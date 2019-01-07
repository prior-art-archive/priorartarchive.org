import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { ProgressBar } from '@blueprintjs/core';
import uuidv4 from 'uuid/v4';
import Icon from 'components/Icon/Icon';
import OrganizationHeader from 'components/OrganizationHeader/OrganizationHeader';
import OrganizationEdit from 'components/OrganizationEdit/OrganizationEdit';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper, s3Upload } from 'utilities';

require('./organization.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	organizationData: PropTypes.object.isRequired,
};

class Organization extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
		};
		this.onDrop = this.onDrop.bind(this);
		this.onUploadFinish = this.onUploadFinish.bind(this);
		this.onUploadProgress = this.onUploadProgress.bind(this);
	}

	onDrop(files) {
		this.setState((prevState)=> {
			const newItems = [];
			files.forEach((file, index)=> {
				const fileIndex = index + prevState.items.length;
				const docId = uuidv4();
				s3Upload(file, this.onUploadProgress, this.onUploadFinish, fileIndex, `uploads/${this.props.organizationData.id}/${docId}`);
				newItems.push({
					name: file.name,
					progress: 0,
					url: undefined,
				});
			});
			return {
				items: [...prevState.items, ...newItems],
			};
		});
	}

	onUploadProgress(evt, index) {
		this.setState((prevState)=> {
			const newItems = [...prevState.items];
			newItems[index].progress = evt.loaded / evt.total;
			return { items: newItems };
		});
	}

	onUploadFinish(evt, index, type, filename) {
		this.setState((prevState)=> {
			const url = `https://assets.priorartarchive.org/${filename}`;
			const newItems = [...prevState.items];
			newItems[index].url = url;
			return { items: newItems };
		});
	}

	render() {
		const organizationData = this.props.organizationData;
		const loginData = this.props.loginData;
		const selfProfile = loginData.id && organizationData.id === loginData.id;
		const mode = this.props.locationData.params.mode;

		return (
			<div id="organization-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
				>
					{mode === 'edit' &&
						<OrganizationEdit
							organizationData={organizationData}
						/>
					}
					{mode !== 'edit' &&
						<div>
							<div className="container narrow">
								<div className="row">
									<div className="col-12">
										<OrganizationHeader organizationData={organizationData} isOrganization={selfProfile} />
									</div>
								</div>
							</div>
						</div>
					}
					<div className="container narrow">
						<div className="row">
							<div className="col-12">
								{this.state.items.map((item, index)=> {
									const key = `${item.name}-${index}`;
									return (
										<div key={key}>
											<div><b>{item.name}</b></div>
											{item.url &&
												<div><a href={item.url}>{item.url}</a></div>
											}
											{!item.url &&
												<ProgressBar value={item.progress === 1 ? null : item.progress} />
											}
										</div>
									);
								})}
							</div>
						</div>
					</div>
					{selfProfile &&
						<div className="container narrow">
							<div className="row">
								<div className="col-12">
									<Dropzone
										onDrop={this.onDrop}
										accept="application/pdf, text/html"
									>
										{({ getRootProps, getInputProps, isDragActive }) => {
											return (
												<div
													{...getRootProps()}
													className={`dropzone ${isDragActive ? 'dropzone--isActive' : ''}`}
												>
													<input {...getInputProps()} />
													<div className="drag-message">
														<Icon icon="circle-arrow-up" iconSize={50} />
														<div className="drag-title">Drag & drop to upload files</div>
														<div className="drag-details">Or click to browse files</div>
														<div className="drag-details">PDF or HTML</div>

													</div>
												</div>
											);
										}}
									</Dropzone>
								</div>
							</div>
						</div>
					}
				</PageWrapper>
			</div>
		);
	}
}

Organization.propTypes = propTypes;
export default Organization;

hydrateWrapper(Organization);
