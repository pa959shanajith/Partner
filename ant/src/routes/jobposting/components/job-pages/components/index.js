import { Button, Steps , Modal,message} from 'antd';
import React from 'react';
import partnerService from '../../../../../services/partnerService';
import CandidateDetails from './CandidateDetails/index';
import EducationDetails from './EducationDetails/index';
import JobDetails from './JobDetails/index';
import ManageResponses from './ManageResponses/index';
import { withRouter } from "react-router-dom";

const Step = Steps.Step;
var prop ;
var saveDraft;;
const routetoDashboard = () => {
  prop.history.push('/app/dashboard');
}
class JobPost extends React.Component {
  constructor(props) {
    super(props);
    prop = props;
    saveDraft = false;
    this.JobDetailsref = React.createRef();
    this.CandidateDetailsref = React.createRef();
    this.EducationDetailsref = React.createRef();
    this.ManageResponsesref = React.createRef();
    this.partnerSvc = new partnerService();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      jobDetails: {},
      candidateDetails: {},
      educationalDetails: {},
      manageResponseDetails:{},
      current: 0,
      steps: [{
        title: 'Job Details',
        content: <JobDetails ref={this.JobDetailsref} /*onSelectChange={this.handleChange}*/ setJDState={this.updateJDState} />,
      }, {
        title: 'Candidate Details',
        content: <  CandidateDetails ref={this.CandidateDetailsref} setCDState={this.updateCDState}/>,
      }, {
        title: 'Education Details',
        content: <EducationDetails ref={this.EducationDetailsref} setEDState={this.updateEDState}/>,
      }, {
        title: 'Manage Responses',
        content: < ManageResponses ref={this.ManageResponsesref} setMRState={this.updateMRState}/>,
      }],
    };
  }
  componentDidMount() {
    // console.log(this.state);
  }
  // componentWillMount() {
  //   // console.log(this.state);
  // }
  handleChange = () => {
   //this.setState({ EducationDetails: [] });
  }
  updateJDState = (s) => {
    this.setState({jobDetails : s});
  }

  updateCDState = (s) => {
    this.setState({candidateDetails : s});
  }

  updateEDState = (s) => {
    this.setState({educationalDetails : s});
  }

  updateMRState = (s) => {
    this.setState({manageResponseDetails : s});
  }

  next() {
    var validated = false;
    switch (this.state.current) {
      case 0:
        {
          this.JobDetailsref.current.validateFields((err, fieldValues) => {
            if (err) {
              return
            }
            else {
              var jobDetails = { ...this.state.jobDetails };
              console.log(jobDetails);
              let data = {
                  "companyName": jobDetails.companyName,
                  "jobPostedBy": jobDetails.jobPostedBy,
                  "jobId" : jobDetails.jobId,
                  "jobTitle": jobDetails.jobTitle,
                  "jobDescription": jobDetails.jobDescription,
                  "videoJd": jobDetails.videoJd,
                  "vacancies": jobDetails.vacancies,
                  "jobLocation": jobDetails.jobLocation,
                  "employementType": jobDetails.employementType,
                  "travelRequired": jobDetails.travelRequired,
                  "minCTC": jobDetails.minCTC,
                  "maxCTC": jobDetails.maxCTC, 
                  "salaryHide": jobDetails.salaryHide,
                  "otherMonetoryBenefits": jobDetails.otherMonetoryBenefits
              }
              
              this.partnerSvc.updatejobpostingjobdetails(data).then( (d) => {
                message.success("Succesfully saved job details.",5);
                    if(saveDraft){
                      routetoDashboard();
                    }
                    else{
                      const current = this.state.current + 1;
                      this.setState({ current });
                    }
                }).catch((err) => {
                  console.log(err, 'error while saving job details');
                  //Show error handler and return
                  message.error("Failed to save job details.",5);
                   return;
                })
                //validated = true;
            }
          })
        }
        break;
      case 1:
        {
          this.CandidateDetailsref.current.validateFields((err, fieldValues) => {
            if (err) {
              return
            }
            else {
               var candidateDetails = { ...this.state.candidateDetails };
               console.log(candidateDetails);
               let data ={
                "companyName":candidateDetails.companyName,
                "jobId":candidateDetails.jobId,
                "minexperience":candidateDetails.minexperience,
                "maxexperience":candidateDetails.maxexperience,
                "industries":candidateDetails.industries,
                "functionalArea":candidateDetails.functionalArea,
                "noticePeriod":candidateDetails.noticePeriod,
                "skills": candidateDetails.skills,
                "languagesKnown":candidateDetails.languagesKnown
              }
               this.partnerSvc.updatejobpostingcandidatedetails(data).then((d) => {
                   //show succes and proceed
                   message.success("Succesfully saved candidate details.",5);
                   if(saveDraft){
                    routetoDashboard();
                  }
                  else{
                    const current = this.state.current + 1;
                    this.setState({ current });
                  }
                 }).catch((err) => {
                   console.log(err, 'error saving candidate details');
                   //Show error handler and return
                   message.error("Failed to save candidate details.",5);
                   return;
                 })
              // validated = true;
            }
          })
        }

        break;
      case 2:
        {
          this.EducationDetailsref.current.validateFields((err, fieldValues) => {
            // console.log(fieldValues, ' its fieldValues of Employement');
            if (err) {
              return
            }
            else {
              var educationalDetails = { ...this.state.educationalDetails };
               console.log(educationalDetails);
               let data = {
                "companyName": educationalDetails.companyName,
                "jobId": educationalDetails.jobId,
                "educationalDetails":{ "qualification": educationalDetails.qualification, "specialization": educationalDetails.specialization, "degree": educationalDetails.degree },
                // "educationalDetails": educationalDetails.educationalDetails,
                "certificatesDesired": educationalDetails.certificatesDesired
              }
               this.partnerSvc.updatejobpostingeducationdetails(data).then(async (d) => {
                    message.success("Succesfully saved educational details.",5);
                    if(saveDraft){
                      routetoDashboard();
                    }
                    else{
                      const current = this.state.current + 1;
                      this.setState({ current });
                    }
                 }).catch((err) => {
                   console.log(err, ' error saving educatinal details');
                   message.error("Failed to save educational details.",5);
                   return;
                 })
            }
          })
        }
        break;
      case 3:
        {
          this.ManageResponsesref.current.validateFields((err, fieldValues) => {
            if (err) {
              return
            }
            else {
              var manageResponseDetails = { ...this.state.manageResponseDetails };
              console.log(manageResponseDetails);
              let data = {
                "companyName": manageResponseDetails.companyName,
                "jobId": manageResponseDetails.jobId,
                "forwardApplication": manageResponseDetails.forwardApplication,
                "recepientEmailAddress": manageResponseDetails.recepientEmailAddress,
                "approvedBy": ""
              }
              this.partnerSvc.updatejobpostingresponseetails(data).then((d) => {
                  message.success("Succesfully saved response details.",5);
                  //const current = this.state.current + 1;
                  // this.setState({ current });
                  Modal.success({
                    title: 'Job Saved Succesfully',
                    content: (
                      <div>
                        <p>Place holder for success Image</p>
 
                      </div>
                    ),
                    onOk() {routetoDashboard();},
                  });
                }).catch((err) => {
                  console.log(err, 'error saving manage response');
                  message.error("Failed to save job post.",5);
                  return;
                })
              validated = true;
            }
          })
        }
        break;
      default:
      // code block
    }
     if (validated) {
    //   const current = this.state.current + 1;
    //   this.setState({ current });
    var prop = {...this.props}
    prop.history.push("/dashboard");
     }
  }

  prev() {
  // No action to be performed or server side call to be made on moving to previous page, if needed use switch case as in next()
  }

  savedraft = () => {
    saveDraft = true;
    this.next();
  }

  render() {
    const { current, steps } = this.state;
    const {prop} = this.props;
    return (
      <div className="ui-animate">
        <section className="container-fluid container-mw-xxl chapter page-icons">
          <article className="article demo-style-steps post-steps">
            <Steps current={current}>
              {steps.map(item => <Step key={item.title} title={item.title} />)}
            </Steps>
            <div className="steps-content">{steps[this.state.current].content}</div>
            <div className="steps-action-save-draft">
              {
                this.state.current >= 0
                &&
                <Button style={{ marginRight: 8, float: 'left' }} onClick={() => this.savedraft()}>
                  Save Draft
                </Button>
              }
            </div>
            <div className="steps-action">
              
              {
                this.state.current > 0
                &&
                <Button style={{ marginRight: 8 }} onClick={() => this.prev()}>
                  Previous
            </Button>
              }
              {
                this.state.current < steps.length - 1
                &&
                <Button type="primary" onClick={() => this.next()}>Next</Button>
              }
              {
                this.state.current === steps.length - 1
                &&
                <Button type="primary" onClick={() => this.next()}>Done</Button>
                // <Button type="primary" onClick={}>Done</Button>
                // () => message.success('Processing complete!')
              }
            </div>
          </article>
        </section>
      </div>
    );
  }
}

const App = withRouter(JobPost);

const Box = () => {
  return (
    <div className="container">
      <App />
    </div>
  )
}

export default Box;