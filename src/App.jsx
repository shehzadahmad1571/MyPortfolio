import HeroReveal from './HeroReveal';
import './HeroReveal.css';
import IntroLoader from './IntroLoader';
import './IntroLoader.css';
import FeaturedWorks from './FeaturedWorks';
import './FeaturedWorks.css';
import Roles from './Roles';
import './Roles.css';
import VariableFontText from './VariableFontText';
import './VariableFontText.css';
import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
	const [showIntro, setShowIntro] = useState(true);

	useEffect(() => {
		if (showIntro) return undefined;

		const lenis = new Lenis({
			duration: 0.8,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		});

		lenis.on('scroll', ScrollTrigger.update);

		let animationFrameId;
		const raf = (time) => {
			lenis.raf(time);
			animationFrameId = requestAnimationFrame(raf);
		};

		animationFrameId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(animationFrameId);
			lenis.off('scroll', ScrollTrigger.update);
			lenis.destroy();
			ScrollTrigger.refresh();
		};
	}, [showIntro]);

	return (
		<>
			<main className="site-main">
				{showIntro && <IntroLoader onComplete={() => setShowIntro(false)} />}
				<HeroReveal />
				<section className="hero" aria-labelledby="intro-title">
					<h1 id="intro-title">Shehzad Ahmad</h1>
					<p>CS student @UOL | Driven to learn, Determined to deliver.</p>
				</section>
				<div className="py-20">
					<VariableFontText
						text="Shehzad Ahmad"
						animate={true}
					/>
				</div>
				<Roles />
				<FeaturedWorks />
				<section className="contact" aria-labelledby="contact-title">
					<h2 id="contact-title">Let&apos;s work together</h2>
					<a href="mailto:shehzadahmad11012l@gmail.com">
						shehzadahmad11012l@gmail.com
					</a>
				</section>
			</main>
			<footer className="site-footer">Shehzad Ahmad</footer>
		</>
	);
}

export default App;
