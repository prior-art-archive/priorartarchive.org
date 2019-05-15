import fs from 'fs';
import tmp from 'tmp-promise';
import Promise from 'bluebird';
import { Document, Organization } from '../../server/models';
import { uploadSiteMap } from './awsUpload';

const fsWriteFile = Promise.promisify(fs.writeFile);

async function getDocuments() {
	return Document.findAll({});
}

function generateSitemapData(documents) {
	const byDateUploaded = (a, b) => {
		if (a.dateUploaded > b.dateUploaded) return -1;
		if (a.dateUploaded < b.dateUploaded) return 1;
		return 0;
	}

	return documents.map((document)=> {
		return {
			url: document.fileUrl,
			fileId: document.id,
			companyName: '',
			companyId: document.organizationId,
			title: document.title,
			dateUploaded: '',
			datePublished: document.publicationDate,
			sourcePath: '',
		};
	}).sort(byDateUploaded);
}

async function createTmpFile() {
	tmp.setGracefulCleanup();
	return tmp.file({
		postfix: '.txt',
	})
}

function packageSitemapContent(sitemapData) {
	return sitemapData.reduce((prev, curr)=> {
		return `${prev}${JSON.stringify(curr)}\n`;
	}, '')
}

async function writeSitemap(filePath, content) {
	return fsWriteFile(filePath, content, 'utf-8')
}

async function run() {
	const documents = await getDocuments()
	const tmpFile = await createTmpFile()
	const sitemapData = generateSitemapData(documents)
	const sitemapContent = packageSitemapContent(sitemapData)
	await writeSitemap(tmpFile.path, sitemapContent)
	console.log('Succesfully generated new sitemap');
	await uploadSiteMap(tmpFile.path)
	return;
}

module.exports = {
	run
}
