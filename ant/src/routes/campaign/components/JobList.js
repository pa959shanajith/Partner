import { Icon, List } from 'antd';
import React from 'react';
import { FaBriefcase } from "react-icons/fa";
import AddCandidateModal from './JobDetailsModal';
import partnerService from "../../../services/partnerService";


const logoDimensions = {
  padding: '20px',
}
const list = {
  jobs: [
    {
      key: 'ntdnps',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: '.Net Production support',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntdsdev',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Datastage Developers',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntdsps',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Datastage Production Support',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntdsact',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Datastage Actimize',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntjavbd',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Java + Bigdata',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntjavsbo',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: '.Java + Springboot + Oracle',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntjavsbms',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Java + Springboot + Microservices',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      // minexperience:'12'
    }, {
      key: 'ntmanqa',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Manual QA',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntautqa',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Automation QA',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }
    , {
      key: 'ntfsjav',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Fullstack Java (HackerEarth)',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntmfdev',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'Mainframe Developers',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }, {
      key: 'ntbpmdev',
      logo: 'https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/ProfilePics/demo%40northerntrust.com_nt.png',
      jobTitle: 'BPM / Appian Developers',
      jobLocation: 'Pune',
      jobDescription: '',
      minexperience: '5',
      maxexperience: '12'
    }
  ]
};

class JobList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddModal: false,
      selectedJob: {},
      jobData: [],
    }
    this.partnerService = new partnerService();
    this.visible = this.visible.bind(this);
  }
  // componentDidMount() {

  // }

  // componentWillReceiveProps(nextProps) { }

  closeAddRecruiterModal() {
    this.setState({ showAddModal: false });
  }
  // Modal Visible
  visible = (e, id, data) => {
    this.setState({ showAddModal: true, selectedJob: data })
  }

  setVisiblity = () => {
    this.setState({
      jobDetailsModal: {
        isVisible: !this.state.jobDetailsModal.isVisible
      }
    })
  }
  eventProfileMatch = (profileEmailId, profileName, jobEventId) => {
    //TODO Call api for job/event profile match
    let data = {
      email: profileEmailId, name: profileName, eventId: jobEventId, type: "Job"
    }
    console.log(data)
    this.partnerService.updateEventProfileMatch(data).then((res) => {
      console.log(res.data, ' its res');
      if (res.data.status === true) {
        // this.setState({ tableData: res.data.listofApplicants, isloading: false })
      }
    }).catch((err) => {
      console.log(err);
    })
  }
  render() {
    return (
      <div className='container px-0'>

        <div className="app-header-inner bg-white">
          <div className="header-left">
            <div className="list-unstyled list-inline">
              <p onClick={() => this.dashboardRedirect.bind(this)} className="brand">
                <img style={logoDimensions} src='https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/Shenzyn-TM.svg' height="85px" alt="Shenzyn" />
              </p>
            </div>
          </div>
        </div>

        <AddCandidateModal
          visible={this.state.showAddModal}
          onClose={this.closeAddRecruiterModal.bind(this)}
          selectedJob={this.state.selectedJob}
          eventProfileMatch={this.eventProfileMatch.bind(this)}>
        </AddCandidateModal>
        <List itemLayout="vertical" size="large"
          pagination={{ pageSize: 12, }}
          dataSource={list.jobs}
          renderItem={(d, i) => (
            <div key={i} onClick={(e) => this.visible(e, i, d)} style={{ cursor: 'pointer' }}>
              <div className="JobItem">
                <div className="row">
                  <div className="col-lg-2 col-md-2 col-sm-12 text-center">
                    <img src={d.logo} alt="avatar" />
                  </div>
                  <div className="col-lg-7 col-md-7 col-sm-12 p-1">
                    <h4 className="">{d.jobTitle}</h4>
                    <p> {d.companyName} at {d.jobLocation} </p>
                    <h5 className=""><FaBriefcase className="mr-2" /> {d.minexperience}  to {d.maxexperience} Yrs</h5>
                    <p className="blog-card__content">
                      {d.jobDescription}
                    </p>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-12 p-1">
                    <div className="col-md-12 col-sm-4 pt-4">
                    </div>
                    <div className="col-md-12 col-sm-4 pt-2">
                      <h5 className="pr-3"> <Icon type="solution" className="mr-2" />  Upload Candidate Profile</h5>
                    </div>
                    <div className="col-md-12 col-sm-4 pt-2">

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    )
  }
}

export default JobList;