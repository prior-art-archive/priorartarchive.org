import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./help.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Help = function(props) {
	return (
		<div id="help-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="container narrow">
					<div className="row">
						<div className="col-12">
							<h1>Search Help</h1>

							<h2>Operators</h2>

							<ul>
								<li>
									Examiners can choose the following operators from dropdown.
									<ul>
										<li>OR</li>
										<li>AND</li>
										<li>ADJ</li>
										<li>NEAR</li>
										<li>WITH</li>
										<li>SAME</li>
									</ul>
								</li>
								<li>"AND" will be considered as the default operator.</li>
								<li>
									The NEAR operator searches for terms that are next to each other
									(distance=0)
								</li>
								<li>
									The ADJ operator is similar to the NEAR operator, except it
									requires matching documents have terms in the same order as
									specified in the expression
									<div className="example">
										Ex: cisco ADJ router will become ONEAR(cisco, router)
									</div>
								</li>
								<li>
									WITH Operator will search for terms within a distance of 15.
									<div className="example">
										Ex: cisco WITH router will become NEAR(cisco, router,
										distance=15)
									</div>
								</li>
								<li>
									SAME Operator will search for the terms within a distance of
									200.
									<div className="example">
										Ex: cisco SAME router will become NEAR(cisco, router,
										distance=200)
									</div>
								</li>
								<li>
									Exact match is enabled for hypen & period character.
									<div className="example">Ex: "in-memory"</div>
								</li>
								<li>
									'$' will be interpreted as any number of characters and hence
									will be converted to '*'.
									<div className="example">Ex: config$ will become config*</div>
								</li>
								<li>
									'$n' will be interpreted as 'n' number of characters and will be
									converted to [a-zA-Z0-9]{'{'}0,n{'}'}.
									<div className="example">
										Ex: config$5 will become config[a-zA-Z0-9]{'{'}0,5{'}'}
									</div>
								</li>
								<li>
									'~' if used in search text will always have a number following
									the '~' and will be interpreted as 'FUZZY' of the preceding
									string with a similarity of the following number.
									<div className="example">
										Ex: cisco~4 will become FUZZY(cisco, similarity=4)
									</div>
								</li>
								<li>
									'^' if used in search text will always have a number following
									'^' and this number will be used as 'BOOST' value for the string
									preceding '^'.
									<div className="example">
										Ex: cisco^100 will become TERM(cisco, BOOST=100)
									</div>
								</li>
								<li>
									'|' if used in search text will be interpreted as 'OR' operator.
									<div className="example">
										Ex: cisco|router will become OR(cisco, router)
									</div>
								</li>
								<li>
									Date should always be of either 'yyyymmdd' or 'yyyy' format.
									'yyyymmdd' format should always be preceded by any of '@RLAD',
									'@AD', '@PD', '@FD', '@RLFD' and 'yyyy' format should always be
									preceded by any of '@AY', '@PY', '@FY'.
									<div className="example">Ex: @AD>19961011</div>
								</li>
								<li>
									Phrases should be enclosed within double quotes.
									<div className="example">Ex: "cisco systems"</div>
								</li>
							</ul>

							<h2>Extensions</h2>
							<ul>
								<li>
									All the extensions will be removed except .ti. & .ab. to enable
									search on title & abstract
									<div className="example">
										Ex: cisco.ti. will become title:cisco
									</div>
									<div className="example">
										Ex: cisco.ab. will become description:cisco
									</div>
									<div className="example">
										Ex: A comma will need to separate a search on the title and
										abstract. cisco.ti,ab. will become OR(CONTEXT(title):cisco,
										CONTEXT(description):cisco)
									</div>
									<div className="example">
										Ex: cisco AND 799/11.ccls will become cisco
									</div>
								</li>
								<li>
									For following extensions, strings associated will be retained as
									normal string in the search text.
									<br />
									ASGP, AS, INGP, IN
									<div className="example">
										Ex: cisco AND marker.ASGP will become cisco AND marker
									</div>
								</li>
								<li>
									For following extensions the string will be converted to date
									format.
									<br />
									AD, FD, AY, FY, PPPD, PD, ISD ,PY, ISY
									<div className="example">
										Ex: 19961011.AD will become date:[1996-10-11T00:00:00 TO
										1996-10-11T23:59:59]
									</div>
								</li>
								<li>
									To search by CPC code, use .cpc. extension. All the records
									matching H04L29/06 code will be returned and displayed in the
									sorted order of score (high to low).
									<div className="example">Ex: H04L29/06.cpc.</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Help.propTypes = propTypes;
export default Help;

hydrateWrapper(Help);
