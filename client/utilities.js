import React from 'react';
// import Raven from 'raven-js';
import { hydrate } from 'react-dom';
import { FocusStyleManager } from '@blueprintjs/core';

let isPriorArtArchiveProduction = false;

export const hydrateWrapper = (Component)=> {
	if (typeof window !== 'undefined' && window.location.origin !== 'http://localhost:9001') {
		FocusStyleManager.onlyShowFocusOnTabs();

		/* Remove any leftover service workers from last PubPub instance */
		if (window.navigator && navigator.serviceWorker) {
			navigator.serviceWorker.getRegistrations()
			.then((registrations)=> {
				registrations.forEach((registration)=> {
					registration.unregister();
				});
			});
		}

		const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));
		isPriorArtArchiveProduction = initialData.locationData.isPriorArtArchiveProduction;

		const isDev = window.location.origin.indexOf('localhost:') > -1;
		if (!isDev) {
			// Raven.config('https://b4764eod07c240488d390c8343193208@sentry.io/197897').install();
			// Raven.setUserContext({ username: initialData.loginData.slug });
		}

		hydrate(<Component {...initialData} />, document.getElementById('root'));
	}
};

export const apiFetch = function(path, opts) {
	return fetch(path, {
		...opts,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	})
	.then((response)=> {
		if (!response.ok) {
			return response.json().then((err)=> { throw err; });
		}
		return response.json();
	});
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

export const getResizedUrl = function(url) {
// export const getResizedUrl = function(url, type, dimensions) {
	return url;
	// if (!url || url.indexOf('https://assets.pubpub.org/') === -1) { return url; }
	// const extension = url.split('.').pop().toLowerCase();
	// const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
	// if (validExtensions.indexOf(extension) === -1) { return url; }

	// const prefix = type ? `${type}/` : '';
	// const filepath = url.replace('https://assets.pubpub.org/', '');
	// return `https://resize.pubpub.org/${prefix}${dimensions}/${filepath}`;
};

export function checkForAsset(url) {
	let checkCount = 0;
	const maxCheckCount = 10;
	const checkInterval = 1000; /* This will check for 10 seconds and then fail */
	return new Promise((resolve, reject)=> {
		const checkUrl = ()=> {
			fetch(url, {
				method: 'HEAD',
			})
			.then((response)=> {
				if (!response.ok) {
					if (checkCount < maxCheckCount) {
						checkCount += 1;
						return setTimeout(checkUrl, checkInterval);
					}
					return reject();
				}
				return resolve();
			});
		};
		checkUrl();
	});
}

export function s3Upload(file, progressEvent, finishEvent, index) {
	function beginUpload() {
		const folderName = isPriorArtArchiveProduction
			? generateHash(8)
			: '_testing';

		const extension = file.name !== undefined ? file.name.split('.').pop() : 'jpg';

		// const filename = folderName + '/' + new Date().getTime() + '.' + extension;
		// const filename = folderName + '/' + (Math.floor(Math.random() * 8)) + new Date().getTime() + '.' + extension;
		const filename = `${folderName}/${Math.floor(Math.random() * 8)}${new Date().getTime()}.${extension}`;
		const fileType = file.type !== undefined ? file.type : 'image/jpeg';
		const formData = new FormData();

		formData.append('key', filename);
		formData.append('AWSAccessKeyId', 'AKIAJGNYICEFYTH5R3RQ');
		formData.append('acl', 'public-read');
		formData.append('policy', JSON.parse(this.responseText).policy);
		formData.append('signature', JSON.parse(this.responseText).signature);
		formData.append('Content-Type', fileType);
		formData.append('success_action_status', '200');
		formData.append('file', file);
		const sendFile = new XMLHttpRequest();
		sendFile.upload.addEventListener('progress', (evt)=>{
			progressEvent(evt, index);
		}, false);
		sendFile.upload.addEventListener('load', (evt)=>{
			checkForAsset(`https://s3-external-1.amazonaws.com/assets.priorartarchive.org/${filename}`)
			.then(()=> {
				finishEvent(evt, index, file.type, filename, file.name);
			});
		}, false);
		sendFile.open('POST', 'https://s3-external-1.amazonaws.com/assets.priorartarchive.org', true);
		sendFile.send(formData);
	}

	const getPolicy = new XMLHttpRequest();
	getPolicy.addEventListener('load', beginUpload);
	getPolicy.open('GET', `/api/uploadPolicy?contentType=${file.type}`);
	getPolicy.send();
}
