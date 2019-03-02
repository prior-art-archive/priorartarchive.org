import React from 'react';
import PropTypes from 'prop-types';

let manifest;
try {
	manifest = require('../dist/manifest.json');
} catch (err) {
	// No Manifest file. Must be dev mode.
}

const propTypes = {
	children: PropTypes.node.isRequired,
	chunkName: PropTypes.string.isRequired,
	initialData: PropTypes.object.isRequired,
	headerComponents: PropTypes.array.isRequired,
};

const Html = (props) => {
	const getPath = (chunkName, extension) => {
		const manifestUrl = manifest
			? `${manifest[`${chunkName}.${extension}`]}`
			: `${chunkName}.${extension}`;

		return manifestUrl;
	};

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				{props.headerComponents}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<link rel="stylesheet" type="text/css" href={getPath('baseStyle', 'css')} />
				<link rel="stylesheet" type="text/css" href={getPath('vendor', 'css')} />
				<link rel="stylesheet" type="text/css" href={getPath(props.chunkName, 'css')} />
				<link
					rel="search"
					type="application/opensearchdescription+xml"
					title="Prior Art Archive"
					href="/opensearch.xml"
				/>
			</head>
			<body>
				<div id="root">{props.children}</div>
				<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=fetch,default,HTMLCanvasElement.prototype.toBlob,Object.entries,Object.values,Array.prototype.@@iterator" />
				<script
					id="initial-data"
					type="text/plain"
					data-json={JSON.stringify(props.initialData)}
				/>
				<script src={getPath('vendor', 'js')} />
				<script src={getPath(props.chunkName, 'js')} />
			</body>
		</html>
	);
};

Html.propTypes = propTypes;
export default Html;
