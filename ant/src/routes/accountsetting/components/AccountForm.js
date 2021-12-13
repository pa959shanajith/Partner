import React from 'react';
import { Form, Input, Button } from 'antd'
import BankDetails from './BankDetails'
import partnerService from "../../../services/partnerService";




class AccountForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }

        this.partnerService = new partnerService();
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return
            }
            else {
                // console.log("IN ELSE")
                // console.log(values.accountNumber)
                let data = {
                    accountNumber: values.accountNumber,
                    ifscCode: values.ifscCode,
                    bankName: values.bankName,
                    accountHoldersName: values.accountHoldersName,
                    email: localStorage.getItem('email')
                }
                this.partnerService.postBankDetails(data)
                    .then((res) => {
                        console.log(res)

                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                span: 12
            },
            wrapperCol: {
                span: 14
            },
        };
        return (
            <div className="flex-bank-page">
                <div>
                    <h3>Save Your Account Details</h3>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="Account Number">
                            {getFieldDecorator('accountNumber', {
                                rules: [
                                    {
                                        pattern: /^[0-9]+$/,
                                        message: "Should Contain only Numbers"
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your account Number'
                                    },
                                    {
                                        min: 10,
                                        message: 'Account Number should be atleast 10 digits'
                                    },
                                    {
                                        max: 20,
                                        message: 'Account Number cannont be more than 20 digits'
                                    }
                                ]
                            })(
                                <Input placeholder="Account Number" />
                            )}
                        </Form.Item>
                        <Form.Item label="Name">
                            {getFieldDecorator('accountHoldersName', {
                                rules: [
                                    // {
                                    //     type: 'string',
                                    //     message: "Name should only be a string"
                                    // },
                                    {
                                        pattern: /^[A-Z ]+$/i,
                                        message: 'Name should only contain alphabets'
                                    },
                                    {
                                        required: true,
                                        message: 'Please provide name of account holder'
                                    },
                                ]
                            })(
                                <Input placeholder="Name" />
                            )}
                        </Form.Item>
                        <Form.Item label="IFSC Code">
                            {getFieldDecorator('ifscCode', {
                                rules: [
                                    {
                                        pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                                        message: 'Please Enter Correct IFSC CODE'
                                    },
                                    {
                                        required: true,
                                        message: 'Please provide IFSC code of your bank'
                                    },
                                ]
                            })(
                                <Input placeholder="IFSC CODE" />
                            )}
                        </Form.Item>
                        <Form.Item label="Bank Name">
                            {getFieldDecorator('bankName', {
                                rules: [
                                    {
                                        pattern: /^[A-Z ]+$/i,
                                        message: 'Enter a valid bank name'
                                    },
                                    {
                                        required: true,
                                        message: 'Please provide the name of your bank'
                                    },
                                ]
                            })(
                                <Input placeholder="BANK NAME" />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button id="Partner_account_SubmitDetails" type="primary" htmlType="submit">
                                Submit Details
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <h5>Saved Bank Details</h5>
                    <BankDetails />
                </div>
            </div>
        )
    }
}

const wrappedAccountForm = Form.create()(AccountForm)
export default wrappedAccountForm