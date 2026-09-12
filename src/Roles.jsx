import React, { useCallback, useEffect, useRef, useState } from 'react';

const roles = [
	'Full Stack Developer',
	'UI Engineer',
	'Graphic Designer',
	'Video Editor',
];

function Roles() {
	const sectionRef = useRef(null);
	const videoRef = useRef(null);
	const animationFrameRef = useRef(0);
	const pointerRef = useRef({ x: 0, y: 0 });
	const [activeRole, setActiveRole] = useState(null);
	const [reducedMotion, setReducedMotion] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const syncMotionPreference = () => setReducedMotion(mediaQuery.matches);

		syncMotionPreference();
		mediaQuery.addEventListener('change', syncMotionPreference);

		return () => {
			mediaQuery.removeEventListener('change', syncMotionPreference);
		};
	}, []);

	const updateVideoPosition = useCallback(() => {
		animationFrameRef.current = 0;

		if (!videoRef.current || !sectionRef.current || reducedMotion) return;

		const bounds = sectionRef.current.getBoundingClientRect();
		const x = pointerRef.current.x - bounds.left;
		const y = pointerRef.current.y - bounds.top;

		videoRef.current.style.transform = `translate(${x}px, ${y}px) translate(18px, 24px)`;
	}, [reducedMotion]);

	const handlePointerMove = useCallback((event) => {
		pointerRef.current = { x: event.clientX, y: event.clientY };

		if (!animationFrameRef.current) {
			animationFrameRef.current = requestAnimationFrame(updateVideoPosition);
		}
	}, [updateVideoPosition]);

	useEffect(() => () => {
		cancelAnimationFrame(animationFrameRef.current);
	}, []);

	const handleRoleKeyDown = (event, index) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			setActiveRole((currentRole) => (currentRole === index ? null : index));
		}
	};

	return (
		<section
			className={`roles${reducedMotion ? ' is-reduced-motion' : ''}`}
			ref={sectionRef}
			onMouseMove={handlePointerMove}
			onMouseLeave={() => setActiveRole(null)}
		>
			<ul className="roles-list">
				{roles.map((role, index) => (
					<li
						className="roles-item"
						key={role}
						tabIndex="0"
						onMouseEnter={() => setActiveRole(index)}
						onFocus={() => setActiveRole(index)}
						onBlur={() => setActiveRole(null)}
						onKeyDown={(event) => handleRoleKeyDown(event, index)}
					>
						{role}
					</li>
				))}
			</ul>
			<video
				ref={videoRef}
				className={`roles-video${activeRole !== null ? ' is-visible' : ''}`}
				muted
				autoPlay
				loop
				playsInline
				aria-label={activeRole === null ? 'Role preview video' : `${roles[activeRole]} preview`}
			>
				Video
			</video>
		</section>
	);
}

export default Roles;
