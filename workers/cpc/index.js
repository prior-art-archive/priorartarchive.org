import config from '../../server/config';
import rp from 'request-promise';

async function getLatestCpcResultsUrl() {
	return rp(process.env.CPC_RESULT_POINTER_URL)
}

async function run() {
	const cpcResultsUrl = await getLatestCpcResultsUrl()
	console.log(cpcResultsUrl)
	return;
}

module.exports = {
	run
}
