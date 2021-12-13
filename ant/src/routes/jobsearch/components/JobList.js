import { Icon, List, message, Spin, Tooltip } from 'antd';
import React from 'react';
import { FaBlackTie } from "react-icons/fa";
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import jobSeekerService from '../../../services/jobseekerService';
import JobDetailsModal from './JobDetailsModal';
import _ from 'underscore';
import { FaDownload } from 'react-icons/fa';
import ExcelUtils from "../../../services/excelUtils";
import moment from 'moment';
// import _ from "lodash";

const loadingIcon = <Icon type="loading" style={{fontSize: 80, position: 'absolute',left: '50%',height: '30%',width: '50%',marginTop: '-15%',marginRight: '0',marginBottom: '0',marginLeft: '-25%'}} spin />;


const Company_Name = {
  color: '#d80075'
}

class JobList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      data: [],
      count: 0,
      jobTitle: '',
      minValue: 0,
      maxValue: 9,
      modalId: null,
      jobDetailsModal: {
        isVisible: false
      },
      isOpen: [],
      selectedCompany: [],
      jobId: null,
      jobData: [],
      exportColumns: [
        { header: 'Job Title', key: 'jobTitle', width: 40, style: { font: { bold: true } } },
        { header: 'Job Id', key: 'jobId', width: 30, style: { font: { bold: true } } },
        { header: 'JD', key: 'jobDescription', width: 40, style: { font: { bold: true } } },
        { header: 'Job Posted Date', key: 'jobPostedDate', render: (jobPostedDate) => ((jobPostedDate) ? moment(jobPostedDate).format("YYYY-MM-DD") : ''), width: 30, style: { font: { bold: true } } },
        { header: 'Job Updated Date', key: 'jobUpdatedDate', render: (jobUpdatedDate) => ((jobUpdatedDate) ? moment(jobUpdatedDate).format("YYYY-MM-DD") : ''), width: 30, style: { font: { bold: true } } },
        { header: 'Job Approved Date', key: 'jobPostApprovedDate', render: (jobPostApprovedDate) => ((jobPostApprovedDate) ? moment(jobPostApprovedDate).format("YYYY-MM-DD") : ''), width: 30, style: { font: { bold: true } } },
        { header: 'Company Name', key: 'companyName', width: 40, style: { font: { bold: true } } },
        { header: 'Company Type', key: 'companyType', width: 40, style: { font: { bold: true } } },
        { header: 'Status', key: 'status', width: 30, style: { font: { bold: true } } },
        { header: 'Vacancies', key: 'vacancies', width: 40, style: { font: { bold: true } } },
        { header: 'Location', key: 'jobLocation', width: 40, style: { font: { bold: true } } },
        { header: 'Employement Type', key: 'employementType', width: 40, style: { font: { bold: true } } },
        { header: 'Travel Required', key: 'travelRequired', width: 40, style: { font: { bold: true } } },
        { header: 'Experience', key: 'experience', width: 40, style: { font: { bold: true } } },
        { header: 'Min Experience', key: 'minexperience', width: 40, style: { font: { bold: true } } },
        { header: 'Max Experience', key: 'maxexperience', width: 40, style: { font: { bold: true } } },
        { header: 'Min Annual CTC', key: 'minannualCTC', width: 40, style: { font: { bold: true } } },
        { header: 'Max Annual CTC', key: 'maxannualCTC', width: 40, style: { font: { bold: true } } },
        { header: 'Industries', key: 'industries', width: 40, style: { font: { bold: true } } },
        { header: 'Functional Areas', key: 'functionalArea', width: 40, style: { font: { bold: true } } },
        { header: 'Languages Known', key: 'languagesKnown', width: 40, style: { font: { bold: true } } },
        { header: 'Notice Period', key: 'noticePeriod', width: 40, style: { font: { bold: true } } },
        { header: 'Other Benefits', key: 'otherMonetoryBenefits', width: 40, style: { font: { bold: true } } },
        { header: 'Certification Required', key: 'certificationRequired', width: 40, style: { font: { bold: true } } },
        { header: 'Skills', key: 'skills', width: 40, style: { font: { bold: true } } },
        { header: 'Recepient Email', key: 'recepientEmailAddress', width: 40, style: { font: { bold: true } } },
        { header: 'Forward Application', key: 'forwardApplication', width: 40, style: { font: { bold: true } } },
        { header: 'status', key: 'status', width: 40, style: { font: { bold: true } } },
        { header: 'List of Applicants', key: 'listofApplicants', width: 40, style: { font: { bold: true } } },
        { header: 'Selected', key: 'selected', width: 40, style: { font: { bold: true } } },
        { header: 'Offered', key: 'offered', width: 40, style: { font: { bold: true } } },
        { header: 'Rejected', key: 'rejected', width: 40, style: { font: { bold: true } } },
        { header: 'Joined', key: 'joined', width: 40, style: { font: { bold: true } } },
        { header: 'Job Posting Approved By', key: 'jobPostingApprovedBy', width: 40, style: { font: { bold: true } } },
    ],
    }
    this.errorHandler = new errorHandler();
    this.jobSeekerService = new jobSeekerService();
    this.visible = this.visible.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.ExcelUtils = new ExcelUtils();
  }
  componentDidMount() {
    var jobData = _.sortBy(this.props.jobData, function(data) {
      return data.jobUpdatedDate;
    });
    this.setState({
      count: this.props.count,
      data: jobData.reverse(),
      jobTitle: this.props.jobTitle,
      loading: false
    });
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
    var jobData = _.sortBy(nextProps.jobData, 'jobPostApprovedDate');
    this.setState({
      count: nextProps.count,
      data: jobData,
      jobTitle: nextProps.jobTitle,
      loading: false
    });
  }

  handleChange = value => {
    if (value <= 1) {
      this.setState({
        minValue: 0,
        maxValue: 9
      });
    } else {
      this.setState({
        minValue: this.state.maxValue,
        maxValue: value * 9
      });
    }
  };

  // Modal Visible
  visible = (e, id, data) => {
    this.setState({
      isOpen: {
        [id]: true
      },
      jobDetailsModal: {
        isVisible: !this.state.jobDetailsModal.isVisible
      },
      jobData: data,
      jobId: data.jobId
    });

  }

  Scroll = () => {
    var arr = [];
    this.setState({ selectedCompany: arr }, () => {
      // console.log(this.state,' its state');
    });
  }

  saveJob = (e, jobId) => {
    e.preventDefault();
    if (jobId) {
      var data = {
        id: jobId
      }
      this.jobSeekerService.saveJob(data).then((res) => {
        if (res.status === 200) {
          message.success('Job Saved SuccessFully !');
        }
      }).catch((err) => {
        console.log(err);
        this.errorHandler.customErrorCheck(err);
      });
    }

  }

  setVisiblity = () => {
    this.setState({
      jobDetailsModal: {
        isVisible: !this.state.jobDetailsModal.isVisible
      }
    })
  }

  rowFunction = (rows) => {
    let rowData = [];
    this.state.exportColumns.forEach((o, key) => {
      rowData.push(rows[o.key]);
    });
    return rowData;
  }
  downloadExcel = (data) => {
    let rows = data;
    let exportData = [];
    for (let i = 0; i < rows.length; i++) {
      let rowData = this.rowFunction(rows[i]);
      exportData.push(rowData);
    }
    let props = {
      fileName: 'Jobs search',
      columns: this.state.exportColumns,
      data: exportData
    }
    this.ExcelUtils.exportToExcel(props)
  }

  render() {
    if (this.state.loading) return <Spin indicator={loadingIcon} />
    else
      return (
        <div className='container px-0'>
          {this.state.jobTitle === '' ?
            (<p>Total <b>{this.state.count}</b> Jobs Found<b></b> </p>) : (<p>Total <b>{this.state.count} Jobs</b> found for <b>{this.state.jobTitle}</b> </p>)}
          <div className = "job-list-download-icon">
          <span>
              <Tooltip title='Download jobs report'>
                <FaDownload style={{ fontSize: '24px', cursor:'pointer' }} onClick={()=>this.downloadExcel(this.props.jobData)} />
              </Tooltip>
            </span>
          </div>
          <JobDetailsModal jobData={this.state.jobData} onClickClose={this.setVisiblity.bind(this)} visible={this.state.jobDetailsModal.isVisible} />

          <List itemLayout="vertical" size="large" 
            pagination={{pageSize: 6, }} 
            dataSource={this.state.data}
            renderItem={(d, i) => (
              <div id={"Partner_Jobs_ActiveJobs_"+d._id} key={i} onClick={(e) => this.visible(e, i, d)} style={{cursor: 'pointer'}}>
                <div className="JobItem">
                  <div className="row">
                    <div className="col-lg-2 col-md-2 col-sm-12 text-center">
                      <img src={d.logo} alt="avatar" />
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-12 p-1">
                      <h4 className="">{d.jobTitle}</h4>                      
                      <p id={"Partner_Jobs_ActiveJobs_"+d._id}> <span style={Company_Name}>{d.companyName}</span>  at {d.jobLocation.map((loc, i) => (<span key={i}>{loc},</span>))} </p>
                      <p className="blog-card__content" dangerouslySetInnerHTML={{__html: d.jobDescription}}>
                        {/* {d.jobDescription} */}
                      </p>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12 p-1">
                      <div className="col-md-12 col-sm-4 pt-4">
                        <h5 className="pr-3"> <Icon type="code" className="mr-2" /> {d.employementType?d.employementType.map((empType) => empType):''}</h5>
                      </div>
                      <div className="col-md-12 col-sm-4 pt-2">
                        <h5 className="pr-3"> <Icon type="solution" className="mr-2" />  Graduate</h5>
                      </div>
                      <div className="col-md-12 col-sm-4 pt-2">
                        <h5 className="pr-3"><FaBlackTie className="mr-2" /> {d.minexperience}-{d.maxexperience} Yrs</h5>
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