import { Button, Steps, Modal, message } from 'antd';
import React from 'react';
import partnerService from '../../../../../services/partnerService';
import CandidateDetails from './CandidateDetails/index';
import EducationDetails from './EducationDetails/index';
import JobDetails from './JobDetails/index';
import ManageResponses from './ManageResponses/index';
import { withRouter } from "react-router-dom";

const Step = Steps.Step;
var prop;
var saveDraft;
const routetoDashboard = () => {
  prop.history.push('/app/dashboard');
}
class JobPost extends React.Component {
  constructor(props) {
    super(props);
    prop = props;
    saveDraft = false;
    // approveJobPost = false;
    // leftBtnTxt = "Save Draft";
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
      manageResponseDetails: {},
      approveJobPost: false,
      current: 0,
      steps: [{
        title: 'Job Details',
        content: <JobDetails ref={this.JobDetailsref} /*onSelectChange={this.handleChange}*/ setJDState={this.updateJDState} />,
      }, {
        title: 'Candidate Details',
        content: <  CandidateDetails ref={this.CandidateDetailsref} setCDState={this.updateCDState} />,
      }, {
        title: 'Education Details',
        content: <EducationDetails ref={this.EducationDetailsref} setEDState={this.updateEDState} />,
      }, {
        title: 'Manage Responses',
        content: < ManageResponses ref={this.ManageResponsesref} setMRState={this.updateMRState} />,
      }],
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
  updateJDState = (s) => {
    this.setState({ jobDetails: s });
  }

  updateCDState = (s) => {
    this.setState({ candidateDetails: s });
  }

  updateEDState = (s) => {
    this.setState({ educationalDetails: s });
  }

  updateMRState = (s) => {
    this.setState({ manageResponseDetails: s });
  }

  next() {
    var validated = false;
    switch (this.state.current) {
      case 0:
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
                "jobId": jobDetails.jobId,
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

              this.partnerSvc.updatejobpostingjobdetails(data).then((d) => {
                message.success("Succesfully saved job details.", 5);
                if (saveDraft) {
                  routetoDashboard();
                }
                else {
                  const current = this.state.current + 1;
                  this.setState({ current });
                }
              }).catch((err) => {
                console.log(err, 'error while saving job details');
                //Show error handler and return
                message.error("Failed to save job details.", 5);
                return;
              })
              //validated = true;
            }
          })
        break;
      case 1:
        this.CandidateDetailsref.current.validateFields((err, fieldValues) => {
          if (err) {
            return
          }
          else {
            var candidateDetails = { ...this.state.candidateDetails };
            console.log(candidateDetails);
            let data = {
              "companyName": candidateDetails.companyName,
              "jobId": candidateDetails.jobId,
              "minexperience": candidateDetails.minexperience,
              "maxexperience": candidateDetails.maxexperience,
              "industries": candidateDetails.industries,
              "functionalArea": candidateDetails.functionalArea,
              "noticePeriod": candidateDetails.noticePeriod,
              "skills": candidateDetails.skills,
              "languagesKnown": candidateDetails.languagesKnown
            }
            this.partnerSvc.updatejobpostingcandidatedetails(data).then((d) => {
              //show succes and proceed
              message.success("Succesfully saved candidate details.", 5);
              if (saveDraft) {
                routetoDashboard();
              }
              else {
                const current = this.state.current + 1;
                this.setState({ current });
              }
            }).catch((err) => {
              console.log(err, 'error saving candidate details');
              //Show error handler and return
              message.error("Failed to save candidate details.", 5);
              return;
            })
            // validated = true;
          }
        })
        break;
      case 2:
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
              "educationalDetails": { "qualification": educationalDetails.qualification, "specialization": educationalDetails.specialization, "degree": educationalDetails.degree },
              // "educationalDetails": educationalDetails.educationalDetails,
              "certificatesDesired": educationalDetails.certificatesDesired
            }
            this.partnerSvc.updatejobpostingeducationdetails(data).then(async (d) => {
              message.success("Succesfully saved educational details.", 5);
              if (saveDraft) {
                routetoDashboard();
              }
              else {
                const current = this.state.current + 1;
                this.setState({ current });
              }
            }).catch((err) => {
              console.log(err, ' error saving educatinal details');
              message.error("Failed to save educational details.", 5);
              return;
            })
          }
        })
        break;
      case 3:
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
              message.success("Succesfully saved response details.", 5);
              //const current = this.state.current + 1;
              // this.setState({ current });
              Modal.success({
                title: 'Job Saved Succesfully',
                content: (
                  <div>
                    <img src={'./assets/success_job_posting.png'} height='50%' width='50%' alt="Job Post Approved" />
                  </div>
                ),
                onOk() { routetoDashboard(); },
              });
            }).catch((err) => {
              console.log(err, 'error saving manage response');
              message.error("Failed to save job post.", 5);
              return;
            })
            validated = true;
          }
        })
        break;
      default:
      // code block
    }
    if (validated) {
      //   const current = this.state.current + 1;
      //   this.setState({ current });
      var prop = { ...this.props }
      prop.history.push("/dashboard");
    }
  }

  prev() {
    switch (this.state.current) {
      case 0:
        //this.JobDetailsref.current.updateState({jobId:this.state.jobDetails.jobId})
        // TODO :: Make a server call to get the relevant data
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      default:
      // code block
    }

    const current = this.state.current - 1;
    this.setState({ current });
  }

  savedraft = () => {
    saveDraft = true;
    this.next();
  }
  approvejob = () => {
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
          "approverdBy": manageResponseDetails.emailId
        }
        this.partnerSvc.approvejobposting(data).then((d) => {
          message.success("Succesfully approved Job Post.", 5);
          Modal.success({
            title: 'Job Approved Succesfully',
            content: (
              <div>
                <img src={'./assets/success_job_posting.png'} height='50%' width='50%' alt="Job Post Approved" />
              </div>
            ),
            onOk() { routetoDashboard(); },
          });
        }).catch((err) => {
          console.log(err, 'error saving manage response');
          message.error("Failed to save job post.", 5);
          return;
        })
        // validated = true;
      }
    })
  }

  rejectjob = () => {
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
          "approverdBy": manageResponseDetails.emailId
        }
        this.partnerSvc.rejectjobposting(data).then((d) => {
          message.success("Succesfully approved Job Post.", 5);
          Modal.success({
            title: 'Job Post Rejected ',
            content: (
              <div>
                <img src={'./assets/success_job_posting.png'} height='50%' width='50%' alt="Job Post Rejected" />
              </div>
            ),
            onOk() { routetoDashboard(); },
          });
        }).catch((err) => {
          console.log(err, 'error saving manage response');
          message.error("Failed to save job post.", 5);
          return;
        })
        // validated = true;
      }
    })
  }


  render() {
    const { current, steps } = this.state;
    // const {prop} = this.props;
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
                (this.state.current >= 0 && !this.state.approveJobPost)
                &&
                <Button style={{ marginRight: 8, float: 'left', }} onClick={() => this.savedraft()}>
                  Save Draft
                </Button>
              }
              {
                (this.state.current === steps.length - 1 && this.state.approveJobPost)
                &&
                <Button style={{ marginRight: 8, float: 'left', }} onClick={() => this.rejectjob()}>
                  Reject
                </Button>
              }
            </div>
            {/* <div className="steps-action-save-draft">
              {
                // this.state.approveJobPost == true
                // &&
                <Button style={{ marginRight: 8, float: 'left', visibility: this.state.approveJobPost?'':'hidden' }} onClick={() => this.approvejob()}>
                  Approve Job 
                </Button>
              }
            </div> */}
            <div className="steps-action-save-draft">
              {


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
                (this.state.current < steps.length - 1)
                &&
                <Button type="primary" onClick={() => this.next()}>Next</Button>
              }

              {
                (this.state.current === steps.length - 1 && !this.state.approveJobPost)
                &&
                <Button type="primary" onClick={() => this.next()}>Done</Button>
              }
              {
                (this.state.current === steps.length - 1 && this.state.approveJobPost)
                &&
                <Button type="primary" onClick={() => this.approvejob()}>Approve</Button>
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