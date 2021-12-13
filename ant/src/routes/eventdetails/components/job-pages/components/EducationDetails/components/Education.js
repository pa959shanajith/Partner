import { Form, Icon, Input, Select, AutoComplete , Spin} from 'antd';
// import moment from 'moment';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from '../../../../../../../services/partnerService';

const FormItem = Form.Item;
const Option = Select.Option;
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

class EducationDetails extends React.Component {

    constructor(props) {
        super(props)
        var email = localStorage.getItem('email').replace(/['"]+/g, '');
        var auth = localStorage.getItem('authToken').replace(/['"]+/g, '');
        var company = localStorage.getItem('companyName').replace(/['"]+/g, '');
        var isRec = localStorage.getItem('isRecruiter').replace(/['"]+/g, '');
        var jobId = localStorage.getItem('jobId').replace(/['"]+/g, '');
        this.state = {
            confirmDirty: false,
            showModal: false,
            educationDetails: {},
            listOfDegrees :[],
            dupDegrees :[],
            loading: false,
            jobId:jobId,
            authToken: auth,
            companyName : company,
            isRecruiter : isRec,
            emailId: email,
        }
        this.partnerSvc = new partnerService();
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    componentDidMount() {

        if (this.props.formValidator)
             this.props.formValidator(this.props.form);
        this.setState({ loading: true });      
        //get Job Details
        this.partnerSvc.geteducationaldetailsforjobpost(this.state.jobId).then((d) => {
        //update state
        
            var data={
                "companyName": this.state.companyName,
                "jobPostedBy": this.state.emailId,
                "jobId" : this.state.jobId,
                "qualification": d.data.data.educationalDetails.length>0?d.data.data.educationalDetails[0].qualification:"",
                "specialization": d.data.data.educationalDetails.length>0?d.data.data.educationalDetails[0].specialization:"", 
                "degree": d.data.data.educationalDetails.length>0?d.data.data.educationalDetails[0].degree:"",
                "certificatesDesired":d.data.data.certificationRequired?d.data.data.certificationRequired:""
            }
            this.props.setEDState(data);
            this.setState({ educationDetails: data});

            // this.setState({loading: false})
            }).catch((err) => {
                this.setState({loading: false})
                console.log(err);
            });

        //fetch degrees for autopopulate
        // this.setState({loading: true})
        this.partnerSvc.degrees().then((d) => {
            this.setState({ listOfDegrees: d.data, dupDegrees: d.data , loading: false});
            // this.state.loading = false;
        }).catch((err) => {
            console.log(err);
            this.setState({loading: false})
        });
    }

    handleChange = () => {
        var data = this.state.personalDetails;
        this.props.onSelectChange(data);
    }

    //   On Search
    onSearch = (value) => {
        this.setState({
                    listOfDegrees: !value ? [] : this.state.dupDegrees.filter(el => el.includes(value))
            })
    };

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            console.log(values, ' its values');
            return values;
        })
    }
    // Contact Num state
    handleInput = (e, fieldName) => {
        var educationDetails = { ...this.state.educationDetails };
  
        if (fieldName === 'specialization'){
            educationDetails.specialization = e.target.value;
        }
        else if (fieldName === "certifications"){
            educationDetails.certificatesDesired = e;
        }
        this.setState({ educationDetails });
        this.props.setEDState(educationDetails);
    }
    // Degree Change
    handleDegreeChange = (e ) => {
        // console.log(e,' its loca');
        var educationDetails = { ...this.state.educationDetails };
        educationDetails.degree = e;
        this.setState({ educationDetails });
    }
    // Qualification change State
    handleQualificationChange = (e) => {
        console.log(e,' its nat');
        var  educationDetails = { ...this.state.educationDetails };
        educationDetails.qualification = e;
        this.setState({ educationDetails });
        this.props.setEDState(educationDetails);
    }

    handleTagSelect = (e, fieldName) => {
        console.log(e);
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

    render() {
        const { getFieldDecorator } = this.props.form;
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
        if (this.state.loading === true) return <Spin indicator={loadingIcon} />
        else
        return (
            <section className="form-v1-container">
                <Form onSubmit={this.handleSubmit} className="form-v1">
                <FormItem
                        {...formItemLayout}
                        label="Qualification"
                    >
                        {getFieldDecorator(`qualification`, {
                            initialValue: this.state.educationDetails.qualification,
                            rules: [
                                {
                                    required: true, message: 'Please select your Qualification',
                                }],
                        })(
                            <Select onChange={this.handleQualificationChange}>
                                <Option value="High School">High School</Option>
                                <Option value="Intermediate">Intermediate</Option>
                                <Option value="Graduation">Graduation</Option>
                                <Option value="Post Graduation">Post Graduation</Option>
                                <Option value="Phd">Phd</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Degree"
                    >
                        {getFieldDecorator(`degree`, {
                            initialValue: this.state.educationDetails.degree,
                            rules: [
                                {
                                    required: true, message: 'Please select your degree',
                                }],
                        })(
                            <AutoComplete
                                    dataSource={this.state.listOfDegrees}
                                    defaultValue={this.state.educationDetails.degree}
                                    onSelect={e => this.handleDegreeChange(e)}
                                    onSearch={e => this.onSearch(e)}
                                    placeholder="Please specify degree"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Specialization"
                    >
                        {getFieldDecorator(`specialization`, {
                            initialValue: this.state.educationDetails.specialization,
                            rules: [
                                {
                                    required: true, message: 'Please enter your Specialization',
                                }],
                        })(
                            <Input onChange={e => this.handleInput(e,'specialization')}/>
                        )}

                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Certifications Desired"

                    >
                        {getFieldDecorator(`certifications`, {
                            initialValue: this.state.educationDetails.certificatesDesired,
                            rules: [
                                {
                                    required: false, message: 'Please input Your Certifications Desired',
                                }],
                        })(
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                // searchPlaceholder="start typing comapnies you like"
                                // defaultValue={pre.companyName}
                                onChange={(e) => this.handleInput(e, 'certifications')}
                            >
                                {/* {children} */}
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </section>
        );
    }
}

const WrappedPersonalDetails = Form.create()(withRouter(EducationDetails));
export default WrappedPersonalDetails;