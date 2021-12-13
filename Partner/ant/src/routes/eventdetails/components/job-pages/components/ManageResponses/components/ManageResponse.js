import { Form, Icon, Input, Spin } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
// import DEMO from '../../../../../../../constants/demoData.js';
import partnerService from '../../../../../../../services/partnerService';

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

const customEmailValidator = (rule, value, callback) => {
    var re = /\S+@\S+\.\S+/;
    var validEmail = re.test(value);
    console.log(validEmail);
    console.log(value);
    console.log(rule);
    if (!validEmail ) {
        if(rule.field === "forward" && value === ""){
            //forward is not mandatory
        }
        else{
            callback(rule.message);
        }
        
    } // Always return a callback, otherwise validateFields cannot respond
    callback();
}
class ManageResponseDetails extends React.Component {
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
            responseDetails: {},
            loading: false,
            jobId:jobId,
            authToken: auth,
            companyName : company,
            isRecruiter : isRec,
            emailId: email,
        }
        this.partnerSvc = new partnerService();
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });
        if (this.props.formValidator)
             this.props.formValidator(this.props.form);
        //get Job Details
        this.partnerSvc.getjobpostingresponseetails(this.state.jobId).then((d) => {
            //update state
            console.log(d.data);
            // this.state.loading = false;
            var data ={
                "companyName": this.state.companyName,
                "jobPostedBy": d.data.data.jobPostedBy?d.data.data.jobPostedBy:this.state.emailId,
                "jobId" : this.state.jobId,
                "recepientEmailAddress": d.data.data.recepientEmailAddress,
                "forwardApplication": d.data.data.forwardApplication,
                "emailId" : this.state.emailId
            }
            this.setState({ responseDetails: data , loading: false});
            this.props.setMRState(data);
            

            }).catch((err) => {
                console.log(err);
                this.setState({loading: false})
            });
    }
    handleInput = (e,fieldName) => {
         console.log(e,' its num');        
        var responseDetails = { ...this.state.responseDetails };
        if(fieldName === "recipient"){
            responseDetails.recepientEmailAddress = [e.target.value];
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "forward"){
            responseDetails.forwardApplication = [e.target.value];
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        this.setState({ responseDetails });
        this.props.setMRState(responseDetails);

        this.props.form.validateFields([fieldName], { force: true }, (err, fieldValues) => {
            if (err) {
                return
            }
            else {
            }
        });
    }
    handleSubmit = (e) => {
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
                        label="Recipient Address"
                        hasFeedback
                    >
                        {getFieldDecorator(`recipient`, {
                            initialValue: this.state.responseDetails.recepientEmailAddress,
                            rules: [
                                {  
                                    required: true, message: 'Please enter your recipient email address',
                                },
                                // {  
                                //     type: 'email', message : 'Please provide valid email id',
 
                                // },
                                {
                                    type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Invalid Email Id!'
                                }],
                            
                        })(
                            <Input  onChange={e => this.handleInput(e,'recipient')}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Forward Application"
                    >
                        {getFieldDecorator(`forward`, {
                            initialValue: this.state.responseDetails.forwardApplication,
                            // validateTrigger : 'onChange',
                            // valuePropName: 'forward',
                            rules: [
                                // {  
                                //     type: 'email', message: 'Please provide valid email id',
                                // },
                                {
                                    type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Invalid Email Id!'
                                }],
                        })(
                            <Input onChange={e => this.handleInput(e,'forward')}/>
                        )}
                    </FormItem>
                </Form>
            </section>
        );
    }
}

const WrappedProjectDetails = Form.create()(withRouter(ManageResponseDetails));

export default WrappedProjectDetails;