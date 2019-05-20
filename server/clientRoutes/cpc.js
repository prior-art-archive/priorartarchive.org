import app from '../server';

app.get('/cpc/sitemap', (req, res)=> {
  const sitemapPrefix = process.env.SITEMAP_PREFIX || '';
  request(`https://s3.amazonaws.com/prior-art-archive-sftp/_priorArtArchive/{$sitemapPrefix}sitemap.txt`).pipe(res);
});
