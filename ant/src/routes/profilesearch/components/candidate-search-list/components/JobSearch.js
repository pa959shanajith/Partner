import { Select, Icon } from 'antd';
import React from 'react';
// const Search = Input.Search;
const Option = Select.Option;

// const StyleSheet_maxWidth = {
//   maxWidth: '1000px',
//   margin: 'auto'
// }
// const StyleSheet_maxWidth2 = {
//   alignItems: 'center',
//   justifyContent: 'center'
// }

class JobSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      listofIndustries: [
        "Administrative/Support", "Art/Design/Media", "Buisness", "Child Care", "Education", "Engineering", "Finance/Accounting", "Health Care",
        "Human Resources", "Insurance", "Legal and Low Enforcement", "Manufaturing", "Marketing/Public Relations", "Nursing", "Real Estate",
        "Restaurant and Hospitality", "Retails", "Others"
      ],
      noticePeriods: [15, 30, 45, 60, 75, 90, "Any"],
      EducationQualifications: ["BTech", "BCA", "BSc", "MTech", "MCA", "MBA", "Any"],


    }
  }

  render() {
    const { listofIndustries } = this.state;
    let industriesList = listofIndustries.map((industries, i) => {
      return (
        <Option key={i} value={industries}>{industries}</Option>
      )
    }, this);

    const { noticePeriods } = this.state;
    let NoticeDays = noticePeriods.map((noticePeriod, i) => {
      return (
        <Option key={i} value={noticePeriod}>{noticePeriod} Days</Option>
      )
    }, this);

    const { EducationQualifications } = this.state;
    let EducationQualification = EducationQualifications.map((EduQualification, i) => {
      return (
        <Option key={i} value={EduQualification}>{EduQualification}</Option>
      )
    }, this);

    return (
      <div className="jobsearchfilter">
        <h5 style={{ color: '#737373', fontSize: '18px' }}>20 Profiles</h5>
        <h2 style={{ color: '#7B1AF6', fontWeight: '600' }}>Java Developer</h2>

        {/* job search filters */}
        <div className="row pt-3 pr-2">
          <div className="col-md-2 col-sm-12 p-1">
            <h5>Experience: </h5>
            <Select onChange={e => { this.CompanyTypeFilter(e) }}>
              <Option value="0">Fresher</Option>
              <Option value="1">1 Year</Option>
              <Option value="2">2 Years</Option>
              <Option value="3">3 Years</Option>
              <Option value="4">4 Years</Option>
              <Option value="5">5 Years</Option>
              <Option value="6">6 Years</Option>
              <Option value="7">7 Years</Option>
              <Option value="8">8 Years</Option>
              <Option value="9">9 Years</Option>
              <Option value="10">10+ Years</Option>
              <Option value="15">15+ Years</Option>
              <Option value="20">20+ Years</Option>
              <Option value="any">Any</Option>
            </Select>
          </div>

          <div className="col-md-2 col-sm-12 p-1">
            <h5>Salary(LPA):</h5>
            <Select onChange={e => { this.Salary(e) }}>
              <Option value="100000">Above 1 </Option>
              <Option value="200000">2 </Option>
              <Option value="400000">4 </Option>
              <Option value="600000">6 </Option>
              <Option value="800000">8 </Option>
              <Option value="1000000">10 + </Option>
              <Option value="2000000">20 + </Option>
              <Option value="any">Any </Option>
            </Select>
          </div>

          <div className="col-md-3 col-sm-12 p-1">
            <h5>Functional Area:</h5>
            <Select>
              {industriesList}
            </Select>
          </div>

          <div className="col-md-3 col-sm-12 p-1">
            <h5>Notice Period:</h5>
            <Select>
              {NoticeDays}
            </Select>
          </div>
          <div className="col-md-2 col-sm-12 p-1">
            <h5>Education:</h5>
            <Select>
              {EducationQualification}
            </Select>
          </div>
        </div>
        {/* job search filters ends*/}

        <div className="pt-5 filterresultwrapper">
          <div className="pt-2 pb-2">
            <div className="col-12" style={{ borderBottom: '1px solid #D9D9D9' }}>
              <div className="row">
                <div className="col-2">
                  <img src={"https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png"} alt="Profile" />
                </div>
                <div className="col-6">
                  <h6 style={{ color: '#000000', fontSize: '14px', fontWeight: '600' }}>Name Name</h6>
                  <h6>Java Develoh6er</h6>
                  <h6>2 years</h6>
                </div>
                <div className="col-3 text-center">
                  <Icon type="star" style={{ marginRight: '12px', fontSize: '20px' }} />
                  <Icon type="sync" style={{ fontSize: '20px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* start deleting the unwanted codes from here */}

          <div className="pt-2 pb-2">
            <div className="col-12" style={{ borderBottom: '1px solid #D9D9D9' }}>
              <div className="row">
                <div className="col-2">
                  <img src={"https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png"} alt="Profile"/>
                </div>
                <div className="col-6">
                  <h6 style={{ color: '#000000', fontSize: '14px', fontWeight: '600' }}>Name Name</h6>
                  <h6>Java Develoh6er</h6>
                  <h6>2 years</h6>
                </div>
                <div className="col-3 text-center">
                  <Icon type="star" style={{ marginRight: '12px', fontSize: '20px' }} />
                  <Icon type="sync" style={{ fontSize: '20px' }} />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-2 pb-2">
            <div className="col-12" style={{ borderBottom: '1px solid #D9D9D9' }}>
              <div className="row">
                <div className="col-2">
                  <img src={"https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png"} alt="Profile"/>
                </div>
                <div className="col-6">
                  <h6 style={{ color: '#000000', fontSize: '14px', fontWeight: '600' }}>Name Name</h6>
                  <h6>Java Develoh6er</h6>
                  <h6>2 years</h6>
                </div>
                <div className="col-3 text-center">
                  <Icon type="star" style={{ marginRight: '12px', fontSize: '20px' }} />
                  <Icon type="sync" style={{ fontSize: '20px' }} />
                </div>
              </div>
            </div>
          </div>        <div className="pt-2 pb-2">
            <div className="col-12" style={{ borderBottom: '1px solid #D9D9D9' }}>
              <div className="row">
                <div className="col-2">
                  <img src={"https://shenzyn-uploads.s3.ap-south-1.amazonaws.com/Assets/profilePic.png"} alt="Profile"/>
                </div>
                <div className="col-6">
                  <h6 style={{ color: '#000000', fontSize: '14px', fontWeight: '600' }}>Name Name</h6>
                  <h6>Java Develoh6er</h6>
                  <h6>2 years</h6>
                </div>
                <div className="col-3 text-center">
                  <Icon type="star" style={{ marginRight: '12px', fontSize: '20px' }} />
                  <Icon type="sync" style={{ fontSize: '20px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* start deleting the unwanted codes upto here */}

        </div>


      </div>
    )
  }
}


export default JobSearch;