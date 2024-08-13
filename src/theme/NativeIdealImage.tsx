import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { NativeIdealImageProps } from '../index.js'

import './NativeIdealImage.css'

// This is kinda messy handling all those posibilities at a single place >.<
export default function NativeIdealImage(props: NativeIdealImageProps): JSX.Element {
	const { img, swapOnLoad, src, srcSet, width, height, sizes, loading, ...propsRest } = props

	const data = typeof img === 'object' && 'default' in img ? img.default : img
	// For disableInDev
	const enabled = typeof data === 'object'
	const formats = enabled ? data.formats : []
	const lqip = enabled ? data.lqip : undefined

	const sources = enabled ? data.formats.slice(0, data.formats.length - 1) : undefined
	const lastFormat = enabled ? data.formats[data.formats.length - 1]! : undefined

	const sizesAttr = sizes ?? 'auto'
	const isSingleImage = formats[0]?.srcSet.length === 1
	const largestImage = formats[0]?.srcSet[formats[0]?.srcSet.length - 1]

	const [placeHolderOnTop, setPlaceHolderOnTop] = useState(false)
	const [loaded, setLoaded] = useState(false)

	const imageEl = useRef<HTMLImageElement>(null)
	useEffect(() => {
		if (imageEl.current?.complete) {
			setLoaded(true)
			return
		}
		if (!loaded) {
			// Prevent fade in if we have the image cache available (likely being a back/forward navigation)
			const id = setTimeout(() => setPlaceHolderOnTop(true), 50)
			return () => clearTimeout(id)
		}
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
			{sources?.map((format) => (
				<source
					srcSet={
						isSingleImage
							? format.srcSet[0]!.path
							: format.srcSet.map((image) => `${image.path} ${image.width}w`).join(',')
					}
					type={format.mime}
					key={format.mime}
				/>
			))}
			<img
				loading={loading ?? 'lazy'}
				src={src ?? enabled ? (isSingleImage ? lastFormat!.srcSet[0]!.path : undefined) : data}
				srcSet={
					srcSet ?? enabled
						? !isSingleImage
							? lastFormat!.srcSet.map((image) => `${image.path} ${image.width}w`).join(',')
							: undefined
						: undefined
				}
				sizes={sizesAttr}
				width={width ?? (isSingleImage || sizesAttr === 'auto') ? largestImage?.width : undefined}
				height={
					height ?? (isSingleImage || sizesAttr === 'auto') ? largestImage?.height : undefined
				}
				ref={imageEl}
				{...propsRest}
			/>
		</picture>
	)
}
