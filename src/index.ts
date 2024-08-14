import path from 'node:path'
import type { LoadContext, Plugin, OptionValidationContext } from '@docusaurus/types'
import { DEFAULT_LOADER_OPTIONS, type LoaderOptions } from './loader.js'
// import { Compilation, Compiler, NormalModule, type LoaderContext } from 'webpack'
// import { fileURLToPath } from 'node:url'

export type { NativeIdealImageProps } from './theme/NativeIdealImage.js'
export type {
	LoaderOutput,
	DEFAULT_LOADER_OPTIONS,
	SrcSetData,
	SupportedOutputMimeTypes,
	SupportedOutputTypes,
	OutputDataForFormat,
	LoaderOptions,
	Preset,
} from './loader.js'
export type NativeIdealImageOptions = Partial<LoaderOptions>

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
			// const { disableInDev, presets, ...loaderOptions } = {
			// 	...settings,
			// 	...options,
			// }

			return {
				// plugins: [idealImageUriPlugin],
				// module: {
				// 	rules: [
				// 		{
				// 			test: /\.(?:png|jpe?g|webp)/i,
				// 			// test: /.*/,
				// 			// scheme: 'ideal-img',
				// 			use: [
				// 				{
				// 					loader: path.resolve(__dirname, './loader.js'),
				// 					options: {
				// 						...loaderOptions,
				// 						presets: { ...DEFAULT_OPTIONS.presets, ...presets },
				// 					},
				// 				},
				// 			],
				// 		},
				// 	],
				// },
				resolveLoader: {
					alias: {
						'ideal-img': `${path.resolve(__dirname, './loader.js')}?${JSON.stringify({
							...DEFAULT_LOADER_OPTIONS,
							...options,
							presets: { ...DEFAULT_LOADER_OPTIONS.presets, ...options.presets },
						})}`,
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
