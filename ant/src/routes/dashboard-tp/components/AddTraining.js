import React from 'react';
import { withRouter } from "react-router-dom";
import { Modal, Button, Form, Input, InputNumber,Select, Upload, message, DatePicker } from 'antd';
import partnerService from "../../../services/partnerService";
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
// const timeFormat = 'HH:mm';
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

// const profilePicProps = {
//     name: 'image',
//     multiple: false,
//     accept: '.jpeg, .jpg, .png',
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
// var closeModal;
var isEdit = false;
// const onFinish = values => {
//     // console.log('Success:', values);
//     message.success("Succesfully added recruiter.", 5);
//     closeModal();
// };
// const onFinishFailed = errorInfo => {
//     // console.log('Failed:', errorInfo);
//     message.success("Failed to add recruiter.", 5);
//     closeModal();
// };
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
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

const customDateValidator = (rule, value, callback) => {
    var dateFormat = moment(value).format('YYYY-MM-DD');
    var todayFormat = moment().format('YYYY-MM-DD');
    var dateCompare = moment(dateFormat).isAfter(todayFormat);
    // console.log(dateFormat,' ',todayFormat);
    // console.log(moment(dateFormat).isAfter(todayFormat) ,' its compare value');
    // console.log(todayFormat.diff(dateFormat, 'days') ,' its diff');


    if (dateCompare === false) {

        callback(rule.message);
    }
    callback();
}

// const customDurationValidator = (rule, value, callback) => {su
// }

class AddTraining extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        // var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        this.state = {
            loading: false,
            visible: false,
            emailId: email,
            // authtoken: auth,
            companyName: companyName,
            current: 0,
            trainingDetails: {},
            imageUrl: '',
            imageloading: false,
            mode: '',
            training_fee: '',
            date:'',
            initialDate:undefined
        };
        // closeModal = this.handleCancel();
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
    }

    componentDidMount() {
        if (this.props.formValidator)
            this.props.formValidator(this.props.form);
        this.setState({ mode: '', training_fee: '',date:'' })
        this.props.form.resetFields()
        
    }

    customProfilePicUpload = (componentsData) => {
        // console.log(componentsData);

        if (componentsData.file.status === 'uploading') {
            this.setState({ imageloading: true });
            return;
        }
        if (componentsData.file.status === 'done') {
            //Get this url from response in real world.
            getBase64(componentsData.file.originFileObj, imageUrl => this.setState({
                imageUrl,
                imageloading: false,
            }));
        }
        const formData = new FormData();
        formData.append('image', componentsData.file.originFileObj, componentsData.file.name)
        // console.log(formData);
        this.partnerService.uploadprofilepic(formData).then((d) => {
            // console.log(d);
            this.setState({ imageloading: false });
            if (d.data.status === false) {
                message.warn(`Upload failed.${d.data.message}.`, 5);
                // componentsData.onError(`Uploaded failed.${d.data.message}.`)
            } else {
                this.setState({ imageUrl: d.data.fileUrl });
                message.success(`Uploaded successfully...`, 5);
                // componentsData.onSuccess();
            }
        }).catch((err) => {
            console.log(err, ' its err');
            this.errorHandler.customErrorCheck(err);
            message.error(`File upload failed.`, 5);
            // componentsData.onError("Error uploading Profile Picture")
        })
    }

    handleOk = () => {
        // this.setState({ loading: true });
        this.props.form.validateFields((err, fieldValues) => {
            if (err) {
                return
            }
            else {
                var email = this.state.emailId;
                var companyName = this.state.companyName;
                // console.log(fieldValues);

                if (isEdit) {
                    let data = {
                        title: fieldValues.title, description: fieldValues.description, date: fieldValues.date,
                        duration: fieldValues.duration, training_mode: (fieldValues.training_mode === 'offline') || (fieldValues.training_mode === 'OFFLINE')  ?'OFFLINE':'ONLINE'  , onlineurl: fieldValues.onlineurl || "",
                        email: email, cost: fieldValues.cost, training_fee: fieldValues.fee || '',
                        training_location: fieldValues.offlinelocation || [], fmail: fieldValues.fmail, rmail: fieldValues.rmail,
                        eventCreatedBy: email, companyName: companyName, ObjectId: localStorage.getItem('ObjectId'),
                        trainingBanner:this.state.imageUrl,isEdit:true
                    };
                    // console.log(data,' its data');
                    
                    //Call update API
                    this.partnerService.editTrainingEvent(data).then((d) => {
                        // console.log(d, ' its data');
                        if (d.data.status === true) {
                            message.success('Updated Successfully', 5);
                            this.props.form.resetFields();
                            this.props.reloadList();
                            this.props.onClose();
                        }
                        

                    }).catch((err) => {
                        console.log(err);
                        this.props.onClose();
                        this.props.reloadList();
                        this.setState({date:''})
                        this.errorHandler.customErrorCheck(err);
                        this.props.form.resetFields();
                        // message.error("Failed up update recruiter details.",5);
                    })
                }
                else {
                    // console.log(' its inside else cond');
                    let data = {
                        title: fieldValues.title, description: fieldValues.description, date: fieldValues.date,
                        duration: fieldValues.duration, training_mode: fieldValues.training_mode, onlineurl: fieldValues.onlineurl || "",
                        email: email, cost: fieldValues.cost, training_fee: fieldValues.fee || '',
                        training_location: fieldValues.offlinelocation || [], fmail: fieldValues.fmail, rmail: fieldValues.rmail,
                        eventCreatedBy: email, companyName: companyName,trainingBanner:this.state.imageUrl,isEdit:false
                    };
                    this.partnerService.createTrainingEvent(data).then((res) => {
                        // console.log(res, ' its after saved res');
                        //show succes and proceed to close
                        if (res.data.status === true) {
                            message.success('Training Event Added Successfully', 5);
                        }
                        this.props.form.resetFields();
                        this.props.onClose();
                        this.props.reloadList();
                        this.setState({date:''});
                    }).catch((err) => {
                        // message.error(err.data.message,5);
                        this.props.onClose();
                        this.props.reloadList();
                        this.setState({date:''});
                        this.errorHandler.customErrorCheck(err);
                        this.props.form.resetFields();
                    })
                }
            }
        });
    };

    handleCancel = () => {
        this.props.onClose();
        this.props.form.resetFields();
    };

    handleOnChange = (e, fieldName) => {
        var trainingDetails = { ...this.state.trainingDetails };
        // console.log(e, ' ', fieldName);
        if (e) {

            if (fieldName === "title") {
                trainingDetails.title = e.target.value;
                this.props.form.setFieldsValue({
                    [fieldName]: e.target.value
                });
            }
            else if (fieldName === "description") {
                trainingDetails.description = e.target.value;
                this.props.form.setFieldsValue({
                    [fieldName]: e.target.value
                });
            }
            else if (fieldName === "date") {
                // console.log(e._d, ' its date ',moment(e._d).format('DD-MM-YYYY'));
                trainingDetails.date = moment(e._d).format('DD-MM-YYYY');
                this.props.form.setFieldsValue({
                    [fieldName]: moment(e._d).format('DD-MM-YYYY')
                });
            }
            else if (fieldName === "duration") {
                // console.log(e._d);
                trainingDetails.duration = e
                this.props.form.setFieldsValue({
                    [fieldName]: e
                });
            }
            else if (fieldName === "training_mode") {
                trainingDetails.training_mode = e;
                if (e === 'ONLINE') {
                    this.setState({ mode: e });
                }
                else if (e === 'OFFLINE') {
                    this.setState({ mode: e });
                }
                this.props.form.setFieldsValue({
                    [fieldName]: e
                });
            }
            else if (fieldName === "onlineurl") {
                trainingDetails.onlineurl = e.target.value;
                this.props.form.setFieldsValue({
                    [fieldName]: e.target.value
                });
            }
            else if (fieldName === "offlinelocation") {
                trainingDetails.offlinelocation = e.target.value;
                this.props.form.setFieldsValue({
                    [fieldName]: e.target.value
                });
            }
            else if (fieldName === "cost") {
                trainingDetails.cost = e;
                if (e === 'FREE') {
                    this.setState({ training_fee: 'FREE' });
                }
                else if (e === 'PAID') {
                    this.setState({ training_fee: 'PAID' });
                }
                this.props.form.setFieldsValue({
                    [fieldName]: e
                });
            }
            else if (fieldName === "fee") {
                trainingDetails.fee = e;
                this.props.form.setFieldsValue({
                    [fieldName]: e
                });
            }
            else if (fieldName === "rmail") {
                trainingDetails.rmail = e.target.value;
                this.props.form.setFieldsValue({
                    [fieldName]: e.target.value
                });
            }
            else if (fieldName === "fmail") {
                trainingDetails.fmail = e.target.value;
                this.props.form.setFieldsValue({
                    [fieldName]: e.target.value
                });
            }

        }

        this.setState({ trainingDetails });

        this.props.form.validateFields([fieldName], { force: true }, (err, fieldValues) => {
            if (err) {
                return
            }
            else {
            }
        });
    }

    // Show Location
    showLocation = (value) => {
        var returnValue = false;
        if (value && value.length > 0) {
            switch (value[0]) {
                case 'ONLINE':
                    this.setState({ mode: 'online' })
                    returnValue = true;
                    break;
                case 'OFFLINE':
                    this.setState({ mode: 'offline' });
                    returnValue = false;
                    break;
                default:
                    break;
            }
        }
        return returnValue;
    }
    componentWillReceiveProps(props) {
        if (props.editTraining.trainingId !== this.props.editTraining.trainingId) {
            // console.log(props, ' its props');
            // console.log(moment(props.editTraining.trainingDate).format(dateFormat));
            
            this.setState({
                imageUrl:props.editTraining.trainingBanner,
                mode: props.editTraining.trainingMode[0],
                training_fee: props.editTraining.trainingType[0],
                date:props.editTraining.trainingDate// moment(props.editTraining.trainingDate).format('YYYY-MM-DD')
            });
            this.props.form.setFieldsValue({
                title:props.editTraining.trainingName,
                description:props.editTraining.trainingDescription,
                // date:props.editTraining.trainingDate,
                duration:props.editTraining.trainingDuration,
                training_mode:props.editTraining.trainingMode[0],
                onlineurl:props.editTraining.trainingModeOnlineUrl,
                offlinelocation:props.editTraining.trainingModeOfflineLocation,
                cost:props.editTraining.trainingType[0],
                fee:props.editTraining.trainingCost,
                rmail:props.editTraining.recepientEmailAddress[0],
                fmail:props.editTraining.forwardEmailAddress[0]

            })
        }
    }



    render() {
        // const { loading } = this.state;
        const visible = this.props.visible;
        const { getFieldDecorator } = this.props.form;
        const TrainingData = this.props.editTraining;
        // const imageUrl = this.state.imageUrl ? this.state.imageUrl : TrainingData.logo;
        isEdit = this.props.isEdit;
        // console.log("training", TrainingData);
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
                    width='40%'
                    className="add-training-modal"
                >
                    <section className="form-v1-container pt-4">
                        <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>Add Training</h3>
                        <hr style={{ border: '2px solid #D45895' }} />

                        <Form
                            {...layout}
                            name="basic"
                        >
                            <FormItem
                                label="Training Banner"
                                name="ProfileImage"
                            >
                                {getFieldDecorator('profilePicture', {
                                    rules: [{ required: false, message: 'Please upload image!' }],
                                })(
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        onPreview={this.handlePreview}
                                        multiple={false}
                                        showUploadList={false}
                                        accept='.jpeg, .jpg, .png'
                                        onChange={this.customProfilePicUpload}
                                    >
                                        {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
                                        <img src={ this.state.imageUrl ? this.state.imageUrl:'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png'} alt="avatar" style={{ width: '100%' }} />
                                    </Upload>
                                )}
                            </FormItem>
                            <FormItem
                                label="Training Title"
                                name="name"
                            >
                                {getFieldDecorator(`title`, {
                                    initialValue: TrainingData.trainingName,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide name!',
                                        }
                                    ],

                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'title')} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Training Description"
                                name=""
                            >
                                {getFieldDecorator(`description`, {
                                    initialValue: TrainingData.trainingDescription,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide company name!',
                                        },
                                    ],

                                })(
                                    <TextArea onChange={e => this.handleOnChange(e, 'description')} row={4} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Training Date"
                                name=""
                            > 
                                {getFieldDecorator(`date`, {
                                    initialValue: TrainingData.trainingDate ? moment(TrainingData.trainingDate):this.state.initialDate,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide Event Date',
                                        },
                                        {
                                            type: "custom", name: "DateValid", validator: customDateValidator, message: 'Please provide a valid date'
                                        }
                                    ],

                                })(
                                    // defaultValue={moment('2020-06-06')}  defaultValue={moment(TrainingData.trainingDate,dateFormat)}
                                    <DatePicker autocomplete="off"  onChange={e => this.handleOnChange(e, 'date')} format={dateFormat} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Training Duration (hrs)/day"
                                name=""
                            >
                                {getFieldDecorator('duration', {
                                    initialValue: TrainingData.trainingDuration,
                                    rules: [
                                        { required: true, message: 'Please select Time Duration.' },
                                        // {
                                        //     type: 'custom', name: 'durationValid', validator: customDurationValidator, message: "Please Provide a Valid Time"
                                        // }
                                    ],
                                })(
                                    <InputNumber max={12} onChange={e => this.handleOnChange(e, 'duration')} />
                                    // <TimePicker onChange={e => this.handleOnChange(e, 'duration')} defaultValue={moment('12:08', timeFormat)} format={timeFormat} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Training Mode"
                                name=""
                            >
                                {getFieldDecorator(`training_mode`, {
                                    initialValue: TrainingData.trainingMode && TrainingData.trainingMode.length > 0 && TrainingData.trainingMode[0] === 'ONLINE' ? 'Online' : 'Offline',
                                    rules: [
                                        {
                                            required: true, message: 'Please Select Mode of Training',
                                        },
                                    ]
                                })(
                                    <Select onChange={e => this.handleOnChange(e, 'training_mode')} >
                                        <Option value="ONLINE">Online</Option>
                                        <Option value="OFFLINE">Offline</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem
                                label="Online URL"
                                name=""
                                className={this.state.mode === "ONLINE" ? '' : 'd-none'}
                            // {this.state.mode === "online" ? '' : 'd-none'}
                            >
                                {getFieldDecorator(`onlineurl`, {
                                    initialValue: TrainingData.trainingModeOnlineUrl,
                                    rules: [
                                        {
                                            required: this.state.mode === "ONLINE" ? true : false, message: 'Please provide Online Url',
                                        },
                                    ]
                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'onlineurl')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Training Location"
                                name=""
                                className={this.state.mode === "OFFLINE" ? '' : 'd-none'}
                            // {this.state.mode === "offline" ? '' : 'd-none'}
                            >
                                {getFieldDecorator(`offlinelocation`, {
                                    initialValue: TrainingData.trainingModeOfflineLocation,
                                    rules: [
                                        {
                                            required: this.state.mode === "OFFLINE" ? true : false, message: 'Please provide Training Location',
                                        },
                                    ]
                                })(
                                    // <Select
                                    //     mode="tags"
                                    //     style={{ width: '100%' }}
                                    //     searchPlaceholder="start typing training areas"
                                    //     // defaultValue={pre.companyName}
                                    //     // onChange={(e) => this.onChange(e, 'preferredCompanies')}
                                    //     onChange={(e) => this.handleOnChange(e, 'offlinelocation')}
                                    // >
                                    //     {/* {children} */}
                                    // </Select>
                                    <TextArea onChange={e => this.handleOnChange(e, 'offlinelocation')} row={4} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Training Cost"
                                name=""
                            >
                                {getFieldDecorator(`cost`, {
                                    initialValue: TrainingData.trainingType && TrainingData.trainingType.length > 0 && TrainingData.trainingType[0] === "PAID" ? 'Paid' : 'Free',
                                    rules: [
                                        {
                                            required: true, message: 'Please Select Training Cost',
                                        },
                                    ],

                                })(

                                    <Select onChange={e => this.handleOnChange(e, 'cost')} >
                                        <Option value="FREE">Free</Option>
                                        <Option value="PAID">Paid</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem
                                label="Training Fee(Rs)"
                                name=""
                                className={this.state.training_fee === "FREE" || this.state.training_fee === "" ? 'd-none' : ''}
                            >
                                {getFieldDecorator(`fee`, {
                                    initialValue: TrainingData.trainingCost,
                                    rules: [
                                        {
                                            required: this.state.training_fee === "FREE" || this.state.training_fee === "" ? false : true, message: 'Please Enter Training Amount in Rs',
                                        },
                                    ]
                                })(
                                    <InputNumber max={100000} onChange={e => this.handleOnChange(e, 'fee')} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Recipient Address"
                                name="mail"
                            >
                                {getFieldDecorator(`rmail`, {
                                    initialValue: TrainingData.recepientEmailAddress && TrainingData.recepientEmailAddress.length > 0 && TrainingData.recepientEmailAddress[0],
                                    rules: [
                                        {
                                            required: true, message: 'Please provide mail id!',
                                        },
                                        {
                                            type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                        }
                                    ],

                                })(
                                    // <Input disabled={isEdit} onChange={e => this.handleOnChange(e, 'mail')} />
                                    <Input onChange={e => this.handleOnChange(e, 'rmail')} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Forward Address"
                                name="mail"
                            >
                                {getFieldDecorator(`fmail`, {
                                    initialValue: TrainingData.forwardEmailAddress && TrainingData.forwardEmailAddress.length > 0 && TrainingData.forwardEmailAddress[0],
                                    rules: [
                                        {
                                            required: true, message: 'Please provide mail id!',
                                        },
                                        {
                                            type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                        }
                                    ],

                                })(
                                    // <Input disabled={isEdit} onChange={e => this.handleOnChange(e, 'mail')} />
                                    <Input onChange={e => this.handleOnChange(e, 'fmail')} />
                                )}
                            </FormItem>

                            <Form.Item {...tailLayout}>
                                <Button style={StyleSheet_DefaultButton} htmlType="submit" onClick={() => this.handleOk()}>
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

const WrappedAddTraining = Form.create()(withRouter(AddTraining));

export default WrappedAddTraining;
