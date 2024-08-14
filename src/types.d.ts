declare module 'ideal-img!*' {
	const x: import('../lib/index.d.ts').NativeIdealImageData
	export default x
}

declare module '@theme/NativeIdealImage' {
	export default function NativeIdealImage(
		props: import('../lib/index.d.ts').NativeIdealImageProps,
	): JSX.Element
}
