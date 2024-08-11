import React from 'react'
import type { NativeIdealImageProps } from '../index.js'

import styles from './NativeIdealImage.module.css'

export default function IdealImage(props: NativeIdealImageProps): JSX.Element {
	const { img, sizes, loading, ...propsRest } = props

	const formats = typeof img === 'object' && 'formats' in img ? img.formats : []
	const lqip = typeof img === 'object' && 'lqip' in img ? img.lqip : ''

	return (
		<picture
			className={styles.picture}
			style={
				{
					'--lqip': `url(${lqip})`,
				} as React.CSSProperties
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
				{...propsRest}
			/>
		</picture>
	)
}
