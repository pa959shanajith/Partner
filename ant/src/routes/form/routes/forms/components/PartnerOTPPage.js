import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from "../../../../../services/partnerService.js";
import { Layout, Divider, Icon } from 'antd';
// import errorHandler from '../../../ErrorHandler/ErrorHandler';
// import moment from 'moment';
import PAGEROUTES from 'constants/pageRoutes';
const { Header } = Layout;
const { Footer } = Layout;
// const { Option } = Select;

const logoDimensions = {
    padding: '2px',
}

class PartnerOTPPage extends React.Component {
    constructor(props) {
        super();
        this.state = { secret: "", paymentDetails: {} };
        this.partnerService = new partnerService();
    }
    componentDidMount() {
        //this.setState({secret: this.props.match.params.pymtcode})
        console.log(this.state.secret);
        this.partnerService.getOTPDetails(this.props.match.params.pymtcode).then((d) => {
            //  console.log(d,' its d ');
            this.setState({ paymentDetails: d.data.data })
        }).catch((err) => {
        })
    }

    render() {
        return (
            <div>
                <Header className="app-header">
                    <div className="app-header-inner bg-white">
                        <div className="header-left">
                            <div className="list-unstyled list-inline">
                                <p className="brand hyperlink">
                                    <img style={logoDimensions} src={'./assets/logo_text.svg'} height="85px" alt="Shenzyn" />
                                </p>
                            </div>
                        </div>
                        <div className="header-right">
                            <div className="list-unstyled list-inline">
                            </div>
                        </div>
                    </div>
                </Header>
                <div className="col-md-4 offset-md-4">
                    <div className="mt-3 col-12 mb-4">
                        {/* Training Register Start Here */}
                        <div style={{ borderRadius: '5px', boxShadow: '0px 0px 35px #00000029', background: '#fff', padding: '20px' }}>
                            <h4>Partner One Time Payment
                  </h4>
                            <Divider />
                            <div class="row">
                                <div class="col-sm-4 ">
                                    <h5>Partner Name:</h5>
                                </div>
                                <div class="col-sm-8">
                                    <p>{this.state.paymentDetails.customerName}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-4 ">
                                    <h5>Partner Email:</h5>
                                </div>
                                <div class="col-sm-8">
                                    <p>{this.state.paymentDetails.customerEmail}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-4 ">
                                    <h5>Contact Number:</h5>
                                </div>
                                <div class="col-sm-8">
                                    <p>{this.state.paymentDetails.customerPhone}</p>
                                </div>
                            </div>

                            <h4>Payment Details</h4>
                            <div class="row">
                                <div class="col-sm-4 ">
                                    <h5>Payment Amount:</h5>
                                </div>
                                <div class="col-sm-8">
                                    <p>{this.state.paymentDetails.orderAmount} {this.state.paymentDetails.orderCurrency}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-4 ">
                                    <h5>Subscription Validity:</h5>
                                </div>
                                <div class="col-sm-8">
                                    <p>{this.state.paymentDetails.subscriprtionValidity}</p>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-12">
                                    <form method="post" id="redirectForm" action={this.state.paymentDetails.postUrl}   >
                                        <input type="hidden" name="appId" value={this.state.paymentDetails.appId} />
                                        <input type="hidden" name="orderId" value={this.state.paymentDetails.orderId} />
                                        <input type="hidden" name="orderAmount" value={this.state.paymentDetails.orderAmount} />
                                        <input type="hidden" name="orderCurrency" value={this.state.paymentDetails.orderCurrency} />
                                        <input type="hidden" name="orderNote" value={this.state.paymentDetails.orderNote} />
                                        <input type="hidden" name="customerName" value={this.state.paymentDetails.customerName} />
                                        <input type="hidden" name="customerEmail" value={this.state.paymentDetails.customerEmail} />
                                        <input type="hidden" name="customerPhone" value={this.state.paymentDetails.customerPhone} />
                                        <input type="hidden" name="returnUrl" value={this.state.paymentDetails.returnUrl} />
                                        <input type="hidden" name="notifyUrl" value={this.state.paymentDetails.notifyUrl} />
                                        <input type="hidden" name="signature" value={this.state.paymentDetails.signature} />
                                        <div className="styled-radio payment__box__wrapper">
                                            <div className="payment__box">
                                                <button type="submit" disabled={this.state.btnDisable}
                                                    style={{ borderRadius: '5px', marginTop: '-14px', marginLeft: "90px", width: '140px', paddding: '20px', height: '40px', background: '#D45895', fontSize: '18px', color: '#fff', border: 'none' }}
                                                >Pay</button >
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer className="app-footer bg-white" style={{ marginTop: "12.1rem" }}>
                    <div className="footer-inner-v2">
                        <ul className="list-inline list-inline-split">
                            <li className="list-inline-item"><a href={PAGEROUTES.footerLinks.About}>About</a></li>
                            <li className="list-inline-item"><a href={PAGEROUTES.footerLinks.Career}>Careers</a></li>
                            <li className="list-inline-item"><a href={PAGEROUTES.footerLinks.Help}>Help &amp; Support</a></li>
                            <li className="list-inline-item"><a href={PAGEROUTES.footerLinks.Privacy}>Privacy</a></li>
                            <li className="list-inline-item"><a href={PAGEROUTES.footerLinks.Terms}>Terms</a></li>
                        </ul>
                        <ul className="footer-social-list">
                            <li><a href={PAGEROUTES.footerLinks.LinkedIn} rel="noopener noreferrer" target="_blank"><Icon type="linkedin" /></a></li>
                            <li><a href={PAGEROUTES.footerLinks.Facebook} rel="noopener noreferrer" target="_blank"><Icon type="facebook" /></a></li>
                            <li><a href={PAGEROUTES.footerLinks.Twitter} rel="noopener noreferrer" target="_blank"><Icon type="twitter" /></a></li>
                            <li><a href={PAGEROUTES.footerLinks.Instagram} rel="noopener noreferrer" target="_blank"><Icon type="instagram" /></a></li>
                            <li><a href={PAGEROUTES.footerLinks.YouTube} rel="noopener noreferrer" target="_blank"><Icon type="youtube" /></a></li>
                        </ul>
                        <div className="footer-copyright">
                            <span>© 2020 4GEN Technologies Pvt. Ltd. All Rights Reserved.</span>
                        </div>
                    </div>
                </Footer>
            </div>
        )
    }
}
export default withRouter(PartnerOTPPage);
