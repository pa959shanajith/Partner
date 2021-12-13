import React from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { withRouter } from "react-router-dom";
import loginService from "../../../../../services/loginService.js";
const FormItem = Form.Item;
class UpdateNewPasswordForm extends React.Component {
  constructor(props) {
    super();
    this.state = { secret: "" };
    this.loginService = new loginService();
  }
  componentDidMount() {
    this.setState({secret: this.props.match.params.ResetCode})
    console.log(this.state.secret);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.loginService.verifyPartnerEmail(this.state.secret, values).then((d) => {
        console.log(d.data.message);
        Modal.success({
          //   title: 'This is a warning message',
          content: (
            <div>
              <p>Your password is updated, please login using the email and password you just changed!</p>
            </div>
          ),
          onOk: () => {
            this.props.history.push('/user/login');
          }
        });

      }).catch((err) => {
        this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
        console.log(err, ' its err');
        Modal.error({
          content: (
            <div>
              <p>Failed to update password ! Please write to wehearyou@shenzyn.com</p>
            </div>
          ),
          onOk: () => {
            this.props.history.push('/user/login');
          }
        });
      })

      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <section className="form-v1-container">
        <h2>Update New Password</h2>
        {/* <p className="additional-info col-lg-10 mx-lg-auto mb-3">Enter the email address you used when you joined and we’ll send you instructions to reset your password.</p> */}
        <Form onSubmit={this.handleSubmit} className="form-v1">
          <FormItem
            {...formItemLayout}
            label="Password"
            hasFeedback
          >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Confirm Password"
            hasFeedback
          >
            {getFieldDecorator('password-confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!',
              }, {
                validator: this.checkPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="btn-cta btn-block">
              Update Password
            </Button>
          </FormItem>
        </Form>
      </section>
    );
  }
}

const WrappedUpdateNewPasswordForm = Form.create()(withRouter(UpdateNewPasswordForm));


export default WrappedUpdateNewPasswordForm;
