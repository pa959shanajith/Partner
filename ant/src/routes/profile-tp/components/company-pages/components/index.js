import { Button, Steps, message } from 'antd';
import React from 'react';
import partnerService from '../../../../../services/partnerService';
import PersonalDetails from './PersonalDetails/index';
import ProfessionalDetails from './ProfessionalDetails/index';
import { withRouter } from "react-router-dom";

const Step = Steps.Step;
const closeModal = true;
// var prop;
// var saveDraft;

class JobPost extends React.Component {
  constructor(props) {
    super(props);
    // prop = props;
    // saveDraft = false;
    // approveJobPost = false;
    // leftBtnTxt = "Save Draft";
    this.PersonalDetailsref = React.createRef();
    this.ProfessionalDetailsref = React.createRef();
    this.partnerSvc = new partnerService();
    this.handleChange = this.handleChange.bind(this);
    // this.closeModal = true
    this.state = {
      PersonalDetails: {},
      ProfessionalDetails: {},
      approveJobPost: false,
      current: 0,
      steps: [
        // {
        //   title: 'Professional Details',
        //   content: <  ProfessionalDetails ref={this.ProfessionalDetailsref} setADState={this.updateADState} />,
        // },
        {
          title: 'Personal Details',
          content: <PersonalDetails ref={this.PersonalDetailsref} setBDState={this.updateBDState} />,
        },
        {
          title: 'Professional Details',
          content: <  ProfessionalDetails ref={this.ProfessionalDetailsref} closeModal={closeModal} setADState={this.updateADState} />,
        }
      ],
    };
  }
  componentDidMount() {
    // console.log(this.state);
    var forApproval = JSON.parse(localStorage.getItem("approveJob"));
    if (forApproval === true) {
      // this.leftBtnTxt = "Approve Job Post";
      // console.log("For Approval")
      this.setState({ approveJobPost: true });
    }
  }
  // componentWillMount() {
  //   // console.log(this.state);
  // }
  handleChange = () => {
    //this.setState({ EducationDetails: [] });
  }
  updateBDState = (s) => {
    this.setState({ PersonalDetails: [] });
  }

  updateADState = (s) => {
    this.setState({ ProfessionalDetails: [] });
  }

  next() {
    var validated = false;
    switch (this.state.current) {
      case 0:
        this.PersonalDetailsref.current.validateFields((err, fieldValues) => {
          if (err) {
            return
          }
          else {
            var PersonalDetails = { ...this.state.PersonalDetails };
            // console.log(fieldValues);
            PersonalDetails.profilePicture = fieldValues.profilePicture;
            PersonalDetails.name = fieldValues.name;
            PersonalDetails.email = fieldValues.email;
            PersonalDetails.companyName = fieldValues.companyName;
            PersonalDetails.countrycode = fieldValues.countrycode;
            PersonalDetails.contactno = fieldValues.contactno;
            PersonalDetails.address = fieldValues.address;
            PersonalDetails.location = fieldValues.location;

            let data = {
              "email": PersonalDetails.email,
              "companyName": PersonalDetails.companyName,
              "name": PersonalDetails.name,
              "address": PersonalDetails.address,
              "countrycode": PersonalDetails.countrycode,
              "contactno": PersonalDetails.contactno,
              "location": PersonalDetails.location,
              "imgURL": PersonalDetails.profilePicture
            }
            // console.log(data, ' its PersonalDetails ', PersonalDetails);

            this.partnerSvc.createTrainingPartner(data).then((d) => {

              // console.log(d,' its d');
              if (d.data.status === true) {
                message.success("Personal Details Saved.", 5);
                const current = this.state.current + 1;
                this.setState({ current });
              }

            }).catch((err) => {
              console.log(err, 'error while saving Personal details');
              //Show error handler and return
              message.error("Failed to save Personal details.", 5);
              return;
            })
            //validated = true;
          }
        })
        break;
      case 1:
        this.ProfessionalDetailsref.current.validateFields((err, fieldValues) => {
          if (err) {
            return
          }
          else {
            var ProfessionalDetails = { ...this.state.ProfessionalDetails };
            // console.log(fieldValues,' its case 1');
            ProfessionalDetails.about = fieldValues.about;
            ProfessionalDetails.companyName = localStorage.getItem('companyName');
            ProfessionalDetails.email = localStorage.getItem('email');
            ProfessionalDetails.exp = fieldValues.exp;
            ProfessionalDetails.isPartner = fieldValues.isPartner;
            ProfessionalDetails.training_areas = fieldValues.training_areas;

            let data = {
              "about": ProfessionalDetails.about,
              "companyName": ProfessionalDetails.companyName,
              "email": ProfessionalDetails.email,
              "exp": ProfessionalDetails.exp,
              "isPartner": ProfessionalDetails.isPartner,
              "training_areas": ProfessionalDetails.training_areas
            }
            this.partnerSvc.createProfessionDetails(data).then((d) => {
              // console.log(d,' its d');

              if (d.data.status === true) {
                message.success('Professional deatails Updated Successfully', 5);
                this.props.closeModal();
                this.props.history.push('/app/dashboard-tp');
                // const current = this.state.current + 1;
                this.setState({ current: 0 });
              }
            }).catch((err) => {
              console.log(err, 'error saving company details');
              //Show error handler and return
              message.error("Failed to save company details.", 5);
              return;
            })
            // validated = true;
          }
        })
        break;
      default:
        break;
      // code block
    }
    if (validated) {
      //   const current = this.state.current + 1;
      //   this.setState({ current });
      var prop = { ...this.props }
      prop.history.push("/dashboard-tp");
    }
  }

  prev() { // No action/server call required on previous
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current, steps } = this.state;
    // const { prop } = this.props;
    return (
      <div className="ui-animate">
        <section className="container-fluid container-mw-xxl chapter page-icons">
          <article className="trainer-profile demo-style-steps post-steps">
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">{steps[this.state.current].content}</div>
            {/* <div className="steps-action-save-draft">
              {
                (this.state.current >= 0 && !this.state.approveJobPost)
                &&
                <Button style={{ marginRight: 8, float: 'left', }} onClick={() => this.savedraft()}>
                  Save Draft
                </Button>
              }
            </div> */}
            <div className="steps-action">
              {
                this.state.current > 0
                &&
                <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                  Previous
                </Button>
              }

              {
                (this.state.current < steps.length - 1)
                &&
                <Button type="primary" onClick={() => this.next()}>Next</Button>
              }

              {
                (this.state.current === steps.length - 1)
                &&
                <Button type="primary" onClick={() => this.next()}>Done</Button>
              }
              {/* {
                (this.state.current === steps.length - 1 && this.state.approveJobPost)
                &&
                <Button type="primary" onClick={() => this.approvejob()}>Approve</Button>
              } */}

            </div>
          </article>
        </section>
      </div>
    );
  }
}

const App = withRouter(JobPost);


class Box extends React.Component {
  // constructor(){
  //   super()
  // }

  closeModalcallBack = () => {
    this.props.closeModal();
  }

  render() {
    return (
      <div className="container">
        <App closeModal={this.closeModalcallBack} />
      </div>
    )
  }
}

// const Box = () => {
//   return (
//     <div className="container">
//       <App />
//     </div>
//   )
// }

export default Box;