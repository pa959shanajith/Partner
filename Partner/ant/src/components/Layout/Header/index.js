import { toggleCollapsedNav, toggleOffCanvasMobileNav } from 'actions/settingsActions';
import { Avatar, Dropdown, Icon, Layout, Menu } from 'antd';
import DEMO from 'constants/demoData';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import SubscriptionModal from "../../../routes/dashboard-tp/components/SubscriptionModal";
import HIRINGSubscriptionModal from "../../../routes/dashboard/components/SubscriptionModal";
import TrainingPartnerProfile from '../../../routes/profile-tp/';
import partnerService from "../../../services/partnerService";
import requireAuthentication from '../../AuthenticatedComponentHOC';
import EditProfileModal from './editProfileModal';
import ChangePasswordModal from '../../../routes/dashboard/components/ChangePasswordModal';
import Cookies from 'universal-cookie';

const { Header } = Layout;

const logoDimensions = {
  padding: '20px 20px 20px 50px',
  cursor: 'pointer'
}
class AppHeader extends React.Component {
  constructor() {
    super();
    var partnerType = localStorage.getItem('partnerType')
    // var isPartnerRecruiter = localStorage
    var partnerAdmin = JSON.parse(localStorage.getItem('isPartner'));
    var customerEmail = localStorage.getItem('email'),
      customerPhone = localStorage.getItem('contactNo')
    this.state = {
      profilePicUrl: '',
      userName: '',
      editProfileModal: false,
      showCompanyModal: false,
      showTrainingProfile: false,
      partnerType: partnerType,
      subscriptionInfo: [],
      hiringSubscriptionInfo: [],
      txStatus: "",
      hiringTxStatus: "",
      paymentDetails: {},
      hiringPaymentDetails: {},
      showSubscription: false,
      showHiringSubscription: false,
      statusTxt: "",
      hiringStatusTxt: "",
      BasicPlanStatus: false,
      basicplan: false,
      partnerAdmin: partnerAdmin,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      isEdit: false,
      showChangePasswordModal: false
    }
    this.partnerService = new partnerService();
    this.errorHandler = new errorHandler();
    this.cookies = new Cookies()
    // this.removeLocal = this.removeLocal.bind(this);
  }

  componentDidMount() {
    // console.log("LOCAL: ",localStorage)
    // var customerEmail = localStorage.getItem('email')
    var customername = localStorage.getItem('name');
    this.partnerService.getBasicDetails().then((response) => {
      this.setState({ profilePicUrl: response.data.data.logo, userName: this.state.partnerAdmin ? response.data.data.companyName : customername });
      // console.log(response.data.data.OrderAmount);
      if (response.data.data.OrderAmount === "FREE") {
        // console.log('its inisde free',response);
        this.setState({ basicplan: true });
      }
    }).catch((err) => {
      console.log(err);
    });
    // var partnerType = localStorage.getItem('partnerType')
    // var isPartner = JSON.parse(localStorage.getItem('isPartner'));
    // if (partnerType) {
    //   this.setState({ partnerType: partnerType,partnerAdmin:isPartner })
    // }
    // console.log(partnerType,' its partnerType');
    if (this.state.partnerType === "TRAINING") {
      this.getTrainingpartnerSubscription();
      var data = {
        //TODO: Move all local store call in constructor or component did mount and use state object
        customerPhone: this.state.customerPhone
      }
      this.partnerService.getTrainingPaymentDetails(data).then((res) => {
        if (res.data.status === true) {
          this.setState({ paymentDetails: res.data.data })
        }
      }).catch((err) => {
        this.errorHandler.customErrorCheck(err);
      })
    }
    else if (this.state.partnerType === "HIRING") {
      this.getHiringPartnerSubscription();
      let data = {
        customerPhone: this.state.customerPhone
      }
      this.partnerService.getPaymentDetails(data).then((res) => {
        // console.log(res,' its res of getPaymentDetails');
        if (res.data.status === true) {
          this.setState({ hiringPaymentDetails: res.data.data })
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
        this.setState({ txStatus: res.data.data[0].txStatus, subscriptionInfo: res.data.data })
      }
    }).catch((err) => {
      this.errorHandler.customErrorCheck(err);
    })
  }
  // getting HIRING Partner Subscription Info
  getHiringPartnerSubscription = () => {
    this.partnerService.getSubscription().then((res) => {
      // console.log(res, ' its res in modal');
      if (res.data.status === true) {
        this.setState({ hiringSubscriptionInfo: res.data.data, hiringTxStatus: res.data.data[0].txStatus });
      }
    }).catch((err) => {
      this.errorHandler.customErrorCheck(err)
    });
  }

  // Reload After Activated Plan
  reload = () => {
    this.componentDidMount();
  }

  // Show Subscription Modal
  ShowSubscription = () => {
    this.setState({ showSubscription: true, statusTxt: this.state.txStatus, BasicPlanStatus: this.state.basicplan });
  }
  // Show Hiring Subscription Modal
  ShowHiringSubscription = () => {
    this.setState({ showHiringSubscription: true, hiringStatusTxt: this.state.hiringTxStatus });
  }
  // close Subscription
  closeSubscription = () => {
    this.setState({ showSubscription: false, statusTxt: '', BasicPlanStatus: false });
    this.componentDidMount();
  }

  closeEditProfileModal = () => {
    this.setState({ editProfileModal: false })
  }
  closeEditRecruiterProfileModal = () => {
    this.setState({ editRecruiterProfileModal: false })
  }
  // close Hiring partner Subscription
  closeHiringSubscription = () => {
    this.setState({ showHiringSubscription: false, hiringStatusTxt: '' });
    this.componentDidMount();
  }

  removeLocal = () => {
    // console.log(' its inside remove local');
    localStorage.clear();
    this.cookies.remove('partnerEmailId',{ path: '/' })
    this.cookies.remove('partnerType',{ path: '/' })
    this.cookies.remove('partneradmin',{ path: '/' })
    this.props.history.push('/user/login');
    if (window.localStorage) {
      window.location.reload();
    }
  }

  onToggleCollapsedNav = () => {
    const { handleToggleCollapsedNav, collapsedNav } = this.props;
    handleToggleCollapsedNav(!collapsedNav);
  }

  onToggleOffCanvasMobileNav = () => {
    const { handleToggleOffCanvasMobileNav, offCanvasMobileNav } = this.props;
    handleToggleOffCanvasMobileNav(!offCanvasMobileNav);
  }

  // Show TrainingPartnerProfile Modal
  showTrainerProfileModal = () => {
    this.setState({ showTrainingProfile: true });
  }
  // close TrainingPartnerProfile
  closeTrainerProfileModal = () => {
    this.setState({ showTrainingProfile: false })
  }

  dashboardRedirect = () => {
    console.log("here")
    this.props.history.push('dashboard');
  }
  showProfileSubmissions = () => {
    this.props.history.push('profilesubmissions')
  }
  showAccountSettings = () => {
    this.props.history.push('account')
  }
  openEditProfileModal = () => {
    this.setState({ editProfileModal: true })
  }
  openEditRecruiterProfileModal = () => {
    this.setState({ editRecruiterProfileModal: true, isEdit: true })
  }
  changePasswordModal = () => {
    this.setState({ showChangePasswordModal : true})
  }
  handleCancelChangePasswordModal = () => {
    this.setState({ showChangePasswordModal : false})
  }

  render() {
    // const { collapsedNav, offCanvasMobileNav, colorOption, showLogo } = this.props;
    const avatarDropDown = (
      <Menu className="app-header-dropdown">
        <Menu.Item key="6"> <a id="Partner_app_header_EditProfile" href={() => false} onClick={() => this.openEditProfileModal()}><Icon type="edit" />Edit Profile</a> </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="7"> <a id="Partner_app_header_ChangePassword" href={() => false} onClick={() => this.changePasswordModal()} ><Icon type="key" />Change Password?</a> </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1" id="Partner_app_header_Reports" onClick={this.showProfileSubmissions} > <Icon type="profile" />Reports</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="2" id="Partner_app_header_Subscription" onClick={this.ShowHiringSubscription} > <Icon type="pay-circle-o" />Subscription </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" id="Partner_app_header_Credits" onClick={this.showAccountSettings}><Icon type="setting" />Credits </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4"><a id="Partner_app_header_NeedHelp" href={DEMO.headerLink.help}><Icon type="question-circle-o" />Need Help?</a> </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="5"> <a id="Partner_app_header_Signout" href={() => false} onClick={() => this.removeLocal()}><Icon type="logout" />Sign out</a> </Menu.Item> {/* onClick={clearUserSession} */}
      </Menu>
    );
    const RecruiterDropDown = (
      <Menu className="app-header-dropdown">
        {/* <Menu.Item key="1" onClick={this.showTrainerProfileModal} > <Icon type="profile" />Edit Profile</Menu.Item> */}
        {/* <Menu.Item key="2" onClick={this.ShowHiringSubscription} > <Icon type="pay-circle-o" />Subscription </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item key="3"> <a id="Partner_Recruiter_NeedHelp" href={DEMO.headerLink.help}><Icon type="question-circle-o" />Need Help?</a> </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="5"> <a id="Partner_Recruiter_ChangePassword" href={() => false} onClick={() => this.changePasswordModal()}><Icon type="key" />Change Password?</a> </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4"> <a id="Partner_Recruiter_Signout" href={() => false} onClick={() => this.removeLocal()}><Icon type="logout" />Sign out</a> </Menu.Item> {/* onClick={clearUserSession} */}
      </Menu>
    );

    const TraineravatarDropDown = (
      <Menu className="app-header-dropdown">
        <Menu.Item key="1" onClick={this.showTrainerProfileModal} > <Icon type="profile" />Edit Profile</Menu.Item>
        <Menu.Item key="2" onClick={this.ShowSubscription} > <Icon type="pay-circle-o" />Subscription </Menu.Item>
        <Menu.Item key="3"> <a href={DEMO.headerLink.help}><Icon type="question-circle-o" />Need Help?</a> </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4"> <a href={() => false} onClick={() => this.removeLocal()}><Icon type="logout" />Sign out</a> </Menu.Item> {/* onClick={clearUserSession} */}
      </Menu>
    );

    return (
      <Header className="app-header">
        <TrainingPartnerProfile
          visible={this.state.showTrainingProfile}
          onClose={this.closeTrainerProfileModal.bind(this)}>
        </TrainingPartnerProfile>
        <SubscriptionModal basicplan={this.state.BasicPlanStatus} reload={this.reload} txStatus={this.state.statusTxt} paymentData={this.state.paymentDetails} subscriptionData={this.state.subscriptionInfo} visible={this.state.showSubscription} onClose={this.closeSubscription} />
        <HIRINGSubscriptionModal txStatus={this.state.hiringStatusTxt} paymentData={this.state.hiringPaymentDetails} subscriptionData={this.state.hiringSubscriptionInfo} visible={this.state.showHiringSubscription} onClose={this.closeHiringSubscription} />
        <ChangePasswordModal visible={this.state.showChangePasswordModal} onClose={this.handleCancelChangePasswordModal.bind(this)} isPartner={this.state.partnerAdmin}/>
        <div className="app-header-inner bg-white">
          <div className="header-left">
            <div className="list-unstyled list-inline">
              {/* <a href="#/" className="brand">
                <img style={logoDimensions} src='https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/Shenzyn-TM.svg' height="85px" alt="Shenzyn" />
              </a> */}
              {/* <a onClick={() => this.dashboardRedirect.bind(this)} className="brand"> */}

              <img onClick={this.dashboardRedirect} style={logoDimensions} src='https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/Shenzyn-TM.svg' height="85px" alt="Shenzyn" />
              {/* </a> */}
            </div>
          </div>

          <div className="header-right">
            <div className="list-unstyled list-inline">
              {
                this.state.partnerAdmin ? (
                  <Dropdown className="list-inline-item" overlay={this.state.partnerType && this.state.partnerType === 'TRAINING' ? TraineravatarDropDown : avatarDropDown} trigger={['click']} placement="bottomRight">
                    <a id="Partner_app_header_dropdown" className="ant-dropdown-link no-link-style" href={DEMO.link}>
                      <span className="avatar-text d-none d-md-inline mr-2">{this.state.userName}</span>
                      <Avatar src={this.state.profilePicUrl} size="large" />
                    </a>
                  </Dropdown>
                ) :
                  (
                    <Dropdown className="list-inline-item" overlay={RecruiterDropDown} trigger={['click']} placement="bottomRight">
                      <a className="ant-dropdown-link no-link-style" href={DEMO.link}>
                        <span className="avatar-text d-none d-md-inline mr-2">{this.state.userName}</span>
                        <Avatar src={this.state.profilePicUrl} size="large" />
                      </a>
                    </Dropdown>
                  )
              }
            </div>
            {this.state.partnerAdmin ? (<EditProfileModal reload={this.reload} visible={this.state.editProfileModal} closeModal={this.closeEditProfileModal} />)
              :
              ''
            }
          </div>
        </div>
      </Header>
    );
  }
}

const mapStateToProps = (state) => ({
  offCanvasMobileNav: state.settings.offCanvasMobileNav,
  collapsedNav: state.settings.collapsedNav,
  colorOption: state.settings.colorOption,
});

const mapDispatchToProps = dispatch => ({
  handleToggleCollapsedNav: (isCollapsedNav) => {
    dispatch(toggleCollapsedNav(isCollapsedNav));
  },
  handleToggleOffCanvasMobileNav: (isOffCanvasMobileNav) => {
    dispatch(toggleOffCanvasMobileNav(isOffCanvasMobileNav));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(requireAuthentication(AppHeader)));
