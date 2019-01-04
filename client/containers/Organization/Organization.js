import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrganizationHeader from 'components/OrganizationHeader/OrganizationHeader';
import OrganizationEdit from 'components/OrganizationEdit/OrganizationEdit';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper, apiFetch } from 'utilities';

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
			putOrganizationIsLoading: false,
			putOrganizationError: undefined,
		};
		this.handleOrganizationEditSave = this.handleOrganizationEditSave.bind(this);
	}

	handleOrganizationEditSave(organizationObject) {
		this.setState({ putOrganizationIsLoading: true, putOrganizationError: undefined });
		return apiFetch('/api/organizations', {
			method: 'PUT',
			body: JSON.stringify(organizationObject)
		})
		.then(()=> {
			window.location.href = `/organization/${this.props.organizationData.slug}`;
		})
		.catch((err)=> {
			this.setState({ putOrganizationIsLoading: false, putOrganizationError: err });
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
							onSave={this.handleOrganizationEditSave}
							error={this.state.putOrganizationError}
							isLoading={this.state.putOrganizationIsLoading}
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
				</PageWrapper>
			</div>
		);
	}
}

Organization.propTypes = propTypes;
export default Organization;

hydrateWrapper(Organization);
