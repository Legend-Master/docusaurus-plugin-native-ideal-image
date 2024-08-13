import type { LoaderContext } from 'webpack'
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'
import loaderUtils from 'loader-utils'
import { type LoaderOutput, type LoaderOptions } from './index.js'

const MIMES = {
	jpeg: 'image/jpeg',
	webp: 'image/webp',
	avif: 'image/avif',
} as const

export type SupportedOutputTypes = keyof typeof MIMES
export type SupportedOutputMimeTypes = (typeof MIMES)[SupportedOutputTypes]

export type SrcSetData = {
	path: string
	width: number
	height: number
}

export type OutputDataForFormat = {
	mime: SupportedOutputMimeTypes
	srcSet: SrcSetData[]
}

export const DEFAULT_LOADER_OPTIONS = {
	fileNameTemplate: 'assets/native-ideal-image/[name]-[hash:hex:5]-[width].[format]',
	lqipFormat: 'webp',
	presets: {
		default: {
			formats: ['webp', 'jpeg'],
			sizes: [2160],
			lqip: true,
		},
	},
	disableInDev: false,
} as const satisfies LoaderOptions

export default async function loader(this: LoaderContext<LoaderOptions>, content: string) {
	const callback = this.async()

	const options = this.getOptions()
	if (options.disableInDev && process.env.NODE_ENV !== 'production') {
		// Return the value from default asset loader
		callback(null, content)
		return
	}

	const queryOptions = new URLSearchParams(this.resourceQuery)

	const buffer = await readFile(this.resourcePath)
	const image = sharp(buffer)
	const metadata = await image.metadata()
	const orginalWidth = metadata.width
	if (!orginalWidth) {
		throw `Can't get the width of this image (${this.resourcePath})`
	}

	const preset = options.presets[queryOptions.get('preset') || 'default']

	const sizes: number[] = [...(preset?.sizes || [])]
	const w = queryOptions.get('w')
	if (w) {
		sizes.push(...new Set(w.split(',').map((size) => Math.min(Number(size), orginalWidth))))
	}
	if (sizes.length === 0) {
		sizes.push(orginalWidth)
	}

	const formats: SupportedOutputTypes[] = [...(preset?.formats || [])]
	const formatQuery = queryOptions.get('format')
	if (formatQuery) {
		for (const format of formatQuery.split(',')) {
			if (format in MIMES) {
				formats.push(format as SupportedOutputTypes)
			} else {
				console.warn(`Unknown format ${format} for ideal image`)
			}
		}
	}
	if (formats.length === 0) {
		formats.push('webp')
	}

	const lqipOverride = queryOptions.get('lqip')
	const shouldGenerateLqip = lqipOverride ? lqipOverride !== 'false' : preset?.lqip !== false

	const [files, lqip] = await Promise.all([
		createFiles(this, image.clone(), { formats, sizes }),
		shouldGenerateLqip ? toBase64Lqip(image.clone(), options.lqipFormat) : undefined,
	])
	const output = {
		formats: files,
		// src: files[0]![files.length - 1]!,
		lqip,
	} satisfies LoaderOutput
	callback(null, `export default ${JSON.stringify(output)}`)
}

async function createFiles(
	context: LoaderContext<LoaderOptions>,
	image: sharp.Sharp,
	options: { formats: SupportedOutputTypes[]; sizes: number[] }
) {
	const formats: OutputDataForFormat[] = []
	for (const format of options.formats) {
		const output: Promise<SrcSetData>[] = []
		for (const size of options.sizes) {
			output.push(processImage(context, image.clone(), size, format))
		}
		formats.push({ mime: MIMES[format], srcSet: await Promise.all(output) })
	}
	return formats
}

async function processImage(
	context: LoaderContext<LoaderOptions>,
	image: sharp.Sharp,
	size: number,
	format: SupportedOutputTypes
) {
	const resized = image.resize(size)
	let output: sharp.Sharp
	switch (format) {
		case 'jpeg':
			output = resized.jpeg({ progressive: size > 500 })
			break
		case 'webp':
			output = resized.webp()
			break
		case 'avif':
			output = resized.avif()
			break
	}
	const data = await output.toBuffer()
	const metadata = await sharp(data).metadata()
	const options = context.getOptions()
	const path = loaderUtils
		.interpolateName(context, options.fileNameTemplate, { content: data })
		.replaceAll('[width]', String(metadata.width))
		.replaceAll('[height]', String(metadata.height))
		.replaceAll('[format]', format)
	context.emitFile(path, data)
	return { path, width: metadata.width!, height: metadata.height! }
}

async function toBase64Lqip(image: sharp.Sharp, imageType: SupportedOutputTypes) {
	const mimeType = MIMES[imageType]
	const resized = image.resize(16)
	let output: sharp.Sharp
	switch (mimeType) {
		case 'image/jpeg':
			output = resized.jpeg({ quality: 20 })
			break
		case 'image/webp':
			output = resized.webp({ quality: 20, alphaQuality: 20, smartSubsample: true })
			break
		case 'image/avif':
			output = resized.avif({ quality: 20 })
			break
	}
	const data = await output.toBuffer()
	return `data:${mimeType};base64,${data.toString('base64')}`
}
