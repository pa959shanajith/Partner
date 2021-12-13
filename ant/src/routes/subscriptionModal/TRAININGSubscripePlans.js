import React from 'react';
import partnerService from "../../services/partnerService";
import SubscriptionModal from '../dashboard-tp/components/SubscriptionModal';

// const SubscriptionNotification = (msg, title) => {
//     notification.open({
//         message: title,
//         description: msg,
//         duration: 8,
//         icon: <FaCreditCard />,
//     });
// }
class TRAININGSubscriptionPlans extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        // var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        var partnerAdmin = JSON.parse(localStorage.getItem('isPartner'));
        var partnerType = localStorage.getItem('partnerType'),
            customerPhone = localStorage.getItem('contactNo');
        this.state = {
            confirmDirty: false,
            loading: false,
            showAddModal: false,
            showViewModal: false,
            emailId: email,
            partnerType: partnerType,
            customerPhone: customerPhone,
            // authtoken: auth,
            companyName: companyName,
            partnerAdmin: partnerAdmin,
            isCalledSubscription: false,
            hiringSubscriptionInfo: [],
            hiringTxStatus: "",
            hiringPaymentDetails: {},
            showHiringSubscription: false,
            statusTxt: "",
            BasicPlanStatus: false,
            basicplan: false,
            showSubscription: false,
            paymentDetails:{},
            subscriptionInfo: [],
        }
        this.partnerService = new partnerService();
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    // componentWillMount(){
    //     console.log("Will Mount")
    // }
    componentDidMount() {
        if (this.state.partnerType === "TRAINING") {
            this.getTrainingpartnerSubscription();
            var data = {
                //TODO: Move all local store call in constructor or component did mount and use state object
                customerPhone: this.state.customerPhone
            }
            this.partnerService.getTrainingPaymentDetails(data).then((res) => {
                if (res.data.status === true) {
                    this.setState({ paymentDetails: res.data.data,showSubscription:true,statusTxt:this.state.statusTxt })
                }
            }).catch((err) => {
                this.errorHandler.customErrorCheck(err);
            })
        }
    }
    // getting Training Subscription Info
    getTrainingpartnerSubscription = () => {
        this.partnerService.getTrainingSubscription().then((res) => {
            // console.log(res,' its res');
            if (res.data.status === true) {
                this.setState({ txStatus: res.data.data && res.data.data.length > 0 && res.data.data[0].txStatus ? res.data.data[0].txStatus : '', subscriptionInfo: res.data.data })
            }
        }).catch((err) => {
            this.errorHandler.customErrorCheck(err);
        })
    }


    // close Hiring partner Subscription
    closeSubscription = () => {
        this.setState({ showSubscription: false, statusTxt: '',BasicPlanStatus: false });
        this.props.closeModal();
        this.componentDidMount();
    }
    // Reload After Activated Plan
    reload = () => {
        this.componentDidMount();
    }
    // Show Subscription Modal
    ShowSubscription = () => {
        this.setState({ showSubscription: true, statusTxt: this.state.txStatus, BasicPlanStatus: this.state.basicplan });
    }
    // // close Subscription
    // closeSubscription = () => {
    //     this.setState({ showSubscription: false, statusTxt: '', BasicPlanStatus: false });
    //     this.componentDidMount();
    // }

    render() {
        // console.log(' its inside training sub');
        // console.log(this.state.showSubscription,' its showSubscription');
        // const marginRight = {
        //     marginRight: '15px',
        //     paddingTop: '6px',
        //     color: '#fff',
        //     fontSize: '20px'
        // }
        // const headingStyle = {
        //     marginRight: '15px',
        //     fontWeight: '600',
        //     color: '#fff',
        //     fontSize: '28px'
        // }
        return (
            <div>
                <SubscriptionModal basicplan={this.state.BasicPlanStatus} reload={this.reload} txStatus={this.state.statusTxt} paymentData={this.state.paymentDetails} subscriptionData={this.state.subscriptionInfo} visible={this.state.showSubscription} onClose={this.closeSubscription} />
                {/* <HIRINGSubscriptionModal txStatus={this.state.hiringStatusTxt} paymentData={this.state.hiringPaymentDetails} subscriptionData={this.state.hiringSubscriptionInfo} visible={this.state.showHiringSubscription} onClose={this.closeHiringSubscription} /> */}
            </div>
        )
    }
}

export default TRAININGSubscriptionPlans;