import path from 'node:path'
import type { LoadContext, Plugin, OptionValidationContext } from '@docusaurus/types'
import type { LoaderOptions, Preset, SupportedOutputTypes } from './loader.js'
// import { Compilation, Compiler, NormalModule, type LoaderContext } from 'webpack'
// import { fileURLToPath } from 'node:url'

export type { NativeIdealImageProps } from './theme/NativeIdealImage.js'
export type {
	NativeIdealImageData,
	SrcSetData,
	SupportedOutputMimeTypes,
	SupportedOutputTypes,
	OutputDataForFormat,
	LoaderOptions,
	Preset,
} from './loader.js'

export type NativeIdealImageOptions = Partial<{
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
	 * Disable in dev mode for faster compile time
	 */
	disableInDev: boolean
}>

export const DEFAULT_OPTIONS = {
	fileNameTemplate: 'assets/native-ideal-image/[name]-[hash:hex:5]-[width].[format]',
	lqipFormat: 'webp',
	presets: {
		default: {
			formats: ['webp', 'jpeg'],
			sizes: 2160,
			lqip: true,
		},
	},
	disableInDev: false,
} as const satisfies NativeIdealImageOptions

export { default as nativeIdealImageRemarkPlugin } from './mdx-plugin.js'

export default function pluginNativeIdealImage(
	context: LoadContext,
	options: NativeIdealImageOptions,
): Plugin<void> {
	return {
		name: 'docusaurus-plugin-native-ideal-image',

		getThemePath() {
			return '../lib/theme'
		},

		getTypeScriptThemePath() {
			return '../src/theme'
		},

		configureWebpack(config, isServer) {
			const { disableInDev, ...optionsRest } = {
				...DEFAULT_OPTIONS,
				...options,
				presets: { ...DEFAULT_OPTIONS.presets, ...options.presets },
			}
			const mergedOptions = {
				disabled: disableInDev && process.env.NODE_ENV !== 'production',
				...optionsRest,
			} satisfies LoaderOptions

			return {
				// plugins: [idealImageUriPlugin],
				// mergeStrategy: { 'module.rules.test': 'match', 'module.rules.test.use': 'prepend' },
				// module: {
				// 	rules: [
				// 		{
				// 			test: /\.(?:ico|jpe?g|png|gif|webp|avif)(?:\?.*)?$/i,
				// 			use: [
				// 				{
				// 					loader: path.resolve(__dirname, './loader.js'),
				// 					options: {
				// 						...DEFAULT_LOADER_OPTIONS,
				// 						...options,
				// 						presets: { ...DEFAULT_LOADER_OPTIONS.presets, ...options.presets },
				// 					},
				// 				},
				// 			],
				// 		},
				// 	],
				// },
				resolveLoader: {
					alias: {
						'ideal-img': `${path.resolve(__dirname, './loader.js')}?${JSON.stringify(mergedOptions)}`,
					},
				},
			}
		},
	}
}

// function idealImageUriPlugin(this: Compiler, compiler: Compiler) {
// 	compiler.hooks.thisCompilation.tap(
// 		'IdealImageUriPlugin',
// 		(compilation, { normalModuleFactory }) => {
// 			normalModuleFactory.hooks.resolveForScheme
// 				.for('ideal-img')
// 				.tap('IdealImageUriPlugin', (resourceData) => {
// 					// const url = new URL(resourceData.resource.replace('ideal-img:', 'file://'))
// 					// const url = new URL(resourceData.resource)
// 					// const path = url.pathname
// 					// const query = url.search
// 					// const fragment = url.hash
// 					// resourceData.path = path
// 					// resourceData.query = query
// 					// resourceData.fragment = fragment
// 					// resourceData.resource = path + query + fragment
// 					return true
// 				})
// 			compilation.compiler.webpack.NormalModule.getCompilationHooks(compilation)
// 				.readResource.for('ideal-img')
// 				.tapAsync('IdealImageUriPlugin', (context, callback) => {
// 					const loaderContext = context as LoaderContext<{}>
// 					const { resourcePath } = loaderContext
// 					loaderContext.addDependency(resourcePath)
// 					loaderContext.fs.readFile(resourcePath, callback)
// 				})
// 		}
// 	)
// }

// export function validateOptions({
// 	validate,
// 	options,
// }: OptionValidationContext<PluginOptions, PluginOptions>): PluginOptions {
// 	const pluginOptionsSchema = Joi.object<PluginOptions>({
// 		disableInDev: Joi.boolean().default(true),
// 	}).unknown()
// 	return validate(pluginOptionsSchema, options)
// }
