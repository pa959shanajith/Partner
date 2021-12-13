import { Modal, message, Button } from 'antd';
import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import dashboard from './Dashboard';
import _ from 'underscore';

const paragraph = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitLineClamp: '5', /* number of lines to show */
    webkitBoxOrient: 'vertical'
}
class ViewAllEventsModal extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        this.state = {
            emailId: email,
            loading: false,
            visible: false,
            current: 0,
            defaultCompanyLogo: "assets/partner/company_default.png",
            btnName1: 'ENROLL',
            btnName2: 'ENROLLED',
            btnColor1: '#D45895',
            btnColor2: "#5b8c00",
            textColor: '#FFF',
            btnDisable: false,
            assignedCompanies:[],
            expiredAssignedCompanies: [],
            eventPostedCompanyName: "",
            showRequestToAdminModal: false
        };
        this.partnerService = new partnerService();
        this.dashboard = new dashboard();
        this.errorHandler = new errorHandler();
        this.enrollEvent = this.enrollEvent.bind(this);
    }

    handleCancel = () => {
        this.props.onClose();
    };
    componentDidMount = () => {
        this.partnerService.getBasicDetails().then((response) => {
            if (response.data.status === true) {
                this.setState({ companyName : response.data.data.companyName })
                response.data.data.assignedCompanies.forEach((obj) => {
                    if(moment(obj.endDate)>moment.utc()){
                        this.state.assignedCompanies.push(obj.companyName)
                      }else{
                        this.state.expiredAssignedCompanies.push(obj.companyName)
                      }
                // this.state.assignedCompanies.push(obj.companyName)
              });
            }
          }).catch((err) => {
                console.log(err);
                this.errorHandler.customErrorCheck(err);
          });
    }
    // Enroll / Subscribe the Event
    enrollEvent = (event) => {
        this.setState({  eventPostedCompanyName: event.companyName})
        if(this.state.expiredAssignedCompanies.includes(event.companyName)){
            message.error("The company "+event.companyName+" in your grantee list has end date expired")
            this.setState({  showRequestToAdminModal:true });
        }else{
        if(this.state.assignedCompanies.includes(event.companyName) && event) {
        this.setState({ btnDisable: true })
            event.SubscribedBy = this.state.emailId;
            this.partnerService.enrollEvent(event).then((r) => {
                if (r.data.status === true) {
                    message.success('Events Enrolled Successfully');
                    this.props.afterSubscribed();
                    // this.dashboard.componentDidMount()
                }
            }).catch((err) => {
                console.log(err);
                this.errorHandler.customErrorCheck(err);
            })
    }else{
        message.error("Company not in grantee list")
        this.setState({  showRequestToAdminModal:true });
    }
}
    }
    handleCancelRequestAdminModal = () => {
        this.setState({showRequestToAdminModal:false})
    }
    requestAdminToAddCompany = (partnerCompanyName,eventPostedCompanyName) => {
        let data = {
            partnerCompanyName: partnerCompanyName,
            jobPostedCompanyname: eventPostedCompanyName
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

    // Event Enroll Check
    enrollCheck = (enrollData) => {
        var status, value;
        if (enrollData.length > 0) {
            status = enrollData.find(el => el === this.state.emailId)
            if (status) {
                value = true
            }
            else {
                value = false
            }
        }
        return value;

    }

    // btn color change
    btnColor = (enrollData) => {
        var status, btnColor;
        if (enrollData.length > 0) {
            status = enrollData.find(el => el === this.state.emailId)
            if (status) {
                btnColor = this.state.btnColor2
            }
            else {
                btnColor = this.state.btnColor1
            }

        }
        else {
            btnColor = this.state.btnColor1;
        }
        return btnColor;
    }

    // btn Name Change
    btnName = (enrollData) => {
        var status, btnName;
        if (enrollData.length > 0) {
            status = enrollData.find(el => el === this.state.emailId)
            if (status) {
                btnName = this.state.btnName2
            }
            else {
                btnName = this.state.btnName1
            }
        }
        else {
            btnName = this.state.btnName1;
        }
        return btnName;
    }


    render() {
        const visible = this.props.visible;
        var eventsList = this.props.eventsListData;
        eventsList = _.sortBy(eventsList, 'eventDate');
        // console.log(_.sortBy(eventsList, 'eventDate'));

        return (
            <div>
            <Modal
                visible={visible}
                maskClosable={true}
                onCancel={this.handleCancel}
                footer={null}
                width='70%'
                className="view-lineups-modal"
            >
                {
                    eventsList.length > 0 ? eventsList.map((ev, ind) => {
                        return (
                            <div key={ind} className="container">
                                {ev.eventEnrolledBy.length > 0 ? ev.eventEnrolledBy.map((ch, i) => {
                                    if (ch === this.state.emailId) {
                                        return (
                                            <div key={i}></div>
                                        )
                                    }
                                    else{
                                        return (<></>)
                                    }
                                }) : ''
                                }

                                <hr style={{ color: '1px solid rgba(112, 112, 112, .2)' }} />

                                <div className="event__list">
                                    <div className="row">
                                        <div className="col-sm-3 company__logo">
                                            <div className="text-center">
                                                <img src={ev.companyLogo !== '' ? ev.companyLogo : this.state.defaultCompanyLogo} alt={ev.companyName} />
                                                <p className="mt-1">{ev.companyName}</p>
                                            </div>
                                        </div>
                                        <div className="col-sm-9 company__event__details">
                                            <div className="row">
                                                <h4 style={{ marginRight: '15px', fontWeight: '600', color: '#D45895', fontSize: '24px' }}>
                                                    {ev.eventName}/
                                                <Moment format="DD-MM-YYYY">
                                                        {ev.eventDate}
                                                    </Moment>/
                                                {ev.eventLocation}</h4>
                                            </div>
                                            <div className="row pt-3">
                                                <div className="col-sm-4">

                                                    <div className="col-sm-12 dis-in">
                                                        <h5>Expected Footfall:</h5>
                                                        <p>{ev.maximumFootfall}</p>
                                                    </div>

                                                </div>
                                                <div className="col-sm-3">

                                                    <div className="col-sm-12 dis-in">
                                                        <h5>Experience:</h5>
                                                        <p>{ev.minexperience ? ev.minexperience : '0'} - {ev.maxexperience} yrs</p>
                                                    </div>
                                                </div>
                                                <div className="col-sm-2">
                                                    <div className="col-sm-12 dis-in">
                                                        <h5>Positions:</h5>
                                                        <p>{ev.openPositions}</p>
                                                    </div>
                                                </div>

                                                <div className="col-sm-3 company__enroll__icon">
                                                    <div onClick={() => this.enrollEvent(ev)}>
                                                        <Button id={"Partner_UpcomingEvents_Enroll_"+ev._id} disabled={this.enrollCheck(ev.eventEnrolledBy)} style={{ fontSize: '14px', color: '#fff', background: this.btnColor(ev.eventEnrolledBy), fontWeight: 600, }} >{this.btnName(ev.eventEnrolledBy)}</Button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-sm-8 dis-in">
                                                    <h5>Description:</h5>
                                                    <p style={paragraph}>
                                                        {ev.eventDescription}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }) :
                        (
                            <div>
                                No Events Found
                            </div>
                        )
                }

            </Modal>
            <Modal
                title={"Request Shenzyn admin to add company "+ this.state.eventPostedCompanyName + " to your grantee list"}
                visible={this.state.showRequestToAdminModal}
                onCancel={() => this.handleCancelRequestAdminModal()}
                footer={[
                <Button key={1}  onClick={() => this.requestAdminToAddCompany(this.state.companyName,this.state.eventPostedCompanyName)} type="default" style={{ marginRight: '12px' }}>Request </Button>,
                ]}
            >
            </Modal>
            </div>
        );
    }
}
export default ViewAllEventsModal;