import { Carousel, Tooltip } from 'antd';
import React from 'react';
import { FaCalendar, FaLocationArrow } from 'react-icons/fa';
import Moment from 'react-moment';
import partnerService from "../../../services/partnerService";
import ViewAllEventsModal from './ViewAllEventsModal';

const StyleSheet_BoxProperties = {
    boxShadow: '0px 0px 35px #00000029',
    minHeight: '300px'
}

class UpcomingEvents extends React.Component {
    constructor() {
        super();
        var isPartner = localStorage.getItem('isPartner');
        var email = localStorage.getItem('email');
        var companyName = localStorage.getItem('companyName');
        this.state = {
            showTable: "",
            showViewAllEventModal: false,
            isPartner: isPartner === 'true' ? true : false,
            companyName: companyName,
            emailId: email,
            eventsList: [],
            defaultCompanyLogo: "assets/partner/company_default.png",
        }
        this.partnerService = new partnerService();
    }
    componentDidMount() {
        // console.log(this.props, ' its events Props');
        this.getAllEvents()
        //TODO : Remove 
        // if (this.state.isPartner) {
        //     this.getAllEvents()
        // }
        // else {
        //     this.getAllEvents();
        // }
    }

    getAllEvents() {
        this.partnerService.getAllEvents().then((response) => {
            // console.log(response.data.data, ' its res of events');
            // this.setState({ eventsList: response.data.data });
            this.setState({ eventsList: response.data.data.user });
        }).catch((err) => {
            console.log(err);
        });
    }

    // Methods
    showViewAllEventsModal = () => {
        this.setState({ showViewAllEventModal: true });
    }
    closeViewAllEventsModal = () => {
        this.setState({ showViewAllEventModal: false });
    }

    // It will Trigger After Enroll the Each Events
    subscribeCallback = () => {
        this.componentDidMount();
        this.props.enrollEventList();
    }


    render() {
        const { showViewAllEventModal } = this.state;
        const { showAllEvents } = this.props;
        // console.log("this.state.eventsList ", this.state.eventsList);
        // if (showAllEvents)
            return (
                <section className="row" >
                    <ViewAllEventsModal
                        visible={showViewAllEventModal}
                        onClose={this.closeViewAllEventsModal.bind(this)}
                        eventsListData={this.state.eventsList}
                        afterSubscribed={this.subscribeCallback.bind(this)} />

                    {/* <ViewAllJobsModal
                        visible={showViewAllJobsModal}
                        onClose={this.closeViewAllEventsModal.bind(this)} /> */}

                    <div className="col">
                        <div className="JobStatsWrapper" style={StyleSheet_BoxProperties}>
                            <div className="top-button-wrapper row justify-content-between" style={{ padding: '0 20px' }}>
                                <p style={{
                                    textAlign: 'left',
                                    fontFamily: 'Helvetica',
                                    letterSpacing: '0px',
                                    color: '#D45895',
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    padding: '10px 15px 0 10px'
                                }}>Upcoming Events</p>
                                <p style={{
                                    textAlign: 'left',
                                    fontFamily: 'Helvetica',
                                    letterSpacing: '0px',
                                    color: '#D45895',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    padding: '10px 10px 0 15px',
                                    cursor: 'pointer'
                                }} id="Partner_UpComingEvents_ViewAll" onClick={() => this.showViewAllEventsModal()}>view all</p>
                            </div>
                            <Carousel autoplay>
                                {
                                    this.state.eventsList.length > 0 ?
                                        this.state.eventsList.map((eve, i) => (
                                            <div className="px-3">
                                                <div key={i} className="job-list-item card" >
                                                    <div id={"Partner_Events_UpComingEvents_"+eve._id} className="job-container-card mb-2">
                                                        <Tooltip title={eve.companyName}>
                                                            <img
                                                                src={eve.companyLogo !== '' ? eve.companyLogo : this.state.defaultCompanyLogo}
                                                                alt={eve.companyName}
                                                                style={{ paddingTop: '8px', height: '65px' }}
                                                            />
                                                        </Tooltip>
                                                        <div className="justify-content-between text-left">
                                                            <div style={{ padding: '5px 10px' }}>
                                                                <Tooltip placement="left" title="Event Date">
                                                                    <FaCalendar style={{ color: '#A75A8D', marginRight: '10px' }} />
                                                                </Tooltip>
                                                                <Moment format="DD MMMM YYYY">
                                                                    {eve.eventDate}
                                                                </Moment>
                                                            </div>
                                                            <div style={{ padding: '5px 10px' }}>
                                                                <Tooltip placement="left" title="Location">
                                                                    <FaLocationArrow style={{ color: '#A75A8D', marginRight: '10px' }} />
                                                                </Tooltip>
                                                                {eve.eventLocation}
                                                            </div>
                                                        </div>

                                                    </div>

                                                    <div className="">
                                                       <Tooltip placement="left" title="Event Title">
                                                            <div className="justify-content-between row" style={{ padding: '10px 0 0 20px' }}>
                                                                <h4 className="event-title">{eve.eventName}</h4>
                                                                {/* <div style={{ width: '20%' }}>
                                                                    <FaChevronRight style={{ color: '#A75A8D', fontSize: '22px', margin: '25px' }} />
                                                                </div> */}
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        (
                                            <div>
                                                No Events Found
                                            </div>
                                        )
                                }
                            </Carousel>
                        </div>
                    </div>
                </section >
            )
        // else
        //     return (
        //         <div>

        //         </div>
        //     )
    }
}

export default UpcomingEvents;