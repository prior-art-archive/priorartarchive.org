import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { apiFetch, generateDocumentTitle, hydrateWrapper } from 'utilities';
import { HTMLTable, Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';

require('./document.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	documentData: PropTypes.object.isRequired,
	assertionData: PropTypes.array.isRequired,
};

class Document extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.documentData.title || '',
			newTitle: props.documentData.title || '',
			hasChanged: false,
			putDocumentIsLoading: false,
			putDocumentError: undefined,
		};
		this.onTitleChange = this.onTitleChange.bind(this);
		this.handlePutDocument = this.handlePutDocument.bind(this);
	}

	onTitleChange(evt) {
		this.setState({
			newTitle: evt.target.value,
			hasChanged: true,
		});
	}

	handlePutDocument(evt) {
		evt.preventDefault();

		const document = {
			id: this.props.documentData.id,
			title: this.state.newTitle,
		};

		this.setState({
			putDocumentIsLoading: true,
			putDocumentError: undefined,
		});

		return apiFetch('/api/documents', {
			method: 'PUT',
			body: JSON.stringify({
				document: document,
			}),
		})
			.then(() => {
				this.setState({
					putDocumentIsLoading: false,
					title: document.title,
				});
			})
			.catch((err) => {
				this.setState({
					putDocumentIsLoading: false,
					putDocumentError: err,
				});
			});
	}

	render() {
		const {
			description,
			fileUrl,
			language,
			contentType,
			organizationName,
			organizationSlug,
		} = this.props.documentData;

		const { title, newTitle, hasChanged, putDocumentError, putDocumentIsLoading } = this.state;

		const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
		const createdAt = formatDate(this.props.documentData.createdAt);
		const updatedAt = formatDate(this.props.documentData.updatedAt);
		const publicationDate = formatDate(this.props.documentData.publicationDate);
		const cpcCodes = this.props.documentData.cpcCodes || [];

		const generatedTitle = generateDocumentTitle(title);
		const placeholderDescription = 'No description available.';
		const gatewayUrl = 'https://dev-gateway.underlay.store/ipfs/';
		const tableProps = { bordered: true, condensed: true, striped: true };
		return (
			<div id="document-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
				>
					<div className="container">
						<div id="flex-container" className="row">
							<div className="col-12">
								<header>
									<h1
										className={
											generatedTitle.isPlaceholder ? 'placeholder' : ''
										}
									>
										{generatedTitle.title}
									</h1>
									<form onSubmit={this.handleSaveDetails}>
										<InputField
											label="Document Name"
											isRequired={true}
											value={newTitle}
											onChange={this.onTitleChange}
										/>
										<InputField
											error={putDocumentError && 'Error Saving Details'}
										>
											<Button
												name="create"
												type="submit"
												className="bp3-button bp3-intent-primary"
												onClick={this.handlePutDocument}
												text="Save Details"
												disabled={
													!hasChanged || !newTitle || title === newTitle
												}
												loading={putDocumentIsLoading}
											/>
										</InputField>
									</form>
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
											{this.props.assertionData.map((assertion) => (
												<HTMLTable key={assertion.cid} {...tableProps}>
													<tbody>
														<tr>
															<td>Uploaded</td>
															<td>
																{formatDate(assertion.createdAt)}
															</td>
														</tr>
														<tr>
															<td>Original file</td>
															<td>
																<a
																	href={`
																		${gatewayUrl}
																		${assertion.fileCid}
																	`}
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
	}
}

Document.propTypes = propTypes;
export default Document;

hydrateWrapper(Document);
