import { Input, message, Form, Upload, AutoComplete, Select } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from '../../../../../../../services/partnerService';
import errorHandler from '../../../../../../../ErrorHandler/ErrorHandler';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const layout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12,
    },
};
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class JobDetails extends React.Component {
    constructor(props) {
        super(props);
        const email = localStorage.getItem('email');
        const companyName = localStorage.getItem('companyName');
        const partnerAdmin = localStorage.getItem('isPartner');
        this.state = {
            emailId: email,
            companyName: companyName,
            partnerAdmin: partnerAdmin,
            confirmDirty: false,
            loading: false,
            showModal: false,
            // companyName: '',
            personalDetails: {},
            imageUrl: '',
            countrycodes: [],
            dupCountrycodes: []

        }
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler()
    }


    componentDidMount() {

        if (this.props.formValidator)
            this.props.formValidator(this.props.form);
        // var jsonObj = {
        //     emailId: email
        //   }
        this.getCountryCodes();
        this.partnerService.getBasicDetails().then((res) => {
            if (res.data.status === true) {
                // console.log(res.data,' its personalDetails');
                var personalDetails = { ...this.state.personalDetails };
                personalDetails.name = res.data.data.TrainingPartnerDetails.name || "";
                personalDetails.countrycode = res.data.data.countryCode || "";
                personalDetails.contactno = res.data.data.contactNo || "";
                personalDetails.location = res.data.data.TrainingPartnerDetails.location || "";
                personalDetails.address = res.data.data.TrainingPartnerDetails.address || "";
                //  personalDetails.imageUrl = res.data.data.TrainingPartnerDetails.imgURL || "";
                var imgUrl = res.data.data.TrainingPartnerDetails.imgURL || ""
                //  console.log(personalDetails,' its filled');

                this.setState({ personalDetails, imageUrl: imgUrl });
            }

        }).catch((err) => {
            console.log(err, ' its failed to get personal details');
            this.errorHandler.customErrorCheck(err);
        })

    }

    getCountryCodes = () => {
        this.partnerService.getAllCountryCodes().then((res) => {
            // console.log(res.data, ' its res');
            var countrycodes = { ...this.state.countrycodes };
            countrycodes = res.data;
            this.setState({ countrycodes, dupCountrycodes: res.data });
            // setChildren(res.data);
        }).catch((err) => {
            console.log(err);
            message.info('Failed to Load page Please Refresh page');
        })
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
                this.props.form.setFieldsValue({
                    profilePicture: d.data.fileUrl
                });
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


    // On Change Fields
    handleOnChange = (e, fieldName) => {
        var personalDetails = { ...this.state.personalDetails };
        // console.log(e);
        // console.log(this.props.form,' its forms ');
        if (fieldName === "name") {
            personalDetails.name = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });

        }
        else if (fieldName === "countrycode") {
            personalDetails.countryCode = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "contactno") {
            // console.log(' its inside ',fieldName);
            personalDetails.phone = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "location") {
            // console.log(' its inside ',fieldName);
            personalDetails.location = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        else if (fieldName === "address") {
            // console.log(' its inside ',fieldName);
            personalDetails.address = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });
        }
        personalDetails.email = this.state.emailId;
        personalDetails.companyName = this.state.companyName;
        personalDetails.isPartner = this.state.partnerAdmin;
        // console.log(personalDetails,' its personalDetails');

        this.setState({ personalDetails });

        this.props.form.validateFields([fieldName], { force: true }, (err, fieldValues) => {
            if (err) {
                return
            }
            else {
            }
        });
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            return values;
        })
    }


    // onSearch
    onSearch = (value) => {
        return (
            this.setState({
                countrycodes: !value ? [] : this.state.dupCountrycodes.forEach(el => {
                    if (el.name.toLowerCase().includes(value.toLowerCase())) {
                        return el;
                    }
                    else if (el.number.includes(value)) {
                        return el;
                    }
                })
            })
        )
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <section className="form-v1-container">
                <Form onSubmit={this.handleSubmit}
                    {...layout}
                    name="basic"
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
                                <img src={this.state.imageUrl ? this.state.imageUrl : 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png'} alt="avatar" style={{ width: '100%' }} />
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        label="Name"
                        name="name"
                    >
                        {getFieldDecorator(`name`, {
                            initialValue: this.state.personalDetails.name,
                            rules: [
                                {
                                    required: false, message: 'Please provide name!',
                                }
                            ],

                        })(
                            <Input onChange={e => this.handleOnChange(e, 'name')} />
                        )}
                    </FormItem>
                    <FormItem
                        label="Email ID"
                        name="mail"
                    >
                        {getFieldDecorator(`email`, {
                            initialValue: this.state.emailId,
                            rules: [
                                {
                                    required: false, message: 'Please provide mail id!',
                                },
                            ],

                        })(
                            <Input disabled={true} />
                        )}
                    </FormItem>

                    <FormItem
                        label="Company Name"
                        name="companyName"
                    >
                        {getFieldDecorator(`companyName`, {
                            initialValue: this.state.companyName,
                            rules: [

                            ],

                        })(
                            <Input disabled={true} />
                        )}
                    </FormItem>
                    <FormItem
                        label="Country Codes"
                        name="countrycode"
                    >
                        {getFieldDecorator(`countrycode`, {
                            initialValue: this.state.personalDetails.countrycode || 'India-(+91)',
                            rules: [
                                {
                                    required: false, message: 'Please provide Country Code!',
                                }
                            ],

                        })(
                            <AutoComplete style={{ width: 'auto' }} onSearch={e => this.onSearch(e)} onChange={e => this.handleOnChange(e, 'countrycode')} placeholder="country code">
                                {this.state.countrycodes.map((el) => {
                                    let value = `${el.name}-(${el.number})`
                                    return (
                                        <Option key={el.number} value={value}>{value}</Option>
                                    )
                                })}
                            </AutoComplete>
                        )}
                    </FormItem>
                    <FormItem
                        label="Contact No"
                        name="contactno"
                    >
                        {getFieldDecorator(`contactno`, {
                            initialValue: this.state.personalDetails.contactno,
                            rules: [
                                {
                                    required: false, message: 'Please enter contact number!',
                                },
                                {
                                    message: 'Please enter valid contact Number ',
                                    pattern: /^[0-9]{4,13}$/
                                }

                            ],

                        })(
                            <Input onChange={e => this.handleOnChange(e, 'contactno')} style={{ width: 'auto' }} />
                        )}
                    </FormItem>

                    <FormItem
                        label="Location"
                        name="location"
                    >
                        {getFieldDecorator(`location`, {
                            initialValue: this.state.personalDetails.location,
                            rules: [
                                {
                                    required: false, message: 'Please input your Location!',
                                },
                            ],

                        })(
                            <Input onChange={e => this.handleOnChange(e, 'location')} />
                        )}
                    </FormItem>

                    <FormItem
                        label="Address"
                        name="Address"
                    >
                        {getFieldDecorator(`address`, {
                            initialValue: this.state.personalDetails.address,
                            rules: [
                                {
                                    required: false, message: 'Please input Your Address!',
                                },
                            ],

                        })(
                            <TextArea onChange={e => this.handleOnChange(e, 'address')} rows={4} />
                        )}
                    </FormItem>

                </Form>
            </section>
        );
    }
}

const WrappedEducationDetails = Form.create()(withRouter(JobDetails));
export default WrappedEducationDetails;