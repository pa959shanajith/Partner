import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import Subscription from './SubscriptionModal';
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';

const StyleSheet_ProfileImage = {
    borderRadius: 0,
    boxShadow: 'none',
    marginBottom: '0',
}

let backgroundImageRight = 'assets/images-demo/assets/plant1.png'
// let backgroundImageLeft = 'assets/images-demo/assets/plant_.png'

const StyleSheet_ProfileCard = {
    textAlign: 'left',
    padding: '0',
    backgroundImage: `url(${backgroundImageRight})`,
    backgroundSize: 'cover',
    backgroundPosition: 'bottom right'
}
const StyleSheet_GirlImage = {
    // maxWidth: 'fit-content',
    // max-width: 281px; for devices less that 1200 px width
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

// const StyleSheet_DefaultButton = {
//     color: '#fff',
//     fontSize: '15px',
//     background: 'linear-gradient(270deg, #B446FF 0%, #6D68FE 28%, #4C46E6 70%, #9700FF 100%)',
//     border: '1px solid #E3E3E3',
//     borderRadius: '8px',
//     width: '160px',
//     height: '55px',
//     margin: '4px 8px',
//     textAlign: 'left'
// }
// const StyleSheet_OutlinedButton = {
//     color: '#ef5869',
//     fontSize: '15px',
//     border: '3px solid #ef5869',
//     borderRadius: '8px',
//     width: '160px',
//     padding: '0 20px',
//     height: '50px',
//     margin: '4px 8px',
//     textAlign: 'center',
//     fontWeight: 600
// }
// const StyleSheet_IconButton = {
//     color: '#707070',
//     // border: '1px solid #707070'
// }
class AboutCompany extends Component {
    constructor() {
        super();
        var isRecruiter = localStorage.getItem('isRecruiter');
        var customerEmail = localStorage.getItem('email'),
            customerPhone = localStorage.getItem('contactNo')
        this.state = {
            showTable: "",
            showCompanyModal: false,
            isRecruiter: isRecruiter === 'true' ? true : false,
            showSubscription: false,
            subscriptionInfo: [],
            paymentDetails: [],
            customerEmail:customerEmail,
            customerPhone:customerPhone
        }
        // this.ShowSubscription = this.ShowSubscription.bind(this);
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
    }

    componentDidMount() {
        this.partnerService.getSubscription().then((res) => {
            // console.log(res, ' its res in modal');
            if (res.data.status === true) {
                this.setState({ subscriptionInfo: res.data.data });
            }
        }).catch((err) => {
            this.errorHandler.customErrorCheck(err)
        });
        var data = {
            customerPhone: localStorage.getItem('contactNo')
        }
        this.partnerService.getPaymentDetails(data).then((res) => {
            // console.log(res,' its res of getPaymentDetails');
            if (res.data.status === true) {
                this.setState({ paymentDetails: res.data.data })
            }
        }).catch((err) => {
            this.errorHandler.customErrorCheck(err);
        })
    }

    handlePostAJob = () => {
        localStorage.setItem('jobId', 0);
        this.props.history.push("jobposting");
    }
    handleJobTable = () => {
        this.props.onChangeTable('events');
    }
    handleTrainingsTable = () => {
        this.props.onChangeTable('recruiters');
    }
    // Show Subscription Modal
    ShowSubscription = () => {
        this.setState({ showSubscription: true });
    }
    // close Subscription
    closeSubscription = () => {
        this.setState({ showSubscription: false })
    }

    render() {
        // const { details, showRecruiter } = this.props;
        const { details } = this.props;
        // const { showCompanyModal, isRecruiter } = this.state;
        return (
            <section className="profile-card-v2 mx-0 h-100 mt-4 row" style={StyleSheet_ProfileCard} >
                <Subscription paymentData={this.state.paymentDetails} subscriptionData={this.state.subscriptionInfo} visible={this.state.showSubscription} onClose={this.closeSubscription} />
                <div className="col-lg-2 text-center">
                    <div className="pt-5">
                        <img style={StyleSheet_ProfileImage} src={details.logo} alt="Company Logo" />
                    </div>
                </div>
                <div className="col-lg-5">
                    <div>
                        <h2 className="pt-5" style={StyleSheet_Heading2}>{details.companyName}</h2>
                        <h4 className="pt-3" style={StyleSheet_Heading4}>{details.address}, {details.location} {details.contactNo}  </h4> {/*<Button icon="edit" style={StyleSheet_IconButton}></Button> */}
                        <h4 className="pt-3" style={StyleSheet_Heading6}><a href={details.website} target="_blank" rel="noopener noreferrer" >{details.website}</a> </h4>
                    </div>
                </div>
                {/* <div className="col-lg-2 mt-5">
                    {showRecruiter ? (<Button onClick={this.handleTrainingsTable} style={StyleSheet_OutlinedButton}>Recruiters</Button>) : ("")}
                    {showRecruiter ? (<Button onClick={this.ShowSubscription} style={StyleSheet_OutlinedButton}>Subscriptions</Button>) : ("")}
                </div> */}
                <div className="col-lg-3">
                    <img style={StyleSheet_GirlImage} src={'assets/images-demo/assets/banner_girl.png'} alt="Banner" />
                </div>
            </section>
        )
    }
}

export default withRouter(AboutCompany);