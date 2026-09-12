import React, {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import heroImage from './assets/hero.png';

function HeroReveal() {
	const stageRef = useRef(null);
	const topImageRef = useRef(null);
	const [mx, setMx] = useState(0);
	const [my, setMy] = useState(0);
	const [keyboardReveal, setKeyboardReveal] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);

	const handleMouseMove = useCallback((event) => {
		if (!stageRef.current) return;

		const bounds = stageRef.current.getBoundingClientRect();
		setMx(event.clientX - bounds.left);
		setMy(event.clientY - bounds.top);
	}, []);

	const handleKeyDown = useCallback((event) => {
		if (document.activeElement === stageRef.current && event.key === 'Enter') {
			event.preventDefault();
			setKeyboardReveal((isRevealed) => !isRevealed);
		}
	}, []);

	useEffect(() => {
		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updateMotionPreference = () => setReducedMotion(motionQuery.matches);

		updateMotionPreference();
		motionQuery.addEventListener('change', updateMotionPreference);

		return () => {
			motionQuery.removeEventListener('change', updateMotionPreference);
		};
	}, []);

	useEffect(() => {
		if (!stageRef.current) return;

		stageRef.current.style.setProperty('--mx', `${mx}px`);
		stageRef.current.style.setProperty('--my', `${my}px`);
	}, [mx, my]);

	return (
		<section
			className={`hero-reveal${keyboardReveal ? ' is-keyboard-reveal' : ''}${
				reducedMotion ? ' is-reduced-motion' : ''
			}`}
			ref={stageRef}
			tabIndex="0"
			onMouseMove={handleMouseMove}
			onKeyDown={handleKeyDown}
			aria-label="Reveal hero image"
		>
			<div className="reveal-bottom">
				<img src={heroImage} alt="Casual portrait" />
			</div>
			<div className="reveal-top" ref={topImageRef}>
				<img src={heroImage} alt="Formal portrait" />
			</div>
			<svg style={{ display: 'none' }}>
				<defs>
					<filter id="amoebaDistort" x="-60%" y="-60%" width="220%" height="220%">
						<feTurbulence
							type="turbulence"
							baseFrequency="0.013"
							numOctaves="2"
							seed="4"
							result="noise"
						>
							<animate
								attributeName="baseFrequency"
								dur="12s"
								values="0.009;0.018;0.012;0.009"
								repeatCount="indefinite"
							/>
						</feTurbulence>
						<feDisplacementMap
							in="SourceGraphic"
							in2="noise"
							scale="60"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
				</defs>
			</svg>
		</section>
	);
}

export default HeroReveal;
