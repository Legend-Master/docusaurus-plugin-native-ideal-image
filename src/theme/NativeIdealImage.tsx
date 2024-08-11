import React from 'react'
import type { NativeIdealImageProps } from '../index.js'

import styles from './NativeIdealImage.module.css'

export default function IdealImage(props: NativeIdealImageProps): JSX.Element {
	const { img, ...propsRest } = props

	// In dev env just use regular img with original file
	if (typeof img === 'string' || 'default' in img) {
		return <img src={typeof img === 'string' ? img : img.default} loading="lazy" {...propsRest} />
	}

	return (
		<picture
			className={styles.picture}
			style={
				{
					'--lqip': `url(${img.lqip})`,
					// backgroundImage: `url(${img.lqip})`,
					// backgroundRepeat: 'no-repeat',
					// backgroundSize: 'cover',
					// width: '100%',
					// height: 'auto',
				} as React.CSSProperties
			}
		>
			{img.formats.map((format) => (
				<source
					// media={`(min-width: ${source.width})`}
					// sizes={`source.width`}
					// srcSet={source.fileName}
					srcSet={format.srcSet.map((image) => `${image.path} ${image.width}w`).join(',')}
					sizes="auto"
					type={format.mime}
					key={format.mime}
				/>
			))}
			<img
				loading="lazy"
				// src={img.src.fileName}
				// width={img.src.width}
				// height={img.src.height}
				// style={
				// 	{
				// 		'--lqip': `url(${img.lqip})`,
				// 		// backgroundImage: `url(${img.lqip})`,
				// 		// backgroundRepeat: 'no-repeat',
				// 		// backgroundSize: 'cover',
				// 		// width: '100%',
				// 		// height: 'auto',
				// 	} as React.CSSProperties
				// }
				{...propsRest}
			/>
		</picture>
	)
}
