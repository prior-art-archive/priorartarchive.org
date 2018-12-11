import React from 'react';
import { storiesOf } from '@storybook/react';
import Login from 'containers/Login/Login';
import { locationData, loginData } from '../data';

storiesOf('Containers', module)
.add('Login', () => (
	<Login
		locationData={locationData}
		loginData={loginData}
	/>
));
