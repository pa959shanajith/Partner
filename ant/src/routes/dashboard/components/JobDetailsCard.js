import React from 'react';
import { Button, Avatar } from 'antd';
import AddQuires from "./addQuires";
import companyService from "../../../services/companyService";
import moment from 'moment';
import { AiOutlineComment } from 'react-icons/ai'
class JobDetailsCard extends React.Component {
  constructor(props) {
    let companyName = localStorage.getItem('companyName')
    super(props);
    this.state = {
      defaultCompanyLogo: "assets/partner/company_default.png",
      selectedCompany: [],
      showNoteModal: false,
      getAllQuires: [],
      companyName:companyName
    }
    this.companyService = new companyService()
  }
  openModal = (id) => {
    let messages = []
    this.setState({ showNoteModal: true })
    let partnerEmail = localStorage.getItem('email')
    this.companyService.getQuires(id).then((res) => {
      if (res.data.data.discussionThread.length !== 0) {
        res.data.data.discussionThread.forEach(element => {
          element.author = element.author !== partnerEmail ? this.hideEmailId(element.author) : element.author
          element.datetime = moment(element.datetime).format('DD MMMM hh:mm')
          element.avatar = <Avatar>{element.author.charAt(0).toUpperCase()}</Avatar>
          messages.push(element)
        });
        this.setState({ getAllQuires: messages }, () => {
          console.log(this.state.getAllQuires);
        })
      }
      else {
        this.setState({ getAllQuires: [] })
      }
    })

  }
  hideEmailId = (email) => {
    let partnerEmail = localStorage.getItem('email')
    if (email !== partnerEmail) {
      var arr = email.split('');
      let finalArr = [];
      let len = arr.indexOf('@');
      arr.forEach((item, pos) => {
        (pos >= 1 && pos <= len - 2) ? finalArr.push('*') : finalArr.push(arr[pos]);
      })
      return finalArr.join('')
    }
  }
  closeAddNoteModal = () => {
    this.setState({ showNoteModal: false })
  }

  render() {
    const s = this.props.clickedEventData;
    // console.log(this.props);

    if (!s.jobTitle) {
      return (
        <div>

        </div>
      )
    }
    return (
      <div style={{ borderRadius: '5px', boxShadow: '0px 0px 35px #00000029', background: '#fff', padding: '20px', marginBottom: '18px' }}>
        <div className="container pb-3">
          <div className="row">
            <div className="col-sm-12 pt-4">
              <div className="row">
                <div className="col-sm-4 company-info-modal p-2 text-center">
                  <img src={s.logo} alt={s.companyName} />
                  <h4>{s.companyName}</h4>
                  <p className="mb-0"> {this.state.selectedCompany.length > 0 ? this.state.selectedCompany[0].location : ''} </p>
                  <p className="mb-0"> {this.state.selectedCompany.length > 0 ? <a href={this.state.selectedCompany[0].website} target="_blank" rel="noopener noreferrer"> {this.state.selectedCompany[0].website} </a> : ''} </p>
                </div>
                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm-6">
                      <h5>Location</h5>
                      <p> {s.jobLocation.length > 0 ? s.jobLocation.map((d) => d + ' , ') : ''}</p>
                    </div>
                    <div className="col-sm-6">
                      <h5>DNI Category</h5>
                      {s.dniCategory && s.dniCategory.length > 0 ? s.dniCategory.map((data) => `${data}`) : 'Female'}
                    </div>
                    <div className="col-sm-6">
                      <h5>Experience</h5>
                      <p>{s.minexperience}-{s.maxexperience} Yrs</p>
                    </div>
                    <div className="col-sm-6">
                      <h5>Annual CTC</h5>
                      {/* <p>₹ {s.salaryHide ? " Undisclosed" : `${s.minannualCTC} to ${s.maxannualCTC}`}  </p> */}
                      <p>₹ { `${s.minannualCTC} to ${s.maxannualCTC}`} </p>
                    </div>
                    <div className="col-sm-6">
                      <h5>Vacancies</h5>
                      <p>{s.vacancies}</p>
                    </div>
                    <div className="col-sm-6">
                      <h5>Applicant Count</h5>
                      <p>{s.profilesByPartner.length?s.profilesByPartner.length:0}</p>
                    </div>
                    {/*<div className="col-sm-6">
                      <h5>DNI Category</h5>
                      {s.dniCategory && s.dniCategory.length > 0 ? s.dniCategory.map((data) => `${data}`) : 'Female'}
                    </div>*/}
                  </div>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-sm-4">
                  <h5>Functional Area</h5>
                  <p>{s.functionalArea}</p>
                </div>
                <div className="col-sm-4">
                  <h5>Notice Period</h5>
                  <p>{s.noticePeriod}</p>
                </div>
                <div className="col-sm-4">
                  <h5>Other Benefits</h5>
                  <p> {s.otherMonetoryBenefits}</p>
                </div>
                <div className="col-sm-4">
                  <h5>Job Type </h5>
                  <p>{s.employementType}</p>
                </div>
                <div className="col-sm-8">
                  <h5>Skills Required</h5>
                  <p>{s.skills.length > 0 ? s.skills.map((d) => d + ' ,') : ''}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 pt-1">
              <h5>Job Description</h5>
            
            </div>
            <div className="col-sm-6 pt-1">
              {/* <h5>Discussion Board</h5> */}
              {<Button style={{top:'-10px',left:'37px'}} onClick={(e) => this.openModal(this.props.clickedEventData.jobId)}>
                <AiOutlineComment className='mr-1' />Discussion Board</Button>}
              {<AddQuires reload={this.openModal.bind(this)} visible={this.state.showNoteModal} onClose={this.closeAddNoteModal.bind(this)} jobId={this.props.clickedEventData.jobId} jobTitle={this.props.clickedEventData.jobTitle} quireMessages={this.state.getAllQuires} />}
            </div>
            <div className="row">
            <p dangerouslySetInnerHTML={{ __html: s.jobDescription }} className="job-description"></p>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default JobDetailsCard;