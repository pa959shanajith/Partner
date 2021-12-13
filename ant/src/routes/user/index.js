import React from 'react';
import { Route,Switch } from 'react-router-dom';

import Login from './routes/Login'
import SignUp from './routes/SignUp'
import SignUpV2 from './routes/SignUpV2'
import ForgotPassword from './routes/ForgotPassword'
import ForgotPasswordV2 from './routes/ForgotPasswordV2'
import UpdateNewPassword from './routes/UpdateNewPassword';
import VerifyEmail from './routes/VerifyEmail';
import TrailPartner from './routes/trailpartner';
import AddTrainees from './routes/AddTrainees';
import RequestAdminToAssignCompany from './routes/RequestAdminToAssignCompany';
// import VerifyPartner from './routes/verifyPartnerEmail';
import partner_payment_callback from './routes/partner-payment-callback';
import training_partners_payment_callback from "./routes/training_partner_payment_callback";
import PartnerOTP from './routes/PartnerOTP';
import partner_OTP_callback from './routes/partner-OTP-callback';
import NotFoundPage from '../../components/error404/NotFoundPage';
import './styles.scss';

const Page = ({ match }) => (
  <div>
    <Switch>
    <Route path={`${match.url}/login`} component={Login} />
    <Route path={`${match.url}/sign-up`} component={SignUp} />
    <Route path={`${match.url}/sign-up-v2`} component={SignUpV2} />
    <Route path={`${match.url}/tpo-upload`} component={AddTrainees} />
    <Route path={`${match.url}/forgot-password`} component={ForgotPassword} />
    <Route path={`${match.url}/forgot-password-v2`} component={ForgotPasswordV2} />
    <Route path={`${match.url}/confirm-partner/:verifycode`} component={VerifyEmail} />
    <Route path={`${match.url}/trail-partner/:verifycode`} component={TrailPartner} />
    <Route path={`${match.url}/assignCompanyToPartnerFromEmail/:partnerCompanyName/:jobPostedCompanyName/:token`} component={RequestAdminToAssignCompany} />
    <Route path={`${match.url}/partners-payment-callback`} component={partner_payment_callback} />
    <Route path={`${match.url}/training-partners-payment-callback`} component={training_partners_payment_callback} />
    <Route path={`${match.url}/partner-otp/:pymtcode`} component={PartnerOTP} />
    <Route path={`${match.url}/partners-OTP-callback/:orderId`} component={partner_OTP_callback} />
    <Route path={`${match.url}/employer-reset/:ResetCode`} component={UpdateNewPassword} />
    <Route path={`${match.url}/partner-reset/:ResetCode`} component={UpdateNewPassword} />
    <Route path={`${match.url}/partners-recruiter-reset/:ResetCode`} component={UpdateNewPassword} />
    <Route  component={NotFoundPage} />
    </Switch>
  </div>
)

export default Page;
