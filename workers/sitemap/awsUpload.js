import fs from 'fs';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

const fsReadFile = Promise.promisify(fs.readFile);

function getS3Bucket() {
	return new AWS.S3({
		params: {
			Bucket: process.env.SITEMAP_DESTINATION_S3_BUCKET
		}
	});
}

function getS3Params(data) {
	return {
		Key: process.env.SITEMAP_DESTINATION_PATH,
		Body: data,
		ACL: 'public-read',
	}
}

async function putDataInS3(data) {
	AWS.config.region = process.env.AWS_REGION;
	AWS.config.setPromisesDependency(Promise);
	const s3bucket = getS3Bucket();
	const params = getS3Params(data);
	return s3bucket.putObject(params).promise();
}

async function uploadSiteMap(filePath) {
	const data = await fsReadFile(filePath)
	return putDataInS3(data)
}

module.exports = {
	uploadSiteMap
}
