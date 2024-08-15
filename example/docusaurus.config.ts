import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import { themes } from 'prism-react-renderer'
import {
	nativeIdealImageRemarkPlugin,
	type NativeIdealImageOptions,
} from 'docusaurus-plugin-native-ideal-image'

const config: Config = {
	title: 'Docusaurus Native Ideal Image Plugin',
	tagline: 'Pre-process images to multiple formats and low quality image placeholders',
	// favicon: 'images/favicon.ico',

	// Set the production url of your site here
	url: 'https://legend-master.github.io/',
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: '/docusaurus-plugin-native-ideal-image',

	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	presets: [
		[
			'classic',
			{
				docs: false,
				blog: false,
				pages: {
					remarkPlugins: [nativeIdealImageRemarkPlugin],
				},
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	plugins: [
		[
			'native-ideal-image',
			{
				presets: {
					card: {
						sizes: [600, 800, 1000],
						formats: ['avif', 'webp', 'jpeg'],
					},
				},
				// disableInDev: true,
			} satisfies NativeIdealImageOptions,
		],
	],

	themeConfig: {
		navbar: {
			title: 'Docusaurus Native Ideal Image Plugin',
			items: [
				{
					label: 'GitHub',
					position: 'right',
					href: 'https://github.com/Legend-Master/docusaurus-plugin-native-ideal-image',
				},
			],
		},
		footer: {
			links: [
				// {
				// 	title: 'Docs',
				// 	items: [
				// 		{
				// 			label: 'Tutorial',
				// 			to: '/docs/intro',
				// 		},
				// 	],
				// },
			],
		},
		prism: {
			theme: themes.github,
			darkTheme: themes.vsDark,
		},
		colorMode: {
			respectPrefersColorScheme: true,
		},
	} satisfies Preset.ThemeConfig,
}

export default config
