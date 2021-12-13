import React from 'react';
import Moment from 'react-moment';

const paragraph = {
  minHeight: '120px',
  overflow: 'hidden',
  // overflowY: 'scroll',
  width: '100%'
}
class EventDetailsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultCompanyLogo: "assets/partner/company_default.png",
    }
  }
  render() {
    const eventData = this.props.clickedEventData;
    // console.log("EVENT DATA--->", eventData)
    return (

      <div style={{ borderRadius: '5px', boxShadow: '0px 0px 35px #00000029', background: '#fff', padding: '20px', marginBottom: '18px' }}>
        <div className="container pb-3">
          <div className="row">
            <div className="col-sm-12 pt-4">
              <div className="row">
                <div className="col-sm-4 company-info-modal p-2 text-center">
                  <img src={eventData.companyLogo !== '' ? eventData.companyLogo : this.state.defaultCompanyLogo} alt="Company Logo" />
                  <h4>{eventData.companyName}</h4>
                  {/* <p className="mb-0"> {this.state.selectedCompany.length > 0 ? this.state.selectedCompany[0].location : 'Not Mentioned'} </p>
                  <p className="mb-0"> {this.state.selectedCompany.length > 0 ? <a href={this.state.selectedCompany[0].website} target="_blank" rel="noopener noreferrer"> {this.state.selectedCompany[0].website} </a> : 'Not available'} </p> */}
                </div>
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm-6">
                      <h5>Location:</h5>
                      <p>{eventData.eventLocation ? eventData.eventLocation : 'N/A'}</p>
                    </div>
                    <div className="col-sm-6">
                      <h5>Date:</h5>
                      <p>
                        <Moment format="DD MMMM YYYY">
                          {eventData.eventDate}
                        </Moment>
                      </p>
                    </div>
                    <div className="col-sm-6">
                      <h5>Experience:</h5>
                      <p>{eventData.minexperience ? eventData.minexperience : '0'} - {eventData.maxexperience ? eventData.maxexperience : '0'} yrs</p>
                    </div>
                    <div className="col-sm-6">
                      <h5>Positions:</h5>
                      <p>{eventData.openPositions ? eventData.openPositions : 'N/A'}</p>
                    </div>
                    <div className="col-sm-6">
                      <h5>Footfall:</h5>
                      <p>{eventData.maximumFootfall ? eventData.maximumFootfall : '0'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 pt-1">
              <h5>Description:</h5>
              <p style={paragraph}>{eventData.eventDescription ? eventData.eventDescription : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default EventDetailsCard;