import React from 'react';
import { Form, Modal } from 'antd';
import { withRouter } from "react-router-dom";
import loginService from "../../../../../services/loginService.js";
// const FormItem = Form.Item;
class VerifyTrailPartner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {secret: "" };
    this.loginService = new loginService();
  }
  componentDidMount(){
    // this.setState({secret: this.props.match.params.verifycode })
    //  console.log(this.state.secret);
     this.loginService.trailPartner(this.props.match.params.verifycode).then((d) =>{
        //  console.log(d,' its d ');
        Modal.success({
                    //   title: 'This is a warning message',
                    content: (
                      <div>
                        <p> Thank you !!!...Registered Partner was confirmed successfully </p>
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
                <p>Failed to verify mail ! Please write to wehearyou@shenzyn.com</p>
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
const WrappedUpdateNewPasswordForm = Form.create()(withRouter(VerifyTrailPartner));
export default WrappedUpdateNewPasswordForm;
