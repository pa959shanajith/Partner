import React from 'react';
import { Layout, Icon } from 'antd';
import PAGEROUTES from 'constants/pageRoutes';

const { Footer } = Layout;

const AppFooter = () => (
  <Footer className="app-footer bg-white">
    <div className="footer-inner-v2">
      <ul className="list-inline list-inline-split">
        <li className="list-inline-item"><a id="Partner_About" href={PAGEROUTES.footerLinks.About} target="_blank">About</a></li>
        <li className="list-inline-item"><a id="Partner_Careers" href={PAGEROUTES.footerLinks.Career} target="_blank">Careers</a></li>
        <li className="list-inline-item"><a id="Partner_Help&Support" href={PAGEROUTES.footerLinks.Help} target="_blank">Help &amp; Support</a></li>
        <li className="list-inline-item"><a id="Partner_Privacy" href={PAGEROUTES.footerLinks.Privacy} target="_blank">Privacy</a></li>
        <li className="list-inline-item"><a id="Partner_Terms" href={PAGEROUTES.footerLinks.Terms} target="_blank">Terms</a></li>
      </ul>
      <ul className="footer-social-list">
        <li><a id="Partner_LinkedIn" href={PAGEROUTES.footerLinks.LinkedIn} target="_blank" rel="noopener noreferrer" ><Icon type="linkedin" /></a></li>
        <li><a id="Partner_FaceBook" href={PAGEROUTES.footerLinks.Facebook} target="_blank" rel="noopener noreferrer" ><Icon type="facebook" /></a></li>
        <li><a id="Partner_Twitter" href={PAGEROUTES.footerLinks.Twitter} target="_blank" rel="noopener noreferrer" ><Icon type="twitter" /></a></li>
        <li><a id="Partner_Instagram" href={PAGEROUTES.footerLinks.Instagram} target="_blank" rel="noopener noreferrer"><Icon type="instagram" /></a></li>
        <li><a id="Partner_YouTube" href={PAGEROUTES.footerLinks.YouTube} target="_blank" rel="noopener noreferrer"><Icon type="youtube" /></a></li>
      </ul>
      <div className="footer-copyright">
        <span>© 2020 4GEN Technologies Pvt. Ltd. All Rights Reserved.</span>
      </div>
    </div>
  </Footer>
)

export default AppFooter;
