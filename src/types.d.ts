declare module 'ideal-img!*' {
	const x: import('./index.ts').LoaderOutput
	export default x
}

declare module '@theme/NativeIdealImage' {
	export default function IdealImage(props: import('./index.ts').NativeIdealImageProps): JSX.Element
}
