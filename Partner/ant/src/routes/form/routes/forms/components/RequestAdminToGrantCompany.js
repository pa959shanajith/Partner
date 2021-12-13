import React from 'react';
import { Form, message, Modal } from 'antd';
import { withRouter } from "react-router-dom";
import loginService from "../../../../../services/loginService.js";
// const FormItem = Form.Item;
class RequestAdminToGrantCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {token: "",
    partnerCompanyName: "",jobPostedCompanyName:"" };
    this.loginService = new loginService();
  }
  componentDidMount(){
     this.loginService.assignCompanyToPartnerFromEmail(this.props.match.params.partnerCompanyName,this.props.match.params.jobPostedCompanyName,this.props.match.params.token).then((d) =>{
        Modal.success({
                    //   title: 'This is a warning message',
                    content: (
                      <div>
                        <p> Thank you !!!...Company assigned to partner successfully </p>
                      </div>
                    ),
                    onOk: () => {
                      this.props.history.push('/user/login');
                    }
                  });
                
     }).catch((err) =>{
        this.setState({ validateStatus: 'error', errormsg: err.response.data.message })
          console.log(err, ' its err');
          Modal.error({
            content: (
              <div>
                <p>Failed to assign company ! Please write to wehearyou@shenzyn.com</p>
              </div>
            ),
            onOk: () => {
              this.props.history.push('/user/login');
            }
          });
     })
  }

  render() {
    return (
    <div>
    </div>
    )
  }
}
const WrappedRequestAdminToGrantCompany = Form.create()(withRouter(RequestAdminToGrantCompany));
export default WrappedRequestAdminToGrantCompany;
