import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
// import loginService from "../../../services/loginService";
import partnerService from '../../../services/partnerService'
import loginService from "../../../services/loginService"
import { isBrowser, isMobile } from 'react-device-detect';
const FormItem = Form.Item;


class ChangePasswordModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: false,
            validateStatus: '',
            errormsg: '',
            secret: '',
            partnerAdmin: ''
        }
        this.partnerService = new partnerService();
        this.login = new loginService();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err)
                return
            }
            // values.isPartner = this.state.partnerAdmin // sending whether partnerAdmin or recruiter
            this.partnerService.changePassword(values,this.state.partnerAdmin)
                .then((response) => {
                      this.eventLogger()
                    Modal.success({
                        //   title: 'This is a warning message',
                        content: (
                            <div>
                                <p>{response.data.message}</p>
                            </div>
                        ),
                        onOk: () => {
                            this.props.form.resetFields();
                            this.props.onClose()
                        }
                    });
                })
                .catch((error) => {
                    this.setState({ validateStatus: 'error', errormsg: error.response.data.message })
                    this.props.form.resetFields();
                })
        })
    }

    componentDidMount() {
        this.props.form.resetFields()
        this.setState({ partnerAdmin: localStorage.getItem('isPartner') })
    }
    eventLogger = () => {
        let emailId = localStorage.getItem('email')
        let role = localStorage.getItem('isPartner') === 'true' ? "admin" : "recruiter"
        let data = {
            emailId: emailId,
            eventCategory: 'USEREVENT',
            eventType: 'resetPassword',
            userCategory: 'partner',
            actionPerformedBy: emailId,
            role: role,
            eventTimeStamp: new Date(),
            userAgent: isBrowser ? "browser" : "mobile"
        }
        this.login.eventLoggerPartnerResetPassword(data).then((d) => {
            if (d.data.status === true) {
                console.log("Event logged successfully")
            }
        }).catch((err) => {
            console.log("Event logging error")
        })
    }
    handleCancel = (e) => {
        this.setState({ validateStatus: "",errormsg:""})
        console.log(e);
        this.props.form.resetFields();
        this.props.onClose()
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Both entered password should be same');
        } else {
            callback();
        }
    }

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        console.log(form.getFieldValue('oldpassword'))
        if (value && value === form.getFieldValue('oldpassword')) {
            callback('New Password cannot be same as old password')
        }
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }

        callback();
    }


    render() {
        var visible = this.props.visible
        const { getFieldDecorator } = this.props.form
        return (
            <div>
                <Modal
                    visible={visible}
                    //   okText="Reset Password"
                    //   cancelText="Cancel"
                    onCancel={this.handleCancel}
                    // onOk={this.handleSubmit}
                    destroyOnClose={true}
                    maskClosable={false}
                    footer={[
                        <>
                            <Button form="myForm" key="submit" htmlType="submit">
                                Reset Password
                            </Button>
                            <Button onClick={this.handleCancel}>Cancel</Button>
                        </>
                    ]}

                >
                    <Form id="myForm" onSubmit={this.handleSubmit} className="form-v1">
                        <FormItem
                            // {...formItemLayout}
                            label="Old Password"
                            // hasFeedback={true}
                            validateStatus={this.state.validateStatus}
                            help={this.state.errormsg}
                        >
                            {getFieldDecorator('oldpassword', {
                                rules: [{
                                    required: true, message: 'Please input your old password!',
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            // {...formItemLayout}
                            label="New Password"
                            hasFeedback
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: 'Please input your password!',
                                    // min: 8, message: 'Please enter a password between 8 and 15 Characters',
                                    // max: 15, message: 'Please enter a password between 8 and 15 Characters'
                                }, {
                                    validator: this.checkConfirm
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            // {...formItemLayout}
                            label="Confirm New Password"
                            hasFeedback
                        >
                            {getFieldDecorator('password-confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                    // min: 8, message: 'Please enter a password between 8 and 15 Characters',
                                    // max: 15, message: 'Please enter a password between 8 and 15 Characters'
                                }, {
                                    validator: this.checkPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }

}

export default Form.create()(ChangePasswordModal)