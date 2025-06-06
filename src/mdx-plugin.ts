import type { Transformer } from 'unified'
import type { MdxjsEsm, MdxJsxTextElement } from 'mdast-util-mdx'
import type { Parent } from 'unist'
import { visit, EXIT } from 'unist-util-visit'
import { assetRequireAttributeValue, transformNode } from './utils.js'

export type RemarkPluginOptions = Partial<{
	/**
	 * The image loader preset to use
	 */
	preset: string
	/**
	 * Swap (fade in) the actual image after it's fully loaded
	 */
	swapOnLoad: boolean
}>

export default function plugin(options: RemarkPluginOptions): Transformer {
	const queryString = options.preset ? `?preset=${options.preset}` : ''
	return (ast) => {
		let needsNativeIdealImageImport = false
		visit(ast, { type: 'mdxJsxTextElement', name: 'img' }, (node: MdxJsxTextElement) => {
			const srcNode = node.attributes.find(
				(attribute) => 'name' in attribute && attribute.name === 'src',
			)
			if (srcNode?.value && typeof srcNode?.value === 'object' && 'value' in srcNode.value) {
				const src = srcNode.value.value.match(/^require.*!(.*)"\).default$/)?.[1]
				if (src) {
					const attributes: MdxJsxTextElement['attributes'] = []
					const altNode = node.attributes.find(
						(attribute) => 'name' in attribute && attribute.name === 'alt',
					)
					if (altNode) {
						attributes.push(altNode)
					}
					const titleNode = node.attributes.find(
						(attribute) => 'name' in attribute && attribute.name === 'title',
					)
					if (titleNode) {
						attributes.push(titleNode)
					}
					attributes.push({
						type: 'mdxJsxAttribute',
						name: 'img',
						value: assetRequireAttributeValue(`ideal-img!${src}${queryString}`),
					})
					if (options.swapOnLoad) {
						attributes.push({
							type: 'mdxJsxAttribute',
							name: 'swapOnLoad',
							value: 'true',
						})
					}
					transformNode(node, {
						type: 'mdxJsxFlowElement',
						name: 'NativeIdealImage',
						attributes,
					})
					needsNativeIdealImageImport = true
				}
			}
		})
		if (needsNativeIdealImageImport) {
			let hasNativeIdealImageImport = false
			visit(ast, 'mdxjsEsm', (node: MdxjsEsm) => {
				const found = node.data?.estree?.body.find(
					(body) =>
						body.type === 'ImportDeclaration'
						&& body.specifiers.find(
							(specifier) =>
								specifier.type === 'ImportDefaultSpecifier'
								&& specifier.local.type === 'Identifier'
								&& specifier.local.name === 'NativeIdealImage',
						),
				)
				if (found) {
					hasNativeIdealImageImport = true
					return EXIT
				}
			})
			if (!hasNativeIdealImageImport) {
				if (ast.type === 'root') {
					const root = ast as unknown as Parent
					root.children.unshift(importNativeIdealImageValue())
				}
			}
		}
	}
}

function importNativeIdealImageValue() {
	return {
		type: 'mdxjsEsm',
		value: "import NativeIdealImage from '@theme/NativeIdealImage'",
		data: {
			estree: {
				type: 'Program',
				body: [
					{
						type: 'ImportDeclaration',
						specifiers: [
							{
								type: 'ImportDefaultSpecifier',
								local: {
									type: 'Identifier',
									name: 'NativeIdealImage',
								},
							},
						],
						attributes: [],
						source: {
							type: 'Literal',
							value: '@theme/NativeIdealImage',
							raw: "'@theme/NativeIdealImage'",
						},
					},
				],
				sourceType: 'module',
				comments: [],
			},
		},
	} as const satisfies MdxjsEsm
}
