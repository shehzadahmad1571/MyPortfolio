import React, { useCallback, useEffect, useRef, useState } from 'react';

export const DEFAULTS = {
	thinWght: 100,
	boldWght: 820,
	thinWdth: 25,
	boldWdth: 151,
	entranceDuration: 0.9,
	entranceEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
	stagger: 0.045,
	pinchRadius: 150,
	hoverTransition: '0.25s ease-out',
};

const fvs = (wght, wdth) => `'wght' ${wght}, 'wdth' ${wdth}`;

const prefersReducedMotion = () => {
	if (typeof window === 'undefined') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export default function VariableFontText({ text = 'Hello World', animate = true }) {
	const containerRef = useRef(null);
	const [reduced, setReduced] = useState(prefersReducedMotion());
	const rafIdRef = useRef(0);
	const lastEventRef = useRef(null);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => setReduced(mediaQuery.matches);

		sync();
		mediaQuery.addEventListener('change', sync);
		return () => mediaQuery.removeEventListener('change', sync);
	}, []);

	const playEntrance = (container) => {
		const spans = container.querySelectorAll('.vft-letter');

		spans.forEach((span) => {
			span.style.transition = 'none';
			span.style.fontVariationSettings = fvs(
				DEFAULTS.thinWght,
				DEFAULTS.thinWdth,
			);
		});

		void container.offsetWidth;

		spans.forEach((span, index) => {
			span.style.transition = `font-variation-settings ${DEFAULTS.entranceDuration}s ${DEFAULTS.entranceEasing}`;
			span.style.transitionDelay = `${index * DEFAULTS.stagger}s`;
			span.style.fontVariationSettings = fvs(
				DEFAULTS.boldWght,
				DEFAULTS.boldWdth,
			);
		});
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return undefined;

		const letters = [...text];
		container.innerHTML = '';

		letters.forEach((letter, index) => {
			const span = document.createElement('span');
			span.textContent = letter;
			span.className = 'vft-letter';
			span.setAttribute('data-index', index);
			span.style.fontVariationSettings = fvs(
				DEFAULTS.boldWght,
				DEFAULTS.boldWdth,
			);
			container.appendChild(span);
		});

		if (animate && !reduced) {
			const entranceTimeout = setTimeout(() => playEntrance(container), 50);
			return () => clearTimeout(entranceTimeout);
		}

		return undefined;
	}, [text, animate, reduced]);

	const applyProximity = useCallback((event) => {
		if (!containerRef.current || reduced) return;

		const spans = containerRef.current.querySelectorAll('.vft-letter');

		spans.forEach((span) => {
			const rect = span.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			const distX = event.clientX - centerX;
			const distY = event.clientY - centerY;
			const distance = Math.sqrt(distX * distX + distY * distY);
			const {
				pinchRadius,
				thinWght,
				boldWght,
				thinWdth,
				boldWdth,
			} = DEFAULTS;

			let wght = boldWght;
			let wdth = boldWdth;

			if (distance < pinchRadius) {
				const factor = Math.max(0, 1 - distance / pinchRadius);
				wght = boldWght + (thinWght - boldWght) * factor;
				wdth = boldWdth + (thinWdth - boldWdth) * factor;
			}

			span.style.fontVariationSettings = fvs(
				Math.round(wght),
				Math.round(wdth),
			);
		});
	}, [reduced]);

	const handleMouseMove = useCallback((event) => {
		lastEventRef.current = event;
		if (rafIdRef.current) return;

		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = 0;
			if (lastEventRef.current) {
				applyProximity(lastEventRef.current);
			}
		});
	}, [applyProximity]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return undefined;

		container.addEventListener('mousemove', handleMouseMove);

		return () => {
			container.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(rafIdRef.current);
		};
	}, [handleMouseMove]);

	return (
		<div
			ref={containerRef}
			className="vft-container"
			style={{ fontVariationSettings: `'wght' 400, 'wdth' 100` }}
		>
			{text}
		</div>
	);
}
