import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { Button, NonIdealState } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Icon from 'components/Icon/Icon';
import { hydrateWrapper, apiFetch, slugifyString } from 'utilities';

require('./organizationCreate.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	signupData: PropTypes.object.isRequired,
};

class OrganizationCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postOrganizationIsLoading: false,
			postOrganizationError: undefined,
			// subscribed: false,
			name: '',
			slug: '',
			password: '',
			bio: '',
			avatar: undefined,
			website: '',
		};
		this.onCreateSubmit = this.onCreateSubmit.bind(this);
		// this.onSubscribedChange = this.onSubscribedChange.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
		this.onSlugChange = this.onSlugChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onBioChange = this.onBioChange.bind(this);
		this.onAvatarChange = this.onAvatarChange.bind(this);
	}

	onCreateSubmit(evt) {
		evt.preventDefault();

		this.setState({ postOrganizationIsLoading: true, postOrganizationError: undefined });
		return apiFetch('/api/organizations', {
			method: 'POST',
			body: JSON.stringify({
				email: this.props.signupData.email,
				hash: this.props.signupData.hash,
				// subscribed: this.state.subscribed,
				name: this.state.name,
				slug: this.state.slug,
				password: SHA3(this.state.password).toString(encHex),
				avatar: this.state.avatar,
				bio: this.state.bio,
				website: this.state.website,
			}),
		})
			.then(() => {
				window.location.href = `/organization/${this.state.slug}`;
			})
			.catch((err) => {
				this.setState({ postOrganizationIsLoading: false, postOrganizationError: err });
			});
	}

	// onSubscribedChange() {
	// 	this.setState((prevState) => ({
	// 		subscribed: !prevState.subscribed
	// 	}));
	// }

	onNameChange(evt) {
		this.setState({ name: evt.target.value });
	}

	onSlugChange(evt) {
		this.setState({ slug: slugifyString(evt.target.value) });
	}

	onPasswordChange(evt) {
		this.setState({ password: evt.target.value });
	}

	onBioChange(evt) {
		this.setState({ bio: evt.target.value.substring(0, 280).replace(/\n/g, ' ') });
	}

	onAvatarChange(val) {
		this.setState({ avatar: val });
	}

	render() {
		const expandables = [
			{
				label: 'Website',
				showTextOnButton: true,
				icon: <Icon icon="link" />,
				action: () => {
					this.setState({ showWebsite: true });
				},
				isVisible: this.state.showWebsite,
				value: this.state.website,
				onChange: (evt) => {
					this.setState({ website: evt.target.value });
				},
			},
		];
		return (
			<div id="organization-create-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
					hideFooter={true}
				>
					{this.props.signupData.hashError && (
						<NonIdealState
							title="Signup URL Invalid"
							description={
								<div className="success">
									<p>This URL cannot be used to signup.</p>
									<p>Click below to restart the signup process.</p>
								</div>
							}
							visual="error"
							action={
								<a href="/signup" className="bp3-button">
									Signup
								</a>
							}
						/>
					)}

					{!this.props.signupData.hashError && (
						<div className="container small">
							<div className="row">
								<div className="col-12">
									<h1>Create Account</h1>
									<form onSubmit={this.onCreateSubmit}>
										<InputField
											label="Email"
											isDisabled={true}
											value={this.props.signupData.email}
										/>
										<InputField
											label="Organization Name"
											isRequired={true}
											value={this.state.firstName}
											onChange={this.onNameChange}
										/>
										<InputField
											label="Organization Username"
											isRequired={true}
											value={this.state.slug}
											onChange={this.onSlugChange}
											helperText={`Profile will be https://priorartarchive.org/${this
												.state.slug || 'username'}`}
										/>
										<InputField
											label="Password"
											type="password"
											isRequired={true}
											value={this.state.password}
											onChange={this.onPasswordChange}
										/>
										<ImageUpload
											htmlFor="avatar-upload"
											label="Avatar Image"
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
										{expandables
											.filter((item) => {
												return item.isVisible;
											})
											.map((item) => {
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

										{!!expandables.filter((item) => !item.isVisible).length && (
											<InputField label="Add More">
												<div className="bp3-button-group">
													{expandables
														.filter((item) => {
															return !item.isVisible;
														})
														.map((item) => {
															return (
																<button
																	type="button"
																	key={`button-${item.label}`}
																	className="bp3-button expandable"
																	onClick={item.action}
																>
																	{item.icon}
																	{item.showTextOnButton
																		? item.label
																		: ''}
																</button>
															);
														})}
												</div>
											</InputField>
										)}

										{/* <InputField wrapperClassName="bp3-callout" label="Stay Up To Date">
											<Checkbox
												label="Subscribe to our feature release & community newsletter."
												checked={this.state.subscribed}
												onChange={this.onSubscribedChange}
											/>
										</InputField> */}

										<InputField
											error={
												this.state.postOrganizationError &&
												'Error Creating Organization'
											}
										>
											<Button
												name="create"
												type="submit"
												className="bp3-button bp3-intent-primary create-account-button"
												onClick={this.onCreateSubmit}
												text="Create Account"
												disabled={
													!this.state.name ||
													!this.state.slug ||
													!this.state.password
												}
												loading={this.state.postOrganizationIsLoading}
											/>
										</InputField>
									</form>
								</div>
							</div>
						</div>
					)}
				</PageWrapper>
			</div>
		);
	}
}

OrganizationCreate.propTypes = propTypes;
export default OrganizationCreate;

hydrateWrapper(OrganizationCreate);
