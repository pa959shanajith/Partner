import ServiceBase from './serviceBase'
import api from 'constants/pageRoutes';

export default class Login {
    // Partner's Login
    loginService(value) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/login', value);
    }
    // Partner's Password Reset
    resetPasswordService(value) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/forgot', value);
    }
    // Partner's Signup
    signUpService(value) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/registerpartner', value);
    }
      //Training Partner's Signup
      trainingSignUpService(value) {
        return ServiceBase.post(api.equipEndPointUrl.default + 'tenant/register', value);
    }
    
    // Update New Password
    updateNewPasswordService(secret, value) {
        return ServiceBase.post(api.endPointUrl.default + 'recruiter/reset/' + secret, value);
    }
    // Confirm partner 
    confirmPartner(secret) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/confirm-partner/' + secret);
    }
    // Trail partner 
    trailPartner(secret) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/trail-partner/' + secret);
    }
    // Verify Partner Email
    verifyPartnerEmail(secret,value){
        return ServiceBase.post(api.endPointUrl.default + 'partner/reset/' + secret,value);
    }
    // This api called when shenzyn approves to assign a company to the partner via a link sent to shenzyn admin 
    assignCompanyToPartnerFromEmail(partnerCompanyName,jobPostedCompanyName,token) {
        return ServiceBase.post(api.endPointUrl.default + 'partner/assignCompanyToPartnerFromEmail/'+ partnerCompanyName +'/'+ jobPostedCompanyName+ '/'+token);
    }
    eventLoggerPartnerLogin(data) {
        return ServiceBase.post(api.endPointUrl.default + 'eventlogger/partnerLogin',data);
    }
    eventLoggerPartnerSignup(data) {
        return ServiceBase.post(api.endPointUrl.default + 'eventlogger/partnerSignup',data);
    }
    eventLoggerPartnerForgotPassword(data) {
        return ServiceBase.post(api.endPointUrl.default + 'eventlogger/partnerForgotPassword',data);
    }
    eventLoggerPartnerResetPassword(data) {
        return ServiceBase.post(api.endPointUrl.default + 'eventlogger/partnerResetPassword',data);
    }
    cookieLoginService(data){
        return ServiceBase.post(api.endPointUrl.default + 'partner/cookieToken',data);
    }
}

