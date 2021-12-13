import { Button, Form, Input, Modal, Select } from 'antd';
import React from 'react';
import partnerService from '../../../services/partnerService';

// const Dragger = Upload.Dragger;

const StyleSheet_DefaultButton = {
    color: '#fff',
    fontSize: '15px',
    background: '#ef5869',
    border: '1px solid #E3E3E3',
    borderRadius: '8px',
    width: '120px',
    height: '40px',
    margin: '4px 8px'
}
const FormItem = Form.Item;
const { Option } = Select;

// const resumeProps = {
//     name: 'file',
//     multiple: false,
//     accept: '.doc,.docx,.pdf',
//     showUploadList: {
//         showDownloadIcon: true,
//         downloadIcon: 'download ',
//         showRemoveIcon: true,
//     },
//     onChange(info) {
//         const { status } = info.file;
//         console.log(status)
//         if (status !== 'uploading') {
//         }
//         if (status === 'done') {
//             // message.success(`${info.file.name} file uploaded successfully.`);
//         } else if (status === 'error') {
//             message.error(`${info.file.name} file upload failed.`);
//         }
//     }
// };
const layout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 19,
        span: 16,
    },
};

const customEmailValidator = (rule, value, callback) => {
    var re = /\S+@\S+\.\S+/;
    var validEmail = re.test(value);
    if (!validEmail) {
        callback(rule.message);
    } // Always return a callback, otherwise validateFields cannot respond
    callback();
}

class EditProfileModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            current: 0,
            companyData: {

            },
            validateStatus: '',
            Companyerrormsg: '',
            candidatedata: {
                name: '',
                email: '',
                phone: '',
                submittedby: '',
                currentCompany: '',
                yearsofExp: '',
                currentCTC: '',
                expectedCTC: '',
                noticePeriod: '',
                currentLocation: '',
                preferredLocation: '',
                accepttnc: ''
            },
            listOfLocations: [],
            dupLocations: [],
            profileSubmittedBy: '',
            imageloading: false,
            fieldsDisable: true,
            resumeURL: ''
        };
        // closeModal = this.handleCancel();
        this.partnerSvc = new partnerService();
        this.reload = this.reload.bind(this);
    }

    componentDidMount() {
        this.partnerSvc.getBasicDetails().then((d) => {
            this.setState({ companyData: d.data.data });
            // this.state.loading = false;
        }).catch((err) => {
            console.log(err);
            this.setState({ loading: false })
        });
    }
    reload = () => {
        this.componentDidMount();
    }

    handleOk = () => {
        this.props.form.validateFields((err, fieldValues) => {
            if (err) {
                return
            }
            else {
                var data = {
                    companyName: fieldValues.companyName,
                    companyEmailId: fieldValues.companyEmail,
                    companyAddress: fieldValues.companyAddress,
                    perferredContactName: fieldValues.perferredContactName,
                    companyPhoneNo: fieldValues.companyPhoneNo,
                    comapnyGST: fieldValues.gst,
                    partnerType: fieldValues.partnerType
                }
                this.partnerSvc.updateProfileDetails(data).then((response) => {
                    Modal.success({
                        //   title: 'This is a warning message',
                        content: (
                            <div>
                                <p>{response.data.message}</p>
                            </div>
                        ),
                        onOk: () => {
                            this.props.closeModal()
                            this.reload()
                        }
                    });
                })
                    .catch((err) => {
                        if (err.response.data.message === 'Company Name Already Registered') {
                            this.setState({ validateCompanyStatus: 'error', Companyerrormsg: err.response.data.message });
                        } else {
                            this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
                        }
                        console.log(err, ' its err');
                    })
            }
        });
    };

    handleCancel = () => {
        // this.props.onClose();
        this.props.closeModal()
    };

    checkGST = (rule, value, callback) => {
        var check = this.checksum(value)
        if (typeof check === "boolean") {
            // console.log(check, ' its inside if');
            if (check === true) {
                callback();
            }
            else if (check === false) {
                callback('Please Enter Valid GST Number');
            }
        }
        else if (typeof check === "number") {
            callback('Please Enter Valid GST Number');
        }
    }

    render() {
        // const { loading } = this.state;
        const visible = this.props.visible;
        const { getFieldDecorator } = this.props.form;
        // var selectedJob = this.props.selectedJob;

        return (
            <div>
                <Modal
                    destroyOnClose={true}
                    visible={visible}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='40%'
                    className="add-recruiter-modal"
                >
                    <section className="form-v1-container pt-4">
                        {/* <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>{'Profile Upload for '+ selectedJob.jobTitle} </h3> */}
                        <hr style={{ border: '2px solid #D45895' }} />
                        <Form {...layout} name="basic" >
                            <FormItem
                                label="Company Name"
                                name="companyName"
                                hasFeedback
                                validateStatus={this.state.validateCompanyStatus}
                                help={this.state.Companyerrormsg}
                            >
                                {getFieldDecorator('companyName', {
                                    initialValue: this.state.companyData.companyName,
                                    rules: [
                                        { required: true, message: 'Please enter the company name' }
                                    ],
                                })(
                                    <Input disabled={true} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Company Address"
                                name="companyAddress"
                            >
                                {getFieldDecorator(`companyAddress`, {
                                    initialValue: this.state.companyData.address,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide address',
                                        }
                                    ],

                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                label="Phone No"
                                name="companyPhoneNo"
                            >
                                {getFieldDecorator(`companyPhoneNo`, {
                                    initialValue: this.state.companyData.contactNo,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide contact number!',
                                        },
                                        {
                                            message: 'Only numbers can be entered! ',
                                            pattern: /^[0-9]+$/
                                        },
                                        {
                                            min: 10,
                                            message: 'Mobile number cannot be less than 10 characters',
                                        },
                                        {
                                            max: 10,
                                            message: 'Mobile number cannot be greater than 10 characters',
                                        }
                                    ],

                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                label="Contact Person Name"
                                name="perferredContactName"
                            >
                                {getFieldDecorator('perferredContactName', {
                                    initialValue: this.state.companyData.perferredContactName,
                                    rules: [
                                        {
                                            required: true, message: 'Please input the name of the person to contact!',
                                        },
                                        {
                                            message: 'Please enter a valid name',
                                            pattern: /^[a-zA-Z ]*$/
                                        }
                                    ],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                label="Email Id"
                                name="companyEmail"
                            >
                                {getFieldDecorator(`companyEmail`, {
                                    initialValue: this.state.companyData.emailId,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide mail id!',
                                        },
                                        {
                                            type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                        }
                                    ],
                                })(
                                    <Input disabled={true} />
                                )}
                            </FormItem>
                            <FormItem
                                label="GST"
                                name="gst"
                            >
                                {getFieldDecorator(`gst`, {
                                    initialValue: this.state.companyData.gstin,
                                    rules: [

                                        { required: false },
                                        // {pattern: ('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]1}[1-9A-Z]{1}Z[0-9A-Z]{1}$') , message: 'Please input valid GSTIN!'},
                                        {
                                            min: 15,
                                            message: "GSTIN cannot be less than 15 characters"
                                        },
                                        {
                                            max: 15,
                                            message: "GSTIN cannot be more than 15 characters"
                                        }
                                    ]
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem
                                label="Partner Type"
                                name="partnerType"
                            >
                                {getFieldDecorator(`partnerType`, {
                                    initialValue: this.state.companyData.partnerType,
                                    rules: [
                                        {
                                            required: true, message: 'Please select partner type',
                                        }
                                    ],
                                })(
                                    // <Input />
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Select partner type"
                                        optionFilterProp="children"
                                        disabled={true}
                                    // onChange={onChange}
                                    // onFocus={onFocus}
                                    // onBlur={onBlur}
                                    // onSearch={onSearch}
                                    // filterOption={(input, option) =>
                                    // option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    // }
                                    >
                                        <Option value="HIRING">Hiring</Option>
                                        <Option value="TRAINING">Training</Option>
                                        <Option value="PLACEMENTOFFICE">Placement office</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <Form.Item {...tailLayout}>
                                <Button id={"Partner_EditProfile_Submit_"+this.state.companyData._id} style={StyleSheet_DefaultButton} htmlType="submit" onClick={() => this.handleOk()}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </section>
                </Modal>
            </div>
        );
    }
}

const WrappedEditProfileModal = Form.create()(EditProfileModal);

export default WrappedEditProfileModal;
