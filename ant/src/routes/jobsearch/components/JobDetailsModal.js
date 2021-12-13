import { Button,message, Modal } from 'antd';
import _ from 'lodash';
import React from 'react';
import { withRouter } from 'react-router-dom';
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import partnerService from '../../../services/partnerService';
import JobseekerService from '../../../services/jobseekerService';


// const antIcon1 = <Icon type="loading" style={{ fontSize: 24 }} spin />;
class JobDetailsModal extends React.Component {
    constructor() {
        super();
        this.partnerService = new partnerService();
        this.JobseekerService = new JobseekerService();
        this.errorHandler = new errorHandler();
        var companyName = localStorage.getItem('companyName');
        var partnerEmailId = localStorage.getItem('email');
        var isPartner = localStorage.getItem('isPartner');
        this.state = {
            loadingJob: false,
            btnDisable: false,
            visible: false,
            status: true,
            jobId: null,
            data: null,
            selectedCompany: [],
            videoContentCheck: false,
            companyName: companyName,
            partnerEmailId : partnerEmailId,
            companyWebsiteLink : '',
            assignedCompanies: [],
            expiredAssignedCompanies: [],
            showRequestToAdminModal: false,
            jobPostedCompanyname: "",
            isPartner:isPartner
        }
        this.ShortlistJob = this.ShortlistJob.bind(this);
    }
    componentDidMount() {
        let data = {
            partnerCompanyName: this.state.companyName, // company name is the partner companyName
            emailId: this.state.partnerEmailId,
        }
        this.partnerService.getAssignedCompanies(data).then((d) => {
            if (d.data.status === true) {
              d.data.data.forEach((obj) => {
                    this.state.assignedCompanies.push(obj.assignedCompanies.companyName)
              })
            }
          }).catch((err) => {
            console.log(err);
            this.errorHandler.customErrorCheck(err);
          });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.JobseekerService.getCompany(nextProps.jobData.companyName).then((d) => {
                var arr = [];
                arr.push(d.data.data);
                this.setState({ selectedCompany: arr, visible: nextProps.visible, btnDisable: false });
                var checkHttp = this.state.selectedCompany[0].website.includes("http:")
                var checkHttps = this.state.selectedCompany[0].website.includes("https:")
                if ( !checkHttp && !checkHttps)
                {
                    var prefix = 'http://';
                    let companyWebsiteLink = prefix+this.state.selectedCompany[0].website
                    this.setState({ companyWebsiteLink: companyWebsiteLink})
                }else{
                    this.setState({ companyWebsiteLink: this.state.selectedCompany[0].website })
                }
            }).catch((err) => {
                console.log(err.response);
                this.errorHandler.customErrorCheck(err);
                this.setState({ selectedCompany: [], visible: nextProps.visible, btnDisable: false });
            });
            let data = { fileUrl: nextProps.jobData.jdVideo }
            this.JobseekerService.checkVideoContent(data).then((d) => {
                if (d.data.status === true) {
                    if (d.data.contentstatus === 'SUCCEEDED') {
                        this.setState({ videoContentCheck: true });
                    }
                    else if (d.data.contentstatus === 'PENDING' || d.data.contentstatus === 'IN_PROGRESS') {
                        this.setState({ videoContentCheck: false });
                        message.warn("This video is being content moderated. Please try after sometime.");
                    } else if (d.data.contentstatus === 'FAILED') {
                        this.setState({ videoContentCheck: false });
                        message.warn("Content check failed. Unable to display.");
                    }
                }
                else {
                    this.errorHandler.customErrorCheck('Content Check Failed');
                }
            }).catch((err) => {
                console.log(err);
                this.errorHandler.customErrorCheck(err)
            })

        }
    }



    // Apply Job
    ShortlistJob = (jobId,companyName) => {
        console.log(this.state.isPartner);
        if(this.state.isPartner==="false")
        {
            Modal.info({
                title: 'Please ask your admin to shortlist this job',
                // content: 'A short message',
                // width:50
              });
        }
        else{
        this.setState({ jobPostedCompanyname: companyName})
        if(this.state.assignedCompanies.includes(companyName)){
            var data = { jobId: jobId, companyName: this.state.companyName };
            this.partnerService.shortlistJob(data).then((d) => {
                if (d.status) {
                    message.success('Job Shortlisted SuccessFully !');
                    this.setState({
                        loadingJob: false,
                        visible: false
                    });
                    this.props.onClickClose(false);
                }
            }).catch((err) => {
                console.log(err);
                this.errorHandler.customErrorCheck(err);
                this.setState({ selectedCompany: [], visible: false, loadingJob: false });
                this.props.onClickClose(false);

            })
        }else{
            message.error("Company "+ companyName+ " is not in your grantee list or has the end date expired.",5)
            this.setState({visible: false , showRequestToAdminModal:true, btnDisable:true });
        }
    }
    }

    handleOk = (e) => {

    }
    handleCancel = (e) => {
        this.props.onClickClose();
    }

    handleCancelRequestAdminModal = () => {
        this.setState({showRequestToAdminModal:false})
    }
    requestAdminToAddCompany = (partnerCompanyName,jobPostedCompanyname) => {
        let data = {
            partnerCompanyName: partnerCompanyName,
            jobPostedCompanyname: jobPostedCompanyname
        }
        this.partnerService.requestAdminToAddCompanyToGrantee(data).then((d) => {
            if (d.status) {
                message.success('Requested  SuccessFully !');
                this.setState({showRequestToAdminModal: false})
                // this.setState({
                //     loadingJob: false,
                //     visible: false
                // });
                // this.props.onClickClose(false);
            }
        }).catch((err) => {
            console.log(err);
            this.errorHandler.customErrorCheck(err);
            this.setState({ selectedCompany: [], visible: false, loadingJob: false });
            this.props.onClickClose(false);

        })
    }
    render() {
        const s = this.props.jobData;
        if (!_.isEmpty(s)) {
            return (
                <div>
                    <Modal
                        destroyOnClose={true}
                        title={null}
                        mask={false}
                        footer={null}
                        centered={true}
                        width={'50%'}
                        visible={this.props.visible}
                        onOk={() => this.handleOk()}
                        onCancel={() => this.handleCancel()}
                    >
                        <div className="container pb-5">
                            <div className="row">
                                <div className="col-sm-8 col-sm-push-8 pt-4">
                                    <article className="text-body-reverse mb-4">
                                        <video width="100%" controls>
                                            <source src={this.state.videoContentCheck ? s.jdVideo : ""} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </article>
                                    <div className="d-flex align-content-center justify-content-between">
                                    <h4 className="">{s.jobTitle} </h4>
                                    <Button id={"Partner_shortlistJobs_"+s._id} key={1} disabled={this.state.btnDisable} onClick={() => this.ShortlistJob(s.jobId,s.companyName)} type="default" style={{ marginRight: '12px' }}>Shortlist</Button>
                                    </div>
                                    

                                    <h5>Company</h5>
                                    <p>{s.companyName}</p>

                                    <h5>Job Highlights</h5>
                                    {/* <p>{s.minexperience}-{s.maxexperience} Yrs | ₹{s.minannualCTC} - ₹{s.maxannualCTC} a year |{s.jobLocation.length > 0 ? s.jobLocation.map((d) => d + ' , ') : ''} </p> */}
                                    <p>{s.minexperience}-{s.maxexperience} Yrs | ₹{s.salaryHide ? "Undisclosed" : `${s.minannualCTC} to ${s.maxannualCTC}`} |{s.jobLocation.length > 0 ? s.jobLocation.map((d) => d + ' , ') : ''} </p>
                                    <h5>Job Description</h5>
                                    <p dangerouslySetInnerHTML={{ __html: s.jobDescription }}>
                                        {/* {s.jobDescription} */}
                                    </p>

                                    <h5>Skills</h5>
                                    <p>{s.skills.length > 0 ? s.skills.map((d) => d + ' ,') : ''}</p>
                                </div>
                                <div className="col-sm-4 col-sm-pull-4 pt-4">
                                    <article className="article">
                                        <div className="row">
                                            <article className="col-12 profile-card-v2 h-100 p-2 text-center">
                                                <img src={s.logo} alt="{s.logo}" />
                                                <h4>{s.companyName}</h4>
                                                <p> {this.state.selectedCompany.length > 0 ? this.state.selectedCompany[0].location : 'Not Mentioned'} </p>
                                                <p>{this.state.selectedCompany.length > 0 ? <a id={"Partner_jobs_companywebsite_"+s._id} href={this.state.companyWebsiteLink} target="_blank" rel="noopener noreferrer"> {this.state.companyWebsiteLink} </a> : 'Not available'} </p>
                                            </article>
                                        </div>
                                    </article>
                                </div>
                            </div>
                        </div>
                        <Modal
                        title={"Please request admin to add the company or extend end date of " + this.state.jobPostedCompanyname + " in your grantee list"} 
                        /*+ this.state.jobPostedCompanyname */
                      
                        visible={this.state.showRequestToAdminModal}
                        onCancel={() => this.handleCancelRequestAdminModal()}
                        footer={[
                            <Button key={1} id={"Partner_job_request_"+s._id} onClick={() => this.requestAdminToAddCompany(this.state.companyName,s.companyName)} type="default" style={{ marginRight: '12px' }}>Request </Button>,
                        ]}
                    >

                    </Modal>
                    </Modal>
                    {/* <Modal
                        title={"Request Shenzyn Admin to add company "+ this.state.jobPostedCompanyname + " to your grantee list"}
                        visible={this.state.showRequestToAdminModal}
                        onCancel={() => this.handleCancelRequestAdminModal()}
                        footer={[
                            <Button key={1}  onClick={() => this.requestAdminToAddCompany(this.state.companyName,s.companyName)} type="default" style={{ marginRight: '12px' }}>Request </Button>,
                        ]}
                    >

                    </Modal> */}
                </div>

            );
        }
        else {
            return (
                <div>

                </div>
            )
        }
    }
}



export default withRouter(JobDetailsModal);