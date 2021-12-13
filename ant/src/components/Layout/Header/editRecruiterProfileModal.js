import React from 'react';
import { withRouter } from "react-router-dom";
import { Modal, Button, Form, Icon, Input, Select, Upload, message, AutoComplete } from 'antd';
import partnerService from "../../../services/partnerService";
import errorHandler from '../../../ErrorHandler/ErrorHandler';


// const InputGroup = Input.Group;
const { Option } = Select;
// const StyleSheet_UploadButton = {
//     color: '#939393',
//     fontSize: '16px',
//     borderRadius: '4px',
//     minWidth: '100px',
//     fontWeight: 900,
//     height: '55px',
//     margin: '4px 8px',
//     textAlign: 'center',
// }
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
// const { TextArea } = Input;
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
//  var closeModal;
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


const children = [];
const setChildren = (data) => {
    for (let i = 0; i < data.length; i++) {
        children.push(<Option key={i} value={data[i].number}>{data[i].name}-({data[i].number})</Option>);
    }
}

class EditRecruiterProfileModal extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        this.state = {
            loading: false,
            visible: false,
            emailId: email,
            authtoken: auth,
            companyName: companyName,
            current: 0,
            nameLength: 10,
            textLength: 10,
            recruiterDetails: {},
            imageUrl: '',
            imageloading: false,
            updated: false,
            countrycodes: [],
            dupCountrycodes: [],
            recruiterData: {}
            // recruitername: ""
        };
        // const closeModal = this.handleCancel();
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
    }

    componentDidMount() {
        // if (this.props.formValidator)
        //     this.props.formValidator(this.props.form);
        var email = localStorage.getItem('email');
        this.getCountryCodes();
        // this.getRecruiterData(email);
    }
    getCountryCodes = () => {
        this.partnerService.getAllCountryCodes().then((res) => {
            // console.log(res.data, ' its res');
            var countrycodes = { ...this.state.countrycodes };
            countrycodes = res.data;
            this.setState({ countrycodes, dupCountrycodes: res.data });
            setChildren(res.data);
        }).catch((err) => {
            console.log(err);
            message.info('Failed to Load page Please Refresh page');
        })
    }
    getRecruiterData = (email) => {
        this.partnerService.getrecruiterbasicdetails(email).then((d) => {
            console.log("RECRUITER DATA: ",d.data.data)
            if(d.data.status === true)
            {
                this.setState({recruiterData:d.data.data})
            }
        }).catch((err) => {
            console.log(err);
            message.info('Failed to get recruiter data');
        })
    }
    componentWillReceiveProps(props) {
        // if (props.visible && !props.isEdit && !this.state.updated) {
        // }
        console.log("PROPS: ",props.isEdit)
        if ( props.visible && !props.isEdit && props.isPartner === false){
        this.setState({
            // postUrl: props.paymentData.postUrl,
            // paymentData: props.paymentData
            recruiterData: props.recruiterData
        })
    }
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
                message.success(`Uploaded successfully.${d.data.message}..`, 5);
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
                // console.log(fieldValues);

                if (isEdit) {
                    let data = {
                        emailId: fieldValues.mail,
                        recruiterName: fieldValues.name,
                        address: fieldValues.address,
                        countryCode: fieldValues.countrycode,
                        contactNo: fieldValues.contactno,
                        linkedinId: fieldValues.linkedin,
                        location: fieldValues.location,
                        logo: this.state.imageUrl ? this.state.imageUrl : ""
                    };
                    //Call update API
                    console.log("Correct: ",this.props.isEdit)
                    this.partnerService.updaterecruiterdetails(data, data.emailId).then((d) => {
                        message.success(d.data.message, 5);
                        this.setState({ updated: false });
                        // this.props.onClose();
                        this.props.closeModal()
                        this.props.form.resetFields();
                        this.setState({ imageUrl: "" })
                        // this.setState({ recruitername: "" })

                    }).catch((err) => {
                        console.log(err);
                        // this.props.onClose();
                        this.props.closeModal();
                        this.props.form.resetFields();
                        this.setState({ imageUrl: "" })
                        // this.setState({ recruitername: "" })
                        this.errorHandler.customErrorCheck(err);
                        // message.error("Failed up update recruiter details.",5);
                    })
                }
                else {
                    let data = {
                        emailId: fieldValues.mail,
                        password: fieldValues.password,
                        recruitername: fieldValues.name,
                        companyName: fieldValues.companyname,
                        address: fieldValues.address,
                        PartnerAdminEmail: this.state.emailId,
                        linkedinId: fieldValues.linkedin,
                        countryCode: fieldValues.countrycode,
                        contactNo: fieldValues.contactno,
                        location: fieldValues.location,
                        logo: this.state.imageUrl //TODO: update backend
                    };
                    this.partnerService.createrecruiterdetails(data).then((d) => {
                        // this.partnerService.updateRecruiterDetails(data).then((d) => { 
                        //show succes and proceed to close
                        if (d.data.status === true) {
                            message.success(d.data.message, 5);
                        }
                        this.setState({ updated: false });
                        // this.props.onClose();
                        this.props.closeModal()
                        this.props.form.resetFields();
                        this.setState({ imageUrl: "" })
                        // this.setState({ recruitername: "" })
                    }).catch((err) => {
                        // message.error(err.data.message,5);
                        console.log(err);
                        this.setState({ updated: false });
                        // this.props.onClose();
                        this.props.closeModal()
                        this.props.form.resetFields();
                        this.setState({ imageUrl: "" })
                        // this.setState({ recruitername: "" })
                        this.errorHandler.customErrorCheck(err);
                    })
                }
            }
        });
    };

    handleCancel = () => {
        this.setState({ updated: false });
        // this.props.onClose();
        this.props.closeModal()
    };

    handleOnChange = (e, fieldName) => {
        var recruiterDetails = { ...this.state.recruiterDetails };
        // console.log(e.target.value);
        if (fieldName === "name") {
            recruiterDetails.recruitername = e.target.value;
            // this.setState({ textLength: this.state.nameLength - e.target.value.length, recruitername: e.target.value })
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "password") {
            recruiterDetails.password = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "mail") {
            recruiterDetails.emailId = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "countrycode") {
            recruiterDetails.countryCode = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "phonenum") {
            recruiterDetails.contactNo = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "address") {
            recruiterDetails.address = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "linkedin") {
            recruiterDetails.linkedinId = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "location") {
            recruiterDetails.location = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        this.setState({ recruiterDetails: recruiterDetails, updated: true });

        this.props.form.validateFields([fieldName], { force: true }, (err, fieldValues) => {
            if (err) {
                return
            }
            else {
            }
        });
    }

    // onSearch
    onSearch = (value) => {
        return (
            this.setState({
                countrycodes: !value ? [] : this.state.dupCountrycodes.filter(el => {
                    if (el.name.toLowerCase().includes(value.toLowerCase())) {
                        return el;
                    }
                })
            })
        )
    };



    render() {
        // const { loading } = this.state;
        const visible = this.props.visible;
        const { getFieldDecorator } = this.props.form;
        const recruiterData = this.props.recruiterData;
        const imageUrl = this.state.imageUrl !==""?this.state.imageUrl :recruiterData.logo;
        // const imageUrl = this.state.imageUrl;
        isEdit = this.props.isEdit;

        // console.log("recruiter name", recruiterData.recruitername);
        // console.log("recruiter", recruiterData);

        const uploadButton = (
            <div>
                <Icon type={this.state.imageloading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div>
                <Modal
                    visible={visible}
                    destroyOnClose={true}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='40%'
                    className="add-recruiter-modal"
                >
                    <section className="form-v1-container pt-4">
                        <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>Update Recruiter</h3>
                        <hr style={{ border: '2px solid #D45895' }} />

                        <Form
                            {...layout}
                            name="basic"
                            id="clearForm"
                        >
                            <FormItem
                                label="Profile Picture"
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
                                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                    </Upload>
                                )}
                            </FormItem>

                            <FormItem
                                label="Name"
                                name="Name"
                            >
                                {getFieldDecorator(`name`, {
                                    initialValue: recruiterData && recruiterData.recruiterName?recruiterData.recruiterName:"",
                                    rules: [
                                        {
                                            required: true, message: 'Please provide name',
                                        },
                                    ],

                                })(
                                    <Input
                                        maxLength={50}
                                        placeholder="Enter Name"
                                        onChange={e => this.handleOnChange(e, 'name')}
                                    />
                                )}
                            </FormItem>

                            <FormItem
                                label="Company"
                                name="company"
                            >
                                {getFieldDecorator(`companyname`, {
                                    initialValue: recruiterData.companyName,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide company name!',
                                        },
                                    ],

                                })(
                                    <Input disabled={true} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Email Id"
                                name="mail"
                            >
                                {getFieldDecorator(`mail`, {
                                    initialValue: recruiterData.emailId,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide mail id!',
                                        },
                                        {
                                            type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                        }
                                    ],

                                })(
                                    <Input autoComplete="email" disabled={true} placeholder=" Email" onChange={e => this.handleOnChange(e, 'mail')} />
                                )}
                            </FormItem>

                            {/* <FormItem
                                label="Password"
                                name="password"
                                style={{ display: isEdit ? 'none' : '' }}
                            >
                                {getFieldDecorator('password', {
                                    initialValue: recruiterData.password,
                                    rules: [{ required: isEdit ? false : true, message: 'Please input a Password!' }],
                                })(
                                    <Input autoComplete="new-password" prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" onChange={e => this.handleOnChange(e, 'password')} />
                                )}
                            </FormItem> */}

                            <FormItem
                                label="Country Code"
                                name="countrycode"
                            // initialValue="+91"
                            >
                                {getFieldDecorator(`countrycode`, {
                                    initialValue: "India-(+91)",
                                    rules: [
                                        {
                                            required: true, message: 'Please provide Country Code!',
                                        }
                                    ],

                                })(
                                    <AutoComplete style={{ width: 200 }} onSearch={e => this.onSearch(e)} onChange={e => this.handleOnChange(e, 'countrycode')} placeholder="country code">
                                        {this.state.countrycodes.map((el, i) => {
                                            // var value = el.name + '-' + '(' + el.number + ')';
                                            let value = `${el.name}-(${el.number})`
                                            return (
                                                <Option key={el.number} value={value}>{value}</Option>
                                            )
                                        })}
                                    </AutoComplete>
                                    // <Select style={{ width: 200 }} onChange={e => this.handleOnChange(e, 'countrycode')} onSearch={e => this.onSearch(e)}>
                                    //     {children}
                                    // </Select>
                                )}
                            </FormItem>

                            <FormItem
                                label="Contact No"
                                name="contactno"
                            >
                                {getFieldDecorator(`contactno`, {
                                    initialValue: recruiterData.contactNo,
                                    rules: [
                                        {
                                            required: true, message: 'Please provide contact number!',
                                        },
                                        {
                                            message: 'Please Fill Valid Mobile Number ',
                                            pattern: /^[0-9]{4,13}$/
                                        }
                                    ],

                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'phonenum')} placeholder="phone num" />
                                )}
                            </FormItem>

                            <FormItem
                                label="Recruiter Location"
                                name="RecruiterLocation"
                            >
                                {getFieldDecorator(`location`, {
                                    initialValue: recruiterData.location,
                                    rules: [
                                        {
                                            required: true, message: 'Please input location!',
                                        },
                                    ],

                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'location')} />
                                )}
                            </FormItem>
                            <FormItem
                                label="Recruiter Address"
                                name="RecruiterAddress"
                            >
                                {getFieldDecorator(`address`, {
                                    initialValue: recruiterData.address,
                                    rules: [
                                        {
                                            required: true, message: 'Please input your Recruiter Address!',
                                        },
                                    ],
                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'address')} />
                                )}
                            </FormItem>

                            <FormItem
                                label="Recruiter LinkedIn"
                                name="RecruiterLinkedIn"
                            >
                                {getFieldDecorator(`linkedin`, {
                                    initialValue: recruiterData.linkedinId,
                                    rules: [
                                        {
                                            required: false, message: 'Please input your Recruiter Address!',
                                        },
                                    ],

                                })(
                                    <Input onChange={e => this.handleOnChange(e, 'linkedin')} />
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

const WrappedEditRecruiterProfileModal = Form.create()(withRouter(EditRecruiterProfileModal));

export default WrappedEditRecruiterProfileModal;
