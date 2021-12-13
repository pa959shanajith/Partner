import { Modal } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom';
import partnerService from '../../../services/partnerService';
import errorHandler from '../../../ErrorHandler/ErrorHandler';

class Partner_Payment_Callback extends React.Component {
    constructor(props) {
        super(props)
        const partnerType = localStorage.getItem('partnerType');
        this.state = {
            modal1Visible: false,
            modal2Visible: false,
            status:'',
            partnerType:partnerType
        }
        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.Cancel = this.Cancel.bind(this);
    }
  

    // setModal1Visible(modal1Visible) {
    //     this.setState({ modal1Visible });
    // }

    // setModal2Visible(modal2Visible) {
    //     this.setState({ modal2Visible });
    // }
    componentDidMount() {
        // console.log(' its inside cancel callback');
        this.partnerService.getLastTransactions().then((res) =>{
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
                    <p>Sorry Your Last Transactions Failed Kindly Contact <b>wehearyou@shenzyn.com</b> Or Try Again Later</p>
                </div>
            ),
            onOk: () => {
                if(this.state.partnerType === "TRAINING"){
                    this.props.history.push({
                        pathname:'/app/dashboard-tp',
                        state:{txStatus:"FAILED"}
                    })
                }
                else{
                    this.props.history.push({
                        pathname:'/app/dashboard',
                        state:{txStatus:"FAILED"}
                    })
                }
                
            }
        })
    }
    Cancel = () => {
        Modal.error({
            content:(
                <div>
                    <p>Sorry Your Last Transactions Cancelled !</p>
                </div>
            ),
            onOk: () => {
                if(this.state.partnerType === "TRAINING"){
                    this.props.history.push({
                        pathname:'/app/dashboard-tp',
                        state:{txStatus:"CANCELLED"}
                    })
                }
                else{
                    this.props.history.push({
                        pathname:'/app/dashboard',
                        state:{txStatus:"CANCELLED"}
                    })
                }
            }
        })
    }

    Success() {
        Modal.success({
            //   title: 'This is a warning message',
            content: (
                <div>
                    <p>Payment Successful Welcome to Shenzyn</p>
                </div>
            ),
            onOk: () => {
                if(this.state.partnerType === "TRAINING"){
                    this.props.history.push({
                        pathname:'/app/dashboard-tp',
                        state:{txStatus:"SUCCESS"}
                    })
                }
                else{
                    this.props.history.push({
                        pathname:'/app/dashboard',
                        state:{txStatus:"SUCCESS"}
                    })
                }
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

export default withRouter(Partner_Payment_Callback);