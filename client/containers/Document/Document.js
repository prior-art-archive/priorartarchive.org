import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';
import { HTMLTable } from '@blueprintjs/core';

require('./document.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	documentData: PropTypes.object.isRequired,
	assertionData: PropTypes.array.isRequired,
};

const placeholderTitle = 'Untitled Document';
const placeholderDescription = 'No description available.';

const gatewayUrl = 'https://dev-gateway.underlay.store/ipfs/';

const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

const tableProps = { bordered: true, condensed: true, striped: true };

const Document = function(props) {
	const {
		title,
		description,
		fileUrl,
		language,
		contentType,
		organizationName,
		organizationSlug,
	} = props.documentData;
	const createdAt = formatDate(props.documentData.createdAt);
	const updatedAt = formatDate(props.documentData.updatedAt);
	const publicationDate = formatDate(props.documentData.publicationDate);
	const cpcCodes = props.documentData.cpcCodes || [];
	return (
		<div id="document-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="container">
					<div id="flex-container" className="row">
						<div className="col-12">
							<header>
								<h1 className={title ? '' : 'placeholder'}>
									{title || placeholderTitle}
								</h1>
								<section className={description ? '' : 'placeholder'}>
									{description || placeholderDescription}
								</section>
							</header>
							<main>
								<div>
									<section>
										<HTMLTable {...tableProps}>
											<tbody>
												<tr>
													<td>Source</td>
													<td>
														<a
															href={`/organization/${organizationSlug}`}
														>
															{organizationName}
														</a>
													</td>
												</tr>
												<tr>
													<td>Created</td>
													<td>{createdAt}</td>
												</tr>
												<tr>
													<td>Updated</td>
													<td>{updatedAt}</td>
												</tr>
												<tr>
													<td>Published</td>
													<td>{publicationDate}</td>
												</tr>
												<tr>
													<td>Language</td>
													<td>{language}</td>
												</tr>
												<tr>
													<td>Content Type</td>
													<td>{contentType}</td>
												</tr>
												<tr>
													<td>CPC Codes</td>
													<td>
														<ul>
															{cpcCodes.map((code) => (
																<li key={code}>{code}</li>
															))}
														</ul>
													</td>
												</tr>
											</tbody>
										</HTMLTable>
									</section>
									<section>
										<h2>Files</h2>
										{props.assertionData.map((assertion) => (
											<HTMLTable key={assertion.cid} {...tableProps}>
												<tbody>
													<tr>
														<td>Uploaded</td>
														<td>{formatDate(assertion.createdAt)}</td>
													</tr>
													<tr>
														<td>Original file</td>
														<td>
															<a
																href={
																	gatewayUrl + assertion.fileCid
																}
															>
																{assertion.fileName}
															</a>
														</td>
													</tr>
													<tr>
														<td>Transcript</td>
														<td>
															<a
																href={`${gatewayUrl +
																	assertion.cid}/transcript.txt`}
															>
																transcript.txt
															</a>
														</td>
													</tr>
													<tr>
														<td>Metadata</td>
														<td>
															<a
																href={`${gatewayUrl +
																	assertion.cid}/metadata.csv`}
															>
																metadata.csv
															</a>
														</td>
													</tr>
												</tbody>
											</HTMLTable>
										))}
									</section>
								</div>
								<iframe title="preview" allowFullScreen src={fileUrl} />
							</main>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Document.propTypes = propTypes;
export default Document;

hydrateWrapper(Document);
