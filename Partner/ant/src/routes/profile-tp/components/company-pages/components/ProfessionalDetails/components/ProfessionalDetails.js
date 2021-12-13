import {  Input, Form, Select} from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from '../../../../../../../services/partnerService';
import errorHandler from '../../../../../../../ErrorHandler/ErrorHandler';

const { TextArea } = Input;
const FormItem = Form.Item;
// var isEdit = false;
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
// const StyleSheet_DefaultButton = {
//     color: '#fff',
//     fontSize: '15px',
//     background: '#ef5869',
//     border: '1px solid #E3E3E3',
//     borderRadius: '8px',
//     width: '120px',
//     height: '40px',
//     margin: '4px 8px'
// }
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
// const tailLayout = {
//     wrapperCol: {
//         offset: 19,
//         span: 16,
//     },
// };
// const customEmailValidator = (rule, value, callback) => {
//     var re = /\S+@\S+\.\S+/;
//     var validEmail = re.test(value);
//     // console.log(validEmail);
//     // console.log(value);
//     if (!validEmail) {
//         callback(rule.message);
//     } // Always return a callback, otherwise validateFields cannot respond
//     callback();
// }


class AdvacnceDetails extends React.Component {

    constructor(props) {
        super(props);
        const email = localStorage.getItem('email');
        const companyName = localStorage.getItem('companyName');
        const partnerAdmin = localStorage.getItem('isPartner');
        this.state = {
            emailId:email,
            companyName:companyName,
            partnerAdmin:partnerAdmin,
            confirmDirty: false,
            loading: false,
            showModal: false,
            professionalDetails: {}

        }
        this.handleOnChange = this.handleOnChange.bind(this);
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
    }

    componentDidMount() {

        if (this.props.formValidator)
            this.props.formValidator(this.props.form);
        // var jsonObj = {
        //     emailId: email
        // }

        this.partnerService.getBasicDetails().then((res) => {
            if (res.data.status === true) {
                // console.log(res.data,' its personalDetails');
                var professionalDetails = { ...this.state.professionalDetails };
                professionalDetails.exp = res.data.data.TrainingPartnerDetails.PastTrainings_or_Experience || 0;
                professionalDetails.about = res.data.data.TrainingPartnerDetails.TrainerDescription || "";
                professionalDetails.training_areas = res.data.data.TrainingPartnerDetails.TrainingAreas || [];
                //  console.log(professionalDetails,' its filled');

                this.setState({ professionalDetails });
            }

        }).catch((err) => {
            console.log(err, ' its failed to get personal details');
            this.errorHandler.customErrorCheck(err);
        })
    }


    // On Change Fields
    handleOnChange = (e, fieldName) => {
        var professionalDetails = { ...this.state.professionalDetails };
        // console.log(e,' ',fieldName);
        if (fieldName === "about") {
            professionalDetails.about = e.target.value;
            this.props.form.setFieldsValue({
                [fieldName]: e.target.value
            });

        }
        else if (fieldName === "exp") {
            // console.log(' its inside ',fieldName);
            professionalDetails.exp = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        else if (fieldName === "training_areas") {
            // console.log(' its inside ',fieldName);
            professionalDetails.training_areas = e;
            this.props.form.setFieldsValue({
                [fieldName]: e
            });
        }
        professionalDetails.email =this.state.emailId;
        professionalDetails.companyName = this.state.companyName;
        professionalDetails.isPartner = this.state.partnerAdmin;
        // console.log(professionalDetails,' its professionalDetails');

        this.setState({ professionalDetails });

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
        // const visible = this.props.visible;
        const { getFieldDecorator } = this.props.form;
        // const recruiterData = this.props.editRecruiter;
        // const imageUrl = this.state.imageUrl ? this.state.imageUrl : recruiterData.logo;
        // var isEdit = this.props.isEdit;
        // const uploadButton = (
        //     <div>
        //         <Icon type={this.state.imageloading ? 'loading' : 'plus'} />
        //         <div className="ant-upload-text">Upload</div>
        //     </div>
        // );

        return (
            <section className="form-v1-container">
                <Form
                    {...layout}
                    name="basic"
                >

                    <FormItem
                        label="About Yourself"
                        name=""
                    >
                        {getFieldDecorator(`about`, {
                            initialValue: this.state.professionalDetails.about,
                            rules: [
                                {
                                    required: true, message: 'About Yourself',
                                },
                            ],

                        })(
                            <TextArea onChange={e => this.handleOnChange(e, 'about')} rows={4} />
                        )}
                    </FormItem>

                    <FormItem
                        label="Past Experience"
                        name="exp"
                    >
                        {getFieldDecorator(`exp`, {
                            initialValue: this.state.professionalDetails.exp,
                            rules: [
                                {
                                    required: true, message: 'Please fill Your Experience',
                                }
                            ],

                        })(
                            <TextArea onChange={e => this.handleOnChange(e, 'exp')} />
                        )}
                    </FormItem>

                    <FormItem
                        // {...formItemLayout}
                        label="Trainings provided on"

                    >
                        {getFieldDecorator(`training_areas`, {
                            initialValue: this.state.professionalDetails.training_areas,
                            rules: [
                                {
                                    required: true, message: 'Please input Your Training Areas',
                                }],
                        })(
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                searchPlaceholder="start typing training areas"
                                // defaultValue={pre.companyName}
                                // onChange={(e) => this.onChange(e, 'preferredCompanies')}
                                onChange={(e) => this.handleOnChange(e, 'training_areas')}
                            >
                                {/* {children} */}
                            </Select>
                        )}
                    </FormItem>

                    {/* <FormItem
                        label="Training Zones"
                        name="mail"
                    >
                        {getFieldDecorator(`mail`, {
                            // initialValue: recruiterData.emailId,
                            rules: [
                                {
                                    required: true, message: 'Please provide mail id!',
                                },
                                {
                                    type: "custom", name: "EmailVal", validator: customEmailValidator, message: 'Please provide a valid email id!'
                                }
                            ],

                        })(
                            <Input />
                        )}
                    </FormItem> */}


                    {/* 
                    <Form.Item {...tailLayout}>
                        <Button style={StyleSheet_DefaultButton} htmlType="submit" onClick={() => this.handleOk()}>
                            Submit
                        </Button>
                    </Form.Item> */}
                </Form>
            </section>
        );
    }
}

const WrappedAdvacnceDetails = Form.create()(withRouter(AdvacnceDetails));
export default WrappedAdvacnceDetails;