import React from 'react';
import { Form, Icon, Input, Button, Modal } from 'antd';
import { withRouter } from "react-router-dom";
import DEMO from 'constants/demoData';
import ResetPassword from "../../../../../services/loginService.js";
import {  isBrowser, isMobile } from 'react-device-detect';
const FormItem = Form.Item;
class NormalForm extends React.Component {
  constructor() {
    super();
    this.state = {}
    this.reset = new ResetPassword();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let data = {
        emailId: values.emailId.toLowerCase()
      }
      this.reset.resetPasswordService(data).then((d) => {
        this.eventLogger(data.emailId)
        Modal.success({
          //   title: 'This is a warning message',
          content: (
            <div>
              <p>A password reset email has been sent, Check your mail!</p>
            </div>
          ),
          onOk: () => {
            this.props.history.push('/user/login');
          }
        });
      }).catch((err) => {
        if(err.response.data.message === 'Recruiter not found'){// Validating the error message in front end
          this.setState({ validateStatus: 'error', errormsg: "No account found with the username" })
        }else{
          this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
        }
      })

      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  eventLogger = (email) => {
    let emailId = email
    let data = {
      emailId: emailId,
      eventCategory: 'USEREVENT',
      eventType: 'forgotPassword',
      userCategory: 'partner',
      actionPerformedBy: emailId,
      eventTimeStamp: new Date(),
      userAgent: isBrowser ? "browser" : "mobile"
    }
    this.reset.eventLoggerPartnerForgotPassword(data).then((d) => {
      if (d.data.status === true) {
        console.log("Event logged successfully")
      }
    }).catch((err) => {
      console.log("Event logging error")
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <section className="form-v1-container">
        <h2>Forgot Password?</h2>
        {/* <p className="additional-info col-lg-10 mx-lg-auto mb-3">Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p> */}
        <Form onSubmit={this.handleSubmit} className="form-v1">
          <FormItem className="mb-3"
            validateStatus={this.state.validateStatus}
            help={this.state.errormsg}>
            {getFieldDecorator('emailId', {
              rules: [
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your email!' }
              ],
            })(
              <Input size="large" prefix={<Icon type="mail" style={{ fontSize: 13 }} />} placeholder="Email" />
            )}
          </FormItem>
          <FormItem>
            <Button id="Partner_forgotpwd_SendResetInstructions" type="primary" htmlType="submit" className="btn-cta btn-block">
              Send Reset Instructions
            </Button>
          </FormItem>
        </Form>
        <p className="additional-info">Recalled password? <a id="Partner_forgotpwd_Login" href={DEMO.login}>Log In</a></p>
      </section>
    );
  }
}

const WrappedNormalForm = Form.create()(withRouter(NormalForm));


export default WrappedNormalForm;
