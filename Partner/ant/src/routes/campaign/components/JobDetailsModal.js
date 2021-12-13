import React from 'react';
import { Modal, Button, Form, Icon, Input,  Upload, message, Checkbox, InputNumber,AutoComplete } from 'antd';
import jobseekerService from "../../../services/jobseekerService";
import partnerService from '../../../services/partnerService';

const Dragger = Upload.Dragger;

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
        console.log(status)
        if (status !== 'uploading') {
        }
        if (status === 'done') {
            // message.success(`${info.file.name} file uploaded successfully.`);
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
const tailLayout = {
    wrapperCol: {
        offset: 19,
        span: 16,
    },
};
// var closeModal;

const customEmailValidator = (rule, value, callback) => {
    var re = /\S+@\S+\.\S+/;
    var validEmail = re.test(value);
    if (!validEmail) {
        callback(rule.message);
    } // Always return a callback, otherwise validateFields cannot respond
    callback();
}

class AddCandidateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            current: 0,
            candidatedata: {
                name:'',
                email:'',
                phone:'',
                submittedby:'',
                currentCompany:'',
                yearsofExp:'',
                currentCTC:'',
                expectedCTC:'',
                noticePeriod:'',
                currentLocation:'',
                preferredLocation:'',
                accepttnc:''
            },
            listOfLocations: [],
            dupLocations: [],
            profileSubmittedBy:'',
            imageloading: false,
            fieldsDisable: true,
            resumeURL: ''
        };
        // closeModal = this.handleCancel();
        this.jobseekerService = new jobseekerService();
        this.partnerSvc = new partnerService();
    }

    componentDidMount() {
        this.partnerSvc.locations().then((d) => {
            this.setState({ listOfLocations: d.data,dupLocations:d.data, loading: false});
            // this.state.loading = false;
        }).catch((err) => {
            console.log(err);
            this.setState({loading: false})
        });
    }
    onSearch = (value) => {
        this.setState({
            listOfLocations: !value ? [] : this.state.dupLocations.filter(el => el.includes(value))
        })
    };

    resetState = () => {
       let  cd = this.state.candidatedata;
       cd.name='';
       cd.email='';
       cd.phone='';
       cd.submittedby='';
       cd.accepttnc='';
       cd.yearsofExp='';
       cd.currentCTC='';
       cd.expectedCTC='';
       cd.noticePeriod='';
       cd.currentLocation='';
       cd.preferredLocation='';
       this.setState({resumeURL:'',candidatedata:cd})
    }
    handleOk = () => {
        this.props.form.validateFields((err, fieldValues) => {
            if (err) {
                return
            }
            else {
                var data = {
                    name: fieldValues.name,
                    emailId: fieldValues.email,
                    contactNo: fieldValues.contactno,
                    submittedBy: fieldValues.submittedby,
                    resumeUrl: this.state.resumeURL,
                    yearsofExp:fieldValues.yearsofExp,
                    currentCompany: fieldValues.currentCompany,
                    currentCTC: fieldValues.currentCTC*100000,
                    noticePeriod: fieldValues.noticePeriod,
                    currentLocation:fieldValues.currentLocation,
                    preferredLocation:fieldValues.preferredLocation,
                    expectedCTC: fieldValues.expectedCTC*100000,
                    source: this.props.selectedJob.key,
                }
                this.jobseekerService.campaignRegister(data).then((d) => {
                        //show succes and proceed to close
                        console.log(d);
                    if (d.data.status === true) {
                            // message.success(d.data.message, 5);
                            message.success("Profile submitted succesfully.", 7);
                            this.resetState();
                            this.props.form.resetFields()
                            this.props.onClose();
                    }
                    else{
                        // message.warn(d.data.message, 5);
                        message.warn("A profile with given email-id already submitted.Write to wehearyou@shenzyn.com for any clarifications.", 7);
                        this.resetState();
                        this.props.form.resetFields()
                        this.props.onClose();
                    }
                    }).catch((err) => {
                        message.error("Error submitting profile, write to wehearyou@shenzyn.com for support.",7);
                        console.log(err);
                        this.props.onClose();
                        this.props.form.resetFields()
                    })
            }
        });
    };

    handleCancel = () => {
        this.props.onClose();
    };

    customResumeUpload = (componentsData) => {
        // console.log(componentsData);
        const formData = new FormData();
        formData.append('file', componentsData.file)
        // console.log(formData);
        this.jobseekerService.uploadresume(formData).then((d) => {
            console.log(d, 'its d');
            if (d.data.status === true) {
                let candidatedata = this.state.candidatedata;
                if (d.data.data.phone && d.data.data.phone.length > 0) {
                    candidatedata.phone = d.data.data.phone[0].replace('+91','').replace('-','').replace(' ','').replace(')','').replace('(','');
                }
                if (d.data.data.email && d.data.data.email.length > 0) {
                    candidatedata.email = d.data.data.email[0];
                }
                this.setState({ resumeURL: d.data.location, candidatedata: candidatedata  });
                if(d.data.newuser === false){
                    message.warn(`Duplicate profile, a profile with email id ${d.data.email} exists. Please upload another profile.`, 7);
                }
                else{
                    message.success(`Resume uploaded successfully for email id ${d.data.email}.`, 7);
                }
                componentsData.onSuccess();
            }
        }).catch((err) => {
            // this.errorHandler.customErrorCheck(err);
            message.error(`Resume upload failed.`, 5);
            componentsData.onError("Error uploading Resume")
            console.log(err);
        })
    }
        onSearch = (value) => {
                this.setState({
                    listOfLocations: !value ? [] : this.state.dupLocations.filter(el => el.includes(value))
                })
            };

    handleOnChange = (e, fieldName) => {
        console.log(e);
        if(!e || !fieldName){
            return;
        }
        var candidatedata = { ...this.state.candidatedata };
        if (fieldName === "name") {
            candidatedata.name = e.target.value;
        }
        else if (fieldName === "email") {
            candidatedata.email = e.target.value;
        }
        else if (fieldName === "contactno") {
            candidatedata.phone = e.target.value;
        }
        else if (fieldName === "noticePeriod") {
            candidatedata.noticeperiod = e;
        }
        else if (fieldName === "currentLocation") {
            candidatedata.currentLocation = e;
        }
        else if (fieldName === "preferredLocation") {
            candidatedata.preferredLocation = e;
        }
        else if (fieldName === "currentCompany") {
            candidatedata.currentCompany = e.target.value;
        }
        else if (fieldName === "yearsofExp") {
            candidatedata.yearsofExp = e;
        }
        else if (fieldName === "currentCTC") {
            candidatedata.currentCTC = e;
        }
        else if (fieldName === "expectedCTC") {
            candidatedata.expectedCTC = e;
        }
        else if (fieldName === "submittedby") {
            candidatedata.submittedby = e.target.value;
        }
        else if (fieldName === "accepttnc") {
            candidatedata.accepttnc = e;
        }
        // candidatedata.resumeURL = this.state.resumeURL;
        this.setState({ candidatedata : candidatedata});
        
        let fieldVal = e.target?e.target.value:e;

        this.props.form.setFieldsValue({
            [fieldName]: fieldVal
        });
        this.props.form.validateFields([fieldName], { force: true }, (err, fieldValues) => {
            if (err) {
                return
            }
            else {
            }
        });
    }


    render() {
        // const { loading } = this.state;
        const visible = this.props.visible;
        const { getFieldDecorator } = this.props.form;
        var selectedJob = this.props.selectedJob;

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
                        <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>{'Profile Upload for '+ selectedJob.jobTitle} </h3>
                        <hr style={{ border: '2px solid #D45895' }} />
                        <Form {...layout} name="basic" >
                            <FormItem
                                label="Resume"
                                name="ProfileImage"
                            >
                                {getFieldDecorator('resume', {
                                    rules: [
                                        { required: this.state.resumeUrl !== '' ? false : true, message: 'Please upload resume!' }
                                    ],
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
                            <FormItem
                                label="Name"
                                name="name"
                            >
                                {getFieldDecorator(`name`, {
                                    initialValue: this.state.candidatedata.name,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide name!',
                                        }
                                    ],

                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'name')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Email Id"
                                name="mail"
                            >
                                {getFieldDecorator(`email`, {
                                    initialValue: this.state.candidatedata.email,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide mail id!',
                                        },
                                        {
                                            type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                        }
                                    ],

                                })(
                                    <Input  onChange={e => this.handleOnChange(e, 'email')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Contact No"
                                name="contactno"
                            >
                                {getFieldDecorator(`contactno`, {
                                    initialValue: this.state.candidatedata.phone,
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
                                    <Input onChange={e => this.handleOnChange(e, 'contactno')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Current Company"
                                name="currentCompany"
                            >
                                {getFieldDecorator(`currentCompany`, {
                                    initialValue: this.state.candidatedata.currentCompany,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide current company!',
                                        }
                                    ],

                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'currentCompany')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Experience - Years"
                                name="yearsofExp"
                            >
                                {getFieldDecorator(`yearsofExp`, {
                                    initialValue: this.state.candidatedata.yearsofExp,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide total years of experience!',
                                        }
                                    ],

                                })(
                                    <InputNumber min={0} max={40}  onChange={e => this.handleOnChange(e, 'yearsofExp')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="CTC - Lakhs"
                                name="CTC"
                            >
                            <FormItem
                                label="Current"
                                name="currentCTC"
                            >
                                {getFieldDecorator(`currentCTC`, {
                                    initialValue: this.state.candidatedata.currentCTC,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide Current CTC!',
                                        }
                                    ],

                                })(
                                    <InputNumber min={0} max={50} onChange={e => this.handleOnChange(e, 'currentCTC')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Expected"
                                name="expectedCTC"
                            >
                                {getFieldDecorator(`expectedCTC`, {
                                    initialValue: this.state.candidatedata.expectedCTC,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide Expected CTC!',
                                        }
                                    ],

                                })(
                                    <InputNumber min={2} max={50} onChange={e => this.handleOnChange(e, 'expectedCTC')} />
                                )}
                            </FormItem>
                            </FormItem>
                            <FormItem
                                label="Notice Period - Days"
                                name="noticePeriod"
                            >
                                {getFieldDecorator(`noticePeriod`, {
                                    initialValue: this.state.candidatedata.noticePeriod,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide Notice Period!',
                                        }
                                    ],

                                })(
                                    <InputNumber min={0} max={120} onChange={e => this.handleOnChange(e, 'noticePeriod')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Current Location"
                                name="currentLocation"
                            >
                            {getFieldDecorator(`currentLocation`, {
                            initialValue: this.state.candidatedata.currentLocation,
                            rules: [
                                {
                                    required: true, message: 'Please provide currentLocation!',
                                }],
                            })(
                            <AutoComplete
                                    dataSource={this.state.listOfLocations}
                                    defaultValue={this.state.candidatedata.currentLocation}
                                    onSelect={e => this.handleOnChange(e, 'currentLocation')}
                                    onSearch={e => this.onSearch(e)}
                                    placeholder="Enter current location"
                            />
                            )}
                            </FormItem>
                            <FormItem
                                label="Preferred Location"
                                name="preferredLocation"
                            >
                            {getFieldDecorator(`preferredLocation`, {
                            initialValue: this.state.candidatedata.preferredLocation,
                            rules: [
                                {
                                    required: true, message: 'Please provide preferredLocation!',
                                }],
                            })(
                            <AutoComplete
                                    dataSource={this.state.listOfLocations}
                                    defaultValue={this.state.candidatedata.preferredLocation}
                                    onSelect={e => this.handleOnChange(e, 'preferredLocation')}
                                    onSearch={e => this.onSearch(e)}
                                    placeholder="Enter preferred location"
                            />
                            )}
                            </FormItem>
                            <FormItem 
                            label="Submitted By"
                            name="submittedby">
                                {getFieldDecorator(`submittedby`, {
                                    initialValue: this.state.candidatedata.submittedby,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide details',
                                        },
                                    ],

                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'submittedby')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Accept Terms & Conditions"
                                name="accepttnc"
                            >
                                {getFieldDecorator(`accepttnc`, {
                                    initialValue: this.state.candidatedata.accepttnc,
                                    rules: [{
                                        required: true, message: 'Please accept the terms and condition!',
                                      }],

                                })(
                                    <Checkbox  onChange={e => this.handleOnChange(e, 'accepttnc')} >
                                         <a href="https://www.shenzyn.com/#/termsandconditions" target="_blank" rel="noopener noreferrer">Shenzyn T & C</a>
                                    </Checkbox>
                                )}

                            </FormItem>

                            <Form.Item {...tailLayout}>
                                <Button  style={StyleSheet_DefaultButton} htmlType="submit" onClick={() => this.handleOk()}>
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

const WrappedAddCandidateModal = Form.create()(AddCandidateModal);

export default WrappedAddCandidateModal;
