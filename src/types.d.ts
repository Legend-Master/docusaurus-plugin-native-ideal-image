declare module 'ideal-img!*' {
	const x: import('./index.ts').LoaderOutput
	export default x
}

declare module '@theme/NativeIdealImage' {
	export default function NativeIdealImage(
		props: import('./index.ts').NativeIdealImageProps,
	): JSX.Element
}
