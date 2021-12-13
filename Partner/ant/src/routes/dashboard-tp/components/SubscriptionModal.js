import { Modal, Button, message } from 'antd';
import React from 'react';
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import Moment from 'react-moment';
import moment from 'moment';

class SubscriptionModal extends React.Component {
    constructor(props) {
        super(props);
        const companyName = localStorage.getItem('companyName');
        this.state = {
            loading: true,
            visible: false,
            current: 0,
            subscriptionInfo: [],
            btnDisable: false,
            companyName: companyName
        };
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.basicPlan = this.basicPlan.bind(this);
    }
    handleCancel = () => {
        this.props.onClose();
    };

    componentWillReceiveProps(props) {
        // console.log(props,' its  props');
        // console.log(this.props,' its  this.props');
        if (props.txStatus !== this.props.txStatus || props.basicplan) {
            var txStatus = props.txStatus;
            // console.log(props,' its props inside if');
            if (txStatus === "SUCCESS") {
                message.success('You are already subscribed')
                this.setState({ btnDisable: true, txStatus: txStatus, subscriptionInfo: props.subscriptionData && props.subscriptionData.length > 0 ? props.subscriptionData[0] : {} })
            }
            else if (props.basicplan === true) {
                message.success('You are already subscribed for free Plan');
            }
            this.setState({
                postUrl: props.paymentData.postUrl,
                paymentData: props.paymentData
            })
        }
    }
    // basic Plan update
    basicPlan = () => {
        // console.log('Basic plan Clicked');
        this.partnerService.setBasicPlan().then((res) => {
            // console.log(res,' Basic Plan activated');
            if (res.data.status === true) {
                message.success('Basic plan activated successfully');
                this.props.reload();
            }
        }).catch((err) => {
            console.log(err);
            this.errorHandler.customErrorCheck(err);
        })
    }


    numDifferentiation = (value) => {
        var val = Math.abs(value)
        if (val >= 10000000) {
            val = (val / 10000000).toFixed(2) + ' Cr';
        } else if (val >= 100000) {
            val = (val / 100000).toFixed(2) + ' Lac';
        }
        // console.log(val, 'its val');

        return val;
    }

    SubscriptionCheck = () => {
        message.success('You have already subscribed valid plans');
        // this.setState({ paymentCheck: true });
    }

    //   console.log(numDifferentiation(-50000000))

    render() {
        const visible = this.props.visible;
        const companyName = this.state.companyName;
        var subscriptionInfo = this.props.subscriptionData;
        var paymentData = this.props.paymentData;

        return (
            <Modal
                visible={visible}
                maskClosable={true}
                onCancel={this.handleCancel}
                footer={null}
                width='80%'
                className="subscription-modal"
            >
                <div class="container">
                    <div class="row">
                        <div class="col-sm-12">
                            <h3 style={{
                                marginRight: '15px',
                                fontWeight: '600',
                                color: '#707070',
                                fontSize: '28px'
                            }} >Training Partner - Subscription</h3>
                        </div>
                    </div>
                    <hr />


                    <div class="row">
                        <div class="col-sm-9">
                            <div className="row">
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
                                                    <h4>FREE</h4>
                                                    <p>Validity - NA</p>
                                                    <p>5 Trainings / Month</p>
                                                    <p>100 Invites / Month</p>
                                                    {/* disabled={this.state.btnDisable} */}
                                                    <Button onClick={this.SubscriptionCheck} type="submit"
                                                        style={{ borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                    >Buy</Button >
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                    : (
                                        <div className="styled-radio payment__box__wrapper">
                                            <div className="payment__box">
                                                <h4>FREE</h4>
                                                <p>5 Trainings / Month</p>
                                                <p>100 Invites / Month</p>
                                                <Button onClick={this.basicPlan} disabled={this.state.btnDisable} type="submit"
                                                    style={{ borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none' }}
                                                >Buy</Button >
                                            </div>
                                        </div>
                                    )

                                }

                                {/* </form> */}
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
                                                    <h4>PRO</h4>
                                                    <h4>{paymentData ? this.numDifferentiation(paymentData.orderAmountTrainingProPlan) : ''}</h4>
                                                    <p>Validity - 1 year</p>
                                                    <p>50 Trainings / Month </p>
                                                    <p>2500 Invites / Month </p>
                                                    {/* disabled={this.state.btnDisable} */}
                                                    <Button onClick={this.SubscriptionCheck} type="submit"
                                                        style={{ borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                    >Buy</Button >
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                    :
                                    (
                                        <form method="post" id="redirectForm" action={paymentData.postUrl}   >
                                            <input type="radio" name="radios" id="7d" class="invisible-radio" />
                                            <input type="hidden" name="appId" value={paymentData.appId} />
                                            <input type="hidden" name="orderId" value={paymentData.orderId} />
                                            <input type="hidden" name="orderAmount" value={paymentData.orderAmountTrainingProPlan} />
                                            <input type="hidden" name="orderCurrency" value={paymentData.orderCurrency} />
                                            <input type="hidden" name="orderNote" value={paymentData.orderNote} />
                                            <input type="hidden" name="customerName" value={paymentData.customerName} />
                                            <input type="hidden" name="customerEmail" value={paymentData.customerEmail} />
                                            <input type="hidden" name="customerPhone" value={paymentData.customerPhone} />
                                            <input type="hidden" name="returnUrl" value={paymentData.returnUrl} />
                                            <input type="hidden" name="notifyUrl" value={paymentData.notifyUrl} />
                                            <input type="hidden" name="signature" value={paymentData.signatureTrainingProPlan} />

                                            <div className="styled-radio payment__box__wrapper">
                                                <div className="payment__box">
                                                    <h4>PRO</h4>
                                                    <h4>{paymentData ? this.numDifferentiation(paymentData.orderAmountTrainingProPlan) : ''}</h4>
                                                    <p>Validity - 1 year</p>
                                                    <p>50 Trainings / Month</p>
                                                    <p>2500 Invites / Month</p>
                                                    <button disabled={this.state.btnDisable} type="submit"
                                                        style={{ cursor: 'pointer', borderRadius: '5px', marginTop: '-14px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none' }}
                                                    >Buy</button >
                                                </div>
                                            </div>
                                        </form>
                                    )
                                }

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
                                                    <h4>ENTERPRISE</h4>
                                                    <h4>{paymentData ? this.numDifferentiation(paymentData.orderAmountTrainingEnterprisePlan) : ''}</h4>
                                                    <p>Validity - 1 year</p>
                                                    <p>Unlimited Trainings</p>
                                                    <p>5000 Invites / Month</p>
                                                    {/* disabled={this.state.btnDisable} */}
                                                    <Button onClick={this.SubscriptionCheck} type="submit"
                                                        style={{ borderRadius: '5px', marginTop: '20px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none', cursor: 'pointer' }}
                                                    >Buy</Button >
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                    :
                                    (
                                        <form method="post" id="redirectForm" action={paymentData.postUrl}   >
                                            <input type="radio" name="radios" id="7d" class="invisible-radio" />
                                            <input type="hidden" name="appId" value={paymentData.appId} />
                                            <input type="hidden" name="orderId" value={paymentData.orderId} />
                                            <input type="hidden" name="orderAmount" value={paymentData.orderAmountTrainingEnterprisePlan} />
                                            <input type="hidden" name="orderCurrency" value={paymentData.orderCurrency} />
                                            <input type="hidden" name="orderNote" value={paymentData.orderNote} />
                                            <input type="hidden" name="customerName" value={paymentData.customerName} />
                                            <input type="hidden" name="customerEmail" value={paymentData.customerEmail} />
                                            <input type="hidden" name="customerPhone" value={paymentData.customerPhone} />
                                            <input type="hidden" name="returnUrl" value={paymentData.returnUrl} />
                                            <input type="hidden" name="notifyUrl" value={paymentData.notifyUrl} />
                                            <input type="hidden" name="signature" value={paymentData.signatureTrainingEnterprisePlan} />

                                            <div className="styled-radio payment__box__wrapper">
                                                <div className="payment__box">
                                                    <h4>ENTERPRISE</h4>
                                                    <h4>{paymentData ? this.numDifferentiation(paymentData.orderAmountTrainingEnterprisePlan) : ''}</h4>
                                                    <p>Validity - 1 year</p>
                                                    <p>Unlimited Trainings</p>
                                                    <p>5000 Invites/ Month</p>
                                                    <button disabled={this.state.btnDisable} type="submit"
                                                        style={{ cursor: 'pointer', borderRadius: '5px', marginTop: '-14px', width: '80px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none' }}
                                                    >Buy</button>
                                                </div>
                                            </div>
                                        </form>
                                    )
                                }


                            </div>

                        </div>

                        <div class="col-sm-3" style={{ borderLeft: '1px solid #dedede', marginLeft: '10px', margin: 'auto' }}>
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
                                <p>{subscriptionInfo.length > 0 ? subscriptionInfo[0].subscriptionTerminMonths + ' Months' : 'N/A'}</p>
                                <h4>Status :</h4>
                                <p>{subscriptionInfo.length > 0 ? (<span className="">{subscriptionInfo[0].txStatus}</span>) : 'N/A'}</p>

                            </div>

                        </div>
                    </div>



                </div>
            </Modal>

        );
    }

}
export default SubscriptionModal;