import { Carousel, message, Tooltip } from 'antd';
import React from 'react';
import { FaBolt } from 'react-icons/fa';
import partnerService from "../../../services/partnerService";
import companyService from "../../../services/companyService";
import ViewAllJobsModal from './ViewAllJobsModal';
import moment from 'moment';

const StyleSheet_BoxProperties = {
    boxShadow: '0px 0px 35px #00000029',
    minHeight: '300px'
}

class LatestJobsPosting extends React.Component {
    constructor() {
        super();
        var isPartner = localStorage.getItem('isPartner');
        var email = localStorage.getItem('email');
        var companyName = localStorage.getItem('companyName');
        this.state = {
            showTable: "",
            showViewAllEventModal: false,
            isPartner: isPartner === 'true' ? true : false,
            companyName: companyName,
            emailId: email,
            companiesData: [],
            showViewAllJobsModal: false,
            selectedCompanyName: '',
            defaultCompanyLogo: "assets/partner/company_default.png",
            companyNameArray: [],
            showOnlyAssignedJobs : false
        }
        this.partnerService = new partnerService();
        this.companyService = new companyService();
    }
    componentDidMount() {
        // console.log(this.props, ' its events Props');
        this.getAllCompanies()
    }

    getAllCompanies() {
        this.companyService.getAllCompanies('all')
            .then((response) => {
                var companyNameArray = []
                this.setState({ companiesData: response.data.data })
                response.data.data.forEach(obj => {
                    companyNameArray.push(obj.companyName)
                });
                this.setState({companyNameArray:companyNameArray})
            })
            .catch((error) => {
                console.log('ERROR IN CATCH', error)
            })
    }

    showAllJobsModal = () => {
        this.setState({ showViewAllJobsModal: true, selectedCompanyName: '' });
    }
    showAssignedJobsModal = () => {
        if(this.props.assignedCompanies.length === 0){
            message.error("There are no jobs to show or you've no companies assigned")
        }else{
        this.setState({ showViewAllJobsModal: true, selectedCompanyName: this.props.assignedCompanies, showOnlyAssignedJobs: true });   
        }
    }
    closeAllJobsModal = () => {
        this.setState({ showViewAllJobsModal: false, showOnlyAssignedJobs:false });
        // this.props.form.resetFields();
    }
    // It will Trigger After Enroll the Each Events
    subscribeCallback = () => {
        this.componentDidMount();
        this.props.enrollEventList();
    }
    showCompanyJobModal = (companyName) => {
        this.setState({
            showViewAllJobsModal: true,
            selectedCompanyName: companyName
        });
    }
    // handleJobSeachByCompany = (companyName) => {
    //     console.log(companyName);
    // }

    render() {
        const { showViewAllJobsModal } = this.state;
        const isPartner = this.state.isPartner
        const assignedCompanies = this.props.assignedCompanies
        return (
            <div>
            { isPartner ? 
            (<section className="row" >
                <ViewAllJobsModal
                    visible={showViewAllJobsModal}
                    onClose={this.closeAllJobsModal.bind(this)}
                    companyName={this.state.selectedCompanyName}
                    showOnlyAssignedJobs={this.state.showOnlyAssignedJobs}
                />
                <div className="col">
                    <div className="JobStatsWrapper" style={StyleSheet_BoxProperties}>
                        <div className="top-button-wrapper row justify-content-between" style={{ padding: '0 20px' }}>
                            <p style={{
                                textAlign: 'left',
                                fontFamily: 'Helvetica',
                                letterSpacing: '0px',
                                color: '#D45895',
                                fontSize: '16px',
                                fontWeight: '600',
                                padding: '10px 15px 0 10px'
                            }}>Assigned Jobs</p>
                            <p style={{
                                textAlign: 'left',
                                fontFamily: 'Helvetica',
                                letterSpacing: '0px',
                                color: '#D45895',
                                fontSize: '14px',
                                fontWeight: '600',
                                padding: '10px 10px 0 15px',
                                cursor: 'pointer'
                            }} onClick={() => this.showAssignedJobsModal()}>view all</p>
                        </div>
                        <Carousel autoplay>
                            {
                                assignedCompanies.length > 0 ?
                                    this.state.companiesData.map((Company, i) => (
                                        assignedCompanies.includes(Company.companyName) ?
                                        <div className="px-3">
                                            <div id={"Partner_ActiveJobs_"+Company._id}key={i} className="job-list-item card" onClick={() => this.showCompanyJobModal(Company.companyName)} style={{ cursor: 'pointer' }} >
                                                <div className="job-container-card">
                                                    <Tooltip title={Company.companyName}>
                                                        <img src={Company.logo}
                                                            style={{ paddingTop: '8px', height: '65px' }}
                                                            alt={Company.companyName} />
                                                    </Tooltip>
                                                    
                                                    <div style={{ padding: '0 10px' }}>
                                                        <h3 className="job-oppurtunities">{Company.length}</h3>
                                                        <h6 className="sub-text">Opportunities</h6>
                                                    </div>
                                                </div>
                                                {(moment().diff(moment(Company.lastJobPostApprovedDate), 'days') > 60) ? ("")
                                                    :
                                                    (<div>
                                                        <div className="justify-content-between row">
                                                            <div className="d-flex" style={{ padding: '0 0 0 20px' }}>
                                                                <FaBolt style={{ color: '#A75A8D', height: "40px", width: '14px' }} />
                                                                <h5 style={{ color: '#414040', fontSize: '15px', marginLeft: '10px', textAlign: 'left' }}>Actively <br />Hiring</h5>
                                                            </div>
                                                        </div>
                                                    </div>)
                                                }
                                                
                                            </div>
                                            
                                        </div>
                                        :
                                        ""
                                    ))
                                    :
                                    (
                                        <div>
                                            No Jobs Found
                                        </div>
                                    )
                            }
                        </Carousel>
                    </div>
                </div>
                <div className="col">
                    <div className="JobStatsWrapper" style={StyleSheet_BoxProperties}>
                        <div className="top-button-wrapper row justify-content-between" style={{ padding: '0 20px' }}>
                            <p style={{
                                textAlign: 'left',
                                fontFamily: 'Helvetica',
                                letterSpacing: '0px',
                                color: '#D45895',
                                fontSize: '16px',
                                fontWeight: '600',
                                padding: '10px 15px 0 10px'
                            }}>Other Jobs</p>
                            <p style={{
                                textAlign: 'left',
                                fontFamily: 'Helvetica',
                                letterSpacing: '0px',
                                color: '#D45895',
                                fontSize: '14px',
                                fontWeight: '600',
                                padding: '10px 10px 0 15px',
                                cursor: 'pointer'
                            }} onClick={() => this.showAllJobsModal()}>view all</p>
                        </div>
                    <Carousel autoplay>
                            {
                                this.state.companiesData.length > 0 ?
                                    this.state.companiesData.map((Company, i) => (
                                        assignedCompanies.includes(Company.companyName) ?
                                        ""
                                        :
                                        <div className="px-3">
                                        <div id={"Partner_ActiveJobs_"+Company._id}key={i} className="job-list-item card" onClick={() => this.showCompanyJobModal(Company.companyName)} style={{ cursor: 'pointer' }} >
                                            <div className="job-container-card">
                                                <Tooltip title={Company.companyName}>
                                                    <img src={Company.logo}
                                                        style={{ paddingTop: '8px', height: '65px' }}
                                                        alt={Company.companyName} />
                                                </Tooltip>
                                                
                                                <div style={{ padding: '0 10px' }}>
                                                    <h3 className="job-oppurtunities">{Company.length}</h3>
                                                    <h6 className="sub-text">Opportunities</h6>
                                                </div>
                                            </div>

                                            {(moment().diff(moment(Company.lastJobPostApprovedDate), 'days') > 60) ? ("")
                                                :
                                                (<div>
                                                    <div className="justify-content-between row">
                                                        <div className="d-flex" style={{ padding: '0 0 0 20px' }}>
                                                            <FaBolt style={{ color: '#A75A8D', height: "40px", width: '14px' }} />
                                                            <h5 style={{ color: '#414040', fontSize: '15px', marginLeft: '10px', textAlign: 'left' }}>Actively <br />Hiring</h5>
                                                        </div>
                                                    </div>
                                                </div>)
                                            }
                                            
                                        </div>
                                        
                                    </div>
                                    ))
                                    :
                                    (
                                        <div>
                                            No Jobs Found
                                        </div>
                                    )
                            }
                        </Carousel>
                    </div>
                </div>
            </section >)
            :""}
            </div>
        )
    }
}

export default LatestJobsPosting;