import { Button, Icon, message, Modal, notification, Spin, Table, Tooltip, Popconfirm, Select, Slider } from 'antd';
import React from 'react';
import { FaCreditCard } from 'react-icons/fa';
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import partnerService from "../../../services/partnerService";
import HIRINGSubscription from '../../subscriptionModal/HIRINGSubscripePlans';
import CandidateAddToEventModal from './CandidateAddToEventModal';
import MultipleFileUpload from './MultipleFileUpload';
import FilterComponent from './filterComponent';
import moment from 'moment';

const { Option } = Select;
// const menu = ['SUBMITTED', 'UNAVAILABLE']
const { confirm } = Modal;

const loadingIcon = <Icon type="loading" style={{
    fontSize: 80, position: 'absolute',
    top: '50%',
    left: '50%',
    height: '30%',
    width: '50%',
    marginTop: '-15%',
    marginRight: '0',
    marginBottom: '0',
    marginLeft: '-25%'
}} spin />;

const SubscriptionNotification = (msg, title) => {
    notification.open({
        message: title,
        description: msg,
        duration: 8,
        icon: <FaCreditCard />,
    });
}
class JobCandidatesList extends React.Component {

    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        var partnerAdmin = JSON.parse(localStorage.getItem('isPartner')),
            ObjectID = localStorage.getItem('ObjectID');
        // var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        
        this.reqData = {
            jobId: props.jobData.jobId,
            email: email
        }
        this.state = {
            tableData: [],
            confirmDirty: false,
            loading: false,
            showAddModal: false,
            showBulkModal: false,
            isloading: true,
            profileDetails: {},
            updateProfile: false,
            partnerEmail: email,
            statusChangeApplicant: '',
            partnerAdmin: partnerAdmin,
            ObjectID: ObjectID,
            companyName: companyName,
            isCalledSubscription: false,
            showSubscriptionModal: false,
            showSlider: false,
            selectedCandidate: "",
            responseStatusFalseModal: false,
            profileRank: 0,
            jobTitle:"",
            menu: ['SUBMITTED', 'UNAVAILABLE'],
            filteredData: [],
            visible: false,
            btnValue: false,
            noData: true,
            selectRow: [{ "Name": "applicantName","type":"string" }, { "Experience": "applicantExperience","type":"number"  }, { "Expected CTC": "applicantExpectedCTC","type":"number"  },{ "Status": "status","type":"arrayString"  },{ "Submitted By": "profileSubmittedBy","type":"string"  }],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'applicantName',
                    ellipsis: true,
                    // width: 175,
                    // fixed: 'left',
                    sorter: (a, b) => a.applicantName.localeCompare(b.applicantName),
                },
                {
                    title: 'Experience',
                    dataIndex: 'applicantExperience',
                    // width: 125,
                    sorter: (a, b) => a.applicantExperience - b.applicantExperience,
                },
                {
                    title: 'Expected CTC',
                    dataIndex: 'applicantExpectedCTC',
                    width: 100,
                    sorter: (a, b) => a.applicantExpectedCTC - b.applicantExpectedCTC,
                },
                {
                    title: 'Contact Number',
                    dataIndex: 'applicantPhone',
                    width: 120,
                    // ellipsis: true,
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    width: 175,
                    render: (text, record) => {
                        return (
                            <div>
                                <Select
                                    // disabled={(this.state.partnerEmail === record.profileSubmittedBy) && record.status[0] === "SUBMITTED" ? false : true}
                                    disabled={((this.state.partnerEmail === record.profileSubmittedBy)||(this.state.partnerAdmin=== true)) ? false : true}
                                    showSearch
                                    style={{ width: 'auto' }}
                                    value={text[0]}
                                    optionFilterProp="children"
                                    onChange={this.onChange}
                                >
                                    {this.state.menu.map((st, i) => {
                                        var value = record.applicantEmailId + '_' + st
                                        return (
                                            <Option key={i} value={value}>{st}</Option>
                                        )
                                    })}
                                </Select>
                            </div>
                        )
                    }
                },
                {
                    title: 'Submitted By',
                    dataIndex: 'profileSubmittedBy',
                    ellipsis: true,
                    // width: 175
                },
                {
                    title: 'Action',
                    key: 'action',
                    // width: 125,
                    render: (text, record) => {
                        if (this.state.partnerEmail === record.profileSubmittedBy) {
                            return (
                                <span>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="Edit">
                                            <Icon type="form" onClick={() => this.editProfile(record)} />
                                        </Tooltip>
                                    </span>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="download resume">
                                            <a id={"Partner_candidatejob_downloadResume_"+record._id} href={record.resumeUplodedUrl} ><Icon type="download" /></a>
                                        </Tooltip>
                                    </span>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="View Profile Rank"><Icon onClick={() => this.showProfileRank(record)} type="solution" /></Tooltip>
                                    </span>
                                </span>
                            )
                        }
                        else {
                            return (
                                <span>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="download resume">
                                            <a id={"Partner_candidatejob_downloadResume_"+record._id} href={record.resumeUplodedUrl} ><Icon type="download" /></a>
                                        </Tooltip>
                                    </span>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="View Profile Rank"><Icon onClick={() => this.showProfileRank(record)} type="solution" /></Tooltip>
                                    </span>
                                </span>
                            )
                        }
                    }
                }
            ]
        }

        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.getAllProfiles = this.getAllProfiles.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
        // console.log(' componentDidMount its props', this.props);
        this.getAllProfiles({ isAdmin: this.state.partnerAdmin, companyName: this.state.companyName, jobId: this.props.jobData.jobId, email: this.state.partnerEmail });
        this.setState({ jobId: this.props.jobData.jobId });
    }
    closeSubscriptionModal = () => {
        this.setState({ showSubscriptionModal: false })
    }
    componentWillReceiveProps(props) {
        // console.log(props, ' componentWillReceiveProps its props');
        if (props.jobData.jobId !== this.state.jobId) {
            this.getAllProfiles({ isAdmin: this.state.partnerAdmin, companyName: this.state.companyName, jobId: props.jobData.jobId, email: this.state.partnerEmail });
        }
        this.setState({ jobId: props.jobData.jobId, isSubscribed: this.props.isSubscribed });

    }
    onChange(value) {
        if (value) {
            var splitter = value.split('_');
            var data = {
                applicantEmailId: splitter[0],
                status: splitter[1],
                jobId: localStorage.getItem('jobId')
            }
            this.partnerService.updateJobStatus(data).then((res) => {
                if (res.data.status === true) {
                    this.getAllProfiles({ isAdmin: this.state.partnerAdmin, companyName: this.state.companyName, jobId: this.props.jobData.jobId, email: this.state.partnerEmail });
                    message.success(`${res.data.email} Profile Status Updated Successfully`);
                }
            }).catch((err) => {
                this.errorHandler.customErrorCheck(err);
            })
        }
    }
    showProfileRank = (record) => {
        this.setState({selectedCandidate:record.applicantName})
        let data ={
            emailId: record.applicantEmailId,
            jobId :this.props.jobData.jobId,
            eventId: ""
        }
        this.partnerService.getProfileRankScore(data).then((res) => {
            if (res.data.status === true) {
                this.setState({ showSlider: true ,profileRank:res.data.rank})
            }
        })
        .catch((err) => {
            // this.errorHandler.customErrorCheck(err);
            this.setState({responseStatusFalseModal:true})
        })
    }

    handleOk = e => {
        this.setState({ showSlider: false });
      };
    
      handleCancel = e => {
        this.setState({ showSlider: false });
      };
      handleCancelForResponseFalseModal = e => {
        this.setState({ responseStatusFalseModal: false });
      };



    // Edit profile
    editProfile = (key) => {
        if (key) {
            localStorage.setItem('ClickedApplicantId', key._id);
            var partnerCheck = JSON.parse(localStorage.getItem('isPartner'));
            var data = {
                _id: key._id, name: key.applicantName, email: key.applicantEmailId, phone: JSON.stringify(key.applicantPhone), experience: key.applicantExperience,
                ctc: key.applicantExpectedCTC, notice: key.applicantNoticePeriod, profileSubmittedBy: localStorage.getItem('email'),
                eventId: localStorage.getItem('eventId'), companyName: localStorage.getItem('companyName'),
                ObjectId: localStorage.getItem('ObjectID'), resumeUrl: key.resumeUplodedUrl, lastcompany: key.applicantLastCompany,
                isPartner: partnerCheck, unavailable: key.status[0] === "UNAVAILABLE" ? true : false, comments: key.comments
            }
            this.setState({ profileDetails: data, updateProfile: true, showAddModal: !this.state.showAddModal });
        }
    }



    showAddModal = () => {
        this.checkSubscription(false);
        // var data = {
        //     name: '',
        //     email: "",
        //     phone: "",
        //     experience: '',
        //     expectedCTC: '',
        //     noticeperiod: '',
        //     profileSubmittedBy: "",
        //     ObjectId: localStorage.getItem('ObjectID'),
        //     companyName: localStorage.getItem('companyName')
        // }
        // this.setState({ profileDetails: data, updateProfile: false, updateRecruiter: false, showAddModal: true, showBulkModal: false });
    }

    showBulkModal = () => {
        this.checkSubscription(true);
        // this.setState({ showBulkModal: true, showAddModal: false })
    }

    // check for active Subscription
    checkSubscription = (uploadType) => {
        if (this.state.partnerAdmin) {
            this.partnerService.getSubscription().then((res) => {
                // console.log(res, ' its res of subsscripe');
                if (res.data.status === true) {
                    this.setState({ subscriptionInfo: res.data.data });
                    if (res.data.data && res.data.data.length && res.data.data[0].txStatus !== '') {
                        let txStatus = res.data.data[0].txStatus;
                        let expiryDate = res.data.data[0].subscriptionExpiryDate;
                        if (txStatus === 'SUCCESS' && moment(expiryDate) > moment.utc()) {
                            let data = {
                                name: '',
                                email: "",
                                phone: "",
                                experience: '',
                                expectedCTC: '',
                                noticeperiod: '',
                                profileSubmittedBy: "",
                                comments: "",
                                ObjectId: this.state.ObjectID,
                                companyName: this.state.companyName

                            }
                            // console.log(this.state.isSubscribed,' its sub');
                            this.setState({
                                isSubscribed: txStatus === 'SUCCESS' ? true : false,
                                profileDetails: data,
                                updateProfile: false,
                                updateRecruiter: false,
                                showAddModal: !uploadType ? true : false,
                                showBulkModal: uploadType ? true : false
                            });
                        }
                        else {
                            confirm({
                                //   title: 'This is a warning message',
                                content: (
                                    <div>
                                        <p>Sorry your plans expired,Please subscribe any plans for Add Candidates </p>
                                    </div>
                                ),
                                onOk: () => {
                                    this.setState({ showSubscriptionModal: true });
                                },
                                onCancel: () => {
                                    message.error('Please subscribe any plans');
                                    // this.subscriptionStatusNotification();
                                }

                            });
                        }
                    }
                    else {
                        confirm({
                            //   title: 'This is a warning message',
                            content: (
                                <div>
                                    <p>Please subscribe any plans for submiting profiles</p>
                                </div>
                            ),
                            onOk: () => {
                                this.setState({ showSubscriptionModal: true });
                            },
                            onCancel: () => {
                                message.error('Please subscribe any plans');
                                // this.subscriptionStatusNotification();
                            }

                        });
                    }
                }


            }).catch((err) => {
                console.log(err);
                this.errorHandler.customErrorCheck(err);
            })
        }
        // TODO Recruiter Subscription Check
        else {
            var data = {
                partnerEmail: localStorage.getItem('partnerEmail')
            }
            this.partnerService.getPartnerSubscriptionforRecruiter(data).then((res) => {
                // console.log(res, ' its res of subsscripe of recruiter');
                if (res.data.status === true) {
                    if (res.data.data.subscriptionExpiryDate > moment().utc().format()) {
                        var data = {
                            name: '',
                            email: "",
                            phone: "",
                            experience: '',
                            expectedCTC: '',
                            noticeperiod: '',
                            profileSubmittedBy: "",
                            comments:"",
                            ObjectId: this.state.ObjectID,
                            companyName: this.state.companyName

                        }
                        // console.log(this.state.isSubscribed,' its sub');

                        this.setState({
                            isSubscribed: true,
                            profileDetails: data,
                            updateProfile: false,
                            updateRecruiter: false,
                            showAddModal: !uploadType ? true : false,
                            showBulkModal: uploadType ? true : false
                        });
                    }
                    else {
                        message.error('Please subscribe any plans');
                        // this.subscriptionStatusNotification();
                    }
                }


            }).catch((err) => {
                console.log(err);
                this.errorHandler.customErrorCheck(err);
            })
        }

    }

    // checking Subscriptions
    subscriptionStatusNotification = () => {
        //TODO: We need to check subscription in case of recruiter as well
        // var isPartner = JSON.parse(localStorage.getItem('isPartner'));
        // if (this.state.isCalledSubscription === false) {
        if (this.state.partnerAdmin) { // its for partner admin 
            let msg = "";
            let title = "";
            msg = "Please subscribe any plans to use full features!";
            title = "Subscribe Plans";
            SubscriptionNotification(msg, title);
            this.setState({ isCalledSubscription: true });
        }
        else { // its for recruiter
            let msg = "";
            let title = "";
            msg = "Sorry partner admin not subscribed the plans";
            title = "Subscribe Plans";
            SubscriptionNotification(msg, title);
            this.setState({ isCalledSubscription: true });
        }
        // }

    }


    closeAddCandidatesModal() {
        this.setState({ showAddModal: false, profileDetails: {}, showBulkModal: false });
    }
    reloadProfiles = () => {
        this.onSubmit();
    }

    onSubmit() {
        this.setState({ showAddModal: false, profileDetails: {} });
        this.getAllProfiles({ isAdmin: this.state.partnerAdmin, companyName: this.state.companyName, jobId: this.state.jobId, email: this.state.partnerEmail });
    }

    // get All Candidates Profile After added
    getAllProfiles(data) {
        var jobTitle = localStorage.getItem('jobTitle');
        if (data) {
            this.partnerService.getAllJobCandidateProfiles(data).then((res) => {
                if (res.data.status === true) {
                    this.setState({ tableData: res.data.listofApplicants, isloading: false,jobTitle:jobTitle })
                }
            }).catch((err) => {
                this.setState({ isloading: false });
                this.errorHandler.customErrorCheck(err);
                console.log(err);

            })
        }
    }
    redirectToDashboard = () => {
        this.props.onChangeTable("jobs");
    }
    eventProfileMatch(profileEmailId, profileName, jobEventId) {
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

    openModal = () => {
        this.setState({ visible: true})
    }
    
    closeModal() {
        this.setState({ visible: false });
    }

    sendDataToParent = (data, value,bol) => {
        // console.log("from",data,"value",value);
        this.setState({ filteredData: data, noData: value,click:bol })
    }

    changeButton = (btnName) => {
        // console.log("btnName",btnName);
        this.setState({ btnValue: btnName })
    }

    cancleFilter = () => {
        this.setState({ filteredData: [], btnValue: false, noData: true})
    }

    render() {
        const tableData = this.state.tableData;
        // const marginRight = {
        //     marginRight: '15px',
        //     paddingTop: '6px',
        //     color: '#fff',
        //     fontSize: '20px'
        // }
        const headingStyle = {
            marginRight: '15px',
            fontWeight: '600',
            color: '#fff',
            fontSize: '28px',
            display: 'inline'
        }
        if (this.state.isloading === true) return <Spin indicator={loadingIcon} />
        else
            return (
                <div>
                    { this.state.showAddModal && !this.state.showBulkModal ?
                        <CandidateAddToEventModal
                            visible={this.state.showAddModal}
                            onClose={this.closeAddCandidatesModal.bind(this)}
                            submitProfile={this.onSubmit.bind(this)}
                            profileData={this.state.profileDetails}
                            eventProfileMatch={this.eventProfileMatch.bind(this)}
                            isEdit={this.state.updateProfile}
                            jobData={this.props.jobData} /> :
                        <MultipleFileUpload
                            visible={this.state.showBulkModal}
                            onClose={this.closeAddCandidatesModal.bind(this)}
                            reload={this.reloadProfiles}
                        />
                    }
                    {
                        this.state.showSubscriptionModal ?
                            (<HIRINGSubscription
                                showData={this.state.showSubscriptionModal}
                                closeModal={this.closeSubscriptionModal} />) : ''
                    }
                    <FilterComponent visible={this.state.visible} 
                    userData={tableData} closeModal={this.closeModal.bind(this)} 
                    sendDataToParent={this.sendDataToParent.bind(this)} 
                    showSelectedRow={this.state.selectRow} 
                    changeButton={this.changeButton.bind(this)} />
                    <div className="justify-content-between" style={{
                        borderRadius: '6px 6px 0 0',
                        display: 'flex', padding: '10px', width: '100%',
                        background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                    }}>
                        <span style={{ display: 'inline-block' }}>
                            {/* <Icon style={marginRight} type="left" onClick={this.redirectToDashboard} /> */}
                            <h3 style={headingStyle} >Candidates List for {this.state.jobTitle}</h3>
                        </span>
                        <div style={{ position:"absolute",top:"10px",right:"150px" }}>
                    <Button onClick={this.state.btnValue?this.cancleFilter:this.openModal}>{this.state.btnValue ? "Clear Filter":"Filter"}</Button>
                     {/* {<Button onClick={this.cancleFilter}>Clear Filter</Button> : ""} */}
                    </div>
                        <Popconfirm
                            title="Upload"
                            placement="rightBottom"
                            onConfirm={this.showAddModal}
                            onCancel={this.showBulkModal}
                            okText="Upload"
                            cancelText="Bulk Upload"
                        >
                            <Button id="Partner_candidateJobs_Upload" icon="upload" >Upload</Button>
                        </Popconfirm>

                    </div>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.noData ? this.state.filteredData.length ? this.state.filteredData : tableData : []}
                    // scroll={{ x: 1100 }}
                    />
                    <div>
                        <Modal title={"Profile rank for "+this.state.selectedCandidate+" for Job: "+this.props.jobData.jobTitle}
                               visible={this.state.showSlider}
                               onCancel={this.handleCancel}
                               onOk={this.handleOk}
                               destroyOnClose={true}
                               footer={"Total candidates applied are "+this.props.jobData.profilesByPartner.length}
                        >
                        <Slider defaultValue={this.state.profileRank} max={this.props.jobData.profilesByPartner.length} disabled tooltipVisible></Slider>
                        </Modal>
                    </div> 
                    <div>
                        <Modal title={"Failed to compute profile rank for "+this.state.selectedCandidate+" for job: "+this.props.jobData.jobTitle}
                               visible={this.state.responseStatusFalseModal}
                               onCancel={this.handleCancelForResponseFalseModal}
                               onOk={this.handleOk}
                               destroyOnClose={true}
                               footer={"Total candidates applied are "+this.props.jobData.profilesByPartner.length}
                        >
                        {/* <Slider defaultValue={0}  disabled tooltipVisible></Slider> */}
                        </Modal>
                    </div>
                </div>
            )
    }
}

export default JobCandidatesList;