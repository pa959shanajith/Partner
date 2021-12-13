import { Modal } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';

class Partner_OTP_Callback extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            orderId :"",
            status:'',
        }
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.Cancel = this.Cancel.bind(this);
    }
  
    componentDidMount() {
        // this.setState({orderId: this.props.match.params.orderId})
        this.partnerService.getLastOTPTxnDetails(this.props.match.params.orderId).then((res) =>{
            // console.log(res,' its res');
            if(res.data.status === true){
                this.setState({status:res.data.data[0].txStatus})
            }
        }).catch((err) =>{
            this.errorHandler.customErrorCheck(err)
            // this.Error();
        })
    }
    Error = () =>{
        Modal.error({
            content: (
                <div>
                    <p>Sorry your last transactions failed. Kindly contact <b>wehearyou@shenzyn.com</b> or try again later</p>
                </div>
            ),
            onOk: () => {
                this.props.history.push({
                    pathname:'/app/login',
                    state:{txStatus:"FAILED"}
                })
            }
        })
    }
    Cancel = () => {
        Modal.error({
            content:(
                <div>
                    <p>Sorry your last transactions was cancelled !</p>
                </div>
            ),
            onOk: () => {
                this.props.history.push({
                    pathname:'/app/login',
                    state:{txStatus:"CANCELLED"}
                })
            }
        })
    }

    Success() {
        Modal.success({
            //   title: 'This is a warning message',
            content: (
                <div>
                    <p>Payment successful, Welcome to Shenzyn</p>
                </div>
            ),
            onOk: () => {
                this.props.history.push({
                    pathname:'/app/login',
                    state:{txStatus:"SUCCESS"}
                })
            }
        });

    }

    render() {
        if(this.state.status === 'SUCCESS')
        {
            return (
                <div>
                    {this.Success()}
                </div>
            );
        }
        
        else if(this.state.status === 'FAILED')
        {
            return (
                <div>
                    {this.state.status === 'FAILED' ? this.Error():''}
                </div>
            );
        }
        else if(this.state.status === "CANCELLED")
        {
            return (
                <div>
                {this.Cancel()}
            </div>
            )
        }
        else
        {
            return(
                <div>
                </div>
            )
        }

    }
}

export default withRouter(Partner_OTP_Callback);