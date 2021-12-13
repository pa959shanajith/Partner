import { message, notification, Tabs } from 'antd';
import moment from 'moment';
import React from 'react';
import { FaCreditCard } from 'react-icons/fa';
import { MdSentimentVeryDissatisfied, MdSentimentVerySatisfied } from "react-icons/md";
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import partnerService from "../../../services/partnerService";
import EnrolledEventsTable from './EnrolledEventsTable';
import AboutCompany from './AboutCompany';
import LatestJobsPosting from './LatestJobsPosting';
import ShortlistedJobsTable from './ShortlistedJobsTable';
import UpcomingEvents from './UpcomingEvents';
import RecruitersTable from '../../recruiters/index';
import ViewRecruiter from '../../recruiters/components/ViewRecruiter'
import ViewShortlistedCompanyDetailModal from './ViewShortlistedCompanyDetailModal';
import ViewEnrolledEventDetailModal from './ViewEnrolledEventDetailModal';
import { Helmet } from "react-helmet";
import PAGEROUTES from '../../../constants/pageRoutes';
const { TabPane } = Tabs;


let widgetBotObj = {
  server: findHost() ? PAGEROUTES.widgetBot.stage.server : PAGEROUTES.widgetBot.prod.server,
  channel: findHost() ? PAGEROUTES.widgetBot.stage.channel : PAGEROUTES.widgetBot.prod.channel
}

function findHost() {
  return window.location.href.includes('stage') || window.location.href.includes('localhost') ? true : false;
}

// Notification
const openNotification = (msg, title, status) => {
  notification.open({
    message: title,
    description: msg,
    icon: status === 'FAILED' ? <MdSentimentVeryDissatisfied /> : <MdSentimentVerySatisfied />,
  });
};
const SubscriptionNotification = (msg, title) => {
  notification.open({
    message: title,
    description: msg,
    duration: 8,
    icon: <FaCreditCard />,
  });
}
const ExpiredSubscription = (msg, title) => {
  notification.open({
    message: title,
    description: msg,
    duration: 8,
    icon: <MdSentimentVeryDissatisfied />,
  });
}

class Dashboard extends React.Component {
  constructor() {
    super();
    //TODO: Move all localstore.get call here
    var companyName = localStorage.getItem('companyName');
    var isPartner = JSON.parse(localStorage.getItem('isPartner'));
    var email = localStorage.getItem('email');
    this.state = {
      companyName: companyName,
      partnerAdmin: isPartner,
      emailId: email,
      basicDetails: {},
      jobStats: {},
      allPostedJobs: [],
      table: "events",
      pendingJobs: [],
      draftJobs: [],
      jobs: [],
      events: [],
      enrolledEvents: [],
      ApplicantStats: {},
      eventDetailShow: false,
      eventTableShow: false,
      clickedEventData: [],
      listofApplicants: [],
      assignedCompanies: [],
      recruiterDetails: {},
      showViewModal: false,
      showRecruiter: false,
      showJobDetails: false,
      showCandidates: false,
      showShortlistedCompany: false,
      showEnrolledEventDetail: false,
      isCalledSubscription: false,
      isCalledSuccessNotify: false,
      jobsData: {},
      SubscribedRecruiters: 0,
      recruiterCompanyName: "",
      widgetServer: widgetBotObj.server.toString(),
      widgetChannel: widgetBotObj.channel.toString()
    }
    this.partnerService = new partnerService();
    this.errorHandler = new errorHandler();
    this.eventDelete = this.eventDelete.bind(this);
    this.eventDetails = this.eventDetails.bind(this);
    this.recruiterEventDetails = this.recruiterEventDetails.bind(this);
    this.reload = this.reload.bind(this);
    this.checkSubscription = this.checkSubscription.bind(this);
    this.showRecruiterDetailsView = this.showRecruiterDetailsView.bind(this);
  }
  // Partners Dashboard Different View
  showTable = (tableName) => {
    // console.log(tableName, ' its tableName ');
    this.componentDidMount();
    this.setState({
      table: tableName,
      // eventDetailShow: !this.state.eventDetailShow,
      eventTableShow: !this.state.eventTableShow,
      showCandidates: !this.state.showCandidates
    })
  }
  showShortlistedCompanyModal = () => {
    this.setState({ showShortlistedCompany: true });
  }
  closeShortlistedCompanyModal = () => {
    this.setState({ showShortlistedCompany: false });
  }
  showEnrolledEventDetailModal = () => {
    this.setState({ showEnrolledEventDetail: true });
  }
  closeEnrolledEventDetailModal = () => {
    this.setState({ showEnrolledEventDetail: false });
  }

  // Showing Rectrruiter Table
  showDefaultTable = (tableName) => {
    this.componentDidMount();
    this.setState({
      table: tableName,
      eventDetailShow: !this.state.eventDetailShow,
      eventTableShow: false,
      showJobDetails: false
    });
  }
  // Back To Dashboard
  backToDashboard = (tableName) => {
    this.componentDidMount();
    this.setState({
      table: tableName,
      eventDetailShow: false,
    });
  }
  // < ! ---- End ----- >

  // Recruiters Dashboard Different View
  showTableEvent = (tableName) => {
    // console.log(tableName, ' its tableName ');
    this.componentDidMount();
    this.setState({
      table: tableName,
      eventDetailShow: false,
      eventTableShow: !this.state.eventTableShow
    })
  }
  // Showing Rectrruiter Table
  showRecruitersList = (tableName) => {
    this.componentDidMount();
    this.setState({
      table: tableName,
      eventDetailShow: !this.state.eventDetailShow,
      eventTableShow: false
    });
  }
  showRecruiterDetailsView(emailId) {
    // console.log(emailId)
    this.partnerService.getrecruiterdetailsbyid(emailId).then((response) => {
      // console.log(response);
      this.setState({ recruiterDetails: response.data.data, showViewModal: true });
    }).catch((err) => {
      console.log(err);
    });

  }
  // Back To Dashboard
  backToDashboardRecruiter = (tableName) => {
    this.componentDidMount();
    this.setState({
      table: tableName,
      eventDetailShow: false,
    });
  }
  // < ! ---- End ----- >


  componentDidMount() {
    if (this.state.isCalledSuccessNotify === false && this.props && this.props.location.state && this.props.location.state.txStatus !== undefined) {
      var txStatus = this.props.location.state.txStatus;
      if (txStatus) {
        var title = "";
        var msg = "";
        switch (txStatus) {
          case 'SUCCESS':
            message.success('Last transaction successful');
            msg = " Welcome to Shenzyn !!!"
            title = "Last transaction successful"
            openNotification(msg, title, 'SUCCESS')
            this.setState({ isCalledSuccessNotify: true })
            break;
          case 'FAILED':
            message.error('Last transaction failure');
            title = "Last transaction failure"
            msg = 'Sorry your last transactions failed, kindly contact wehearyou@shenzyn.com or try again later.'
            openNotification(msg, title, 'FAILED')
            this.setState({ isCalledSuccessNotify: true })
            break;
          case 'CANCELLED':
            message.error('Last transaction failure');
            title = "Last transaction failure"
            msg = 'Sorry your last transactions failed, kindly contact wehearyou@shenzyn.com or try again later.'
            openNotification(msg, title, 'CANCELLED')
            this.setState({ isCalledSuccessNotify: true })
            break;
          default:
            break;
        }
      }
    }
    if (this.props && this.props.location.state && this.props.location.state.table !== undefined) {
      this.setState({ table: this.props.location.state.table });
    }

    this.partnerService.getBasicDetails().then((response) => {
      if (response.data.status === true) {
        localStorage.setItem('isPartner', response.data.isPartner);
        this.setState({
          basicDetails: response.data.data,
          isPartner: response.data.isPartner,
          SubscribedRecruiters: response.data.data.SubscribedRecruiters
        });
        if (response.data.isPartner) {
          response.data.data.assignedCompanies.forEach((obj) => {
            this.state.assignedCompanies.push(obj.companyName)
          });
        } else {
          let companyName = this.state.companyName
          this.partnerService.getPartnerCompanyDetails(companyName).then((response) => {
            if (response.data.status === true) {
              response.data.data.assignedCompanies.forEach((obj) => {
                this.state.assignedCompanies.push(obj.companyName)
              });
            }
          }).catch((err) => {
            console.log(err);
            this.errorHandler.customErrorCheck(err);
          });
        }

        this.partnerService.getAllPostedJobs(response.data.data.companyName).then((response) => {
          this.setState({ allPostedJobs: response.data.data });
        }).catch((err) => {
          console.log(err);
          this.errorHandler.customErrorCheck(err);
        });
      }
    }).catch((err) => {
      console.log(err);
      this.errorHandler.customErrorCheck(err);
    });

    var data = {
      partnerEmail: this.state.partnerAdmin ? this.state.emailId : localStorage.getItem('partnerEmail')
    }
    if (this.state.partnerAdmin) {
      let partnerData = {
        partnerEmail: this.state.emailId,
        companyName: this.state.companyName
      }
      this.getAllCountsofApplicant(partnerData);
      this.checkSubscription();
      this.getEnrolledEvents(data);
      // this.getSubscriptionInfo();
    }
    else {
      let partnerData = {
        partnerEmail: this.state.emailId,
        enrolledPartner: localStorage.getItem('partnerEmail'),
        companyName: this.state.companyName
      }
      this.getAllCountsofApplicant(partnerData);
      this.getAssignedEvents();
    }



    // this.getAllEvents();
  }

  // checking Subscriptions
  subscriptionStatusNotification = (data) => {
    //TODO: We need to check subscription in case of recruiter as well
    if (this.state.partnerAdmin) {
      if (data) {
        // console.log(data);
        var msg = "";
        var title = "";
        if (!data.subscriptionExpiryDate) {
          msg = "Please subscribe any plans to use full features!";
          title = "Subscribe Plans";
          SubscriptionNotification(msg, title);
          this.setState({ isCalledSubscription: true });
        }
        // Checking Plans Expiration
        else if (moment(data.subscriptionExpiryDate) < moment.utc()) {
          msg = "Subscription is expired Please subscribe any plans to use full features";
          title = "Subscription Expired";
          ExpiredSubscription(msg, title);
          this.setState({ isCalledSubscription: true });
        }
      }
      else {
        msg = "Please subscribe any plans to use full features!";
        title = "Subscribe Plans";
        SubscriptionNotification(msg, title);
        this.setState({ isCalledSubscription: true });
      }
    }
  }

  // get Enrolled Events
  getEnrolledEvents(data) {
    if (data && data.partnerEmail !== '') {
      this.partnerService.getAllEnrolledEvents(data).then((response) => {
        // console.log(response,' its res of events');
        this.setState({ enrolledEvents: response.data.data });
      }).catch((err) => {
        console.log(err);
        this.errorHandler.customErrorCheck(err);
      });
    }
  }

  getAssignedEvents() {
    this.partnerService.getAllAssignedEvents().then((response) => {
      // console.log(response,' its res of events');
      this.setState({ enrolledEvents: response.data.data });
    }).catch((err) => {
      console.log(err);
      this.errorHandler.customErrorCheck(err);
    });
  }

  // check for active Subscription
  checkSubscription() {
    this.partnerService.getSubscription().then((res) => {
      // console.log(res, ' its res of subsscripe');
      if (res.data.status === true) {
        this.setState({ subscriptionInfo: res.data.data });
        if (res.data.data && res.data.data.length > 0 && res.data.data[0].txStatus !== '') {
          var txStatus = res.data.data[0].txStatus;
          if (txStatus) {
            this.setState({ isSubscribed: txStatus === 'SUCCESS' ? true : false });
            localStorage.setItem('isSubscribed', txStatus === 'SUCCESS' ? true : false);

          }
        }
        if (this.state.isCalledSubscription !== true) {
          this.subscriptionStatusNotification(res.data.data[0]);
        }
      }


    }).catch((err) => {
      console.log(err);
      this.errorHandler.customErrorCheck(err);
    })
  }

  // Get All Counts
  getAllCountsofApplicant(data) {
    this.partnerService.getCounts(data).then((r) => {
      // console.log(r, ' its data');
      if (r.data.status === true) {
        this.setState({ ApplicantStats: r.data.data });
      }
    }).catch((err) => {
      console.log(err);
      // this.errorHandler.customErrorCheck(err);
    })
  }


  jobEditRedirect = (id) => {
    localStorage.setItem("jobId", id);
    this.props.history.push("jobposting");

  }
  jobDelete = id => {
    //TODO call API to inactivate job and re render the table
  }
  eventDelete(id) {
    this.partnerService.inactiveEvents(id).then((response) => {
      this.getAllEvents();
      message.error(response.data.message);
    }).catch((err) => {
      console.log(err);
    });
  }
  eventEdit(id) {
    // console.log("eventEdit", id);
  }

  // It will Trigger if the Any Event is Enrolled
  enrollEventCallback = () => {
    // this.componentDidMount();
    var data = {
      partnerEmail: this.state.partnerAdmin ? this.state.emailId : localStorage.getItem('partnerEmail')
    }

    this.getEnrolledEvents(data);
    if (this.state.partnerAdmin) {
      let partnerData = {
        partnerEmail: this.state.emailId,
        companyName: this.state.companyName
      }
      this.getAllCountsofApplicant(partnerData);
    }
  }

  // clicked Event More Details
  eventDetails = (data) => {
    if (data) {
      var listofApplicants = [];
      if (data.listofApplicants.length > 0) {
        listofApplicants = data.listofApplicants
      }
      localStorage.removeItem('jobId');
      localStorage.removeItem('ObjectID');
      localStorage.setItem('ObjectID', data._id);
      localStorage.setItem('eventId', data.eventId);
      this.setState({
        eventTableShow: true,
        showCandidates: true,
        showEnrolledEventDetail: true,
        // table: '',
        clickedEventData: data,
        listofApplicants: listofApplicants,
        eventId: data.eventId
      });
    }
  }

  showJobDetailsModal = (data) => {
    if (data) {
      // console.log(data, ' its jobData');
      localStorage.removeItem('eventId');
      localStorage.removeItem('ObjectID');
      localStorage.setItem('jobTitle', data.jobTitle);
      localStorage.setItem('jobId', data.jobId);
      localStorage.setItem('ObjectID', data._id);
      // console.log(data);
      // this.setState({ showJobDetails: true, jobsData: data, table: '' });
      this.setState({ showShortlistedCompany: true, jobsData: data, table: '' }); // modal

    }
  }

  showEventDetailModal = (data) => {
    if (data) {
      this.setState({
        showEnrolledEventDetail: true,
      });
    }
  }
  // Recruiter Event Details 
  recruiterEventDetails = (data) => {
    if (data) {
      var listofApplicants = [];
      if (data.listofApplicants.length > 0) {
        listofApplicants = data.listofApplicants
      }
      localStorage.setItem('ObjectID', data._id);
      localStorage.setItem('eventId', data.eventId);
      this.setState({
        eventDetailShow: true,
        eventTableShow: true,
        clickedEventData: data,
        listofApplicants: listofApplicants,
        eventId: data.eventId
      });
    }
  }

  reload = () => {
    this.componentDidMount();
  }
  reloadList() {
  }
  closeViewRecruiterModal() {
    this.setState({ showViewModal: false });
  }
  handleRecruitersTab = () => {
    this.props.onChangeTable('recruiters');
  }
  render() {
    // Partner Dashboard 
    // if (this.state.partnerAdmin) {
    return (
      <div className="container-fluid">
        <div className="col-12">
          <Helmet>
            <script src='https://cdn.jsdelivr.net/npm/@widgetbot/crate@3' type="text/javascript" server={this.state.widgetServer} channel={this.state.widgetChannel} async defer>
              {
                `
                let serverId = document.currentScript.getAttribute('server');
                let channelId = document.currentScript.getAttribute('channel');
                var crate = new Crate({
                server: serverId, // Shenzyn-Support
                channel: channelId, // #general
                color: '#da588a'
               });
              `
              }
            </script>
          </Helmet>
          <ViewRecruiter
            recruiterData={this.state.recruiterDetails}
            visible={this.state.showViewModal}
            onClose={this.closeViewRecruiterModal.bind(this)} />
          <AboutCompany
            isPartnerAdmin={this.state.partnerAdmin}
            // onChangeTable={this.showDefaultTable.bind(this)}
            accountStats={this.state.ApplicantStats}
            details={this.state.basicDetails} />
          <ViewShortlistedCompanyDetailModal
            visible={this.state.showShortlistedCompany}
            jobData={this.state.jobsData}
            applicantData={this.state.listofApplicants}
            Reload={this.reloadList}
            // tableData={this.state.selectedJobData}
            onClose={this.closeShortlistedCompanyModal.bind(this)} />
          <ViewEnrolledEventDetailModal
            visible={this.state.showEnrolledEventDetail}
            clickedEventData={this.state.clickedEventData}
            applicantData={this.state.listofApplicants}
            Reload={this.reloadList}
            isSubscribed={this.state.isSubscribed}
            // tableData={this.state.selectedJobData}
            onClose={this.closeEnrolledEventDetailModal.bind(this)} />
        </div>

        <div className="col-md-12">
          <Tabs defaultActiveKey="1" className="mt-3 partner-tabs">
            <TabPane id="partner_jobsTab" tab="Jobs" key="1">
              <div className="row">
                <div className="col-md-8">
                  <div>
                    <ShortlistedJobsTable
                      isPartnerAdmin={this.state.partnerAdmin}
                      showDetails={this.showJobDetailsModal.bind(this)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-4">
                    <LatestJobsPosting
                      showAllEvents={this.state.partnerAdmin}
                      enrollEventList={this.enrollEventCallback.bind(this)}
                      assignedCompanies={this.state.assignedCompanies}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane id="partner_EventsTab" tab="Events" key="2">
              <div className="row">
                <div className="col-md-8">
                  <EnrolledEventsTable
                    isPartnerAdmin={this.state.partnerAdmin}
                    showDetails={this.showEventDetailModal.bind(this)}
                    arrData={this.state.enrolledEvents}
                    clickEvent={this.eventDetails}
                    editJobCB={this.jobEditRedirect}
                    deleteJobCB={this.jobDelete}
                  />
                </div>
                <div className="col-md-4">
                  <div className="mb-4">
                    <UpcomingEvents
                      showAllEvents={this.state.partnerAdmin}
                      enrollEventList={this.enrollEventCallback.bind(this)}
                    />
                  </div>
                </div>
              </div>
            </TabPane>
            {this.state.partnerAdmin ? (
              <TabPane id="partner_RecruitersTab" tab="Recruiters" key="3" onChange={this.handleRecruitersTab}>
                <div className="row">
                  <div className="col-md-9">
                    <RecruitersTable
                      recruitersCount={this.state.SubscribedRecruiters}
                      showRecruiterDetails={this.showRecruiterDetailsView}
                    />
                  </div>
                  <div className="col-md-3">


                  </div>
                </div>
              </TabPane>) : ''
            }
          </Tabs>
        </div>
      </div>
    )
    // }

    // Recruiter Dashboard
    //   else {
    //     return (
    //       <div className="container-fluid">
    //         <div className="col-12">
    //           <AboutCompany
    //             isPartnerAdmin={this.state.partnerAdmin}
    //             onChangeTable={this.showDefaultTable.bind(this)}
    //             details={this.state.basicDetails} />
    //         </div>

    //         <div className="row">
    //           <div className="col-8">
    //             <div className="mt-3 col-12 mb-4">
    //               {this.state.eventTableShow === false && this.state.showJobDetails === false ?
    //                 (<JobStats details={this.state.ApplicantStats}></JobStats>) :
    //                 ''
    //               }
    //               {this.state.eventTableShow ? (
    //                 <div>
    //                   <EventDetailsCard
    //                     clickedEventData={this.state.clickedEventData}
    //                   />
    //                   <EnrolledEventsCandidatesListTable
    //                     data={this.state.listofApplicants}
    //                     isSubscribed={this.state.isSubscribed}
    //                     Reload={this.reload}
    //                   onChangeTable={this.showTable.bind(this)}
    //                   />
    //                 </div>

    //               ) : (<div></div>)
    //               }
    //               {this.state.showJobDetails ? (
    //                 <div>
    //                   <JobDetailsCard
    //                     clickedEventData={this.state.jobsData} />
    //                   <JobCandidatesList
    //                     jobData={this.state.jobsData}
    //                     data={this.state.listofApplicants}
    //                     Reload={this.reloadList}
    //                     onChangeTable={this.showDefaultTable.bind(this)}
    //                   />
    //                 </div>

    //               ) : (<div></div>)
    //               }

    //             </div>
    //             <div className="mt-3 col-12 mb-4">
    //               {
    //                 this.state.table === 'jobs' ?
    //                   <ShortlistedJobsTable
    //                     isPartnerAdmin={false}
    //                     showDetails={this.showJobDetailsModal.bind(this)}
    //                     onChangeTable={this.showDefaultTable.bind(this)}
    //                   />
    //                   : (
    //                     this.state.table === 'events' ?
    //                       <EnrolledEventsTable
    //                         arrData={this.state.enrolledEvents}
    //                         clickEvent={this.eventDetails}
    //                         editJobCB={this.jobEditRedirect}
    //                         deleteJobCB={this.jobDelete} />
    //                       : ("")
    //                   )
    //               }

    //             </div>
    //           </div>
    //           <div className="col-4">
    //             <div className="mt-3 col-12 mb-4">
    //               <UpcomingEvents
    //                 showAllEvents={this.state.partnerAdmin}
    //                 enrollEventList={this.enrollEventCallback.bind(this)} />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )
    //   }
  }
}

export default Dashboard;
