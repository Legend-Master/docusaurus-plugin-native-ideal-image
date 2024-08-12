import React from 'react'
import type { NativeIdealImageProps } from '../index.js'

import styles from './NativeIdealImage.module.css'

export default function NativeIdealImage(props: NativeIdealImageProps): JSX.Element {
	const { img, width, height, sizes, loading, ...propsRest } = props

	const formats = typeof img === 'object' && 'formats' in img ? img.formats : []
	const lqip = typeof img === 'object' && 'lqip' in img ? img.lqip : ''

	const singleImage = formats[0]?.srcSet.length === 1 ? formats[0] : undefined

	return (
		<picture
			className={styles.picture}
			style={
				lqip
					? ({
							'--lqip': `url(${lqip})`,
					  } as React.CSSProperties)
					: undefined
			}
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
				src={typeof img === 'string' ? img : 'default' in img ? img.default : undefined}
				loading={loading ?? 'lazy'}
				sizes={sizes ?? 'auto'}
				width={width || singleImage?.srcSet[0]?.width}
				height={height || singleImage?.srcSet[0]?.height}
				{...propsRest}
			/>
		</picture>
	)
}
