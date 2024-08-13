import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { NativeIdealImageProps } from '../index.js'

import './NativeIdealImage.css'

export default function NativeIdealImage(props: NativeIdealImageProps): JSX.Element {
	const { img, swapOnLoad, src, width, height, sizes, loading, ...propsRest } = props

	const data = typeof img === 'object' && 'default' in img ? img.default : img
	const enabled = typeof data === 'object'
	const formats = enabled ? data.formats : []
	const lqip = enabled ? data.lqip : undefined

	const sizesAttr = sizes ?? 'auto'
	const isSingleImage = formats[0]?.srcSet.length === 1 ? formats[0] : undefined
	const largestImage = formats[0]?.srcSet[formats[0]?.srcSet.length - 1]!

	const [placeHolderOnTop, setPlaceHolderOnTop] = useState(false)
	const [loaded, setLoaded] = useState(false)

	// Prevent fade in if we have the image cache available (likely being a back/forward navigation)
	useEffect(() => {
		if (!loaded) {
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
			{formats.map((format) => (
				<source
					srcSet={format.srcSet
						.map((image) => (isSingleImage ? image.path : `${image.path} ${image.width}w`))
						.join(',')}
					type={format.mime}
					key={format.mime}
				/>
			))}
			<img
				// For disableInDev
				src={src ?? enabled ? undefined : data}
				loading={loading ?? 'lazy'}
				sizes={sizesAttr}
				width={width ?? (isSingleImage || sizesAttr === 'auto') ? largestImage.width : undefined}
				height={height ?? (isSingleImage || sizesAttr === 'auto') ? largestImage.height : undefined}
				{...propsRest}
			/>
		</picture>
	)
}
