import { Modal, message, Button } from 'antd';
import React from 'react';
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import Moment from 'react-moment';
import moment from 'moment';

class SubscriptionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            visible: false,
            current: 0,
            subscriptionInfo: {},
            btnDisable: false,
            paymentCheck: false,
            txStatus: ''
        };
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.SubscriptionCheck = this.SubscriptionCheck.bind(this);
    }
    handleCancel = () => {
        this.props.onClose();
    };

    componentWillReceiveProps(props) {
        if (props.txStatus !== this.props.txStatus) {
            // console.log(props,' its props');
            // console.log(moment(props.subscriptionData[0].subscriptionExpiryDate) < moment.utc(), 'its date compare');
            var txStatus = props.txStatus
            if (txStatus === "SUCCESS") {
                // message.success('You Are Already Subscribed')
                this.setState({ btnDisable: true, txStatus: txStatus,subscriptionInfo:props.subscriptionData && props.subscriptionData.length > 0 ? props.subscriptionData[0]:{}})
            }
            this.setState({
                postUrl: props.paymentData.postUrl,
                paymentData: props.paymentData
            })
        }

    }
    SubscriptionCheck = () => {
        message.success('You have already subscribed valid Plans');
        // this.setState({ paymentCheck: true });
    }

    render() {
        const visible = this.props.visible;
        const companyName = localStorage.getItem('companyName');
        var subscriptionInfo = this.props.subscriptionData;
        var paymentData = this.props.paymentData;
        // var txStatus = this.props.txStatus
        // console.log(subscriptionInfo, ' its state ');
        // console.log(paymentData, ' its paymentData');

        return (
            <Modal
                visible={visible}
                maskClosable={true}
                onCancel={this.handleCancel}
                footer={null}
                width='66%'
                className="subscription-modal"
            >
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3 style={{ marginRight: '15px', fontWeight: '600', color: '#707070', fontSize: '28px' }} >Choose Your Plan</h3>
                        </div>
                    </div>
                    <hr />
                    {/* style={effect1} */}
                    <div class="row">
                        <div class="col-sm-8 row">
                            {this.state.txStatus === 'SUCCESS' && this.state.subscriptionInfo.subscriptionExpiryDate && moment(this.state.subscriptionInfo.subscriptionExpiryDate) > moment.utc() ? (
                                <div>
                                    <div className='its_dummy' id="redirectForm">
                                        <input type="radio" name="radios" id="7d" class="invisible-radio" />
                                        <input type="hidden" name="appId" />
                                        <input type="hidden" name="orderId" />
                                        <input type="hidden" name="orderAmount" />
                                        <input type="hidden" name="orderCurrency" />
                                        <input type="hidden" name="orderNote" />
                                        <input type="hidden" name="customerName" />
                                        <input type="hidden" name="customerEmail" />
                                        <input type="hidden" name="customerPhone" />
                                        <input type="hidden" name="returnUrl" />
                                        <input type="hidden" name="notifyUrl" />
                                        <input type="hidden" name="signature" />

                                        <div className="styled-radio payment__box__wrapper">
                                            <div className="payment__box">
                                                <h4>{paymentData ? paymentData.orderAmount6mSubscription + ' INR' : ''}</h4>
                                                <p>6 Months</p>
                                                <p>Single User</p>
                                                {/* disabled={this.state.btnDisable} */}
                                                <Button id={"Partner_subscription_singleUser_Buy_"+paymentData.orderId} onClick={this.SubscriptionCheck} type="submit"
                                                    style={{ borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                >Buy</Button >
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                                :
                                (
                                    <div>
                                        <form method="post" id="redirectForm" action={paymentData.postUrl}   >
                                            <input type="radio" name="radios" id="7d" class="invisible-radio" />
                                            <input type="hidden" name="appId" value={paymentData.appId} />
                                            <input type="hidden" name="orderId" value={paymentData.orderId} />
                                            <input type="hidden" name="orderAmount" value={paymentData.orderAmount6mSubscription} />
                                            <input type="hidden" name="orderCurrency" value={paymentData.orderCurrency} />
                                            <input type="hidden" name="orderNote" value={paymentData.orderNote} />
                                            <input type="hidden" name="customerName" value={paymentData.customerName} />
                                            <input type="hidden" name="customerEmail" value={paymentData.customerEmail} />
                                            <input type="hidden" name="customerPhone" value={paymentData.customerPhone} />
                                            <input type="hidden" name="returnUrl" value={paymentData.returnUrl} />
                                            <input type="hidden" name="notifyUrl" value={paymentData.notifyUrl} />
                                            <input type="hidden" name="signature" value={paymentData.signature6mSubscription} />

                                            <div className="styled-radio payment__box__wrapper">
                                                <div className="payment__box">
                                                    <h4>{paymentData ? paymentData.orderAmount6mSubscription + ' INR' : ''}</h4>
                                                    <p>6 Months</p>
                                                    <p>Single User</p>
                                                    {/* disabled={this.state.btnDisable} */}
                                                    <button id={"Partner_subscription_singleUser_Buy_"+paymentData.orderId} type="submit"
                                                        style={{ borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                    >Buy</button >
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                            {/* onSubmit={this.onSubmit} */}
                            {this.state.txStatus === 'SUCCESS' && this.state.subscriptionInfo.subscriptionExpiryDate && moment(this.state.subscriptionInfo.subscriptionExpiryDate) > moment.utc() ?
                                (<div>
                                    <div className='its_dummy' id="redirectForm">
                                        <input type="radio" name="radios" id="7d" class="invisible-radio" />
                                        <input type="hidden" name="appId" />
                                        <input type="hidden" name="orderId" />
                                        <input type="hidden" name="orderAmount" />
                                        <input type="hidden" name="orderCurrency" />
                                        <input type="hidden" name="orderNote" />
                                        <input type="hidden" name="customerName" />
                                        <input type="hidden" name="customerEmail" />
                                        <input type="hidden" name="customerPhone" />
                                        <input type="hidden" name="returnUrl" />
                                        <input type="hidden" name="notifyUrl" />
                                        <input type="hidden" name="signature" />

                                        <div className="styled-radio payment__box__wrapper">
                                            <div className="payment__box">
                                            <h4>{paymentData ? paymentData.orderAmount12mSubscription + ' INR' : ''}</h4>
                                                <p>1 year</p>
                                                <p>5 Users</p>
                                                {/* disabled={this.state.btnDisable} */}
                                                <Button id={"Partner_subscription_5Users_Buy_"+paymentData.orderId} onClick={this.SubscriptionCheck} type="submit"
                                                    style={{ borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                >Buy</Button >
                                            </div>
                                        </div>
                                    </div>
                                </div>)
                                :
                                (<div>
                                    <form method="post" id="redirectForm" action={paymentData.postUrl}   >
                                        <input type="radio" name="radios" id="7d" class="invisible-radio" />
                                        <input type="hidden" name="appId" value={paymentData.appId} />
                                        <input type="hidden" name="orderId" value={paymentData.orderId} />
                                        <input type="hidden" name="orderAmount" value={paymentData.orderAmount12mSubscription} />
                                        <input type="hidden" name="orderCurrency" value={paymentData.orderCurrency} />
                                        <input type="hidden" name="orderNote" value={paymentData.orderNote} />
                                        <input type="hidden" name="customerName" value={paymentData.customerName} />
                                        <input type="hidden" name="customerEmail" value={paymentData.customerEmail} />
                                        <input type="hidden" name="customerPhone" value={paymentData.customerPhone} />
                                        <input type="hidden" name="returnUrl" value={paymentData.returnUrl} />
                                        <input type="hidden" name="notifyUrl" value={paymentData.notifyUrl} />
                                        <input type="hidden" name="signature" value={paymentData.signature12mSubscription} />

                                        <div className="styled-radio payment__box__wrapper">
                                            <div className="payment__box">
                                                <h4>{paymentData ? paymentData.orderAmount12mSubscription + ' INR' : ''}</h4>
                                                <p>1 year</p>
                                                <p>5 Users</p>
                                                <button id={"Partner_subscription_5Users_Buy_"+paymentData.orderId} type="submit"
                                                    style={{ cursor: 'pointer', borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none' }}
                                                >Buy</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>)
                            }

                        </div>

                        <div class="col-sm-4" style={{ borderLeft: '1px solid #dedede', marginLeft: '10px', margin: 'auto' }}>
                            <div className="col-sm-12" style={{ paddingTop: '15px', paddingBottom: '15px' }}>
                                <h4 className="text-uppercase text-bold">Subscription Status</h4>
                                <hr />
                                <h4>Company Name :</h4>
                                <p>{companyName}</p>
                                <h4>Last Payment :</h4>
                                <p>{subscriptionInfo.length > 0 ? (
                                    <Moment format="DD MMMM YYYY">
                                        {subscriptionInfo[0].subscriptionDate}
                                    </Moment>
                                ) :
                                    (
                                        <div>
                                            N/A
                                        </div>
                                    )
                                }</p>
                                <h4>Expiry Date :</h4>
                                <p>{subscriptionInfo.length > 0 ? (
                                    <Moment format="DD MMMM YYYY">
                                        {subscriptionInfo[0].subscriptionExpiryDate}
                                    </Moment>
                                ) :
                                    (
                                        <div>
                                            N/A
                                        </div>
                                    )
                                }</p>

                                <h4>Plan Validity :</h4>
                                <p>{subscriptionInfo.length > 0 ? Math.round(subscriptionInfo[0].subscriptionTerminMonths) + ' Months' : 'N/A'}</p>
                                <h4>Status :</h4>
                                <p>{subscriptionInfo.length > 0 ? (<span className="">{subscriptionInfo[0].txStatus}</span>) : 'N/A'}</p>
                                {/* <Radio.Group onChange={this.onChangePaymentMethodSelected} >
                                    <Radio value={'Net Banking'}>
                                        Cash Free
                                    </Radio>
                                    style={{backgroundColor:"#d3f261"}} 
                                    <Radio value={'Card Payment'}>
                                        Card Payment
                                    </Radio>
                                    <Radio value={'UPI'}>
                                        UPI
                                    </Radio>
                                    <Radio value={'Others'}>
                                        Others
                                    </Radio>
                                </Radio.Group> */}
                            </div>
                            {/* <div className="col-sm-12 text-center pt-4">
                                <Button
                                    style={{ borderRadius: '5px', paddding: '10px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none' }}
                                >Pay Now</Button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </Modal>

        );
    }

}
export default SubscriptionModal;