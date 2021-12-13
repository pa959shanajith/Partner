import { AutoComplete, Button, Checkbox, Form, Icon, Input, InputNumber, message, Radio, Spin, Upload } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from '../../../../../../../services/partnerService';
import CaptureVideoModal from './CaptureVideoModal';
const { TextArea } = Input;
const FormItem = Form.Item;

const loadingIcon = <Icon type="loading" style={{
    fontSize: 80, position: 'absolute',
    top: '50%',
    left: '50%',
    height: '30%',
    width: '50%',
    marginTop: '-15%',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '-25%'
}} spin />;

const StyleSheet_UploadButton = {
    color: '#939393',
    fontSize: '16px',
    borderRadius: '4px',
    minWidth: '100px',
    fontWeight: 900,
    height: '55px',
    margin: '4px 8px',
    textAlign: 'center',
}
const jdUploadProps = {
    name: 'video',
    multiple: false,
    accept: '.mp4, .ogg, .webm',
};
// const customSalaryValidator = (rule, value, callback) => {
// Always return a callback, otherwise validateFields cannot respond
//     callback();
// }

class JobDetails extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email').replace(/['"]+/g, '');
        var auth = localStorage.getItem('authToken').replace(/['"]+/g, '');
        var company = localStorage.getItem('companyName').replace(/['"]+/g, '');
        var isRec = localStorage.getItem('isRecruiter').replace(/['"]+/g, '');
        var jId = localStorage.getItem('jobId').replace(/['"]+/g, '');
        this.state = {
            confirmDirty: false,
            loading: false,
            showModal: false,
            jobEditMode : false,
            jobId:jId,
            jobDetails: {},
            listOfLocations: [],
            dupLocations: [],
            authToken: auth,
            companyName : company,
            isRecruiter : isRec,
            emailId: email,
            employementTypeSelected:"",
            jobLocationSelected:"",
            minCTCLac:"",
            maxCTCLac:""
        }
        this.partnerSvc = new partnerService();
        this.handleSubmit = this.handleSubmit.bind(this);

        if(this.state.jobId!='0'){
            this.state.jobEditMode = true;
            localStorage.setItem('jobId', this.state.jobId);
        }
    }
    componentDidMount() {
        this.setState({ loading: true });
        if (this.props.formValidator)
             this.props.formValidator(this.props.form);

        this.state.loading = true;
        if(this.state.jobEditMode){
            //get Job Details
            this.partnerSvc.getjobdetails(this.state.jobId).then((d) => {
                var data={
                    "companyName": this.state.companyName,
                    "jobPostedBy": this.state.emailId,
                    "jobId" : this.state.jobId,
                    "jobTitle": d.data.data.jobTitle, "jobDescription": d.data.data.jobDescription, "videoJd": d.data.data.videoJd, 
                    "vacancies": d.data.data.vacancies, "jobLocation": d.data.data.jobLocation, "employementType": d.data.data.employementType,
                    "travelRequired": d.data.data.travelRequired, "minCTC": d.data.data.minannualCTC,"maxCTC": d.data.data.maxannualCTC, 
                    "salaryHide": d.data.data.salaryHide, "otherMonetoryBenefits": d.data.data.otherMonetoryBenefits
                }
                this.setState({ jobDetails: data });
                this.setState({jobLocationSelected: data.jobLocation[0]});
                this.setState({employementTypeSelected: data.employementType[0]});
                this.setState({minCTCLac:Number(data.minCTC)/100000});
                this.setState({maxCTCLac:Number(data.maxCTC)/100000});
                this.props.setJDState(data);
                this.state.loading = false;
            }).catch((err) => {
                this.state.loading = false;
                console.log(err);
                
            });
        }
        else{//generate job id
            this.partnerSvc.generatejobid({"companyName" : this.state.companyName,"jobPostedBy" : this.state.emailId}).then((d) => {
                //update state with new joib id and known details
                const jobId = d.data.data.jobId;
                localStorage.setItem('jobId', jobId);
                var data={
                "companyName": this.state.companyName,
                "jobPostedBy": this.state.emailId,
                "jobId" : jobId,
                "jobTitle": "", "jobDescription": "", "videoJd": "", "vacancies": "", "jobLocation": [], "employementType": [], "travelRequired": false, "minCTC": "",
                "maxCTC": "", "salaryHide": false, "otherMonetoryBenefits": ""
            }
            this.setState({ jobDetails: data });
            this.state.loading =false;
        }).catch((err) => {
            this.state.loading =false;
            console.log(err);
            
        });

        }
        //fetch location for aotopopulate
        this.state.loading = true;
        this.partnerSvc.locations().then((d) => {
            this.setState({ listOfLocations: d.data, dupLocations: d.data });
            this.state.loading = false;
        }).catch((err) => {
            console.log(err);
            this.state.loading =false;
        });
    }
    customjdVideoUpload = (componentsData) => {
        console.log(componentsData);
        const formData = new FormData();
        formData.append('file', componentsData.file,componentsData.file.name)
        console.log(formData);
        this.setState({loading: true});
        this.partnerSvc.saveVideoJDfromFile(formData,this.state.jobId).then((d) => {
            console.log(d);
            if(d.data.status==false){
                message.warn(`Upload failed.${d.data.message}.`,5);
                componentsData.onError(`Uploaded failed.${d.data.message}.`)
            }else{
                message.success(`JD Video uploaded successfully.`,5);
                var jobDetails = { ...this.state.jobDetails };
                jobDetails.videoJd = d.data.location;
                this.setState({ jobDetails });
                this.props.setJDState(jobDetails);
                componentsData.onSuccess();
            }
            this.setState({loading: false});
            }).catch((err) => {
            console.log(err, ' its err');
            message.error(`File upload failed.`,5);
            componentsData.onError("Error uploading JD Video")
            this.setState({loading: false});
        })   
    } 

    travelOnChange = e => {
        var jobDetails = { ...this.state.jobDetails };
        jobDetails.travelRequired = e.target.value;
        this.setState({ jobDetails });
        this.props.setJDState(jobDetails);
    };
     // Location select
    currentLocation = (e) => {
        if (e) {
            var jobDetails = { ...this.state.jobDetails };
            jobDetails.jobLocation = [e];
            this.setState({ jobDetails });
            this.setState({jobLocationSelected:e});
            this.props.setJDState(jobDetails);
        }
    }
    handleInput = e => {
        if (e){
            //Update Props and validate fields
            // var fieldName = e.target.id;
            // this.props.form.setFieldsValue({
            // [fieldName]: e.target.value});
            //  this.props.form.validateFields([fieldName],{force: true },(err, fieldValues) => {  
            //      if (err) {
            //      return}
            //  else {}});
            var jobDetails = { ...this.state.jobDetails };
            switch (e.target.id) {
                case 'jobtitle':
                  jobDetails.jobTitle = e.target.value;
                  break;
                case 'jobdescription':
                  jobDetails.jobDescription = e.target.value;
                  break;
                case 'otherbenefits':
                  jobDetails.otherMonetoryBenefits = e.target.value;
                  break;
                default:
                  break;
              }
            this.setState({ jobDetails });
            this.props.setJDState(jobDetails);
        }
    }
    handlePostionInput = e => {
        var jobDetails = { ...this.state.jobDetails };
        jobDetails.vacancies = e;
        this.setState({ jobDetails });
        this.props.setJDState(jobDetails);
    }
    handleJobTypeChange = e => {
        var jobDetails = { ...this.state.jobDetails };
        jobDetails.employementType = [e.target.value];
        this.setState({ jobDetails });
        this.props.setJDState(jobDetails);
        this.setState({employementTypeSelected:e.target.value});
    }
    handleSalaryInput = (e,field) => {
        var jobDetails = { ...this.state.jobDetails };
        if (field == 'minsalary') {
            jobDetails.minCTC = e*100000;
        }
        else{
            jobDetails.maxCTC = e*100000;
        }
        this.setState({ jobDetails });
        this.props.setJDState(jobDetails);
    }

    onSearch = (value) => {
        this.setState({
            listOfLocations: !value ? [] : this.state.dupLocations.filter(el => el.includes(value))
        })
    };

    updatePropsAndValidate = (fieldName, value) => {
    }
    handleSubmit(e) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values, ' its values ', e);
            }
            else {
                console.log(err, ' its err');
            }
        })
    }
    onCheckSalaryHideChange = e => {
        console.log(e.target.checked)
        var jobDetails = { ...this.state.jobDetails };
        jobDetails.salaryHide = e.target.checked;
        this.setState({ jobDetails });
        this.props.setJDState(jobDetails);
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    showCaptureModal = () => {
        this.setState({showModal: true});
    }

    closeCaptureModal(){
        this.setState({showModal: false});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { form } = this.props;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        if (this.state.loading == true) return <Spin indicator={loadingIcon} />
        else
        return (
            <section className="form-v1-container">
                <CaptureVideoModal visible={this.state.showModal} onClose={this.closeCaptureModal.bind(this)}></CaptureVideoModal>
                <Form onSubmit={this.handleSubmit} className="form-v1">
                    <FormItem label="Video JD" {...formItemLayout}>
                        <FormItem
                            name="captureVideo"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', width: 'calc(30% - 5px)', marginRight: 28 }}
                        >
                            {/* <Button><Icon type="video-camera" /></Button> */}
                            <Button onClick={this.showCaptureModal} style={StyleSheet_UploadButton}><Icon type="camera-o" style={{fontSize: '24px'}}/></Button>

                        </FormItem>
                        <FormItem
                            name="uploadVideo"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}
                        >
                            <Upload  {...jdUploadProps} customRequest={this.customjdVideoUpload} name="jdvideo" listType="picture">
                                <Button style={StyleSheet_UploadButton}>
                                    Click to upload <Icon type="upload" />
                                </Button>
                            </Upload>
                        </FormItem>
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Job Title"
                    >
                        {getFieldDecorator(`jobtitle`, {
                            initialValue: this.state.jobDetails.jobTitle,
                            rules: [
                                {
                                    required: true, message: 'Please enter your Job title!',
                                }],
                        })(
                            <Input onChange={e => this.handleInput(e)}/>
                        )}

                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="Job Description"
                        hasFeedback
                    >
                        {getFieldDecorator('jobdescription', {
                            initialValue: this.state.jobDetails.jobDescription,
                            rules: [
                                {
                                    required: true, message: 'Job Description is required!',
                                }],
                        })(
                            <TextArea onChange={e => this.handleInput(e)}
                                placeholder= "Please input detailed Job Description"
                                rows={4} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Number of Positions"
                        hasFeedback
                    >
                        {getFieldDecorator('positions', {
                            initialValue: this.state.jobDetails.vacancies,
                            rules: [
                                {
                                    required: true, message: 'Please input number of positions',
                                }],
                        })(

                            <InputNumber min={1} onChange={e => this.handlePostionInput(e)}/>
                        )}
                    </FormItem>
                    <FormItem label="Salary in Lacs - INR" {...formItemLayout}>
                        <FormItem
                            name="min"
                            label="Min"
                            style={{ display: 'inline-block', width: 'calc(30% - 5px)', marginRight: 8 }}
                        >
                        {getFieldDecorator('minsalary', {
                            initialValue: this.state.minCTCLac,
                            rules: [
                                {
                                    required: true, message: 'Input required!',
                                }, 
                                // { type: "custom", name: "SalValMin", validator: customSalaryValidator, message: 'Min salary more tham max!'}
                             ],
                        })(

                            <InputNumber min={1} max={500} style={{ display: 'inline-block', marginRight: 8 }} onChange={e => this.handleSalaryInput(e, "minsalary")}>
                            {/* <Tooltip>Lacs</Tooltip> */}
                            </InputNumber>
                        )}
                        </FormItem>
                        <FormItem
                            name="max"
                            label="Max"
                            style={{ display: 'inline-block', width: 'calc(50% - 5px)' }}
                        >
                        {getFieldDecorator('maxsalary', {
                            initialValue: this.state.maxCTCLac,
                            rules: [
                                {
                                    required: true, message: 'Input required!',
                                }, 
                                // { type: "custom", name: "SalValMax", validator: customSalaryValidator, message: 'Min salary more tham max!'}
                             ],
                        })(

                            <InputNumber min={1} max={500}   style={{ display: 'inline-block', marginRight: 8 }} onChange={e => this.handleSalaryInput(e, "maxsalary")}/>
                    
                        )}
                        </FormItem>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Hide Salary Details"
                        hasFeedback
                    >
                        {getFieldDecorator('hidesalary', {
                            initialValue:  this.state.jobDetails.salaryHide,
                            rules: [
                                {
                                    required: false, message: 'Please select!',
                                }],
                        })(

                            <Checkbox
                            // indeterminate={this.state.indeterminate}
                            onChange={this.onCheckSalaryHideChange}
                            checked={this.state.jobDetails.salaryHide}
                          >
                          </Checkbox>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Other Benefits"
                    >
                        {getFieldDecorator(`otherbenefits`, {
                            initialValue: this.state.jobDetails.otherMonetoryBenefits,
                            rules: [
                                {
                                    required: false, message: 'Please enter your other Benefits!',
                                }],
                        })(
                            <Input onChange={e => this.handleInput(e)}/>
                        )}
 
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Job Location"

                    >
                        {getFieldDecorator(`joblocation`, {
                            initialValue: this.state.jobLocationSelected,
                            rules: [
                                {
                                    required: true, message: 'Please select your Job Location!',
                                }],
                        })(
                            <AutoComplete
                                    dataSource={this.state.listOfLocations}
                                    defaultValue={this.state.jobLocationSelected}
                                    onSelect={e => this.currentLocation(e)}
                                    onSearch={e => this.onSearch(e)}
                                    placeholder="Enter Work Location"
                            />
                        )}
                    </FormItem>
                    <FormItem label="Job Type" {...formItemLayout}>
                        <FormItem
                            name="jobtype"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', marginRight: 8 }}
                        >
                            <Radio.Group defaultValue="FullTime" buttonStyle="solid" onChange={this.handleJobTypeChange} value={this.state.employementTypeSelected}>
                                <Radio.Button value="FullTime">Full Time</Radio.Button>
                                <Radio.Button value="PartTime">Part Time</Radio.Button>
                                <Radio.Button value="Contract">Contract</Radio.Button>
                            </Radio.Group>
                        </FormItem>
                    </FormItem>
                    <FormItem label="Travel" {...formItemLayout}>
                        <FormItem
                            name="yes"
                            rules={[{ required: true }]}
                            style={{ display: 'inline-block', marginRight: 8 }}
                        >
                            <Radio.Group onChange={this.travelOnChange} value={this.state.jobDetails.travelRequired}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </FormItem>
                    </FormItem>
                </Form>
            </section>
        );
    }
}

const WrappedEducationDetails = Form.create()(withRouter(JobDetails));
export default WrappedEducationDetails;