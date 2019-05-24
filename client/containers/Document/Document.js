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
			description: props.documentData.description || '',
			documentNewData: {
				id: props.documentData.id,
				title: props.documentData.title || '',
				description: props.documentData.description || '',
			},
			hasChanged: false,
			putDocumentIsLoading: false,
			putDocumentError: undefined,
		};
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onDescriptionChange = this.onDescriptionChange.bind(this);
		this.handlePutDocument = this.handlePutDocument.bind(this);
		this.handleEditDocumentDataClick = this.handleEditDocumentDataClick.bind(this);
		this.handleCancelDocumentDataEditClick = this.handleCancelDocumentDataEditClick.bind(this);
	}

	onTitleChange(evt) {
		const { documentNewData } = this.state;
		const documentNewTitle = evt.target.value;
		if (documentNewData.title !== documentNewTitle) {
			this.setState((prevState) => ({
				documentNewData: {
					...prevState.documentNewData,
					title: documentNewTitle,
				},
				hasChanged: true,
			}));
		}
	}

	onDescriptionChange(evt) {
		const { documentNewData } = this.state;
		const documentNewDescription = evt.target.value;
		if (documentNewData.description !== documentNewDescription) {
			this.setState((prevState) => ({
				documentNewData: {
					...prevState.documentNewData,
					description: documentNewDescription,
				},
				hasChanged: true,
			}));
		}
	}

	handlePutDocument(evt) {
		evt.preventDefault();

		const { documentNewData } = this.state;

		this.setState({
			putDocumentIsLoading: true,
			putDocumentError: undefined,
		});

		return apiFetch('/api/documents', {
			method: 'PUT',
			body: JSON.stringify({
				document: documentNewData,
			}),
		})
			.then(() => {
				this.setState({
					putDocumentIsLoading: false,
					isEditingDocument: false,
					title: documentNewData.title,
					description: documentNewData.description,
				});
			})
			.catch((err) => {
				this.setState({
					putDocumentIsLoading: false,
					putDocumentError: err,
				});
			});
	}

	handleEditDocumentDataClick() {
		this.setState({
			isEditingDocument: true,
		});
	}

	handleCancelDocumentDataEditClick() {
		const { title, description } = this.state;

		// TODO: Wrap this up in a default state
		this.setState((prevState) => ({
			documentNewData: {
				...prevState.documentNewData,
				title: title || '',
				description: description || '',
			},
			hasChanged: false,
			isEditingDocument: false,
		}));
	}

	renderDocumentDataHeader() {
		const { title, description, isEditingDocument } = this.state;

		const generatedTitle = generateDocumentTitle(title);
		const placeholderDescription = 'No description available.';

		return (
			<>
				<Button
					type="button"
					className="bp3-button document__edit-button"
					text="Edit"
					onClick={this.handleEditDocumentDataClick}
					disabled={isEditingDocument}
				/>
				<h1 className={generatedTitle.isPlaceholder ? 'placeholder' : ''}>
					{`${generatedTitle.title} `}
				</h1>
				<section className={description ? '' : 'placeholder'}>
					{description || placeholderDescription}
				</section>
			</>
		);
	}

	renderDocumentDataEditForm() {
		const {
			title,
			description,
			documentNewData,
			hasChanged,
			putDocumentError,
			putDocumentIsLoading,
		} = this.state;

		return (
			<>
				<form className="document__edit-form" onSubmit={this.handlePutDocument}>
					<InputField
						label="Title"
						isRequired={true}
						value={documentNewData.title}
						onChange={this.onTitleChange}
					/>
					<InputField
						label="Description"
						value={documentNewData.description}
						onChange={this.onDescriptionChange}
					/>
					<InputField error={putDocumentError && 'Error Saving Details'}>
						<Button
							type="submit"
							className="bp3-button bp3-intent-primary"
							text="Save changes"
							disabled={
								!hasChanged ||
								!documentNewData.title ||
								(title === documentNewData.title &&
									description === documentNewData.description)
							}
							loading={putDocumentIsLoading}
						/>
						{` or `}
						<Button
							type="button"
							className="bp3-button"
							text="Close"
							onClick={this.handleCancelDocumentDataEditClick}
						/>
					</InputField>
				</form>
			</>
		);
	}

	render() {
		const {
			fileUrl,
			language,
			contentType,
			organizationName,
			organizationSlug,
		} = this.props.documentData;

		const { isEditingDocument } = this.state;

		const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
		const createdAt = formatDate(this.props.documentData.createdAt);
		const updatedAt = formatDate(this.props.documentData.updatedAt);
		const publicationDate = formatDate(this.props.documentData.publicationDate);
		const cpcCodes = this.props.documentData.cpcCodes || [];

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
									{isEditingDocument
										? this.renderDocumentDataEditForm()
										: this.renderDocumentDataHeader()}
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
