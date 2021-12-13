import { Button, Checkbox, Form, Input, Modal, Select, AutoComplete, message, InputNumber, Radio} from 'antd';
import DEMO from 'constants/demoData';
import React from 'react';
import { withRouter } from "react-router-dom";
import TermsPage from 'routes/page/routes/terms/';
import SignUp from "../../../../../services/loginService.js";
import partnerService from '../../../../../services/partnerService';
import {  isBrowser, isMobile } from 'react-device-detect';

// const InputGroup = Input.Group;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

// // Mobile Num Validator
// const mobileNoValidator = {
//   pattern: "^\d{4}-\d{3}-\d{4}$"
// }

const children = [];
const setChildren = (data) => {
  for (let i = 0; i < data.length; i++) {
    children.push(<Option key={i} value={data[i].number}>{data[i].name}-({data[i].number})</Option>);
  }
}

// GstIn Validator
// const gstinValidator = {
//   pattern: "\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}"
// }

const menu = ['Hiring Partner', 'Training Partner', 'TPO(Training and Placement Officer)'] //, 'Placement office'

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnDisable: true,
      confirmDirty: false,
      showModal: false,
      termsUncheck: false,
      countrycodes: [],
      dupCountrycodes: [],
      CountryCode: '',
      Phonenum: '',
      defaultcountrycode: 'India-(+91)',
      showRecruiterCount: false,
      type:"Hiring Partner"
    };
    this.signup = new SignUp();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.TermsCheck = this.TermsCheck.bind(this);
    this.partnerService = new partnerService()
    this.getCountryCodes = this.getCountryCodes.bind(this);
  }

  componentDidMount() {
    if (this.props.formValidator)
      this.props.formValidator(this.props.form);
    this.getCountryCodes();
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


  // onSearch
  onSearch = (value) => {
    this.setState({
      countrycodes: !value ? [] : this.state.dupCountrycodes.filter(el => el.name.toLowerCase().includes(value.toLowerCase()))
    })

  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // console.log(err,values,' its err/values');
      if (err) {
        return;
      }
      else {
        // values.countrycode = this.state.CountryCode;
        // console.log(values, ' its values');
        if(values.partnertype === "Hiring Partner")
        {
        let data = {
          address: values.address,
          companyName: values.companyName,
          contactNo: values.contactNo,
          countrycode: values.countrycode,
          emailId: values.emailId.toLowerCase(),
          gstin: values.gstin,
          partnertype: values.partnertype,
          perferredContactName: values.perferredContactName,
          recruiternos: values.recruiternos,
          // signup-agreement: values.signup-agreement
        }
        this.signup.signUpService(data).then((d) => {
          this.eventLogger(d.data.emailId)
          Modal.success({
            //   title: 'This is a warning message',
            content: (
              <div>
                <p>Account created successfully, Please check your inbox.</p>
              </div>
            ),
            onOk: () => {
              this.props.history.push('/user/login');
            }
          });
        }).catch((err) => {
          if (err.response.data.message === 'Company Name Already Registered') {
            this.setState({ validateCompanyStatus: 'error', Companyerrormsg: err.response.data.message });
          }
          else {
            this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
          }
          console.log(err, ' its err');
        })
      }
      else{
        let url = "http://equip.stage.shenzyn.com/#/home?ref="
        let tenant = values.companyName
        let tenantName = tenant.replace(/ /g, "_")
        let tenantUrl = url.concat(tenantName)
  
        let data = {
          companyAddress: values.address,
          tenantName: values.companyName,
          phoneNo: values.contactNo,
          countryCode: values.countrycode,
          adminEmailId: values.emailId.toLowerCase(),
          adminName: values.perferredContactName,
          tenantURL: tenantUrl,
          // signup-agreement: values.signup-agreement
        }
        this.signup.trainingSignUpService(data).then((d) => {
          Modal.success({
            //   title: 'This is a warning message',
            content: (
              <div>
                <p>Account created successfully, Please check your inbox.</p>
              </div>
            ),
            onOk: () => {
              window.location.href="http://equip-admin.stage.shenzyn.com/#/tenantLogin"
            }
          });
        }).catch((err) => {
          if (err.response.data.message === 'Company Name Already Registered') {
            this.setState({ validateCompanyStatus: 'error', Companyerrormsg: err.response.data.message });
          }
          else {
            this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
          }
          console.log(err, ' its err');
        })
      }
      }
    });
  }
  eventLogger = (email) => {
    let emailId = email
    let data = {
      emailId: emailId,
      eventCategory: 'USEREVENT',
      eventType: 'register',
      userCategory: 'partner',
      actionPerformedBy: emailId,
      eventTimeStamp: new Date(),
      userAgent: isBrowser ? "browser" : "mobile"
    }
    this.signup.eventLoggerPartnerSignup(data).then((d) => {
      if (d.data.status === true) {
        console.log("Event logged successfully")
      }
    }).catch((err) => {
      console.log("Event logging error")
    })
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  // GST Validator
  checkGST = (rule, value, callback) => {
    var check = this.checksum(value)
    if (typeof check === "boolean") {
      // console.log(check, ' its inside if');
      if (check === true) {
        callback();
      }
      else if (check === false) {
        callback('Please Enter Valid GST Number');
      }
    }
    else if (typeof check === "number") {
      callback('Please Enter Valid GST Number');
    }
  }

  validategstnumber(g) {
    let a = 65, b = 55, c = 36;
    var p;
    return Array['from'](g).reduce((i, j, k, g) => {
      p = (p = (j.charCodeAt(0) < a ? parseInt(j) : j.charCodeAt(0) - b) * (k % 2 + 1)) > c ? 1 + (p - c) : p;
      return k < 14 ? i + p : j === ((c = (c - (i % c))) < 10 ? c : String.fromCharCode(c + b));
    }, 0);
  }

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  showTnC() {
    this.setState({ showModal: true });
  }
  closeModal() {
    this.setState({ showModal: false });
  }

  // onChange = (value, type) => {
  //   if (value && type) {
  //     switch (type) {
  //       case 'countrycode':
  //         this.ValidatePhoneNum(value, type)
  //         break;
  //       case 'phonenum':
  //         this.ValidatePhoneNum(value, type);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }

  // ValidatePhoneNum = (value, type) => {
  //   let numberisValid = /^[0-9]{4,13}$/;
  //   if (type === 'countrycode') {
  //     if (value) {
  //       this.props.form.setFields({
  //         'contactNo': {
  //           value: '',
  //           errors: '',
  //         },
  //       });
  //       this.setState({ CountryCode: value });
  //     }
  //   }
  //   else if (type === "phonenum") {
  //     if (this.state.CountryCode === '') {
  //       this.props.form.setFields({
  //         'contactNo': {
  //           value: '',
  //           errors: [new Error('Please Fill Country code')],
  //         },
  //       });
  //       // console.log(' CountryCode is Empty');

  //     }
  //     else if (!numberisValid.test(value)) {
  //       this.props.form.setFields({
  //         'contactNo': {
  //           value: '',
  //           errors: [new Error('Please Fill Valid Contact Number')],
  //         },
  //       });
  //     }
  //     else {
  //       this.props.form.setFields({
  //         'contactNo': {
  //           value: value,
  //           errors: '',
  //         },
  //       });
  //       this.setState({ Phonenum: value })
  //     }
  //   }

  // }

  TermsCheck = (e) => {
    if (e.target.checked === true) {
      this.setState({ btnDisable: false, termsUncheck: e.target.checked })
    }
    else if (e.target.checked === false) {
      this.setState({ btnDisable: true, termsUncheck: e.target.checked })
    }
  }

  handleChange = (value) => {
    if (value) {
      var check = this.validategstnumber(value)
      if (typeof check === "boolean") {
        // console.log(check, ' its inside if');
        if (check === true) {
          this.props.form.setFields({
            'gstin': {
              value: value,
              errors: '',
            },
          });
        }
        else if (check === false) {
          this.props.form.setFields({
            'gstin': {
              value: '',
              errors: [new Error('Please Enter Valid GST Number')],
            },
          });
          // callback('Please Enter Valid GST Number');
        }
      }
      else if (typeof check === "number") {
        this.props.form.setFields({
          'gstin': {
            value: '',
            errors: [new Error('Please Enter Valid GST Number')],
          },
        });
        // callback('Please Enter Valid GST Number');
      }
    }
  }

  setRecruiterCount = (partnertype) => {
    // console.log(partnertype, ' its data');
    if (partnertype === "Hiring Partner") {
      this.setState({ showRecruiterCount: true });
    }
    else {
      this.setState({ showRecruiterCount: false });
    }
  }
  customMethodValidate = (rule, value, callback) => {
    const form = this.props.form;
    if(value!==''&&!(/^[0-9]{7,13}$/).test(value))
    {
      callback('Please enter valid contact number');
    }
    else if(value!==''&&form.getFieldValue('countrycode')==='India-(+91)')
    {
      if (!(/^\d{10}$/).test(value)) {
        callback('Phone number should be 10 digits!');
      }
    }
    callback();
  }

  SelectedPartner = (e) =>{
    // console.log(e.target.value);
  this.setState({type:e.target.value})
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 18 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 21 },
        sm: { span: 16 },
      },
    };
    // const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 24,
    //       offset: 0,
    //     },
    //     sm: {
    //       span: 14,
    //       offset: 6,
    //     },
    //   },
    // };

    return (
      <section className="form-v1-container">
        <h1 className="hero-title">Partner’s Registration</h1>
        <h6 className="lead">Partner, and grow with us</h6>
        {/* <h6 className="lead">Welcome to the Shenzyn Partner Extranet Portal.
        <br />By inserting your data below you can register as member for Shenzyn.</h6> */}

        {/* <a onClick={this.linkedIn} className="btn btn-block icon-btn-v2 btn-linkedin"><Icon type="linkedin" /><span className="btn-text">SignUp with LinkedIN</span></a>
        <div className="divider divider-with-content my-4"><span className="divider-inner-content">OR</span></div> */}
        <Form onSubmit={this.handleSubmit} className="form-v1">
        <FormItem
              {...formItemLayout}
              label="Partner Type"
              style={{ display: 'block', marginBottom: 0 }}
            >
              {getFieldDecorator('partnertype', {
                initialValue: this.state.type,
                rules: [{
                  required: true, message: 'Please select partner type',
                }],
              })(
        <RadioGroup onChange={this.SelectedPartner}>
          {/* onChange={this.SelectedPartner} */}
            <Radio value="Hiring Partner">Hiring Partner</Radio>
            <Radio value="Training Partner">Training Partner</Radio>
            </RadioGroup>)}
            </FormItem>
          <FormItem
            {...formItemLayout}
            validateStatus={this.state.validateCompanyStatus}
            help={this.state.Companyerrormsg}
            label={(
              <span>
                Company Name&nbsp;
                {/* <Tooltip title="What do you want other to call you?">
                  <Icon type="question-circle-o" />
                </Tooltip> */}
              </span>
            )}
            hasFeedback
          >
            {getFieldDecorator('companyName', {
              initialValue: '',
              rules: [{ required: true, message: 'Please input your company name!', whitespace: true }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Company Address"
            >
            {getFieldDecorator('address', {
              initialValue: '',
              rules: [
                {
                  required: true, message: 'Please input your company address!',
                }],
            })(
              <TextArea
                // placeholder="A brief bio to pitch yourself"
                rows={4} />
            )}
          </FormItem>

          <FormItem 
          {...formItemLayout}
          label="Contact Details"
          className="mb-0 "
          required>
            
          <div className="row">
            <div className="col-md-3 col-lg-3 col-sm-3">
            <FormItem
              
              className="mb-0"
 
             >
               {getFieldDecorator('countrycode', {
                 initialValue: this.state.defaultcountrycode,
                 rules: [
 
                   {
                     required: true, message: "Country code is required"
 
                   },
                 ],
               })(
                   <AutoComplete style={{ width: 110, height: 50 }} onSearch={e => this.onSearch(e)} placeholder="country code">
                   {this.state.countrycodes.map((el, i) => {
                     // var value = el.name + '-' + '(' + el.number + ')'
                     let value = `${el.name}-(${el.number})`
                     return (
                       <Option key={el.number} value={value}>{value}</Option>
                     )
                   })}
                 </AutoComplete> 
               )}
              
             </FormItem>
            </div>
         <div className="col-md-6 col-lg-9 col-sm-9">
         <FormItem>
               {getFieldDecorator(`contactNo`, {
                 initialValue: '',
                 rules: [
                   {
                     required: true, message: 'Please enter contact no',
                   },
                   {
                     validator: this.customMethodValidate,
                   }
                 ],
 
               })(
                 <Input placeholder="phone number" style={{ width: "100%", height: 33 }} />
               )}
             </FormItem>
         </div>
               
                  
          </div>
        
                  
            
            {/* onChange={e => this.onChange(e, 'countrycode')} */}
            {/* <FormItem
              style={{ display: 'inline-block' }}>
              {getFieldDecorator(`placeholderText`, {

              })(
                <span>&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp; </span>
              )}
            </FormItem> */}
            
            {/* onChange={e => this.onChange(e, 'phonenum')} */}

          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Contact Person Name"
            className="mt-0"

          >
            {getFieldDecorator('perferredContactName', {
              initialValue: '',
              rules: [
                {
                  required: true, message: 'Please input the name of the person to contact!',
                },
                {
                  message: 'Please enter a valid name',
                  pattern: /^[a-zA-Z ]*$/
                }
              ],
            })(
              <Input />
            )}
          </FormItem>

          <FormItem
            validateStatus={this.state.validateStatus}
            help={this.state.errormsg}
            {...formItemLayout}
            label="E-mail"
            hasFeedback
          >
            {getFieldDecorator('emailId', {
              initialValue: '',
              rules: [{
                type: 'email', message: 'The input is not valid e-mail!',
              }, {
                required: true, message: 'Please input your e-mail!',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="GSTIN"
            hasFeedback
            style={{ display: this.state.type==="Hiring Partner" ? 'block' : 'none' }}
          >
            {getFieldDecorator('gstin', {
              initialValue: '',
              rules: [{
                required: false, message: 'Please input your GSTIN!',
              },
                // {
                //   validator: this.checkGST,
                // }
              ],
            })(
              <Input onChange={e => this.handleChange(e)} type="text" />
            )}
          </FormItem>
          {/* Partner Type */}
          <FormItem>
            {/* <FormItem
              {...formItemLayout}
              label="Partner Type"
              style={{ display: 'block', marginBottom: 0 }}
            >
              {getFieldDecorator('partnertype', {
                initialValue: '',
                rules: [{
                  required: true, message: 'Please select partner type',
                }],
              })(
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select partner type"
                  // defaultValue="Select Partner Type"
                  optionFilterProp="children"
                  onChange={(e) => this.setRecruiterCount(e)}
                >
                  {menu.map((st, i) => {
                    return (
                      <Option key={i} value={st}>{st}</Option>
                    )
                  })}
                </Select>
                // {...gstinValidator}
              )}
            </FormItem> */}
            <FormItem
              style={{ display: this.state.type==="Hiring Partner" ? 'inline-block' : 'none' }}
              >
              {getFieldDecorator(`partnertypespace`, {

              })(
                <span className="mr-2 text-black">Recruiter Count -</span>
              )}
            </FormItem>
            <FormItem
              
              style={{ display: this.state.type==="Hiring Partner" ? 'inline-block' : 'none' }}
              // label="Recruiter Count"
            >
              {getFieldDecorator('recruiternos', {
                initialValue: '',
                rules: [{
                  required: false, message: 'Please input your Required Recruiters Count',
                },
                  // {
                  //   validator: this.checkGST,
                  // }
                ],
              })(
              
                <InputNumber type="text" placeholder="nos" min={0}/>
        
                
              )}
            </FormItem>



          </FormItem>



          <FormItem {...formItemLayout} style={{ marginBottom: 8 }}>
            {getFieldDecorator('signup-agreement', {
              initialValue: this.state.termsUncheck,
              rules: [{
                required: true, message: 'Please accept the agreement!',
              }],
            })(
              <Checkbox onClick={(e) => this.TermsCheck(e)}>I have read the <a id="Partner_SignUp_Terms&Conditions" href={DEMO.link} onClick={this.showTnC.bind(this)}> Terms and Conditions</a></Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout}>
            <Button id="Partner_User_SignUp_Form" disabled={this.state.btnDisable} type="primary" htmlType="submit" className="btn-cta">Sign Up</Button>
          </FormItem>
          <ModalTnC visible={this.state.showModal} callbackFn={this.closeModal.bind(this)} />
        </Form>
        <p className="additional-info">Already have an account? <a id="Partner_signup_login" href={DEMO.login}>Log In</a></p>
      </section>
    );
  }
}
class ModalTnC extends React.Component {
  state = { visible: false }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
    this.props.callbackFn();
  }
  render() {
    return (
      <div>

        <Modal
          visible={this.props.visible}
          onCancel={this.handleCancel}
          footer={null}
          className="custom-modal-v1"
        >
          <TermsPage />
        </Modal>
      </div>
    );
  }
}
const WrappedRegistrationForm = Form.create()(withRouter(RegistrationForm));


export default WrappedRegistrationForm;
