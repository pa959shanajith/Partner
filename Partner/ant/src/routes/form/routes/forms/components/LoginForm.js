import { Button, Checkbox, Form, Icon, Input, message, Modal } from 'antd';
import DEMO from 'constants/demoData';
import React from 'react';
import CookieConsent,{Cookies} from "react-cookie-consent";
import { withRouter } from "react-router-dom";
import Login from "../../../../../services/loginService.js";
import {  isBrowser, isMobile } from 'react-device-detect';
import cookies from 'universal-cookie';
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // validateStatus: '',
      // errormsg: ''
      remeberMe:false
    };
    this.login = new Login();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cookies = new cookies()
  }

  componentDidMount()
  {
    // console.log("email",email,"cookieToken",cookieToken);
    let email = this.cookies.get('partnerEmailId')
    let cookieToken = this.cookies.get('partnerType')
    let admin = this.cookies.get('partneradmin')
    if(email && cookieToken)
    {
    let data={
      emailId:email,
      cookieToken:cookieToken,
      admin:admin
    }

    this.login.cookieLoginService(data).then((d) => {
      // console.log(d);
      localStorage.setItem('email', d.data.emailId);
      localStorage.setItem('authToken', d.data.authtoken);
      localStorage.setItem('companyName', d.data.companyName);
      localStorage.setItem('isPartner', d.data.isPartner);
      localStorage.setItem('contactNo', d.data.contactNo);
      localStorage.setItem('partnerType', d.data.partnerType);
      localStorage.setItem('name', d.data.name);
      Cookies.set('partnerEmailId', d.data.emailId, { path: '/',expires: 30 });
      Cookies.set('partnerType', d.data.cookieToken, { path: '/',expires: 30 }); 
      Cookies.set('partneradmin', d.data.isPartner, { path: '/',expires: 30 });
      // this.cookies.set('emailId', d.data.emailId, { path: '/',maxAge: 2592000 });
      // this.cookies.set('type', d.data.cookieToken, { path: '/',maxAge: 2592000 });
      // this.cookies.set('partneradmin', d.data.isPartner, { path: '/',maxAge: 2592000 });
      if (!d.data.isPartner) {
        localStorage.setItem('partnerEmail', d.data.partnerEmail);
      }
      this.eventLogger()
      if (d.data.partnerType && d.data.partnerType.length > 0 && d.data.partnerType[0] === 'TRAINING') {
        //console.log('its inside if');

        this.props.history.push({
          pathname: DEMO.trainingpartnerdashboard,
          state: {
            emailId: d.data.emailId,
            auth: d.data.authtoken,
            isPartner: d.data.isPartner,
            companyName: d.data.companyName
          }
        });
      }
      else {
        //console.log('its inside else');

        this.props.history.push({
          pathname: DEMO.home2,
          state: {
            emailId: d.data.emailId,
            auth: d.data.authtoken,
            isRecruiter: d.data.isRecruiter,
            companyName: d.data.companyName
          }
        });
      }
    }).catch((err) => {
      // this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
      this.cookies.remove('partnerEmailId',{ path: '/' })
      this.cookies.remove('partnerType',{ path: '/' })
      this.cookies.remove('partneradmin',{ path: '/' })
            this.props.history.push('/user/login')
    });
  }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var userData = {
          emailId: (values.emailId).toLowerCase(),
          password: values.password,
          rememberMe: values.remember
        }
        this.login.loginService(userData).then((d) => {
          localStorage.setItem('email', d.data.emailId);
          localStorage.setItem('authToken', d.data.authtoken);
          localStorage.setItem('companyName', d.data.companyName);
          localStorage.setItem('isPartner', d.data.isPartner);
          localStorage.setItem('contactNo', d.data.contactNo);
          localStorage.setItem('partnerType', d.data.partnerType);
          localStorage.setItem('name', d.data.name);
          Cookies.set('partnerEmailId', d.data.emailId, { path: '/',expires: 30 });
          Cookies.set('partnerType', d.data.cookieToken, { path: '/',expires: 30 }); 
          Cookies.set('partneradmin', d.data.isPartner, { path: '/',expires: 30 });
          // this.cookies.set('emailId', d.data.emailId, { path: '/',maxAge: 2592000 });
          // this.cookies.set('type', d.data.cookieToken, { path: '/',maxAge: 2592000 });
          // this.cookies.set('partneradmin', d.data.isPartner, { path: '/' ,maxAge: 2592000});
          if (!d.data.isPartner) {
            localStorage.setItem('partnerEmail', d.data.partnerEmail);
          }
          this.eventLogger()
          if (d.data.partnerType && d.data.partnerType.length > 0 && d.data.partnerType[0] === 'TRAINING') {
            //console.log('its inside if');

            this.props.history.push({
              pathname: DEMO.trainingpartnerdashboard,
              state: {
                emailId: d.data.emailId,
                auth: d.data.authtoken,
                isPartner: d.data.isPartner,
                companyName: d.data.companyName
              }
            });
          }
          else {
            //console.log('its inside else');

            this.props.history.push({
              pathname: DEMO.home2,
              state: {
                emailId: d.data.emailId,
                auth: d.data.authtoken,
                isRecruiter: d.data.isRecruiter,
                companyName: d.data.companyName
              }
            });
          }

        }).catch((err) => {
          //TODO: Handle login failure..redirect to login page after alert
          console.log('error ==>', err);
          this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
          // console.log(this.state.errormsg);
          // this.props.history.push('/user/login');
        });
      }
    });
  }
  eventLogger = () => {
    let emailId = localStorage.getItem('email')
    let role = localStorage.getItem('isPartner') === 'true' ? 'admin' : 'recruiter'
    let data = {
      emailId: emailId,
      eventCategory: 'USEREVENT',
      eventType: 'login',
      userCategory: 'partner',
      actionPerformedBy: emailId,
      role : role,
      eventTimeStamp: new Date(),
      userAgent: isBrowser ? "browser" : "mobile"
    }
    this.login.eventLoggerPartnerLogin(data).then((d) => {
      if (d.data.status === true) {
        console.log("Event logged successfully")
      }
    }).catch((err) => {
      console.log("Event logging error")
    })
  }
  // linkedIn Login
  // linkedIn = () => {
  //   window.location.href = api.endPointUrl.local + 'auth/linkedin/partner';
  // }

  remeberMe = (e) =>{
    console.log("e",e.target.checked);
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <section className="form-v1-container">
        <CookieConsent
          enableDeclineButton
          location="bottom"
          buttonText="I accept"
          cookieName="shenzynPartnerCookie"
          style={{ background: "#2B373B" }}
          buttonStyle={{ backgroundColor: "#68439a", color: 'white' }}
          buttonClasses="btn btn-primary"
          containerClasses="cookie__container"
          expires={30}
          flipButtons
          onAccept={() => {
            message.success("Thank you accepting our cookie policy!", 5)
          }}
          onDecline={() => {
            message.warn("For smoother experience, please accept our cookie policy!", 5)
          }}
        >
          This website uses cookies to enhance the user experience.{" "}
          <span style={{ fontSize: "initial" }}>For more, read our <a target="_blank" rel="noopener noreferrer"  href="https://www.shenzyn.com/#/privacypolicy">Privacy Policy</a> </span>
        </CookieConsent>

        <h1 className="hero-title">Partner’s Login</h1>
        <h6 className="lead">Partner, and grow with us</h6>
        {/* <a onClick={this.linkedIn} className="btn btn-block icon-btn-v2 btn-linkedin"><Icon type="linkedin" /><span className="btn-text">Login with LinkedIN</span></a> */}
        {/* <div className="divider divider-with-content my-4"><span className="divider-inner-content">OR</span></div> */}
        <Form onSubmit={this.handleSubmit} className="form-v1">
          <FormItem>
            {getFieldDecorator('emailId', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input size="large" prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem
            validateStatus={this.state.validateStatus}
            help={this.state.errormsg}
          >
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              // <Input size="large" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
              <Input.Password size="large" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem className="form-v1__remember">
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: this.state.remeberMe,
            })(
              <Checkbox onChange={(e)=>this.remeberMe(e)}>Remember me</Checkbox>
            )}
          </FormItem>
          <FormItem>
            <Button id="Partner_User_Login" type="primary" htmlType="submit" className="btn-cta btn-block">
              Log in
            </Button>
          </FormItem>
        </Form>
        <p className="additional-info">Don't have an account yet? <a id="Partner_User_Login_SignUp" href={DEMO.signUp}>Sign up</a></p>
        <p className="additional-info">Forgot your username or password? <a id="Partner_User_Login_ResetPassword" href={DEMO.forgotPassword}>Reset password</a></p>
      </section>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(withRouter(NormalLoginForm));


export default WrappedNormalLoginForm;
