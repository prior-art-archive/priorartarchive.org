import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./about.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const About = function(props) {
	return (
		<div id="about-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="container narrow">
					<div className="row">
						<div className="col-12">
							<h1>About</h1>
							<p>
								Low quality patents waste money. US companies spend millions of
								dollars year after year in litigation expenses defending against
								patents that shouldn’t have been issued. The patent examination
								process should stop patents from being issued on old or obvious
								technology. Unfortunately, just because technology is old doesn’t
								mean it is easy for a patent examiner to find. Particularly in the
								computer field, much prior art is in the form of old manuals,
								documentation, web sites, etc. that have, until now, not been
								readily searchable.
							</p>
							<p>
								Massachusetts Institute of Technology (MIT) and Cisco have
								collaborated to create this first free and open archiving platform
								for the entire IT industry.
							</p>
							<p>
								Simply put: fewer bad patents will be issued if we as industry give
								USPTO examiners the tools they need to find old technology.
							</p>
							<h2>Features and Scope</h2>
							<ul>
								<li>
									Customized Parser Algorithm to meet USPTO needs. No additional
									training is required for USPTO examiners. USPTO can use their
									complete existing set of operators and search strings to search
									content.
								</li>
								<li>
									Uploaded documents are machine-classified with CPCs by Google{' '}
									<a href="https://publicpolicy.googleblog.com/2015/07/good-patents-support-innovation-while.html">
										https://publicpolicy.googleblog.com/2015/07/good-patents-support-innovation-while.html
									</a>
								</li>
								<li>
									Auto Save Search queries and Custom reporting to be used by
									USPTO to attach to their reports to support their decision
								</li>
								<li>
									Multi-tenant open architecture. You maintain your content using
									unique FTP user id and password
								</li>
								<li>
									Backend API Support & Open standard allows USPTO or any other
									company to develop new search tools or apply latest AI, Machine
									Learning, and Deep Learning technologies to re-use content
									effectively to improve content review and research during patent
									filing process
								</li>
								<li>Hosted by MIT and open to the entire industry</li>
							</ul>

							<h2>Benefits</h2>
							<li>
								The platform is being used by the USPTO, so the documents will be
								available to the USPTO for patent examination.
							</li>
							<li>
								The documents will be also made available to search engines (Google
								Patent, Bing) for easy access to the public.
							</li>
							<li>
								Applicants can search for prior art before they file patent
								applications.
							</li>

							<h2>How to Join</h2>
							<p>
								Simply send your inquiries and request to join at{' '}
								<a href="mailto:priorartarchive@media.mit.edu">
									priorartarchive@media.mit.edu
								</a>
							</p>

							<h2>How it Works</h2>
							<ul>
								<li>
									If you have any content in the digital format, simply collect
									and upload it using the secured FTP server.
								</li>
								<li>
									You will be assigned a unique secured FTP user id and password.
									Simply upload your documents to the secured FTP server and your
									documents will be available for USPTO.
								</li>
								<li>
									Also, you should get your old paper technical documentation
									ready in the digital formats (word, pdf, images, web pages,
									excel, text, and video)
								</li>
								<li>
									Your content will be also made available to other search engines
									like Google & Bing so that it is found in the public domain via
									public search engines.{' '}
								</li>
								<li>
									Site is public and it can be used by innovators and law firms to
									review prior innovations and documents before they file their
									patent requests with USPTO.
								</li>
								<li>
									Make sure your documents have the following metadata elements
									where possible:
									<ul>
										<li>Title</li>
										<li>Description</li>
										<li>Creation Date</li>
										<li>Publication Date</li>
										<li>Modification Date</li>
										<li>Copyright</li>
									</ul>
								</li>
							</ul>

							<h2>Secured FTP Details</h2>

							<pre>
								<b>Host</b>: sftp.priorartarchive.org
							</pre>
							<pre>
								<b>Port</b>: 22
							</pre>
							<pre>
								<b>Protocol</b>: SFTP
							</pre>
							<pre>
								<b>User</b>: &lt;your username&gt;
							</pre>
							<pre>
								<b>Password</b>: &lt;your password&gt;
							</pre>
							<br />
							<p>Drag and drop the files to SFTP folder and you are done.</p>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

About.propTypes = propTypes;
export default About;

hydrateWrapper(About);
