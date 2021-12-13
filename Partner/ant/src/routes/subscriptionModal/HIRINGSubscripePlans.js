import React from 'react';
import { message} from 'antd';
import partnerService from "../../services/partnerService";
import HIRINGSubscriptionModal from '../dashboard/components/SubscriptionModal';

// const SubscriptionNotification = (msg, title) => {
//     notification.open({
//         message: title,
//         description: msg,
//         duration: 8,
//         icon: <FaCreditCard />,
//     });
// }
class HIRINGSubscripePlans extends React.Component {
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
            hiringStatusTxt: "",
            BasicPlanStatus: false,
            basicplan: false,

        }
        this.partnerService = new partnerService();
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    // componentWillMount(){
    //     console.log("Will Mount")
    // }
    componentDidMount() {
        if (this.state.partnerType === "HIRING") {
            this.getHiringPartnerSubscription();
            var data = {
                customerPhone: this.state.customerPhone
            }
            this.partnerService.getPaymentDetails(data).then((res) => {
                // console.log(res,' its res of getPaymentDetails');
                if (res.data.status === true) {
                    this.setState({ hiringPaymentDetails: res.data.data, showHiringSubscription: true, hiringStatusTxt: this.state.hiringTxStatus })
                }
            }).catch((err) => {
                console.log(err);
                message.error('Failed To Get Payment Details');
                // this.errorHandler.customErrorCheck(err);
            })
        }
    }
    getHiringPartnerSubscription = () => {
        this.partnerService.getSubscription().then((res) => {
            // console.log(res, ' its res in modal');
            if (res.data.status === true) {
                this.setState({ hiringSubscriptionInfo: res.data.data, hiringTxStatus: res.data.data && res.data.data.length > 0 && res.data.data[0].txStatus ? res.data.data[0].txStatus : '' });
            }
        }).catch((err) => {
            console.log(err);
            message.error('Failed To Get Payment Details');
            // this.errorHandler.customErrorCheck(err)
        });
    }


    // close Hiring partner Subscription
    closeHiringSubscription = () => {
        this.setState({ showHiringSubscription: false, hiringStatusTxt: '' });
        this.props.closeModal();
        this.componentDidMount();
    }

    render() {
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
                <HIRINGSubscriptionModal txStatus={this.state.hiringStatusTxt} paymentData={this.state.hiringPaymentDetails} subscriptionData={this.state.hiringSubscriptionInfo} visible={this.state.showHiringSubscription} onClose={this.closeHiringSubscription} />
            </div>
        )
    }
}

export default HIRINGSubscripePlans;