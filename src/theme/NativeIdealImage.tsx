import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import type { NativeIdealImageProps } from '../index.js'

import './NativeIdealImage.css'

export default function NativeIdealImage(props: NativeIdealImageProps): JSX.Element {
	const { img, swapOnLoad, src, width, height, sizes, loading, ...propsRest } = props

	const enabled = typeof img === 'object' && 'formats' in img
	const formats = enabled ? img.formats : []
	const lqip = enabled ? img.lqip : undefined

	const singleImage = formats[0]?.srcSet.length === 1 ? formats[0] : undefined

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
					srcSet={format.srcSet.map((image) => `${image.path} ${image.width}w`).join(',')}
					type={format.mime}
					key={format.mime}
				/>
			))}
			<img
				// For disableInDev
				src={src ?? enabled ? undefined : typeof img === 'string' ? img : img.default}
				loading={loading ?? 'lazy'}
				sizes={sizes ?? 'auto'}
				width={width ?? singleImage?.srcSet[0]?.width}
				height={height ?? singleImage?.srcSet[0]?.height}
				{...propsRest}
			/>
		</picture>
	)
}
