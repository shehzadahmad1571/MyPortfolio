import React from 'react';

const projects = [];

function FeaturedWorks() {
	return (
		<section className="featured-works" aria-labelledby="featured-works-title">
			<h2 id="featured-works-title">Featured Works</h2>
			<div className="projects-grid">
				{projects.length > 0 ? (
					projects.map((project) => (
						<a
							className="project-card"
							href={project.link}
							key={project.title}
							tabIndex="0"
						>
							<img src={project.image} alt="" />
							<h3>{project.title}</h3>
							<p>{project.description}</p>
						</a>
					))
				) : (
					<p className="empty-state">Featured projects coming soon.</p>
				)}
			</div>
		</section>
	);
}

export default FeaturedWorks;
