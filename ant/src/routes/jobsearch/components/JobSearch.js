import { Icon, message, Select, Spin } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import JobSeekerService from '../../../services/jobseekerService';
import JobList from './JobList';
// const Search = Input.Search;
// const InputGroup = Input.Group;
const Option = Select.Option;

const loadingIcon = <Icon type="loading" style={{ fontSize: 80, position: 'absolute', left: '50%', height: '30%', width: '50%', marginTop: '15%', marginRight: '0', marginBottom: '0', marginLeft: '-25%' }} spin />;

class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: true,
      childLoading: true,
      title: '',
      place: '',
      count: 0,
      jobData: [],
      filterArr: [],
      CompanyType: 'any',
      ExperienceLevel: 'any',
      JobFreshness: 'any',
      Salary: 'any',
      filterTitle: ['Company', 'Exp', 'Fresh', 'Salary'],
      listOfLocations: [],
      dupLocations: [],
      location: 'location',
      showOnlyAssignedJobs : true
    }
    this.JobSeekerService = new JobSeekerService();
    this.SearchingJob = this.SearchingJob.bind(this);
    this.SearchTitle = this.SearchTitle.bind(this);
    this.SearchPlace = this.SearchPlace.bind(this);
    this.CompanyTypeFilter = this.CompanyTypeFilter.bind(this);
    this.ExperienceLevel = this.ExperienceLevel.bind(this);
    this.JobFreshness = this.JobFreshness.bind(this);
    this.Salary = this.Salary.bind(this);
    this.filterDataItem = this.filterDataItem.bind(this);
    this.filterIterate = this.filterIterate.bind(this);
    this.anyFilter = this.anyFilter.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.currentLocation = this.currentLocation.bind(this);
    this.getAllLocations = this.getAllLocations.bind(this);

  }

  componentDidMount() {
    this.jobSearch(this.props.companyName);
    this.getAllLocations()
  }

  componentWillReceiveProps(props) {
    this.setState({ title: props.companyName });
    this.jobSearch(props.companyName);
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(nextProps, ' its nextProps.someValue');
  //   console.log(prevState, ' its prevState.someValue');
  //   if (nextProps.companyName != prevState.title) {
  //     // console.log(nextProps.arrData, ' its inside ');
  //     return { title: nextProps.companyName };
  //   }
  //   else return null;
  // }

  jobSearch = (companyName) => {
    if(this.props.showOnlyAssignedJobs){
      const data = {
        "searchString": companyName,
        "location": []
      }
      this.JobSeekerService.search(data).then((d) => {
        this.setState({ jobData: d.data.data, filterArr: d.data.data, count: d.data.count, loading: false, childLoading: false });
      }).catch((err) => {
        console.log(err);
      })
    }
    else{
    const data = {
      "searchString": [companyName],
      "location": []
    }
    this.JobSeekerService.search(data).then((d) => {
      this.setState({ jobData: d.data.data, filterArr: d.data.data, count: d.data.count, loading: false, childLoading: false });
    }).catch((err) => {
      console.log(err);
    })
  }
  }

  // List Of Locations
  getAllLocations() {
    this.JobSeekerService.locations().then((d) => {
      this.setState({ listOfLocations: d.data, dupLocations: d.data });
    }).catch((err) => {
      console.log(err);
      this.errorHandler.customErrorCheck(err);
    });
  }

  // Location State
  currentLocation = (e) => {
    if (e) {
      this.setState({ place: e });
    }
  }

  //   On Search
  onSearch = (value, type) => {
    var cap = value.charAt(0).toUpperCase() + value.slice(1);
    switch (type) {
      case this.state.location:
        this.setState({
          listOfLocations: !value ? [] : this.state.dupLocations.filter(el => el.toLowerCase().includes(cap.toLowerCase()))
        })
        break;
      default:
        break;
    }
  };

  SearchingJob = (e) => {
    e.preventDefault();
    this.setState({ childLoading: true });
    var setValueArray = this.setValue(this.state.title, this.state.place)
    const data = {
      "searchString": setValueArray.title || [],
      "location": setValueArray.place || []
    }
    this.JobSeekerService.search(data).then((d) => {
      this.setState({ jobData: d.data.data, filterArr: d.data.data, count: d.data.count, childLoading: false });
      this.forceUpdate();
    }).catch((err) => {
      message.error("Failed to fetch search results",3)
      this.setState({loading:false,childLoading:false})
      console.log(err);
    });
  }

  // set Value to Array if inputs are more than 1
  setValue = (title, place) => {
    var titleSplit, placeSplit;
    var titleArr = [], placeArr = [];

    if (title) {
      if (title.includes(',')) {
        titleSplit = title.split(',');
      }
      else if (title.includes(' ')) {
        titleSplit = title.split(' ');
      }
      else {
        titleArr.push(title);
        titleSplit = titleArr;
      }
    }
    if (place) {
      if (place.includes(',')) {
        placeSplit = place.split(',');
      }
      else if (place.includes(' ')) {
        placeSplit = place.split(' ');
      }
      else {
        placeArr.push(place);
        placeSplit = placeArr
      }
    }
    return { title: titleSplit, place: placeSplit }
  }


  SearchTitle = (e) => {
    this.setState({
      title: e
    });
  }
  SearchPlace = (e) => {
    this.setState({ place: e });
  }

  CompanyTypeFilter = (val) => {
    this.setState({ CompanyType: val }, () => {
      var type1 = 'Company';
      // var type2 = 'Exp', type3 = 'Fresh', type4 = 'Salary';
      this.filterDataItem(type1, this.state.CompanyType);
    })
  }
  ExperienceLevel = (val) => {
    this.setState({ ExperienceLevel: val }, () => {
      var type = 'Exp';
      this.filterDataItem(type, this.state.ExperienceLevel);
    })
  }
  JobFreshness = (val) => {
    this.setState({ JobFreshness: val }, () => {
      var type = 'Fresh';
      this.filterDataItem(type, this.state.JobFreshness);
    })
  }
  Salary = (val) => {
    this.setState({ Salary: val }, () => {
      var type = 'Salary';
      this.filterDataItem(type, this.state.Salary);
    })
  }
  //  Iteration for Filter
  filterIterate = () => {
    this.anyFilter();
    this.setState({ jobData: this.state.CompanyType !== 'any' ? this.comFilter(this.state.CompanyType) : this.anyFilter() }, () => {
      this.setState({ jobData: this.state.ExperienceLevel !== 'any' ? this.expFilter(this.state.ExperienceLevel) : this.anyFilter() }, () => {
        this.setState({ jobData: this.state.JobFreshness !== 'any' ? this.freshFilter(this.state.JobFreshness) : this.anyFilter() }, () => {
          this.setState({ jobData: this.state.Salary !== 'any' ? this.salaryFilter(this.state.Salary) : this.anyFilter() }, () => {
          });
        })
      });
    })
  }
  // Any Type Checking ['Company', 'Exp', 'Fresh', 'Salary']
  anyFilter = () => {
    var count = 0;
    var result = []
    this.state.filterTitle.forEach((a) => {
      switch (a) {
        case 'Company':
          count = this.state.CompanyType === 'any' ? count + 1 : count;
          break;
        case 'Exp':
          count = this.state.ExperienceLevel === 'any' ? count + 1 : count;
          break;
        case 'Fresh':
          count = this.state.JobFreshness === 'any' ? count + 1 : count;
          break;
        case 'Salary':
          count = this.state.Salary === 'any' ? count + 1 : count;
          break;
        default:
          break;
      }
    })
    if (count === 4) {
      result = this.state.filterArr;
    }
    else {
      result = this.state.jobData;
    }
    return result;

  }
  // CallBack After SetState
  filterDataItem = (type, data) => {
    switch (type) {
      case 'Company':
      case 'Exp':
      case 'Fresh':
      case 'Salary':
        this.filterIterate();
        break;
      default:
        break;
    }
  }

  // Company Filter
  comFilter = (d) => {
    var result;
    // var type = 'Company'
    result = this.state.filterArr.filter((i) => i.companyType === d)
    return result;
  }
  // expFilter
  expFilter = (d) => {
    var result;
    var minExp, maxExp, splitter = d;
    splitter = splitter.split('-');
    [minExp, maxExp] = [splitter[0], splitter[1]];
    result = d === '0' ? this.state.jobData.filter((f) => (f.minexperience === parseInt(d))) : this.state.jobData.filter((e) => (e.minexperience <= parseInt(minExp) && e.maxexperience >= parseInt(maxExp)));
    return result;
  }
  // freshness filter checking
  freshFilter = (d) => {
    var result;
    var hour = 24;
    var currDate = moment().utc();
    var sevDayFormat = moment().subtract(7, 'd').format('YYYY-MM-DD');
    var monthFormat = moment().subtract(1, 'months').format('YYYY-MM-DD');

    switch (d) {
      case '1':
        result = this.state.jobData.filter((t) => currDate.diff(moment(t.jobPostApprovedDate), 'h') <= hour);
        break;
      case '2':
        result = this.state.jobData.filter((t) => moment(t.jobPostApprovedDate).utc().format('YYYY-MM-DD') >= sevDayFormat);
        break;
      case '3':
        result = this.state.jobData.filter((t) => moment(t.jobPostApprovedDate).utc().format('YYYY-MM-DD') >= monthFormat);
        break;
      default:
        break;
    }
    return result;
  }
  // Salary Filter
  salaryFilter = (d) => {
    var result;
    result = this.state.jobData.filter((s) => (parseInt(s.minannualCTC) < parseInt(d) && parseInt(s.maxannualCTC) > parseInt(d)));
    return result;
  }


  render() {
    // const backIcon = { marginBottom: '5px', padding: '0' };
    // const backIconText = { margingLeft: '5px', color: '#d80075', cursor: 'pointer' };
    // let companyName = this.props.companyName
    let showOnlyAssignedJobs = this.props.showOnlyAssignedJobs
    if (this.state.loading) return <Spin indicator={loadingIcon} />
    return (
      <div className="">
        { !showOnlyAssignedJobs ? 
        <div className="col-xl-12 mb-4">
          {/* <div className="container" style={backIcon}><Icon type="left" /><span style={backIconText} onClick={this.toDashboard.bind(this)}>Back to Dashboard</span></div> */}
          <div className="container pb-5">
            <form action="#" method="post">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-lg-5 col-md-5 col-sm-12 p-0">
                      <input
                        onChange={e => this.SearchTitle(e.target.value)} type="text"
                        value={this.state.title}
                        className="form-control search-slt" placeholder="Search by Title, Skills, or Keywords" />
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-12 p-0 search-controls">
                      <input onChange={e => this.SearchPlace(e.target.value)} type="text" className="form-control search-slt" placeholder="Location" />
                    </div>
                    <div className="col-lg-2 col-md-2 col-sm-12 p-0">
                      <button id="Partner_Jobsearch" type="button" onClick={e => this.SearchingJob(e)} className="btn search-btn">Search</button>
                    </div>
                  </div>
                  <div className="row pt-3">
                    <div className="col-lg-3 col-md-3 col-sm-12 p-1">
                      <h5>Company Type : </h5>
                      <div className="">
                        <Select onChange={e => { this.CompanyTypeFilter(e) }}>
                          <Option value="Startup">Startups (1-100)</Option>
                          <Option value="MidSize">Mid-Size (101-1000)</Option>
                          <Option value="Large">Very Large (1000+) </Option>
                          <Option value="any">Any</Option>
                        </Select>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12 p-1">
                      <h5>Experience Level :</h5>
                      <div className="">
                        <Select onChange={e => { this.ExperienceLevel(e) }}>
                          <Option value="0">Fresher</Option>
                          <Option value="1-3">1-3 Years</Option>
                          <Option value="3-5">More than 3 Years</Option>
                          <Option value="5-7">More than 5 years</Option>
                          <Option value="10-15">10 years and more</Option>
                          <Option value="any">Any</Option>
                        </Select>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12 p-1">
                      <h5>Job Freshness :</h5>
                      <div className="">
                        <Select onChange={e => { this.JobFreshness(e) }}>
                          <Option value="1"> 24 Hours</Option>
                          <Option value="2"> Week</Option>
                          <Option value="3"> Month</Option>
                          <Option value="any"> Any </Option>
                        </Select>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12 p-1">
                      <h5>Salary (in Lakhs/Annum) :</h5>
                      <div className="">
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
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {
            this.state.childLoading ? <Spin indicator={loadingIcon} /> : <JobList {...this.state} count={this.state.jobData.length ? this.state.jobData.length : 0} jobData={this.state.jobData} jobTitle={this.state.title} />
          }
        </div>
        :
        <div>
        {
          this.state.childLoading ? <Spin indicator={loadingIcon} /> : <JobList {...this.state} count={this.state.jobData.length ? this.state.jobData.length : 0} jobData={this.state.jobData} jobTitle={this.state.title} />
        }
        </div>
  }
      </div>
    )
  }
}

export default withRouter(Section);
