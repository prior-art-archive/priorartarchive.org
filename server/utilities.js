import React from 'react';
import ReactDOMServer from 'react-dom/server';
import queryString from 'query-string';
import { remove as removeDiacritics } from 'diacritics';

const isPriorArtArchiveProduction = !!process.env.PRIOR_ART_ARCHIVE_PRODUCTION;

export const isPriorArtV2 = process.env.PRIORT_ART_V2;
export const operators = ['AND', 'OR', 'ADJ', 'NEAR', 'WITH', 'SAME'];
export const searchDefaults = {
	query: '',
	operator: 'AND',
	sort: 'date',
	range: 'all',
	fileType: [],
	source: [],
	offset: 0,
};

export const fileTypeMap = {
	'text/html': 'HTML',
	'application/pdf': 'PDF',
};

export const slugifyString = (input)=> {
	if (typeof input !== 'string') {
		console.error('input is not a valid string');
		return '';
	}

	return removeDiacritics(input).replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase();
};

export const renderToNodeStream = (res, reactElement)=> {
	res.setHeader('content-type', 'text/html');
	return ReactDOMServer.renderToNodeStream(reactElement)
	.pipe(res);
};

export const getInitialData = (req)=> {
	/* Gather user data */
	const user = req.user || {};
	const loginData = {
		id: user.id,
		initials: user.initials,
		slug: user.slug,
		name: user.name,
		avatar: user.avatar,
	};

	/* Gather location data */
	const locationData = {
		hostname: req.hostname,
		path: req.path,
		params: req.params,
		query: req.query,
		queryString: req.query
			? `?${queryString.stringify(req.query)}`
			: '',
		isPriorArtArchiveProduction: isPriorArtArchiveProduction,
	};

	return new Promise((resolvePromise)=> {
		resolvePromise({
			loginData: loginData,
			locationData: locationData,
		});
	});
};

export const generateMetaComponents = ({ initialData, title, description, publishedAt, unlisted })=> {
	const siteName = 'Prior Art Archive';
	const url = `https://${initialData.locationData.hostname}${initialData.locationData.path}`;
	const favicon = `https://${initialData.locationData.hostname}/favicon.png`;
	const avatar = `https://${initialData.locationData.hostname}/favicon.png`;
	let outputComponents = [];

	if (title) {
		outputComponents = [
			...outputComponents,
			<title key="t1">{title}</title>,
			<meta key="t2" property="og:title" content={title} />,
			<meta key="t3" name="twitter:title" content={title} />,
			<meta key="t4" name="twitter:image:alt" content={title} />,
			<meta key="t5" name="citation_title" content={title} />,
			<meta key="t6" name="dc.title" content={title} />,
		];
	}

	if (siteName) {
		outputComponents = [
			...outputComponents,
			<meta key="sn1" property="og:site_name" content={siteName} />,
			<meta key="sn2" property="citation_journal_title" content={siteName} />,
		];
	}

	if (url) {
		outputComponents = [
			...outputComponents,
			<meta key="u1" property="og:url" content={url} />,
			<meta key="u2" property="og:type" content={url.indexOf('/pub/') > -1 ? 'article' : 'website'} />,
		];
	}

	if (description) {
		outputComponents = [
			...outputComponents,
			<meta key="d1" name="description" content={description} />,
			<meta key="d2" property="og:description" content={description} />,
			<meta key="d3" name="twitter:description" content={description} />,
		];
	}

	if (avatar) {
		outputComponents = [
			...outputComponents,
			<meta key="i1" property="og:image" content={avatar} />,
			<meta key="i2" property="og:image:url" content={avatar} />,
			<meta key="i3" property="og:image:width" content="500" />,
			<meta key="i3" name="twitter:image" content={avatar} />,
		];
	}

	if (favicon) {
		outputComponents = [
			...outputComponents,
			<link key="f1" rel="icon" type="image/png" sizes="256x256" href={favicon} />,
		];
	}

	if (publishedAt) {
		outputComponents = [
			...outputComponents,
			<meta key="pa1" property="article:published_time" content={publishedAt} />,
			<meta key="pub1" property="citation_publisher" content="Prior Art Archive" />,
			<meta key="pub2" property="dc.publisher" content="Prior Art Archive" />,
		];
	}

	if (unlisted) {
		outputComponents = [
			...outputComponents,
			<meta key="un1" name="robots" content="noindex,nofollow" />
		];
	}

	outputComponents = [
		...outputComponents,
		<meta key="misc2" name="twitter:card" content="summary" />,
		<meta key="misc3" name="twitter:site" content="@knowledgefutures" />,
	];

	return outputComponents;
};

export const handleErrors = (req, res, next)=> {
	return (err) => {
		if (err.message === 'Page Not Found' ||
			err.message === 'Pub Not Found' ||
			err.message === 'User Not Admin' ||
			err.message === 'User Not Found'
		) {
			return next();
		}
		console.error('Err', err);
		return res.status(500).json('Error');
	};
};

export function generateHash(length) {
	const tokenLength = length || 32;
	const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

	let hash = '';
	for (let index = 0; index < tokenLength; index += 1) {
		hash += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return hash;
}
