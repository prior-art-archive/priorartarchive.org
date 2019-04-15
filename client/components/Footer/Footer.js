import React from 'react';

require('./footer.scss');

const Footer = function() {
	const links = [
		{
			id: 1,
			title: 'About',
			url: '/about',
		},
		{
			id: 2,
			title: 'Code',
			url: 'https://github.com/knowledgefutures/priorart-site',
		},
		{
			id: 3,
			title: 'Contact',
			url: 'mailto:priorartarchive@media.mit.edu',
		},
		{
			id: 4,
			title: 'Login',
			url: '/login',
		},
		{
			id: 5,
			title: 'Terms of Use & Privacy Policy',
			url: '/terms',
		},
	];

	return (
		<div className="footer">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<ul>
							{links.map((link) => {
								return (
									<li key={`footer-item-${link.id}`}>
										<a href={link.url}>{link.title}</a>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
