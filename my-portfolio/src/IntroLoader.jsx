import React from 'react';
import sigRaw from './assets/signature.svg?raw';

const sigMarkup = sigRaw.replace(/<path /g, '<path pathLength="1" ');

/**
 * @param {{ onComplete: () => void }} props
 */
export default function IntroLoader({ onComplete }) {
	const handleAnimationEnd = (event) => {
		if (event.animationName === 'intro-lift') {
			onComplete();
		}
	};

	return (
		<div
			className="intro-loader"
			aria-hidden="true"
			onAnimationEnd={handleAnimationEnd}
		>
			<div
				dangerouslySetInnerHTML={{
					__html: `<div class="intro-sig">${sigMarkup}</div>`,
				}}
			/>
		</div>
	);
}
