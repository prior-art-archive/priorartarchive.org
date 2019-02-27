import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./terms.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Terms = function(props) {
	return (
		<div id="terms-container">
			<PageWrapper loginData={props.loginData} locationData={props.locationData}>
				<div className="container narrow">
					<div className="row">
						<div className="col-12">
							<h1>Terms of Use & Privacy Policy</h1>
							<p>
								The Prior Art Archive website (the “Site,” which includes all pages
								within the www.priorartarchive.org host directory and subdomains,
								and all associated services) is a project of the Massachusetts
								Institute of Technology (“MIT”) that allows visitors (“Users”) to
								search, and registered users (“Contributors”) to upload, archival
								materials related to prior art. For clarity, all terms that apply to
								Users also apply to Contributors.{' '}
							</p>
							<p>
								These Prior Art Archive Terms of Use and Privacy Policy (together,
								the “Terms”) govern the Site. By registering for a user account,
								accessing any content on, visiting, or otherwise using the Site, you
								accept and agree to be bound by the Terms.
							</p>
							<p>
								MIT reserves the right to change the Terms or modify the features of
								the Site at any time, so please check this page periodically for any
								updates. By continuing to access the Site after any such updates,
								you accept and agree to be bound by all modified terms. If you do
								not agree, you must stop using the Site immediately.{' '}
							</p>

							<h2>1. Registration & Eligibility </h2>
							<p>
								You must be 13 years of age or older to register or access features
								on this Site. If we discover or have reason to suspect that you are
								not 13 or older, we reserve the right to suspend or terminate your
								registration and/or access to this Site immediately and without
								notice.
							</p>
							<p>
								In order to post content to the Site, you must become a Contributor
								by registering for an account with the Site, which includes
								submitting the name of your organization, a contact name, and
								contact e-mail address. All information you provide must be
								accurate, current, and complete. The decision to provide personal
								information to the Site is optional, however, if you elect not to
								provide it, you will not be able to create an account or upload
								content to the Site. Personal information will only be used in
								strict accordance with our Privacy Policy (see Section 5 below).
							</p>
							<p>
								Neither the Site nor MIT will be liable for any loss or damage
								arising from your failure to protect your account password or login
								information. To the extent permitted by applicable law, MIT reserves
								the right, in its sole discretion, to terminate the registration of
								and/or deny Site access to any person for any reason.
							</p>

							<p>2. Acceptable Use of The Site</p>
							<p>
								When using the Site, whether as a User or Contributor, you must
								comply with all applicable laws of your jurisdiction. You also agree
								not to:
							</p>
							<ul>
								<li>
									Communicate or behave in any manner that is threatening,
									harassing, obscene, offensive, knowingly false, or intended to
									cause distress;
								</li>
								<li>
									Impersonate any person or entity or create a false identity on
									the Site;
								</li>
								<li>
									Disseminate or transmit “spam,” unsolicited messages, chain
									letters, advertisements, solicitations, or other unsolicited
									commercial communications, including but not limited to
									communications describing investment opportunities;
								</li>
								<li>
									Post material that infringes a copyright, trademark, patent
									right, trade secret, or other legal right of any person,
									corporation, or institution;
								</li>
								<li>
									Knowingly disseminate or transmit viruses, Trojan horses, worms,
									defects, date bombs, time bombs, malware, spyware, or other
									items of a destructive nature or any other malicious code or
									program;
								</li>
								<li>
									Knowingly carry out any action with the intent or effect of
									disrupting the Site or interfering with other users’ access to
									or experience of the Site;
								</li>
								<li>
									Access or use the Site in any manner that could damage or
									overburden any MIT server, or any network connected to any MIT
									server.
								</li>
							</ul>
							<p>
								Any violation of this section may result in your access to the Site
								being terminated immediately and without notice.
							</p>

							<h2>3. Site Content</h2>
							<p>
								For the purposes of these Terms, “Site Content” means all content
								posted to and available for download from the Site, including but
								not limited to “Contributor Content” (see Section 4 below).
							</p>
							<p>
								Except where otherwise specifically noted, all Site Content is
								licensed under the Creative Commons Attribution Non-Commercial
								No-Derivatives International 4.0 (“CC BY-NC-ND 4.0”) License, a copy
								of which is available at
								https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode. This
								license allows Users and Contributors to copy and redistribute the
								Site Content, in whole or in part, provided that the source of the
								material and its license terms are given proper attribution, and the
								material is not modified, transformed, built upon, or used primarily
								for monetary compensation. No other license to the Site Content is
								provided by these Terms.
							</p>
							<p>
								You may not use MIT’s names, trademarks, logos, or insignia, or any
								version, abbreviation or representation of them, in any advertising,
								publicity, promotional materials or other public announcement
								without the prior written consent of MIT’s Technology Licensing
								Office, which consent MIT may withhold in its sole discretion.
							</p>
							<p>
								If you believe that any Site Content infringes your copyrights,
								please visit http://web.mit.edu/copyright/dmca-notices.html for more
								information, including the email address for MIT’s DMCA agent.
							</p>

							<h2>4. Contributor Content</h2>
							<p>
								This Site allows Contributors to post archival materials related to
								prior art (“Contributor Content”). By submitting Contributor Content
								that you own, you agree to license such content under the terms of
								the CC BY-NC-ND 4.0 License. If you submit Contributor Content that
								you do not own, it must either be (i) licensed by the owner under
								terms no more restrictive than the CC BY-NC-ND 4.0 License (for
								example, a Creative Commons Attribution-only or open source license)
								or (ii) in the public domain (for example, materials that are not
								copyrightable). All Contributor Content must be clearly marked with
								the appropriate attribution and licensing information.
							</p>

							<p>
								In addition, all Contributor Content must conform to the Site’s
								Contribution Guidelines (“Guidelines”),{' '}
								<a href={'/contributions'}>found here</a>. These Guidelines outline
								the requirements that Contributor Content must meet in order to be
								published on the Site, including type, file format, size, and
								descriptive data such as the source and creation date of the
								content. By submitting Contributor Content, you represent that you
								have taken reasonable care in assembling and providing all such
								information and that it is accurate to the best of your knowledge.
								Contributor Content that does not conform to these Guidelines will
								not be published. Our Contribution Guidelines may be updated from
								time to time as needed, so please check back periodically.
							</p>

							<p>
								You may only post Contributor Content that you have the right to
								share under the license terms set forth above. You acknowledge and
								accept that any Contributor Content you post to the Site will be
								made available for the public to access, view, and use, and that any
								views or opinions, legal or otherwise, expressed by others on the
								Site are theirs alone. You may not post any content that violates or
								infringes upon the rights of any third party, including copyright,
								trademark, privacy, publicity, or other personal or proprietary
								rights, breaches or conflicts with any obligation, such as a
								confidentiality obligation, or contains libelous, defamatory, or
								otherwise unlawful material.
							</p>
							<p>
								Contributor Content is the sole responsibility of the Contributor
								who posted it. MIT does not warrant that any Contributor Content is
								accurate or complete or that it will not infringe third party
								rights. MIT may monitor Contributor Content posted to the Site, and
								in its sole discretion, remove Contributor Content for any reason
								without notice or liability.{' '}
							</p>

							<h2>5. Privacy Policy</h2>
							<p>
								MIT is committed to respecting the privacy of Users who access the
								Site and Contributors who upload content to the Site. The following
								Privacy Policy applies to all use of the Site:
							</p>
							<p>
								<b>A. Web Server Logs</b>
							</p>
							<p>
								When you visit the Site, our web server may record the following
								information in its server log:
							</p>
							<ul>
								<li>your IP Address,</li>
								<li>the URLs you have requested to access,</li>
								<li>the dates and methods of requests,</li>
								<li>the status code of your requests,</li>
								<li>URLs of pages that referred you to the Site,</li>
								<li>the number of bytes transferred, and</li>
								<li>your web browser and operating system platform.</li>
							</ul>
							<p>
								We use server log information to help diagnose problems with our
								server and to administer our website by identifying which parts or
								features of our site are most heavily used. We also use this
								information to tailor Site Content to User needs and to generate
								aggregate statistical reports. Web server logs are retained on a
								temporary basis, during which time their contents are accessible to
								Site administrators, and then deleted completely from our systems.
								Unless required by legal process, we do not link IP addresses to any
								personally identifiable information. This means that User sessions
								will be tracked by IP address but we do not use that information to
								identify specific individual activity.
							</p>
							<p>
								In addition, we ordinarily do not disclose to third parties Site
								usage by individual IP addresses, but we may do so in limited
								circumstances when complying with law or legal process, working with
								consultants assisting us with fixing or improving the Site, or
								monitoring and improving the security of our network.
							</p>
							<p>
								<b>B. Contributors</b>
							</p>
							<p>
								The content you post will be available for all Users and will
								identify your organization as the source. From time to time, we may
								solicit feedback from you about your use of the Site and its
								features (your “Feedback”). You are not required to provide
								Feedback. We solicit Feedback for internal purposes only, so that we
								can evaluate the Site and its features, and we will not publish or
								otherwise disclose your Feedback without first obtaining your
								permission to do so.
							</p>
							<p>
								<b>C. Site Analytics</b>
							</p>
							<p>
								In order to refine the resources available through the Site and to
								optimize and improve your experience on the Site, we may conduct
								internal analytics of materials submitted by Contributors. Any such
								internal analytics will generally be conducted on an aggregate or
								otherwise de-identified set of Contributor Content.
							</p>
							<p>
								<b>D. Cookies</b>
							</p>
							<p>
								Cookies are unique bits of computer data that many major websites
								will transfer to your computer the first time that you visit.
								Cookies are stored on your hard drive and may be later accessed by
								the website to track prior usage.{' '}
							</p>
							<p>
								<b>E. Email</b>
							</p>
							<p>
								We will only record your email address if you send us a message or
								submit it to us as part of the Contributor registration process. We
								will only use your email address for the purpose for which you have
								provided it (for example, to respond to a message from you or to
								communicate with you regarding your account).
							</p>
							<p>
								When you submit your email address to the Site during registration,
								we may ask you whether you want to receive periodic announcements
								from the Site by email. Accepting emailed announcements is entirely
								optional and not a condition of registration. You may change your
								email settings at any time to subscribe or unsubscribe to these
								mailings.
							</p>
							<p>
								In the event we contract with a third party service to assist with
								email delivery of newsletters and other mailings containing
								information about the Site, that service will be prohibited from
								using or sharing your information for any purpose other than
								facilitating communications on behalf of the Site.
							</p>
							<p>
								<b>F. Disclosure to Third Parties</b>
							</p>
							<p>
								We will not sell, lend, or disclose to third parties any personally
								identifiable information collected from Users or Contributors,
								except as described in this Policy or in the event we are required
								by law to do so. We may disclose information to MIT’s employees,
								fellows, students, consultants, and agents who have a legitimate
								need to know the information for the purpose of fixing or improving
								the Site and monitoring and improving the security of our network.
								We may also disclose this information when special circumstances
								call for it, such as when disclosure is required by law or court
								order or when disclosure is, in our sole discretion, necessary to
								protect our legal rights, including intellectual property rights.
							</p>
							<p>
								<b>G. Other Websites</b>
							</p>
							<p>
								This Site may contain links to other web resources, including
								websites of organizations other than MIT. Such websites may also
								install cookies on your computer, log your access to their web
								pages, or collect user-identifying information directly from you,
								once you proceed to browse those sites. We are not responsible for
								the privacy policies of other sites to which the Site provides
								links. Please visit the relevant sites to review their privacy
								policies.
							</p>
							<p>
								<b>H. Data Security</b>
							</p>
							<p>
								We have in place physical, electronic and managerial procedures to
								protect the information we collect online. However, as effective as
								these measures are, no security system is impenetrable. We cannot
								completely guarantee the security of our database, nor can we
								guarantee that the information you supply will not be intercepted
								while being transmitted to us over the Internet.
							</p>
							<p>
								<b>I. Notification of Changes in the Privacy Policy</b>
							</p>
							<p>
								We will review our security measures and policies on a periodic
								basis, and we may modify these Terms as appropriate. We may also
								change or update our Privacy Policy if we add new services or
								features. If any changes are made, we will make appropriate
								amendments to this policy and post them at the Site. By accessing
								the Site after modifications to this Privacy Policy have been
								posted, you agree to be bound by the modified terms. We encourage
								you to review our Privacy Policy on a regular basis.
							</p>

							<h2>6. Disclaimer of Warranty & Limitation of Liability</h2>
							<p>
								All use of the Site is at your own risk. To the fullest extent
								permitted by the law, MIT disclaims all warranties, express or
								implied, in connection with the Site and your use thereof.
							</p>
							<p>
								MIT makes no warranties or representations about the accuracy or
								completeness of the Site Content (including Contributor Content) or
								the content of any websites linked to this Site and assumes no
								liability or responsibility for any: (i) errors, mistakes,
								omissions, or inaccuracies in content; (ii) personal injury or
								property damage, of any nature whatsoever, resulting from your
								access to and use of the Site; (iii) unauthorized access to or use
								of MIT’s secure servers and/or any and all personal information
								and/or financial information stored therein; (iv) interruption or
								cessation of transmission to or from the Site; (v) bugs, viruses,
								Trojan horses, or the like that may be transmitted to or through the
								Site by any third-party; and/ or (vi) content or any loss or damage
								of any kind incurred as a result of the use of any content posted,
								emailed, transmitted, or otherwise made available via the Site. You
								assume all risk as to the quality, function, and performance of the
								Site, and to all transactions you undertake on the Site, including
								without limitation submission of any Contributor Content.
							</p>
							<p>
								You agree that MIT will have no liability for any loss or actual,
								consequential, indirect, punitive, special, or incidental damages,
								whether foreseeable or unforeseeable, arising out of or relating to
								these Terms, your or any third party’s use or inability to use the
								Site, your posting of Contributor Content, your reliance upon
								information obtained from or through the Site, or your
								communications with other Users, whether based in contract, tort,
								statutory or other law, including but not limited to claims for
								defamation, errors, loss of data, or interruption in availability of
								data, except where and only to the extent that applicable law
								requires such liability.
							</p>

							<h2>7. Indemnification</h2>
							<p>
								You hereby indemnify, defend, and hold harmless MIT and its
								affiliates, employees, faculty members, fellows, students, members
								of their governing boards and agents (collectively, the “Indemnified
								Parties”) from and against any and all liability and costs,
								including, without limitation, reasonable attorneys’ fees, incurred
								by the Indemnified Parties in connection with any claim arising out
								of (i) your posting of Contributor Content; (ii) any breach by you
								or any user of your account of these Terms; or (iii) your or any
								user of your account’s violation of applicable law. You shall
								cooperate as reasonably required in the defense of any such claim.
								MIT reserves the right, at its own expense, to assume the exclusive
								defense and control of any matter subject to indemnification by you.
							</p>

							<h2>8. General</h2>
							<p>
								These Terms are governed by the laws of the State of Massachusetts,
								U.S.A., excluding any conflict of laws rules or principles. If there
								is any dispute relating to the Site or these Terms, You agree to
								exclusive personal jurisdiction and venue in the state and federal
								courts of Suffolk County, State of Massachusetts, U.S.A.
							</p>
							<p>
								If any provision of these Terms is found to be invalid or
								unenforceable, that provision will be struck and the remaining
								provisions will remain in full effect.
							</p>
							<p>
								If You violate these Terms and we take no immediate action, this in
								no way limits or waives our rights, such as our right to take action
								in the future or in similar situations.
							</p>
							<p>
								If you have any questions about the Terms, Contribution Guidelines,
								Privacy Policy, or Site, please contact Kate Darling at
								kdarling@mit.edu.
							</p>
							<p>These Terms are in effect as of June 19, 2018.</p>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Terms.propTypes = propTypes;
export default Terms;

hydrateWrapper(Terms);
