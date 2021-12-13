import { message, notification } from 'antd';
import React from 'react';
// import EventDetailsCard from './EventDetailsCard';
// import EnrolledEventsCandidatesListTable from './EnrolledEventsCandidatesListTable';
import { MdSentimentVeryDissatisfied, MdSentimentVerySatisfied } from "react-icons/md";
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import partnerService from "../../../services/partnerService";
import AboutCompany from './AboutCompany';
import EnrolledEventsTable from './EnrolledEventsTable';
import ProfileTrainingPartner from './ProfileTrainingPartner';

// Notification
const openNotification = (msg, title, status) => {
  notification.open({
    message: title,
    description: msg,
    duration: 8,
    icon: status === 'FAILED' ? <MdSentimentVeryDissatisfied /> : <MdSentimentVerySatisfied />,
  });
};

class Dashboard extends React.Component {
  constructor() {
    super();
    var email = localStorage.getItem('email');
    var companyName = localStorage.getItem('companyName');
    var isPartner = JSON.parse(localStorage.getItem('isPartner'));
    this.state = {
      emailId: email,
      companyName: companyName,
      partnerAdmin: isPartner,
      basicDetails: {},
      jobStats: {},
      allPostedJobs: [],
      table: "",
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
      showRecruiter: false,
      trainingEvents: []
    }
    this.partnerService = new partnerService();
    this.errorHandler = new errorHandler();
    this.eventDelete = this.eventDelete.bind(this);
    this.eventDetails = this.eventDetails.bind(this);
    this.recruiterEventDetails = this.recruiterEventDetails.bind(this);
    // this.reload = this.reload.bind(this);
    // this.checkSubscription = this.checkSubscription.bind(this);
    // this.showRecruiters = this.showRecruiters.bind(this);
    // this.getAllEvents = this.getAllEvents.bind(this);
  }
  // Partners Dashboard Different View
  showTable = (tableName) => {
    // console.log(tableName, ' its tableName ');
    this.componentDidMount();
    this.setState({
      table: tableName,
      // eventDetailShow: !this.state.eventDetailShow,
      eventTableShow: !this.state.eventTableShow
    })
  }

  // Showing Rectrruiter Table
  showRecruiters = (tableName) => {
    this.componentDidMount();
    this.setState({
      table: tableName,
      eventDetailShow: !this.state.eventDetailShow,
      eventTableShow: false
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
    // console.log(this.props, ' its coming from txt');
    if (this.props && this.props.location.state && this.props.location.state.txStatus !== undefined) {
      var txStatus = this.props.location.state.txStatus;
      // console.log(txStatus);
      var msg = "";
      var title = "";
      if (txStatus) {
        switch (txStatus) {
          case 'SUCCESS':
            message.success('Last transaction successful');
            msg = " Welcome to Shenzyn family !!!"
            title = "Last transaction successful"
            openNotification(msg, title, 'SUCCESS')
            break;
          case 'FAILED':
            message.error('Last transaction failure');
            title = "Last transaction failure"
            msg = 'Sorry your last transactions failed, kindly contact wehearyou@shenzyn.com or try again later '
            openNotification(msg, title, 'FAILED')
            break;
          case 'CANCELLED':
            message.error('Last transaction failure');
            title = "Last transaction failure"
            msg = 'Sorry your last transactions failed, kindly contact wehearyou@shenzyn.com or try again later '
            openNotification(msg, title, 'CANCELLED')
            break;
          default:
            break;
        }
      }
    }
    // var isPartner = JSON.parse(localStorage.getItem('isPartner'));
    // this.setState({ isPartner: isPartner });
    // this.setState({ showRecruiter: this.state.isPartner ? true : false });

    this.partnerService.getBasicDetails().then((response) => {
      // console.log(response,' its res');
      if (response.data.status === true) {
        // localStorage.setItem('isPartner', response.data.isPartner);
        this.setState({ basicDetails: response.data.data, isPartner: response.data.isPartner });
        this.partnerService.getAllPostedJobs(response.data.data.companyName).then((response) => {
          // console.log(response.data.data);
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

  }

  // Check the Subscription Status for Partner To Restrict the Actions Of Partner
  getSubscriptionInfo() {
    this.partnerService.getSubscription().then((res) => {
      // console.log(res);
      if (res.data.status === true) {
        this.setState({ subscriptionInfo: res.data.data });
        if (res.data.data[0].txStatus !== '') {
          var txStatus = res.data.data[0].txStatus;
          if (txStatus) {
            this.setState({ isSubscribed: txStatus === 'SUCCESS' ? true : false });
            localStorage.setItem('isSubscribed', txStatus === 'SUCCESS' ? true : false);
            // switch (txStatus) {
            //   case 'SUCCESS':
            //     this.setState({ isSubscribed: true });
            //     localStorage.setItem('isSubscribed', true);
            //     break;
            //   case 'FAILED':
            //     this.setState({ isSubscribed: false });
            //     localStorage.setItem('isSubscribed', false);
            //     break;
            //   default:
            //     break;
            // }
          }
        }
      }
    }).catch((err) => {
      this.errorHandler.customErrorCheck(err)
    });
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
  c
  // check Subscription
  checkSubscription = () => {
    this.partnerService.getSubscription().then((res) => {
      // console.log(res, ' its res of subsscripe');
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
      this.errorHandler.customErrorCheck(err);
    })
  }


  jobEditRedirect = (id) => {
    localStorage.setItem("jobId", id);
    this.props.history.push("jobposting");

  }
  jobDelete = id => {
    //TODO call API to inactivate job and re render the table
  }
  // recruiterUpdate = emailId => {
  //   //TODO, open add recruiter modal for edit
  // }
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
    this.componentDidMount();
  }

  // clicked Event More Details
  eventDetails = (data) => {
    if (data) {
      var listofApplicants = [];
      if (data.listofApplicants.length > 0) {
        listofApplicants = data.listofApplicants
      }
      localStorage.setItem('ObjectID', data._id);
      localStorage.setItem('eventId', data.eventId);
      this.setState({ eventTableShow: true, clickedEventData: data, listofApplicants: listofApplicants, eventId: data.eventId });
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
      this.setState({ eventDetailShow: true, eventTableShow: true, clickedEventData: data, listofApplicants: listofApplicants, eventId: data.eventId });
    }

  }

  render() {

    return (
      <div className="">

        {/* top section contents starts*/}
        <div className="col-12">
          <AboutCompany showRecruiter={this.state.partnerAdmin} onChangeTable={this.showRecruiters.bind(this)} details={this.state.basicDetails}></AboutCompany>
        </div>
        {/* top section contents ends */}

        <div className="row">
          {/* left side contents */}
          <div className="col-8">
            <div className="mt-3 col-12 mb-4">
              <EnrolledEventsTable />
            </div>
          </div>
          {/* left side contents ends */}


          {/* right side contents of training partner*/}
          <div className="col-4">
            <div className="mt-3 col-12 mb-4">
              <ProfileTrainingPartner basicData={this.state.basicDetails}></ProfileTrainingPartner>
            </div>
          </div>
          {/* right side contents ends */}
        </div>
      </div>
    )
  }
}
export default Dashboard;
