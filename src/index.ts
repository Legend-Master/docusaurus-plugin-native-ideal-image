import path from 'node:path'
import type { LoadContext, Plugin, OptionValidationContext } from '@docusaurus/types'
import type { ComponentProps } from 'react'
import type {
	OutputDataForFormat,
	SupportedOutputMimeTypes,
	SupportedOutputTypes,
} from './loader.js'

export type LoaderOptions = {
	/**
	 * Filename template for output files.
	 */
	fileNameTemplate: string
	/**
	 * JPEG compression quality
	 */
	quality: number
	/**
	 * JPEG compression quality
	 */
	lqipFormat: SupportedOutputTypes
	/**
	 * You can test ideal image behavior in dev mode by setting this to `false`.
	 * Tip: use network throttling in your browser to simulate slow networks.
	 */
	disableInDev: boolean
}
export type NativeIdealImageOptions = Partial<LoaderOptions>

export type LoaderOutput = {
	formats: OutputDataForFormat[]
	// src: {
	// 	fileName: string
	// 	width: number
	// 	height: number
	// }
	lqip: string
}

export type NativeIdealImageProps = ComponentProps<'img'> & {
	readonly img: { default: string } | string | LoaderOutput
}

const DEFAULT_OPTIONS = {
	fileNameTemplate: 'assets/native-ideal-image/[name]-[hash:hex:5]-[width].[format]',
	lqipFormat: 'webp',
	quality: 80,
	disableInDev: false,
} satisfies LoaderOptions

export default function pluginNativeIdealImage(
	context: LoadContext,
	options: NativeIdealImageOptions
): Plugin<void> {
	return {
		name: 'docusaurus-plugin-native-ideal-image',

		getThemePath() {
			return '../lib/theme'
		},

		getTypeScriptThemePath() {
			return '../src/theme'
		},

		configureWebpack(_config, isServer) {
			const { disableInDev, ...loaderOptions } = {
				...DEFAULT_OPTIONS,
				...options,
			}
			if (disableInDev && process.env.NODE_ENV !== 'production') {
				return {}
			}

			return {
				mergeStrategy: {
					'module.rules': 'prepend',
				},
				module: {
					rules: [
						{
							test: /\.(?:png|jpe?g|webp)$/i,
							resourceQuery: /ideal/,
							use: [
								{
									loader: path.resolve(__dirname, './loader.js'),
									options: loaderOptions,
								},
							],
						},
					],
				},
			}
		},
	}
}

// export function validateOptions({
// 	validate,
// 	options,
// }: OptionValidationContext<PluginOptions, PluginOptions>): PluginOptions {
// 	const pluginOptionsSchema = Joi.object<PluginOptions>({
// 		disableInDev: Joi.boolean().default(true),
// 	}).unknown()
// 	return validate(pluginOptionsSchema, options)
// }
