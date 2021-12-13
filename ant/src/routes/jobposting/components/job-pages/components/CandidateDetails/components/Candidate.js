import { Form, Icon, InputNumber, Select, Tooltip, AutoComplete, Spin } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from '../../../../../../../services/partnerService';

const Option = Select.Option;
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

// function validateFields() {
//     this.props.form.validateFields.validateFields((err, fieldValues) => {
//         if (err) {
//             return
//         }
//     })
// }
class CandidateDetails extends React.Component {
    constructor(props) {
        super(props);
        var thisComponent = this;
        //  this.handleSubmit = this.handleSubmit.bind(this);
        var email = localStorage.getItem('email').replace(/['"]+/g, '');
        var auth = localStorage.getItem('authToken').replace(/['"]+/g, '');
        var company = localStorage.getItem('companyName').replace(/['"]+/g, '');
        var isRec = localStorage.getItem('isRecruiter').replace(/['"]+/g, '');
        var jobId = localStorage.getItem('jobId').replace(/['"]+/g, '');
        this.state = {
            confirmDirty: false,
            loading: false,
            showModal: false,
            jobId:jobId,
            candidateDetails: {},
            industries: [],
            dupIndustries:[],
            authToken: auth,
            companyName : company,
            isRecruiter : isRec,
            emailId : email,
        }
        this.partnerSvc = new partnerService();
        this.onSearch = this.onSearch.bind(this);
    }
    componentDidMount() {
        this.setState({ loading: true });
        if (this.props.formValidator)
             this.props.formValidator(this.props.form);
            //get Job Details
            this.partnerSvc.getcandidatedetailsforjobpost(this.state.jobId).then((d) => {
            this.setState({ loading: false });
            var data={
                    "companyName": this.state.companyName,
                    "jobPostedBy": this.state.emailId,
                    "jobId" : this.state.jobId,
                    "minexperience" : d.data.data.minexperience,
                    "maxexperience" : d.data.data.maxexperience,
                    "industries": d.data.data.industries,
                    "functionalArea": d.data.data.functionalArea,
                    "noticePeriod": d.data.data.noticePeriod.replace(/['"]+/g, ''),
                    "skills": d.data.data.skills,
                    "languagesKnown":d.data.data.languagesKnown
            }
            //console.log(d.data.data);
            this.setState({minExp:Number(data.minexperience)});
            this.setState({maxExp:Number(data.minexperience)});
            this.setState({np:Number(data.noticePeriod.replace(/['"]+/g, ''))});
            this.setState({candidateDetails : data});
            this.props.setCDState(data);    
            }).catch((err) => {
                this.setState({ loading: false });
                //TODO : Handle Error
                console.log(err);

            });
            var listofIndustries = [
                "Administrative/Support", "Art/Design/Media", "Buisness", "Child Care", "Education", "Engineering", "Finance/Accounting", "Health Care",
                "Human Resources", "Insurance", "Legal and Low Enforcement", "Manufaturing", "Marketing/Public Relations", "Nursing", "Real Estate",
                "Restaurant and Hospitality", "Retails", "Others"
            ];
        this.setState({
            industries: listofIndustries, dupIndustries : listofIndustries
        });
        console.log(this.state.candidateDetails.maxexperience);
    }

    // handleSubmit(e) {
    // }
    // handleTagSelect = (e, fieldName) => {
    //     console.log(e);
    // }

    handleInput = (e, fieldName) => {
        var candidateDetails = { ...this.state.candidateDetails };
        if (fieldName == 'minexp') {
            candidateDetails.minexperience = e;
        }
        else if (fieldName == 'maxexp') {
            candidateDetails.maxexperience = e;
        }
        else if (fieldName == 'np'){
            candidateDetails.noticePeriod = e;
        }
        else if (fieldName == "skillsUtilized"){
            candidateDetails.skills = e;
        }
        else if (fieldName == "languagesKnown"){
            candidateDetails.languagesKnown = e;
        }
        this.setState({ candidateDetails });
        this.props.setCDState(candidateDetails);
    }
    
    handleFunctionalArea = (e) => {
        var candidateDetails = { ...this.state.candidateDetails };
            candidateDetails.functionalArea = [e];
            candidateDetails.industries = e;
        this.setState({ candidateDetails });
        this.props.setCDState(candidateDetails);
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
    onSearch = (value) => {
        this.setState({
                    industries: !value ? [] : this.state.dupIndustries.filter(el => el.includes(value))
            })
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { form } = this.props;
        const { industries } = this.state;
        let industriesList = industries.map((item, i) => {
            return (
                <Option key={i} value={item}>{item}</Option>
            )
        }, this);
        console.log(industriesList);

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
                <Form onSubmit={this.handleSubmit} className="form-v1">
                    <FormItem
                        {...formItemLayout}
                        name="Min"
                        label="Min Experience"
                        hasFeedback
                    >
                        {getFieldDecorator('minexp', {
                            initialValue: this.state.candidateDetails.minexperience,
                            rules: [
                                {
                                    required: true, message: 'Please input Min Experience',
                                }],
                        })(
                            
                                <InputNumber min={1} max={100} style={{ marginRight: '10px', width: '90%' }} onChange={e => this.handleInput(e, "minexp")} >
                                <Tooltip>Years</Tooltip>
                                </InputNumber>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Max Experience"
                        hasFeedback
                    >
                        {getFieldDecorator('maxexp', {
                            initialValue: this.state.candidateDetails.maxexperience,
                            rules: [
                                {
                                    required: true, message: 'Please input Max Experience',
                                }],
                        })(
                            
                                <InputNumber min={1} max={100} style={{ marginRight: '10px', width: '90%' }} onChange={e => this.handleInput(e, "maxexp")} >
                                 <Tooltip>Years</Tooltip>
                                </InputNumber>

                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Functional Area"
                    >
                        {getFieldDecorator(`functionalArea`, {
                            initialValue: this.state.candidateDetails.functionalArea,
                            rules: [
                                {
                                    required: true, message: 'Please select your Functional Area!',
                                }],
                        })(
                            <AutoComplete
                                    dataSource={this.state.industries}
                                    defaultValue={this.state.candidateDetails.Industry}
                                    onSelect={e => this.handleFunctionalArea(e)}
                                    onSearch={e => this.onSearch(e)}
                                    placeholder="Enter Functional Area"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Notice Period"
                        hasFeedback
                    >
                        {getFieldDecorator('np', {
                            initialValue: Number(this.state.candidateDetails.noticePeriod),
                            rules: [
                                {
                                    required: true, message: 'Please input Notice Period',
                                }],
                        })(
                             
                                <InputNumber min={1} max={500} style={{ marginRight: '10px', width: '60%' }} onChange={e => this.handleInput(e, "np")}>
                                <Tooltip>Days</Tooltip>
                                </InputNumber>

                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Skills Required"

                    >
                        {getFieldDecorator(`skillsUtilized`, {
                            initialValue: this.state.candidateDetails.skills,
                            rules: [
                                {
                                    required: true, message: 'Please input Your Skills Required',
                                }],
                        })(
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                            // searchPlaceholder="start typing comapnies you like"
                            // defaultValue={pre.companyName}
                                onChange={(e) => this.handleInput(e,'skillsUtilized')}
                            >
                                {/* {children} */}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Languages Known"

                    >
                        {getFieldDecorator(`languagesKnown`, {
                            initialValue: this.state.candidateDetails.languagesKnown,
                            rules: [
                                {
                                    required: true, message: 'Please input Your Languages Known',
                                }],
                        })(
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                            // searchPlaceholder="start typing comapnies you like"
                            // defaultValue={pre.companyName}
                             onChange={(e) => this.handleInput(e, 'languagesKnown')}
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

const WrappedEmploymentDetails = Form.create()(withRouter(CandidateDetails));

export default WrappedEmploymentDetails;