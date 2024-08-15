import type { Node } from 'unist'
import type { MdxJsxAttributeValueExpression } from 'mdast-util-mdx'

// Copied from Docusaurus packages/docusaurus-mdx-loader/src/remark/utils/index.ts
/**
 * Util to transform one node type to another node type
 * The input node is mutated in place
 * @param node the node to mutate
 * @param newNode what the original node should become become
 */
export function transformNode<NewNode extends Node>(node: Node, newNode: NewNode): NewNode {
	Object.keys(node).forEach((key) => {
		// @ts-expect-error: unsafe but ok
		delete node[key]
	})
	Object.keys(newNode).forEach((key) => {
		// @ts-expect-error: unsafe but ok
		node[key] = newNode[key]
	})
	return node as NewNode
}

// Modified from Docusaurus packages/docusaurus-mdx-loader/src/remark/utils/index.ts
export function assetRequireAttributeValue(requireString: string): MdxJsxAttributeValueExpression {
	return {
		type: 'mdxJsxAttributeValueExpression',
		value: `require("${requireString}")`,
		data: {
			estree: {
				type: 'Program',
				body: [
					{
						type: 'ExpressionStatement',
						expression: {
							type: 'CallExpression',
							callee: {
								type: 'Identifier',
								name: 'require',
							},
							arguments: [
								{
									type: 'Literal',
									value: requireString,
									raw: `"${requireString}"`,
								},
							],
							optional: false,
						},
					},
				],
				sourceType: 'module',
				comments: [],
			},
		},
	}
}
