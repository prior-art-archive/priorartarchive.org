import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SHA3 from 'crypto-js/sha3';
import encHex from 'crypto-js/enc-hex';
import { AnchorButton, Button, NonIdealState } from '@blueprintjs/core';
import Avatar from 'components/Avatar/Avatar';
import InputField from 'components/InputField/InputField';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { apiFetch, hydrateWrapper } from 'utilities';

require('./login.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loginLoading: false,
			loginError: undefined,
			logoutLoading: false,
		};
		/* We use refs rather than state to manage username */
		/* and password form values because browser autocomplete */
		/* does not play nicely with onChange events as of Oct 31, 2018 */
		this.slugRef = React.createRef();
		this.passwordRef = React.createRef();
		this.onLoginSubmit = this.onLoginSubmit.bind(this);
		this.onLogoutSubmit = this.onLogoutSubmit.bind(this);
	}

	onLoginSubmit(evt) {
		evt.preventDefault();
		if (!this.slugRef.current
			|| !this.slugRef.current.value
			|| !this.passwordRef.current
			|| !this.passwordRef.current.value
		) {
			return this.setState({ loginLoading: false, loginError: 'Invalid Username or Password' });
		}

		this.setState({ loginLoading: true, loginError: undefined });
		return apiFetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({
				slug: this.slugRef.current.value.toLowerCase(),
				password: SHA3(this.passwordRef.current.value).toString(encHex),
			})
		})
		.then(()=> {
			window.location.href = this.props.locationData.query.redirect || '/';
		})
		.catch(()=> {
			this.setState({ loginLoading: false, loginError: 'Invalid Username or Password' });
		});
	}

	onLogoutSubmit() {
		this.setState({ logoutLoading: true });
		apiFetch('/api/logout')
		.then(()=> { window.location.href = '/'; });
	}

	render() {
		return (
			<div id="login-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
					hideNav={true}
					hideFooter={true}
				>
					<div className="container small">
						<div className="row">
							<div className="col-12 bp3-elevation">
								{!this.props.loginData.id &&
									<div>
										<h1>Login</h1>

										<form onSubmit={this.onLoginSubmit}>
											<InputField
												label="Username"
												autocomplete="username"
												inputRef={this.slugRef}
											/>
											<InputField
												label="Password"
												type="password"
												autocomplete="current-password"
												helperText={<a href="/password-reset">Forgot Password</a>}
												inputRef={this.passwordRef}
											/>
											<InputField error={this.state.loginError}>
												<Button
													name="login"
													type="submit"
													className="bp3-button bp3-intent-primary"
													onClick={this.onLoginSubmit}
													text="Login"
													loading={this.state.loginLoading}
												/>
											</InputField>
										</form>

										<a href="/signup" className="switch-message">Don&apos;t have an account? Click to Signup</a>
									</div>
								}
								{this.props.loginData.id &&
									<NonIdealState
										visual={
											<Avatar
												userInitials={this.props.loginData.name.substring(0, 1)}
												userAvatar={this.props.loginData.avatar}
												width={100}
											/>
										}
										title="Already Logged In"
										action={
											<div>
												<AnchorButton
													className="bp3-large"
													text="View Profile"
													href={`/organization/${this.props.loginData.slug}`}
												/>
												<Button
													className="bp3-large"
													text="Logout"
													onClick={this.onLogoutSubmit}
													loading={this.state.logoutLoading}
												/>
											</div>
										}
									/>
								}
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Login.propTypes = propTypes;
export default Login;

hydrateWrapper(Login);
