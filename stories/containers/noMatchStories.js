import React from 'react';
import { storiesOf } from '@storybook/react';
import NoMatch from 'containers/NoMatch/NoMatch';
import { locationData, loginData } from '../data';

storiesOf('Containers', module)
.add('NoMatch', () => (
	<NoMatch
		locationData={locationData}
		loginData={loginData}
	/>
));
