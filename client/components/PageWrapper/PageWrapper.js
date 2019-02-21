import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	children: PropTypes.node.isRequired,
	hideFooter: PropTypes.bool,
};

const defaultProps = {
	hideFooter: false,
};

const PageWrapper = (props) => {
	const loginData = props.loginData;

	return (
		<div id="page-wrapper-component">
			<Header locationData={props.locationData} loginData={props.loginData} />

			<div className="page-content">{props.children}</div>

			{!props.hideFooter && <Footer isAdmin={loginData.isAdmin || false} />}
		</div>
	);
};

PageWrapper.propTypes = propTypes;
PageWrapper.defaultProps = defaultProps;
export default PageWrapper;
