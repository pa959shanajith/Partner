import React from 'react';
import { withRouter } from "react-router-dom";
import { Modal, Button, Form, Icon, Input, InputNumber, DatePicker, message,  Upload } from 'antd';
import moment from 'moment';
import partnerService from "../../../services/partnerService";

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
const StyleSheet_DefaultButton = {
    color: '#fff',
    fontSize: '15px',
    background: 'linear-gradient(270deg, #B446FF 0%, #6D68FE 28%, #4C46E6 70%, #9700FF 100%)',
    border: '1px solid #E3E3E3',
    borderRadius: '8px',
    width: '120px',
    height: '40px',
    margin: '4px 8px'
}

const FormItem = Form.Item;
const { TextArea } = Input;

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
// const onFinish = values => {
//     console.log('Success:', values);
// };
// const onFinishFailed = errorInfo => {
//     console.log('Failed:', errorInfo);
// };
const customEmailValidator = (rule, value, callback) => {
    var re = /\S+@\S+\.\S+/;
    var validEmail = re.test(value);
    console.log(validEmail);
    console.log(value);
    if (!validEmail) {
        callback(rule.message);
    } // Always return a callback, otherwise validateFields cannot respond
    callback();
}

class AddEvent extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        // var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        this.state = {
            emailId: email,
            companyName: companyName,
            loading: false,
            visible: false,
            current: 0,
            eventDetails:{},
            eventId: null
        };
        this.partnerService = new partnerService();
        this.handleOk = this.handleOk.bind(this);
    }
    componentDidMount(){
        if (this.props.formValidator)
            this.props.formValidator(this.props.form);
    }
    componentWillReceiveProps(props){
        if(props.visible && !props.editMode){
            var postData = {companyName: this.state.companyName, recruiterEmailId: this.state.emailId};
            this.partnerService.generateEvent(postData).then((res) => {
                this.setState({eventId: res.data.data.eventId});
            }).catch((err) => {
                message.error(err,5);
            })
        } 
    }
    handleOk = () => {
        this.props.form.validateFields((err, fieldValues) => {
            if (err) {
                return;
            }
            else {
                console.log(fieldValues);
                var eventId = this.props.editMode ? this.props.data.eventId : this.state.eventId;
                var data = {
                    eventId: eventId,
                    recruiterEmailId: this.state.emailId,
                    eventtitle: fieldValues.eventName, 
                    companyName: this.state.companyName, 
                    eventcity: fieldValues.eventLocation,
                    briefjobdescription: fieldValues.eventDescription, 
                    eventdate: fieldValues.eventDate,
                    positionopen: fieldValues.openPositions, 
                    eventaddress: fieldValues.eventAddress, 
                    maxexperience: fieldValues.maxexperience, 
                    maximumFootfall: fieldValues.maximumFootfall,
                    recepientEmailAddress: fieldValues.recepientEmailAddress,
                    forwardEmailAddress: fieldValues.forwardEmailAddress,
                    notesToPartners: fieldValues.notesToPartners
                };
                this.partnerService.postEventDtls(data).then((d) => {
                    message.success(d.data.message,5);
                    this.props.onClose();
                }).catch((err) => {
                    message.error("Error while posting Events details",5);
                })
            }
        });
    };

    handleCancel = () => {
        this.props.onClose();
    };
    handleOnChange = (e,fieldName) => {
        var eventDetails = { ...this.state.eventDetails };
        if(fieldName === "eventName"){
            eventDetails.eventName = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "companyName"){
            eventDetails.companyName = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "eventLocation"){
            eventDetails.eventLocation = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "eventDescription"){
            eventDetails.eventDescription = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "eventDate"){
            var eventDateFormatted = moment(e._d).format('DD/MM/YYYY');
            eventDetails.eventDate = eventDateFormatted;
            this.props.form.setFieldsValue({
                [fieldName]: eventDateFormatted
            });
        }
        else if (fieldName === "openPositions"){
            eventDetails.openPositions = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "eventAddress"){
            eventDetails.eventAddress = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "maxexperience"){
            eventDetails.maxexperience = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "maximumFootfall"){
            eventDetails.maximumFootfall = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "recepientEmailAddress"){
            eventDetails.recepientEmailAddress = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "forwardEmailAddress"){
            eventDetails.forwardEmailAddress = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "notesToPartners"){
            eventDetails.notesToPartners = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        this.setState({ eventDetails });

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
        const {visible, data, editMode} = this.props;
        const title = editMode ? 'Edit Event' : 'Add Event';
        const getFieldDecorator = this.props.form.getFieldDecorator;
        const dateFormat = 'DD/MM/YYYY';
        return (
            <div>
                <Modal
                    visible={visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='40%'
                    maskClosable={false}
                    className="add-event-modal"
                >
                    <section className="form-v1-container pt-4">
                        <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>{title}</h3>
                        <hr style={{ border: '2px solid #D45895' }} />

                        <Form
                            {...layout}
                            name="basic"
                        >
                            <FormItem
                                label="Event Image"
                                name="EventImage"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Event Image!',
                                    },
                                ]}
                            >
                                <Upload name="logo" action="/upload.do" listType="picture">
                                    <Button style={StyleSheet_UploadButton}>
                                        <Icon type="camera-o" style={{ fontSize: '24px' }} />
                                    </Button>
                                </Upload>
                            </FormItem>
                            <FormItem
                                label="Event Name"
                                name="EventName"
                            >
                                {getFieldDecorator('eventName', {
                                    initialValue: data.eventName,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Event Name!',
                                        }
                                    ],
                                    
                                })(
                                    <Input  onChange={e => this.handleOnChange(e,'eventName')}/>
                                )}
                            </FormItem>
                            <FormItem
                                label="Company"
                                name="company"
                            >
                                {getFieldDecorator('companyName', {
                                    initialValue: data.companyName,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Company Name!',
                                        }
                                    ],
                                    
                                })(
                                    <Input  onChange={e => this.handleOnChange(e,'companyName')}/>
                                )}
                            </FormItem>
                            <FormItem
                                label="Event Location"
                                name="EventLocation"
                            >
                                {getFieldDecorator('eventLocation', {
                                    initialValue: data.eventLocation,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Event Location!',
                                        }
                                    ],
                                    
                                })(
                                    <Input  onChange={e => this.handleOnChange(e,'eventLocation')}/>
                                )}
                            </FormItem>
                            <FormItem
                                label="Event Description"
                                name="EventDescription"
                            >
                                {getFieldDecorator('eventDescription', {
                                    initialValue: data.eventDescription,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Event Description!',
                                        }
                                    ],
                                    
                                })(
                                    <TextArea rows={4} onChange={e => this.handleOnChange(e,'eventDescription')}/>
                                )}
                                
                            </FormItem>
                            <FormItem
                                label="Event Date"
                                name="EventDate"
                            >
                                {getFieldDecorator('eventDate', {
                                initialValue: moment(data.eventDate, dateFormat),
                                rules: [
                                    {
                                        required: true, message: 'Please provide Event Date!',
                                    }],
                                })(
                                    <DatePicker onChange={e => this.handleOnChange(e, 'eventDate')} format={dateFormat} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Position Open"
                                name="PositionOpen"
                            >
                                {getFieldDecorator('openPositions', {
                                    initialValue: data.openPositions,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide open Positions!',
                                        }
                                    ],
                                    
                                })(
                                    <InputNumber min={1} onChange={e => this.handleOnChange(e,'openPositions')}/>
                                )}
                                
                            </FormItem>

                            <FormItem
                                label="Event Address"
                                name="EventAddress"
                            >
                                {getFieldDecorator('eventAddress', {
                                    initialValue: data.eventAddress,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Event Address!',
                                        }
                                    ],
                                    
                                })(
                                    <TextArea rows={1} onChange={e => this.handleOnChange(e,'eventAddress')}/>
                                )}
                            </FormItem>
                            <FormItem
                                label="Experience Level"
                                name="ExperienceLevel"
                            >
                                {getFieldDecorator('maxexperience', {
                                    initialValue: data.maxexperience,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Experience Level!',
                                        }
                                    ],
                                    
                                })(
                                    <Input  onChange={e => this.handleOnChange(e,'maxexperience')}/>
                                )}
                            </FormItem>
                            <FormItem
                                label="Footfall Expected"
                                name="FootfallExpected"
                            >
                                {getFieldDecorator('maximumFootfall', {
                                    initialValue: data.maximumFootfall,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Expected Footfall!',
                                        }
                                    ],
                                    
                                })(
                                    <InputNumber min={5}  onChange={e => this.handleOnChange(e,'maximumFootfall')}/>
                                )}
                            </FormItem>
                            <FormItem
                                label="Recipient Mail"
                                name="RecipientMail"
                            >
                                {getFieldDecorator('recepientEmailAddress', {
                                initialValue: data.recepientEmailAddress,
                                rules: [
                                    {  
                                        required: true, message: 'Please provide Recipient Mail!',
                                    },
                                    {
                                        type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                    }
                                ],
                                })(
                                    <Input  onChange={e => this.handleOnChange(e,'recepientEmailAddress')}/>
                                )}
                            </FormItem>

                            <FormItem
                                label="Forward Mail"
                                name="ForwardMail"
                            >
                                {getFieldDecorator('forwardEmailAddress', {
                                initialValue: data.forwardEmailAddress,
                                rules: [
                                    {  
                                        required: true, message: 'Please provide Forward Mail!',
                                    },
                                    {
                                        type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                    }
                                ],
                                })(
                                    <Input  onChange={e => this.handleOnChange(e,'forwardEmailAddress')}/>
                                )}
                            </FormItem>
                            <FormItem
                                label="Notes to Recruiter"
                                name="NotesRecruiter"
                            >
                                {getFieldDecorator('notesToPartners', {
                                    initialValue: data.notesToPartners,
                                    rules: [
                                        {  
                                            required: true, message: 'Please provide Notes to Recruiter!',
                                        }
                                    ],
                                    
                                })(
                                    <TextArea rows={4} onChange={e => this.handleOnChange(e,'notesToPartners')}/>
                                )}
                            </FormItem>

                            <Form.Item {...tailLayout}>
                                <Button style={StyleSheet_DefaultButton} onClick={this.handleOk} htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>
                    </section>
                </Modal>
            </div>
        );
    }
}
const WrappedAddRecruiter = Form.create()(withRouter(AddEvent));

export default WrappedAddRecruiter;