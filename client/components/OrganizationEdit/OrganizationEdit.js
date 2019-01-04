import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import ImageUpload from 'components/ImageUpload/ImageUpload';

require('./organizationEdit.scss');

const propTypes = {
	organizationData: PropTypes.object.isRequired,
	onSave: PropTypes.func,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
};

const defaultProps = {
	onSave: ()=>{},
	error: undefined,
	isLoading: false,
};

class OrganizationEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasChanged: false,
			name: props.organizationData.name || '',
			bio: props.organizationData.bio || '',
			avatar: props.organizationData.avatar,
			website: props.organizationData.website || '',
		};
		this.onNameChange = this.onNameChange.bind(this);
		this.onBioChange = this.onBioChange.bind(this);
		this.onAvatarChange = this.onAvatarChange.bind(this);
		this.handleSaveDetails = this.handleSaveDetails.bind(this);
	}

	onNameChange(evt) {
		this.setState({ name: evt.target.value, hasChanged: true });
	}

	onBioChange(evt) {
		this.setState({ bio: evt.target.value.substring(0, 280).replace(/\n/g, ' '), hasChanged: true });
	}

	onAvatarChange(val) {
		this.setState({ avatar: val, hasChanged: true });
	}

	handleSaveDetails(evt) {
		evt.preventDefault();
		const newOrganizationObject = {
			organizationId: this.props.organizationData.id,
			name: this.state.name,
			avatar: this.state.avatar,
			bio: this.state.bio,
			website: this.state.website,
		};
		this.props.onSave(newOrganizationObject);
	}

	render() {
		const expandables = [
			{
				label: 'Website',
				showTextOnButton: true,
				// icon: 'bp3-icon-link',
				value: this.state.website,
				onChange: (evt)=> { this.setState({ website: evt.target.value, hasChanged: true }); }
			},
		];
		return (
			<div className="organization-edit-component">
				<div className="container narrow nav">
					<div className="row">
						<div className="col-12">
							<h1>Edit Organization Details</h1>
							<form onSubmit={this.handleSaveDetails}>
								<InputField
									label="Organization Name"
									isRequired={true}
									value={this.state.name}
									onChange={this.onNameChange}
								/>
								<ImageUpload
									htmlFor="avatar-upload"
									label="Avatar Image"
									defaultImage={this.state.avatar}
									onNewImage={this.onAvatarChange}
									useCrop={true}
								/>
								<InputField
									label="Bio"
									isTextarea={true}
									value={this.state.bio}
									onChange={this.onBioChange}
									helperText={`${this.state.bio.length}/280 characters`}
								/>
								{expandables.map((item)=> {
									return (
										<InputField
											key={`input-field-${item.label}`}
											label={item.label}
											value={item.value}
											onChange={item.onChange}
											helperText={item.helperText}
										/>
									);
								})}

								<div className="buttons">
									<InputField error={this.props.error && 'Error Saving Details'}>
										<Button
											name="create"
											type="submit"
											className="bp3-button bp3-intent-primary"
											onClick={this.handleSaveDetails}
											text="Save Details"
											disabled={!this.state.name || !this.state.hasChanged}
											loading={this.props.isLoading}
										/>
									</InputField>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

OrganizationEdit.defaultProps = defaultProps;
OrganizationEdit.propTypes = propTypes;
export default OrganizationEdit;
