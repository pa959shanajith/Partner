import { Button, Col, Form, Icon, Input, InputNumber, message, Modal, Row, Upload } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from "../../../services/partnerService";
import errorHandler from '../../../ErrorHandler/ErrorHandler';

const Dragger = Upload.Dragger;
var profileData = {};

const StyleSheet_DefaultButton = {
    color: '#fff',
    fontSize: '15px',
    background: '#ef5869',
    border: '1px solid #E3E3E3',
    borderRadius: '8px',
    // width: '100px',
    height: '36px',
}
const FormItem = Form.Item;
// const { TextArea } = Input;
// const profilePicProps = {
//     name: 'image',
//     multiple: false,
//     accept: '.jpeg, .jpg, .png',
// };

const resumeProps = {
    name: 'file',
    multiple: false,
    accept: '.doc,.docx,.pdf',
    showUploadList: {
        showDownloadIcon: true,
        downloadIcon: 'download ',
        showRemoveIcon: true,
    },
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            //   console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
};


const layout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12,
    },
};
// const tailLayout = {
//     wrapperCol: {
//         offset: 19,
//         span: 16,
//     },
// };
// var closeModal;
var isEdit = false;
const customEmailValidator = (rule, value, callback) => {
    var re = /\S+@\S+\.\S+/;
    var validEmail = re.test(value);
    // console.log(validEmail);
    // console.log(value);
    if (!validEmail) {
        callback(rule.message);
    } // Always return a callback, otherwise validateFields cannot respond
    callback();
}
class AddCandidateModal extends React.Component {
    constructor(props) {
        super()
        var email = localStorage.getItem('email');
        var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        var isPartner = JSON.parse(localStorage.getItem('isPartner'));
        this.state = {
            loading: false,
            visible: false,
            emailId: email,
            authtoken: auth,
            companyName: companyName,
            partnerAdmin: isPartner,
            current: 0,
            eventDetails: {},
            imageUrl: '',
            imageloading: false,
            fieldsDisable: true,
            resumeURL: '',
            profileExists: false,
            dniCategories: ['Female', 'Specially abled', 'LGBTQ', 'Other'],
            otherDnIFieldVisible: false,
            formKey: 0
        };
        // closeModal = this.handleCancel();
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
    }

    componentDidMount() {
        if (this.props.formValidator)
            this.props.formValidator(this.props.form);
    }
    handleOk = () => {
        // this.setState({ loading: true });
        this.props.form.validateFields((err, fieldValues) => {
            // console.log(err, ' its err');
            if (err) {
                return
            }
            else {
                // console.log(fieldValues, ' field values');

                if (isEdit) {
                    let data = {
                        applicantEmailId: fieldValues.email,
                        applicantName: fieldValues.name,
                        address: fieldValues.address,
                        applicantPhone: fieldValues.contactno,
                        applicantExpectedCTC: fieldValues.expectedCTC,
                        applicantExperience: fieldValues.exp,
                        applicantCurrentCompany: fieldValues.currentcompany,
                        unavailable: fieldValues.unavailable,
                        applicantNoticePeriod: fieldValues.noticePeriod,
                        comments: fieldValues.comments,
                        ObjectId: localStorage.getItem('ObjectID'),
                        ClickedApplicantId: localStorage.getItem('ClickedApplicantId'),
                        profileSubmittedBy: localStorage.getItem('email'),
                        companyName: localStorage.getItem('companyName'),
                        dnicategory: fieldValues.dniCategory === 'Other' ? this.state.eventDetails.dniCategory : fieldValues.dniCategory
                    };
                    //Call update API
                    this.partnerService.editProfile(data).then((r) => {
                        if (r.data.status === true) {
                            message.success(r.data.message, 5);
                        }
                        this.props.onClose();
                        this.props.form.resetFields()
                    }).catch((err) => {
                        this.props.onClose();
                        this.props.form.resetFields()
                        this.errorHandler.customErrorCheck(err);
                        console.log(err);
                    })
                }
                else {
                    console.log(' in ELSE');
                    // var partnerCheck = JSON.parse(localStorage.getItem('isPartner'));
                    let data = {
                        name: fieldValues.name,
                        email: fieldValues.email,
                        phone: fieldValues.contactno,
                        experience: fieldValues.exp,
                        currentcompany: fieldValues.currentcompany,
                        ctc: fieldValues.expectedCTC,
                        notice: fieldValues.noticePeriod,
                        comments:fieldValues.comments,
                        profileSubmittedBy: localStorage.getItem('email'),
                        eventId: localStorage.getItem('eventId'),
                        companyName: localStorage.getItem('companyName'),
                        ObjectId: localStorage.getItem('ObjectID'),
                        resumeUrl: this.state.resumeURL,
                        isPartner: this.state.partnerAdmin,
                        partnerEmailId: localStorage.getItem('email'),
                        partnerEmail: this.state.partnerAdmin ? '' : localStorage.getItem('partnerEmail'),
                        dnicategory: fieldValues.dnicategory === 'Other' ? this.state.eventDetails.dniCategory : fieldValues.dnicategory
                    }
                    // console.log(data,' its post data');
                    this.partnerService.addProfile(data).then((d) => {
                        //show succes and proceed to close
                        if (d.data.status === true) {
                            message.success(d.data.message, 5);
                            this.props.eventProfileMatch(data.email, data.name, data.eventId);
                            this.props.onClose();
                            this.props.form.resetFields()
                            this.setState({ profileExists: false, fieldsDisable: true, formKey: (this.state.formKey || 0) + 1 })
                        }

                    }).catch((err) => {
                        // message.error(err.data.message,5);
                        console.log(err);
                        this.props.onClose();
                        this.props.form.resetFields()
                        this.errorHandler.customErrorCheck(err);
                        this.setState({ profileExists: false, fieldsDisable: true, formKey: (this.state.formKey || 0) + 1 })
                    })
                }
            }
        });
    };




    handleCancel = () => {
        this.props.onClose();
        this.setState({ resumeURL: '', profileExists: false, fieldsDisable: true, formKey: (this.state.formKey || 0) + 1 })
        this.props.form.resetFields()
    };

    customResumeUpload = (componentsData) => {
        // console.log(componentsData);
        const formData = new FormData();
        formData.append('file', componentsData.file)
        // console.log(formData);
        this.partnerService.CandidateResumeParser(formData)
            .then((d) => {
                console.log(d)
                // console.log(d, 'its d');
                if (d.data.status === true) {
                    this.setState({ resumeURL: d.data.location, fieldsDisable: false, resumeData: d.data.data, profileExists: d.data.profileExists });
                    console.log(d.data.data)
                    profileData.email = d.data.data.email && d.data.data.email.length > 0 ? d.data.data.email : ''
                    profileData.phone = d.data.data.phone && d.data.data.phone.length > 0 ? d.data.data.phone : ''
                    // message.success(`Resume uploaded successfully. ${d.data.message}..`, 5);
                    componentsData.onSuccess();
                }
            }).catch((err) => {
                this.errorHandler.customErrorCheck(err);
                message.error(`Resume upload failed.`, 5);
                componentsData.onError("Error uploading Resume")
                console.log(err);
            })
    }




    handleOnChange = (e, fieldName) => {
        var eventDetails = { ...this.state.eventDetails };
        // console.log(e);
        // console.log(this.props.form,' its forms ');
        if (fieldName === "name") {
            eventDetails.name = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });

        }
        else if (fieldName === "email") {
            // console.log(' its inside ',fieldName);
            eventDetails.email = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "contactno") {
            // console.log(' its inside ',fieldName);
            eventDetails.phone = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "exp") {
            // console.log(' its inside ',fieldName);
            eventDetails.experience = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "currentcompany") {
            // console.log(' its inside ',fieldName);
            eventDetails.currentcompany = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "expectedCTC") {
            // console.log(' its inside ',fieldName);
            eventDetails.expectedCTC = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "noticePeriod") {
            // console.log(' its inside ',fieldName);
            eventDetails.noticeperiod = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "comments") {
            eventDetails.comments = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "unavailable") {
            eventDetails.unavailable = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        eventDetails.profileSubmittedBy = localStorage.getItem('email');
        eventDetails.ObjectId = localStorage.getItem('ObjectID');
        eventDetails.isPartner = localStorage.getItem('isPartner');
        eventDetails.resumeURL = this.state.resumeURL;
        this.setState({ eventDetails });

        this.props.form.validateFields([fieldName], { force: true }, (err, fieldValues) => {
            if (err) {
                return
            }
            else {
            }
        });
    }
    // Setting Edit Profile value
    setValue = (data) => {
        console.log(data, ' its data of func');
        var profileEdit = {}
        // var eventDetails = { ...this.state.eventDetails };
        if (data) {
            profileEdit.name = data.name;
            profileEdit.email = data.email;
            profileEdit.contactno = data.phone;
            profileEdit.exp = data.experience;
            profileEdit.expectedCTC = data.ctc;
            profileEdit.noticePeriod = data.notice;
            profileEdit.ObjectId = localStorage.getItem('ObjectID');
            profileEdit.isPartner = localStorage.getItem('isPartner');
            profileEdit.profileSubmittedBy = localStorage.getItem('email');
            profileEdit.resumeURL = data.resumeUrl;
            this.setState({ eventDetails: profileEdit });
        }
    }

    dniSelected = (e) => {
        if (e) {
            if (e === 'Other') {
                this.setState({ otherDnIFieldVisible: true });
                return;
            }
            else {
                this.setState({ otherDnIFieldVisible: false });
            }
            var eventDetails = { ...this.state.eventDetails };
            eventDetails.dniCategory = [e];
            this.setState({ eventDetails });
        }

    }
    getDnIOther = (e) => {
        if (e) {
            let val = e.target.value;
            var eventDetails = { ...this.state.eventDetails };
            eventDetails.dniCategory = val;
            this.setState({ eventDetails });
        }
    }

    render() {
        // const { loading } = this.state;
        const visible = this.props.visible;
        const { getFieldDecorator } = this.props.form;
        profileData = this.props.editRecruiter;

        // console.log(profileData,' its profileData');
        // console.log(this.props.form,' its forms');
        // const imageUrl = this.state.imageUrl ? this.state.imageUrl : recruiterData.logo;
        isEdit = this.props.isEdit;
        // const uploadButton = (
        //     <div>
        //         <Icon type={this.state.imageloading ? 'loading' : 'plus'} />
        //         <div className="ant-upload-text">Upload</div>
        //     </div>
        // );
        return (
            <div>
                <Modal
                    visible={visible}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='50%'
                    className="add-recruiter-modal"
                >
                    <section className="form-v1-container pt-4">
                        <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>{isEdit ? 'Edit Candidates' : 'Candidate Details'} </h3>
                        <hr style={{ border: '2px solid #D45895' }} />

                        <Form key={this.state.formKey}
                            {...layout}
                            name="basic"
                        >
                            <FormItem
                                label="Resume"
                                name="ProfileImage"
                            >
                                {getFieldDecorator('resume', {
                                    rules: [{ required: profileData.resumeUrl !== '' ? false : true, message: 'Please upload resume!' }],
                                })(
                                    <Dragger {...resumeProps}
                                        customRequest={this.customResumeUpload}

                                    >
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="file" />
                                            {/* { this.state.resumeName!=""?resume: ""} */}

                                        </p>
                                        <p className="ant-upload-hint">Supported File Formats: .pdf, .doc, .docx</p>
                                    </Dragger>
                                )}
                            </FormItem>
                            <p style={{ color: 'red' }}>{this.state.profileExists ? 'The Following Profile with this email id already exists and this data will be used further on' : ''}</p>
                            <FormItem
                                label="Name"
                                name="name"
                            >
                                {getFieldDecorator(`name`, {
                                    initialValue: profileData.name,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide name!',
                                        }
                                    ],

                                })(
                                    <Input disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'name')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Email Id"
                                name="mail"
                            >
                                {getFieldDecorator(`email`, {
                                    initialValue: profileData.email,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide mail id!',
                                        },
                                        {
                                            type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                        }
                                    ],

                                })(
                                    <Input disabled={isEdit === false ? this.state.fieldsDisable : isEdit} onChange={e => this.handleOnChange(e, 'email')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Contact Number"
                                name="contactno"
                            >
                                {getFieldDecorator(`contactno`, {
                                    initialValue: profileData.phone,
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
                                    <Input disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'contactno')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Experience (yrs)"
                                name="company"
                            >
                                {getFieldDecorator(`exp`, {
                                    initialValue: profileData.experience,
                                    rules: [
                                        {
                                            required: true, message: 'Please enter the experience',
                                        },
                                    ],

                                })(
                                    <InputNumber disabled={isEdit === false ? this.state.fieldsDisable : false} min={0} max={50} onChange={e => this.handleOnChange(e, 'exp')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Current/Last Company"
                            // name="company"
                            >
                                {getFieldDecorator(`currentcompany`, {
                                    initialValue: profileData.currentcompany,
                                    rules: [
                                        {
                                            required: false, message: 'Please enter the experience',
                                        },
                                    ],

                                })(
                                    <Input disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'currentcompany')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Expected CTC (LPA)"
                                name="expectedCTC"
                            >
                                {getFieldDecorator(`expectedCTC`, {
                                    initialValue: profileData.ctc,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide expected CTC',
                                        },
                                    ],

                                })(
                                    <InputNumber disabled={isEdit === false ? this.state.fieldsDisable : false} min={0} max={40} onChange={e => this.handleOnChange(e, 'expectedCTC')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Notice Period (days)"
                                name="NoticePeriod"
                            >
                                {getFieldDecorator(`noticePeriod`, {
                                    initialValue: profileData.notice,
                                    rules: [
                                        {
                                            required: true, message: 'Please input NoticePeriod!',
                                        },
                                    ],

                                })(
                                    <InputNumber type="number" disabled={isEdit === false ? this.state.fieldsDisable : false} min={0} max={180} onChange={e => this.handleOnChange(e, 'noticePeriod')} />
                                    // <Input disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'noticePeriod')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Candidate comments"
                            >
                                {getFieldDecorator(`comments`, {
                                    initialValue: profileData.comments,
                                    rules: [
                                        {
                                            required: false,
                                        },
                                    ],

                                })(
                                    <Input type="text" placeholder="Please provide comments about the candidate" disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'comments')} />
                                )}
                            </FormItem>

                            <Row>
                                <Col span={18}>
                                    <h2 style={{
                                        textAlign: 'left',
                                        fontSize: '18px',
                                        color: '#707070',
                                        fontWeight: '500',
                                        marginTop: '12px'
                                    }}>

                                        Note DNI category for this job is  - {this.state.eventDetails.length > 0 ? this.state.eventDetails.map((data) => `${data} ,`) : 'Female'}
                                    </h2>
                                </Col>
                                <Col span={6}>
                                    <FormItem className="float-right">
                                        <Button id="Partner_Events_CandidateDetails_Submit" disabled={isEdit === false ? this.state.fieldsDisable : false} style={StyleSheet_DefaultButton} htmlType="submit" onClick={() => this.handleOk()}>
                                            Submit
                                        </Button>
                                    </FormItem>
                                </Col>
                            </Row>

                        </Form>
                    </section>
                </Modal>
            </div>
        );
    }
}

const WrappedAddCandidateModal = Form.create()(withRouter(AddCandidateModal));

export default WrappedAddCandidateModal;
