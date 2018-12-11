import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserHeader from 'components/UserHeader/UserHeader';
import UserEdit from 'components/UserEdit/UserEdit';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper, apiFetch } from 'utilities';

require('./user.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	userData: PropTypes.object.isRequired,
};

class User extends Component {
	constructor(props) {
		super(props);
		this.state = {
			putUserIsLoading: false,
			putUserError: undefined,
		};
		this.handleUserEditSave = this.handleUserEditSave.bind(this);
	}

	handleUserEditSave(userObject) {
		this.setState({ putUserIsLoading: true, putUserError: undefined });
		return apiFetch('/api/users', {
			method: 'PUT',
			body: JSON.stringify(userObject)
		})
		.then(()=> {
			window.location.href = `/user/${this.props.userData.slug}`;
		})
		.catch((err)=> {
			this.setState({ putUserIsLoading: false, putUserError: err });
		});
	}

	render() {
		const userData = this.props.userData;
		const loginData = this.props.loginData;
		const selfProfile = loginData.id && userData.id === loginData.id;
		const mode = this.props.locationData.params.mode;

		return (
			<div id="user-container">
				<PageWrapper
					loginData={this.props.loginData}
					locationData={this.props.locationData}
				>
					{mode === 'edit' &&
						<UserEdit
							userData={userData}
							onSave={this.handleUserEditSave}
							error={this.state.putUserError}
							isLoading={this.state.putUserIsLoading}
						/>
					}
					{mode !== 'edit' &&
						<div>
							<div className="container narrow">
								<div className="row">
									<div className="col-12">
										<UserHeader userData={userData} isUser={selfProfile} />
									</div>
								</div>
							</div>
						</div>
					}
				</PageWrapper>
			</div>
		);
	}
}

User.propTypes = propTypes;
export default User;

hydrateWrapper(User);
