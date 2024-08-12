import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'
import NativeIdealImage from '@theme/NativeIdealImage'
import type { LoaderOutput } from 'docusaurus-plugin-native-ideal-image'

import stoneRoadImage from 'ideal-img!../../images/stone-road.webp?preset=card'

import styles from './index.module.css'

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext()
	return (
		<header className={clsx('hero hero--primary', styles.heroBanner)}>
			<div className="container">
				<Heading as="h1" className="hero__title">
					{siteConfig.title}
				</Heading>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<p className="hero__subtitle">(Throttle the network in devtools to see how it works)</p>
				<div className={styles.buttons}>
					<button
						className="button button--secondary button--lg"
						onClick={() => scrollBy({ top: innerHeight * 2, behavior: 'smooth' })}
					>
						Scroll Down To See The Images
					</button>
					<Link className="button button--secondary button--lg" to="/mdx-page">
						MDX Page Example
					</Link>
				</div>
			</div>
		</header>
	)
}

export default function Home(): JSX.Element {
	return (
		<Layout>
			<HomepageHeader />
			<main>
				<div className={styles.bigMargin}></div>
				<div className={styles.cardsContainer}>
					<Card name={'something 1'} image={stoneRoadImage} />
					<Card name={'something 2'} image={stoneRoadImage} />
					<Card name={'something 3'} image={stoneRoadImage} />
					<Card name={'something 4'} image={stoneRoadImage} />
					<Card name={'something 5'} image={stoneRoadImage} />
					<Card name={'something 6'} image={stoneRoadImage} />
				</div>
			</main>
		</Layout>
	)
}

function Card(props: { name: string; image: LoaderOutput }) {
	return (
		<div className={clsx(styles.card, 'pagination-nav__link')}>
			<NativeIdealImage img={props.image} className={styles.cardImage} />
			<div>{props.name}</div>
		</div>
	)
}