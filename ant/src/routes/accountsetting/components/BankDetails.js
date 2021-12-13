import React from 'react';
import partnerService from "../../../services/partnerService";


class BankDetails extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            data: {}
        }
        this.partnerService = new partnerService();
    }

    componentDidMount() {
        let data = {
            email: localStorage.getItem('email')
        }
        this.partnerService.getBankDetails(data)
        .then((res)=>{
            console.log(res)
            this.setState({data: res.data.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }


    render() {
        const {data} = this.state
        return (            
            <div className="card">
                <h4>Bank Name- {data.bankName ? data.bankName: ''}</h4>
                <h4> Name- {data.accountHoldersName ? data.accountHoldersName: ''}</h4>
                <h4>Account Number- {data.accountNumber ? data.accountNumber: ''}</h4>
                <h4>IFSC CODE- {data.ifscCode ? data.ifscCode: ''}</h4>
            </div>
        )
    }
}

export default BankDetails