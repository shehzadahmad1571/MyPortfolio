import React from 'react';

const links = [
	{
		label: 'GitHub',
		href: 'https://github.com/shehzadahmad1571',
		external: true,
	},
	{
		label: 'LinkedIn',
		href: 'https://linkedin.com/in/shehzad-ahmad-6492b03a3',
		external: true,
	},
	{
		label: 'Email',
		href: 'mailto:shehzadahmad11012l@gmail.com',
		external: false,
	},
];

function Footer() {
	return (
		<footer className="footer">
			<p>Shehzad Ahmad</p>
			<nav className="footer-links" aria-label="Social links">
				{links.map((link) => (
					<a
						className="footer-link"
						href={link.href}
						key={link.label}
						{...(link.external
							? { target: '_blank', rel: 'noreferrer' }
							: {})}
					>
						{link.label}
					</a>
				))}
			</nav>
		</footer>
	);
}

export default Footer;
