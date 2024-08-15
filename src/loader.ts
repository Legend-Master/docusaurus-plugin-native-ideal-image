import type { LoaderContext } from 'webpack'
import loaderUtils from 'loader-utils'
import sharp from 'sharp'

const MIMES = {
	jpeg: 'image/jpeg',
	webp: 'image/webp',
	avif: 'image/avif',
} as const

export type SupportedOutputTypes = keyof typeof MIMES
export type SupportedOutputMimeTypes = (typeof MIMES)[SupportedOutputTypes]

export type Preset = {
	/**
	 * Sizes (width) to generate,
	 * will not resize the image to be larger than the original
	 * */
	sizes?: number | number[]
	/** Formats to generate */
	formats?: SupportedOutputTypes | SupportedOutputTypes[]
	/** Set to `false` to disable low quality image placeholder generation */
	lqip?: boolean
}

export type LoaderOptions = {
	/**
	 * File name template for output files
	 */
	fileNameTemplate: string
	/**
	 * Image loader presets
	 */
	presets: Record<string, Preset>
	/**
	 * Low quality image placeholder format
	 */
	lqipFormat: SupportedOutputTypes
	/**
	 * Should disable the loader
	 */
	disabled: boolean
}

export type SrcSetData = {
	path: string
	width: number
	height: number
}

export type OutputDataForFormat = {
	mime: SupportedOutputMimeTypes
	srcSet: SrcSetData[]
}

export type NativeIdealImageData = {
	formats: OutputDataForFormat[]
	// src: {
	// 	fileName: string
	// 	width: number
	// 	height: number
	// }
	lqip?: string
}

export const raw = true

export function pitch(this: LoaderContext<LoaderOptions>) {
	const options = this.getOptions()
	if (!options.disabled) {
		// Remove all other loaders,
		// used for preventing the default url/file loader from generating extra images
		this.loaders = [this.loaders[this.loaderIndex]!]
	}
}

export default async function loader(this: LoaderContext<LoaderOptions>, content: Buffer) {
	const callback = this.async()
	const options = this.getOptions()

	if (options.disabled) {
		// Return the value from default asset loader
		this.callback(null, content)
		return
	}

	const queryOptions = new URLSearchParams(this.resourceQuery)

	const image = sharp(content)
	const metadata = await image.metadata()
	const orginalWidth = metadata.width
	if (!orginalWidth) {
		throw `Can't get the width of this image (${this.resourcePath})`
	}

	const preset = options.presets[queryOptions.get('preset') || 'default']

	const sizes: number[] = []
	const w = queryOptions.get('w')
	if (w) {
		sizes.push(...new Set(w.split(',').map((size) => Math.min(Number(size), orginalWidth))))
	} else {
		const presetSizes = typeof preset?.sizes === 'number' ? [preset.sizes] : preset?.sizes
		sizes.push(...new Set(presetSizes?.map((size) => Math.min(size, orginalWidth))))
	}
	if (sizes.length === 0) {
		sizes.push(orginalWidth)
	}
	// https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers
	sizes.sort((a, b) => a - b)

	const formats: SupportedOutputTypes[] = []
	const formatQuery = queryOptions.get('format')
	if (formatQuery) {
		for (const format of formatQuery.split(',')) {
			if (format in MIMES) {
				formats.push(format as SupportedOutputTypes)
			} else {
				console.warn(`Unknown format ${format} for ideal image`)
			}
		}
	} else {
		const presetFormats = typeof preset?.formats === 'string' ? [preset.formats] : preset?.formats
		formats.push(...(presetFormats || []))
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
	} satisfies NativeIdealImageData
	callback(null, `export default ${JSON.stringify(output)}`)
}

async function createFiles(
	context: LoaderContext<LoaderOptions>,
	image: sharp.Sharp,
	options: { formats: SupportedOutputTypes[]; sizes: number[] },
): Promise<OutputDataForFormat[]> {
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
	format: SupportedOutputTypes,
): Promise<SrcSetData> {
	const resized = image.resize(size)
	let output: sharp.Sharp
	switch (format) {
		case 'jpeg':
			output = resized.jpeg({ quality: 75, progressive: size > 500 })
			break
		case 'webp':
			output = resized.webp({ quality: 75 })
			break
		case 'avif':
			output = resized.avif({ quality: 50 })
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
