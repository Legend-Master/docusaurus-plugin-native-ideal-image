import React, { useEffect, useRef, useState, type ComponentProps } from 'react'
import clsx from 'clsx'
import type { NativeIdealImageData } from '../index.js'
import type { SrcSetData } from '../loader.js'

import './NativeIdealImage.css'

export type NativeIdealImageProps = Omit<ComponentProps<'img'>, 'ref'> & {
	/** The output of `import('ideal-img!./some-image.jpeg')` */
	readonly img: { default: NativeIdealImageData } | NativeIdealImageData
	/**
	 * Swap (fade in) the actual image after it's fully loaded
	 *
	 * Note: this requires JavaScript to work,
	 * so will not work if the script is loaded after the image,
	 * and also if the image is half loaded when the script kicks in,
	 * the partially loaded image will get covered by the low quality placeholder
	 * */
	swapOnLoad?: boolean
}

export default function NativeIdealImage(props: NativeIdealImageProps): JSX.Element {
	const { img, swapOnLoad, src, srcSet, width, height, sizes, loading, ...propsRest } = props

	const data = 'default' in img ? img.default : img
	const { lqip, formats } = data

	const sizesAttr = sizes ?? 'auto'

	// Put the last source on the img element and the others on source elements
	const sources = formats.slice(0, -1)
	const lastFormat = formats[formats.length - 1]!

	const isSingleImage = lastFormat?.srcSet.length === 1
	const largestImage = lastFormat.srcSet[lastFormat.srcSet.length - 1]!

	let imgSrc = src
	let imgSrcSet = srcSet
	if (isSingleImage) {
		imgSrc ??= getSource(lastFormat.srcSet)
	} else {
		imgSrcSet ??= getSource(lastFormat.srcSet)
	}

	const [placeHolderOnTop, setPlaceHolderOnTop] = useState(false)
	const [loaded, setLoaded] = useState(false)
	const imageEl = useRef<HTMLImageElement>(null)

	useEffect(() => {
		if (loaded) {
			return
		}
		if (imageEl.current?.complete) {
			setLoaded(true)
			return
		}
		// Prevent fade in if we have the image cache available (likely being a back/forward navigation)
		const id = setTimeout(() => setPlaceHolderOnTop(true), 50)
		return () => clearTimeout(id)
	}, [loaded])

	return (
		<picture
			className={clsx('native-ideal-img', {
				'swap-on-load': placeHolderOnTop && swapOnLoad,
				loaded,
			})}
			style={lqip ? ({ '--lqip': `url(${lqip})` } as React.CSSProperties) : undefined}
			onLoad={() => setLoaded(true)}
		>
			{sources.map((format) => (
				<source srcSet={getSource(format.srcSet)} type={format.mime} key={format.mime} />
			))}
			<img
				loading={loading ?? 'lazy'}
				src={imgSrc}
				srcSet={imgSrcSet}
				sizes={sizesAttr}
				width={(width ?? (isSingleImage || sizesAttr === 'auto')) ? largestImage.width : undefined}
				height={
					(height ?? (isSingleImage || sizesAttr === 'auto')) ? largestImage.height : undefined
				}
				ref={imageEl}
				{...propsRest}
			/>
		</picture>
	)
}

function getSource(srcSet: SrcSetData[]): string {
	return srcSet.length === 1
		? encodeURI(srcSet[0]!.path)
		: srcSet.map((image) => `${encodeURI(image.path)} ${image.width}w`).join(',')
}
