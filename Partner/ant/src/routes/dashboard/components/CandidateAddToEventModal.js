import { Button, Col, Form, Icon, Input, InputNumber, message, Modal, Row, Upload } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from "../../../services/partnerService";
import errorHandler from '../../../ErrorHandler/ErrorHandler';


const Dragger = Upload.Dragger;
var isEdit = false;
class CandidateAddToEventModal extends React.Component {
    constructor(props) {
        super()
        const email = localStorage.getItem('email');
        const companyName = localStorage.getItem('companyName');
        const isPartner = JSON.parse(localStorage.getItem('isPartner'));
        var ObjectId = localStorage.getItem('ObjectID');
        var jobId = localStorage.getItem('jobId');
        this.state = {
            loading: false,
            visible: false,
            emailId: email,
            companyName: companyName,
            isPartnerAdmin: isPartner,
            ObjectId: ObjectId,
            jobId: jobId,
            candidateEmail: '',
            candidatePhone: '',
            current: 0,
            imageUrl: '',
            profileExists: false,
            imageloading: false,
            fieldsDisable: true,
            applicantEmailId: '',
            resumeURL: '',
            fileList: [],
            dniCategories: ['Female', 'Specially abled', 'LGBTQ', 'Other'],
            otherDnIFieldVisible: false
        };
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
    }

    componentDidMount() {
        if (this.props.formValidator) {
            this.props.formValidator(this.props.form);
        }
        // this.setState({resumeURL: ''})
    }
    handleOk = () => {
        this.props.form.validateFields((err, fieldValues) => {
            if (err) {
                return
            }
            else {
                if (isEdit) {
                    let data = {
                        applicantEmailId: fieldValues.email,
                        applicantName: fieldValues.name,
                        applicantPhone: fieldValues.contactno,
                        applicantExpectedCTC: fieldValues.expectedCTC,
                        applicantExperience: fieldValues.exp,
                        applicantNoticePeriod: fieldValues.noticePeriod,
                        applicantLastCompany: fieldValues.lastcompany,
                        comments: fieldValues.comments,
                        profileSubmittedBy: this.state.emailId,
                        jobId: this.props.jobData.jobId,
                        ObjectId: this.props.profileData._id,
                        companyName: this.state.companyName,
                        dniCategory: fieldValues.dniCategory === 'Other' ? profileData.dniCategory : fieldValues.dniCategory
                    };
                    this.partnerService.updateJobCandidateProfile(data).then((r) => {
                        if (r.data.status === true) {
                            message.success(r.data.message, 5);

                        }
                        this.props.eventProfileMatch(data.applicantEmailId, data.applicantName, data.jobId);
                        this.props.submitProfile();
                        this.props.form.resetFields();
                        this.setState({ profileExists: false, fieldsDisable: true })
                    }).catch((err) => {
                        this.props.onClose();
                        this.props.form.resetFields()
                        this.setState({ profileExists: false, fieldsDisable: true })
                        this.errorHandler.customErrorCheck(err);
                        console.log(err);
                    })
                }
                else {
                    console.log("PartnerDetails", localStorage.getItem('email'))
                    console.log("PartnerDetails", localStorage.getItem('companyName'))
                    console.log("PartnerDetails", localStorage.getItem('contactNo'))
                    console.log("PartnerDetails", localStorage.getItem('partnerType'))

                    let data = {
                        name: fieldValues.name,
                        email: fieldValues.email,
                        phone: fieldValues.contactno,
                        experience: fieldValues.exp,
                        ctc: fieldValues.expectedCTC,
                        notice: fieldValues.noticePeriod,
                        profileSubmittedBy: this.state.emailId,
                        jobId: this.state.jobId,
                        ObjectId: this.state.ObjectId,
                        companyName: this.state.companyName,
                        applicantLastCompany: fieldValues.lastcompany,
                        comments: fieldValues.comments,
                        resumeUrl: this.state.resumeURL,
                        isPartner: this.state.isPartnerAdmin,
                        dniCategory: fieldValues.dniCategory === 'Other' ? profileData.dniCategory : fieldValues.dniCategory,
                        partnerEmail: localStorage.getItem('email'),
                        partnerCompany: localStorage.getItem('companyName'),
                        partnerContactNo: localStorage.getItem('contactNo'),
                        partnerType: localStorage.getItem('partnerType')
                    }
                    this.partnerService.addJobCandidateProfileTo(data).then((d) => {
                        //show succes and proceed to close
                        if (d.data.status === true) {
                            message.success(d.data.message, 5);
                            this.props.eventProfileMatch(data.email, data.name, data.jobId);
                            this.props.onClose();
                            this.props.form.resetFields()
                            this.setState({ profileExists: false, fieldsDisable: true })
                        }
                        this.props.submitProfile();
                    }).catch((err) => {
                        // message.error(err.data.message,5);
                        this.props.onClose();
                        this.props.form.resetFields()
                        this.errorHandler.customErrorCheck(err);
                        this.setState({ profileExists: false, fieldsDisable: true })
                    })
                }
            }
            this.props.form.resetFields();
            this.setState({ profileExists: false, fieldsDisable: true })
            profileData = {};
        });
    };

    handleCancel = () => {
        this.props.onClose();
        // console.log(resumeProps)
        // resumeProps.onRemove()        
        this.props.form.resetFields();
        profileData = {};
        this.setState({ candidateEmail: '', resumeURL: '', fileList: [], profileExists: false, fieldsDisable: true });
    }

    customResumeUpload = (componentsData) => {
        const formData = new FormData();
        formData.append('file', componentsData.file, componentsData.file.name);
        this.partnerService.uploadResume(formData).then((d) => {
            if (d.data.status === true) {
                console.log("DATA", d)
                profileData.email = d.data.data.email && d.data.data.email.length > 0 ? d.data.data.email : ''
                profileData.phone = d.data.data.phone && d.data.data.phone.length > 0 ? d.data.data.phone : ''
                this.setState((prevState) => ({
                    resumeURL: d.data.location,
                    // fileList:[...prevState.fileList, d.data.location],
                    // candidateEmail: d.data.data.email && d.data.data.email.length > 0 ? d.data.data.email : '',
                    // candidatePhone: d.data.data.phone && d.data.data.phone.length > 0 ? d.data.data.phone : '',
                    fieldsDisable: false,
                    profileExists: d.data.profileExists

                }))
                componentsData.onSuccess();
            }
        }).catch((err) => {
            message.error(`Resume upload failed.`, 5);
            componentsData.onError("Error uploading Resume")
            console.log(err);
        })
    }

    handleOnChange = (e, fieldName) => {
        if (fieldName === "name") {
            profileData.name = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "email") {
            profileData.email = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "contactno") {
            profileData.phone = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "exp") {
            profileData.experience = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "expectedCTC") {
            profileData.ctc = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "noticePeriod") {
            profileData.notice = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "unavailable") {
            profileData.name = e.target.checked
            this.props.form.setFieldsValue({
                [fieldName]: e.target.checked
            });
        }
        else if (fieldName === "lastcompany") {
            profileData.lastcompany = e.target.value
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "comments") {
            profileData.comments = e.target.value
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        this.props.form.validateFields([fieldName], { force: true }, (err, fieldValues) => {
            if (err) {
                return
            }
            else {
            }
        });
    }

    onUploadChange = info => {
        const { status } = info.file;
        console.log("FILELIST--->", info.fileList)
        let fileList = [...info.fileList]
        if (status === 'uploading') {
            fileList = fileList.slice(-1);
            this.setState({ fileList: fileList });
        }
        else if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            this.setState({ fileList: [...fileList] })
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
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
            profileData.dniCategory = [e];
        }

    }
    getDnIOther = (e) => {
        if (e) {
            let val = e.target.value;
            profileData.dniCategory = val;
        }
    }

    render() {
        const visible = this.props.visible;
        const { getFieldDecorator } = this.props.form;
        profileData = this.props.profileData;
        isEdit = this.props.isEdit;

        const resumeProps = {
            name: 'file',
            multiple: false,
            accept: '.doc,.docx,.pdf',
            fileList: this.state.fileList,
            showUploadList: {
                showDownloadIcon: true,
                downloadIcon: 'download ',
                showRemoveIcon: false,
            },
            onChange: this.onUploadChange
        }
        return (
            <div>
                <Modal
                    destroyOnClose={true}
                    visible={visible}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='50%'
                    className="add-recruiter-modal">
                    <section className="form-v1-container pt-4">
                        <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>{isEdit ? 'Edit Candidates' : 'Candidate Details'} </h3>
                        <hr style={{ border: '2px solid #D45895' }} />
                        <Form {...layout} name="basic">
                            <FormItem label="Resume" name="ProfileImage">
                                {getFieldDecorator('resume', {
                                    rules: [{ required: profileData.resumeUrl !== '' ? false : true, message: 'Please upload resume!' }],
                                })(
                                    <Dragger {...resumeProps} customRequest={this.customResumeUpload}>
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="file" />
                                        </p>
                                        <p className="ant-upload-hint">Supported File Formats: .pdf, .doc, .docx</p>
                                    </Dragger>
                                )}
                            </FormItem>
                            <p style={{ color: 'red' }}>{this.state.profileExists ? 'The Following Profile with this email id already exists and this data will be used further on' : ''}</p>
                            <FormItem label="Name" name="name">
                                {getFieldDecorator(`name`, {
                                    initialValue: profileData.name,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide name!',whitespace:true,
                                        }
                                    ],
                                })(
                                    <Input disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'name')} />
                                )}
                            </FormItem>
                            <FormItem label="Email Id" name="mail">
                                {getFieldDecorator(`email`, {
                                    initialValue: profileData.email !== undefined ? profileData.email : "",
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
                            <FormItem label="Contact Number" name="contactno">
                                {getFieldDecorator(`contactno`, {
                                    initialValue: profileData.phone !== undefined ? profileData.phone : "",
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
                            <FormItem label="Experience (Years)" name="company">
                                {getFieldDecorator(`exp`, {
                                    initialValue: profileData.experience,
                                    rules: [
                                        {
                                            required: true, message: 'Please enter the experience',
                                        },
                                    ],
                                })(
                                    <InputNumber disabled={isEdit === false ? this.state.fieldsDisable : false} min={0} max={50} step={0.1} onChange={e => this.handleOnChange(e, 'exp')} />
                                )}
                            </FormItem>
                            <FormItem label="Expected CTC (LPA)" name="expectedCTC">
                                {getFieldDecorator(`expectedCTC`, {
                                    initialValue: profileData.ctc,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide expected CTC',
                                        },
                                    ],
                                })(
                                    <InputNumber disabled={isEdit === false ? this.state.fieldsDisable : false} min={0} max={40} step={0.1} onChange={e => this.handleOnChange(e, 'expectedCTC')} />
                                )}
                            </FormItem>
                            <FormItem label="Notice Period (days)" name="NoticePeriod">
                                {getFieldDecorator(`noticePeriod`, {
                                    initialValue: profileData.notice,
                                    rules: [
                                        {
                                            required: true, message: 'Please input NoticePeriod!',
                                        },
                                    ],
                                })(
                                    <InputNumber disabled={isEdit === false ? this.state.fieldsDisable : false} min={0} max={180} onChange={e => this.handleOnChange(e, 'noticePeriod')} />
                                    // <Input disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'noticePeriod')} />
                                )}
                            </FormItem>
                            <FormItem label="Current/Last Company" name="company">
                                {getFieldDecorator(`lastcompany`, {
                                    initialValue: profileData.lastcompany,
                                    rules: [
                                        {
                                            required: false, message: 'Please enter the experience',
                                        },
                                    ],
                                })(
                                    <Input disabled={isEdit === false ? this.state.fieldsDisable : false} onChange={e => this.handleOnChange(e, 'lastcompany')} />
                                )}
                            </FormItem>
                            <FormItem label="Candidate comments" name="comments">
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
                                    <h2 style={{ textAlign: 'left', fontSize: '18px', color: '#707070', fontWeight: '500', marginTop: '12px' }}>Note DNI category for this job is  - {this.props.jobData.dniCategory && this.props.jobData.dniCategory.length > 0 ? this.props.jobData.dniCategory.map((data) => `${data} ,`) : 'Female'}</h2>
                                </Col>
                                <Col span={6}>
                                    <Form.Item className="float-right">
                                        <Button disabled={isEdit === false ? this.state.fieldsDisable : false} style={StyleSheet_DefaultButton} htmlType="submit" onClick={() => this.handleOk()}>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </section>
                </Modal>
            </div>
        );
    }
}

var profileData = {};
const StyleSheet_DefaultButton = {
    color: '#fff',
    fontSize: '15px',
    background: '#ef5869',
    border: '1px solid #E3E3E3',
    borderRadius: '8px',
    // width: '120px',
    height: '35px',
    // margin: '4px 8px'
}
const FormItem = Form.Item;
// const resumeProps = {
//     name: 'file',
//     multiple: false,
//     accept: '.doc,.docx,.pdf',
//     showUploadList: {
//         showDownloadIcon: true,
//         downloadIcon: 'download ',
//         showRemoveIcon: true,
//     },
//     fileList:[],
//     defaultFileList: [],
//     onChange(info) {
//         const { status } = info.file;
//         console.log("FILELIST--->", info.fileList)
//         if (status !== 'uploading') {
//             //   console.log(info.file, info.fileList);
//         }
//         if (status === 'done') {            
//             message.success(`${info.file.name} file uploaded successfully.`);           
//         } else if (status === 'error') {
//             message.error(`${info.file.name} file upload failed.`);
//         }
//     },
//     onRemove (info) {
//         // console.log(info.fileList)
//     },
//     toggleUploadList (status) { //true or false
//         this.showUploadList = status

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
// const tailLayout = {
//     wrapperCol: {
//         offset: 19,
//         span: 16,
//     },
// };
const customEmailValidator = (rule, value, callback) => {
    var re = /\S+@\S+\.\S+/;
    var validEmail = re.test(value);
    if (!validEmail) {
        callback(rule.message);
    } // Always return a callback, otherwise validateFields cannot respond
    callback();
}

const WrappedCandidateAddToEventModal = Form.create()(withRouter(CandidateAddToEventModal));

export default WrappedCandidateAddToEventModal;