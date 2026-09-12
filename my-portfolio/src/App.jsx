import HeroReveal from './HeroReveal';
import './HeroReveal.css';
import IntroLoader from './IntroLoader';
import './IntroLoader.css';
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
				<div className="py-20">
					<VariableFontText
						text="Move your mouse close to the letters"
						animate={true}
					/>
				</div>
				<div className="hero">Hero Section</div>
				<div className="roles">Roles Section</div>
				<div className="works">Works Section</div>
				<div className="contact">Contact Section</div>
			</main>
			<footer className="site-footer">Footer</footer>
		</>
	);
}

export default App;
