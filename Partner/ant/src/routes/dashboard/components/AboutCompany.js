import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import requireAuthentication from '../../../components/AuthenticatedComponentHOC';
import { message } from 'antd';
import ExcelUtils from "../export-excel/ExcelUtils";
import moment from 'moment';

const StyleSheet_ProfileImage = {
    borderRadius: 0,
    boxShadow: 'none',
    marginBottom: '0',
}
let backgroundImageRight = 'assets/images-demo/assets/plant1.png'
const StyleSheet_ProfileCard = {
    textAlign: 'left',
    padding: '0',
    backgroundImage: `url(${backgroundImageRight})`,
    backgroundSize: 'cover',
    backgroundPosition: 'bottom right'
}
const StyleSheet_GirlImage = {
    maxWidth: '400px',
    borderRadius: 0,
    boxShadow: 'none',
    marginTop: '-25px',
    marginBottom: '0',
    height: '245px'
}
const StyleSheet_Heading2 = {
    color: '#D45895',
    fontSize: '30px',
    fontWeight: '600'
}
const StyleSheet_Heading4 = {
    color: '#737373',
    fontSize: '16px',
    fontWeight: '600'
}
const StyleSheet_Heading6 = {
    color: '#737373',
    fontSize: '16px',
    fontWeight: '600'
}
class AboutCompany extends Component {
    constructor() {
        super();
        var isRecruiter = localStorage.getItem('isRecruiter');
        var isPartner = JSON.parse(localStorage.getItem('isPartner'));
        var email = localStorage.getItem('email');
        var companyName = localStorage.getItem('companyName');
        this.state = {
            emailId: email,
            partnerAdmin: isPartner,
            companyName: companyName,
            showTable: "",
            showCompanyModal: false,
            isRecruiter: isRecruiter === 'true' ? true : false,
            // showSubscription:false,
            subscriptionInfo: [],
            paymentDetails: [],
            txStatus: '',
            statusTxt: '',
            jobCount: {},
            jobIdArr: [],
            forExcelDownload: false,
            statusValue: "Applicants",
            ApplicantStats: {},
            totalCount: {},
            exportColumns: [
                { header: 'Job Id', key: 'jobId', width: 30, style: { font: { bold: true } } },
                { header: 'Job Title', key: 'jobTitle', width: 40, style: { font: { bold: true } } },
                { header: 'Event Id', key: 'eventId', width: 40, style: { font: { bold: true } } },
                { header: 'Event Name', key: 'eventName', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Name', key: 'applicantName', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Email Id', key: 'applicantEmailId', width: 40, style: { font: { bold: true } } },
                { header: 'Applicant Phone', key: 'applicantPhone', width: 40, style: { font: { bold: true } } },
                { header: 'Applicant Experience', key: 'applicantExperience', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Notice Period', key: 'applicantNoticePeriod', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Expected CTC', key: 'applicantExpectedCTC', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Submitted By', key: 'profileSubmittedBy', width: 40, style: { font: { bold: true } } },
                { header: 'Applicant Status', key: 'status', width: 30, style: { font: { bold: true } } },
                { header: 'Resume', key: 'resumeUplodedUrl', width: 30, style: { font: { bold: true } } },
            ]
        }
        this.ShowSubscription = this.ShowSubscription.bind(this);
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.ExcelUtils = new ExcelUtils();
    }

    componentDidMount() {
        let partner = this.state.partnerAdmin;
        let companyName = this.state.companyName;
        var data = {
            partnerEmail: partner === true ? localStorage.getItem('email') : localStorage.getItem('partnerEmail')
        }
        // this.partnerService.getShortlistedJobs(data).then((res) => {
        //     let ids = res.data.data
        //     var arr = []
        //     ids.forEach(element => {
        //         arr.push(element.jobId)
        //     });
        //     this.setState({jobIdArr : arr})
        //     // this.getJobCount(arr, companyName)
        // })
        let partnerData = {
            partnerAdmin: this.state.partnerAdmin,
            partnerEmail: this.state.partnerAdmin ? this.state.emailId : localStorage.getItem('email'),
            companyName: this.state.companyName,
            statusValue: this.state.statusValue,
            forExcelDownload: this.state.forExcelDownload,
            // jobIdArr: this.state.jobIdArr
        }
        this.partnerService.getEventAndJobsApplicants(partnerData).then((r) => {
            if (r.data.status === true) {
                this.setState({totalCount:r.data.data})
            }
        }).catch((err) => {
            console.log(err);
        })
        // if (this.state.partnerAdmin) {
        //     let partnerData = {
        //         partnerEmail: this.state.emailId,
        //         companyName: this.state.companyName
        //     }
        //        this.getAllCountsofApplicant(partnerData);
        //     // this.getSubscriptionInfo();
        // }
        // else {
        //     let partnerData = {
        //         partnerEmail: this.state.emailId,
        //         enrolledPartner: localStorage.getItem('partnerEmail'),
        //         companyName: this.state.companyName
        //     }
        //     this.getAllCountsofApplicant(partnerData);
        // }

        // this.setEventanJobCount();
    }

    // this.state.jobCount, this.state.ApplicantStats
    // setEventanJobCount = () => {
    //     // if (Object.keys(this.state.jobCount).length && Object.keys(this.state.ApplicantStats).length) {
    //         let TotalCount = {}
    //         TotalCount.Applicants = this.state.jobCount.Applicants + this.state.ApplicantStats.Applicants;
    //         TotalCount.Offered = this.state.jobCount.Offered + this.state.ApplicantStats.Offered;
    //         TotalCount.Selected = this.state.jobCount.Selected + this.state.ApplicantStats.Selected;
    //         TotalCount.Shortlisted = this.state.jobCount.Shortlisted + this.state.ApplicantStats.Shortlisted;
    //         TotalCount.Joined = this.state.jobCount.Joined + this.state.ApplicantStats.Joined;
    //         this.setState({ totalCount: TotalCount });
    //     // }
    // }

    // getJobCount = (ids, cName) => {
    //     let data = {
    //         jobId: ids,
    //         companyName: cName,
    //         profileSubmittedBy: this.state.emailId,
    //         isPartner:this.state.partnerAdmin
    //     }
    //     this.partnerService.getJobCount(data).then((res) => {
    //         if (res.data.status) {
    //             this.setState({ jobCount: res.data.data })
    //             this.setEventanJobCount();
    //         }
    //     }).catch((error) => {
    //         console.log("error", error);
    //     })
    // }

    // getAllCountsofApplicant(data) {
    //     this.partnerService.getCounts(data).then((r) => {
    //         // console.log(r, ' its data');
    //         // console.log("EVENTS RESPONSE: ",r.data.data.applicantArr)
    //         if (r.data.status === true) {
    //             this.setState({ ApplicantStats: r.data.data });
    //             this.setEventanJobCount();
    //         }
    //     }).catch((err) => {
    //         console.log(err);
    //         // this.errorHandler.customErrorCheck(err);
    //     })
    // }


    handlePostAJob = () => {
        localStorage.setItem('jobId', 0);
        this.props.history.push("jobposting");
    }
    handleEventsTable = () => {
        this.props.onChangeTable('events');
    }
    handleRecruitersTable = () => {
        this.props.onChangeTable('recruiters');
    }
    // Show Subscription Modal
    ShowSubscription = () => {
        this.setState({ showSubscription: true, statusTxt: this.state.txStatus });
    }
    // close Subscription
    closeSubscription = () => {
        this.setState({ showSubscription: false, statusTxt: '' });
    }
    gotoJobSearch() {
        this.props.onChangeTable('jobs');
    }
    downloadExcel = (value,toDownload) => {
        this.setState({ statusValue: value, forExcelDownload: true})
        let partnerData = {
            partnerAdmin: this.state.partnerAdmin,
            partnerEmail: this.state.emailId,
            companyName: this.state.companyName,
            statusValue: value,
            forExcelDownload: toDownload === "true" ? true : false,
            jobIdArr: this.state.jobIdArr
        }
        this.partnerService.getEventAndJobsApplicants(partnerData).then((r) => {
            if (r.data.status === true) {
                let rows = r.data.data
                let exportData = []
                for (var i = 0; i < rows.length; i++){
                    if ((rows[i].CompanySubmittedBy === localStorage.getItem('companyName'))) {
                        let rowData = this.rowDataFunction(rows[i]);
                        exportData.push(rowData);
                    }else if((rows[i].profilesByPartner.CompanySubmittedBy === localStorage.getItem('companyName'))){
                        let rowData = this.rowDataFunctionForJobs(rows[i]);
                        exportData.push(rowData);
                    }
                }
                let props = {
                    fileName: value + " as of ",
                    columns: this.state.exportColumns,
                    data: exportData
                }
                this.ExcelUtils.exportToExcel(props)
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    rowDataFunction = (rows) => {
        let rowData = [];
        this.state.exportColumns.forEach((o, key) => {
            if (o.key === 'status') {
                rowData.push(rows[o.key][0]);
            } else {
                rowData.push(rows[o.key]);
            }
        });
        return rowData;
    }
    rowDataFunctionForJobs = (rows) => {
        let rowData = [];
        this.state.exportColumns.forEach((o, key) => {
            if (o.key === 'status') {
                rowData.push(rows.profilesByPartner[o.key][0]);
            }else if(o.key == 'applicantName' || o.key == 'applicantEmailId' || o.key == 'applicantPhone' ||
            o.key == 'applicantExperience' ||  o.key == 'applicantNoticePeriod' || o.key == 'applicantExpectedCTC' ||
            o.key == 'profileSubmittedBy' || 
            o.key == 'resumeUplodedUrl'){
                rowData.push(rows.profilesByPartner[o.key]);
            } else {
                rowData.push(rows[o.key]);
            }
        });
        return rowData;
    }
    render() {
        const { details } = this.props;
        // const {accountStats} =this.props;
        // const { showCompanyModal, isRecruiter } = this.state;
        return (
            <section className="profile-card-v2 mx-0 h-100 mt-4 row" style={StyleSheet_ProfileCard} >
                {/* <Subscription txStatus={this.state.statusTxt} paymentData={this.state.paymentDetails} subscriptionData={this.state.subscriptionInfo} visible={this.state.showSubscription} onClose={this.closeSubscription} /> */}
                <div className="col-lg-2 text-center">
                    <div className="pt-5">
                        <img style={StyleSheet_ProfileImage} src={details.logo} alt="Company Logo" />
                    </div>
                </div>
                <div className="col-lg-4 mx-0">
                    <div>
                        <h2 className="pt-5" style={StyleSheet_Heading2}>{details.companyName}</h2>
                        <h4 className="pt-3" style={StyleSheet_Heading4}>{details.address}, {details.location} {details.contactNo}  </h4> {/*<Button icon="edit" style={StyleSheet_IconButton}></Button> */}
                        <h4 className="pt-3" style={StyleSheet_Heading6}><a href={details.website} target="_blank" rel="noopener noreferrer">{details.website}</a> </h4>
                    </div>
                </div>
                <div className="col-lg-2 mt-3 mx-0">
                    {/* {isPartnerAdmin ?
                        (
                            <span>
                                <Button onClick={this.gotoJobSearch.bind(this)} style={StyleSheet_OutlinedButton}>Jobs</Button>
                                <Button onClick={this.handleEventsTable} style={StyleSheet_OutlinedButton}>Events</Button>
                                <Button onClick={this.handleRecruitersTable} style={StyleSheet_OutlinedButton}>Recruiters</Button>
                            </span>
                        ) : (
                            <span>
                                <Button onClick={this.gotoJobSearch.bind(this)} style={StyleSheet_OutlinedButton}>Jobs</Button>
                                <Button onClick={this.handleEventsTable} style={StyleSheet_OutlinedButton}>Events</Button>
                            </span>
                        )} */}
                    <div className="row">
                        <div className="col-md-6 text-center my-2" style={{border: '2px solid #D45895',cursor:'pointer' }} onClick={()=>this.downloadExcel("Applicants","true")}>
                            <h6 id="applicants_c" className="stats_count">
                                {this.state.totalCount.Applicants ? this.state.totalCount.Applicants : '0'}
                            </h6>
                            <span className="stats_label">Applicants</span>
                        </div>
                        <div className="col-md-6 text-center my-2" style={{border: '2px solid #D45895',cursor:'pointer' }} onClick={()=>this.downloadExcel("SELECTED","true")}>
                            <h6 id="applicants_c" className="stats_count">
                                {this.state.totalCount.Selected ? this.state.totalCount.Selected : '0'}
                            </h6>
                            <span className="stats_label">Selected</span>
                        </div>
                        <div className="col-md-6 text-center my-2" style={{border: '2px solid #D45895',cursor:'pointer' }} onClick={()=>this.downloadExcel("SHORTLISTED","true")}>
                            <h6 id="applicants_c" className="stats_count">
                                {this.state.totalCount.Shortlisted ? this.state.totalCount.Shortlisted : '0'}
                            </h6>
                            <span className="stats_label">Shortlisted</span>
                        </div>
                        <div className="col-md-6 text-center my-2" style={{border: '2px solid #D45895',cursor:'pointer' }} onClick={()=>this.downloadExcel("OFFERED","true")}>
                            <h6 id="applicants_c" className="stats_count">
                                {this.state.totalCount.Offered ? this.state.totalCount.Offered : '0'}
                            </h6>
                            <span className="stats_label">Offered</span>
                        </div>
                        <div className="col-md-6 text-center my-2" style={{border: '2px solid #D45895',cursor:'pointer' }} onClick={()=>this.downloadExcel("JOINED","true")}>
                            <h6 id="applicants_c" className="stats_count">
                                {this.state.totalCount.Joined ? this.state.totalCount.Joined : '0'}
                            </h6>
                            <span className="stats_label">Joined</span>
                        </div>
                    </div>

                </div>
                <div className="col-lg-3">
                    <img style={StyleSheet_GirlImage} src={'assets/images-demo/assets/Illustration_Partner.png'} alt="Banner" />
                </div>
            </section>
        )
    }
}

export default withRouter(requireAuthentication(AboutCompany));