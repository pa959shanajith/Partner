import React from 'react';
import { Table, Icon, Progress, Checkbox, Tooltip, message, Select, Spin, notification, Modal, Button, Slider } from 'antd';
import CandidateAddToEventModal from './AddCandidateModal';
import partnerService from "../../../services/partnerService";
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import HIRINGSubscription from '../../subscriptionModal/HIRINGSubscripePlans';
import { FaCreditCard } from 'react-icons/fa';
import moment from 'moment';
import FilterComponent from './filterComponent';
// var tableData = [];
const { Option } = Select;
const menu = ['SUBMITTED', 'UNAVAILABLE']

const { confirm } = Modal;

const pagination = {
    pageSize: 5
}
// function onChange(value) {
//     // console.log(`selected ${value}`);
// }

function onBlur() {
    // console.log('blur');
}

function onFocus() {
    // console.log('focus');
}

function onSearch(val) {
    // console.log('search:', val);
}

const SubscriptionNotification = (msg, title) => {
    notification.open({
        message: title,
        description: msg,
        duration: 8,
        icon: <FaCreditCard />,
    });
}

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

class EnrolledEventsCandidatesListTable extends React.Component {

    constructor(props) {
        super(props);

        var eventId = JSON.parse(localStorage.getItem('eventId')),
            partnerAdmin = JSON.parse(localStorage.getItem('isPartner')),
            email = localStorage.getItem('email'),
            companyName = localStorage.getItem('companyName'),
            ObjectID = localStorage.getItem('ObjectID');
        this.reqData = {
            eventId: eventId,
            email: email,
            companyName: companyName
        }
        this.state = {
            partnerAdmin: partnerAdmin,
            emailId: email,
            eventId: eventId,
            companyName: companyName,
            ObjectID: ObjectID,
            tableData: [],
            confirmDirty: false,
            loading: false,
            showAddModal: false,
            isloading: true,
            profileDetails: {},
            updateProfile: false,
            partnerEmail: email,
            statusChangeApplicant: '',
            subscriptionInfo: [],
            isSubscribed: false,
            isCalledSubscription: false,
            showSubscriptionModal: false,
            showSlider: false,
            selectedCandidate: "",
            responseStatusFalseModal: false,
            profileRank: 0,
            filteredData: [],
            visible: false,
            btnValue: false,
            noData: true,
            selectRow: [{ "Name": "applicantName","type":"string" }, { "Experience": "applicantExperience","type":"float"  }, 
            { "Expected CTC": "applicantExpectedCTC","type":"number"  },{ "Status": "status","type":"arrayString"  },
            { "Submitted By": "profileSubmittedBy","type":"string"  }],
            // allActiveRecruiters: [],
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'applicantName',
                    sorter: (a, b) => a.applicantName.localeCompare(b.applicantName),
                    // sortDirections: ['descend', 'ascend'],
                    render: text => <a href={() => false} onClick={this.showViewRecruiterModal.bind(this)} >{text}</a>,
                    ellipsis: true,
                    width: 150,
                    // fixed: 'left'
                },
                {
                    title: 'Experience',
                    dataIndex: 'applicantExperience',
                    // ellipsis: true,
                    width: 100,
                    sorter: (a, b) => a.applicantExperience - b.applicantExperience,
                },
                {
                    title: 'Expected CTC',
                    dataIndex: 'applicantExpectedCTC',
                    // ellipsis: true,
                    width: 115,
                    sorter: (a, b) => a.applicantExpectedCTC - b.applicantExpectedCTC,
                },
                {
                    title: 'Contact Number',
                    dataIndex: 'applicantPhone',
                    // ellipsis: true,
                    width: 120
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    // width: 135,
                    render: (text, record) => {
                        // console.log(text,' its text',record,"record");
                        return (
                            <>
                                <Select
                                    //disabled={(this.state.partnerEmail === record.profileSubmittedBy) && record.status[0] === "SUBMITTED" ? false : true}
                                    disabled={((this.state.partnerEmail === record.profileSubmittedBy)||(this.state.partnerAdmin=== true)) ? false : true}
                                    showSearch
                                    style={{ padding: 0 }}
                                    // placeholder="select a person"
                                    value={text[0]}
                                    optionFilterProp="children"
                                    onChange={this.onChange}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                    onSearch={onSearch}
                                // filterOption={(input, option) =>
                                //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                // }
                                >
                                    {menu.map((st, i) => {
                                        var value = record.applicantEmailId + '_' + st
                                        return (
                                            <Option key={i} value={value}>{st}</Option>
                                        )
                                    })}
                                </Select>
                            </>
                        )
                    }
                },
                {
                    title: 'Submitted By',
                    dataIndex: 'profileSubmittedBy',
                    // ellipsis: true,
                    width: 200
                },
                {
                    title: 'Action',
                    key: 'action',
                    // width: 120,
                    // fixed: 'right',
                    render: (text, record) => {
                        // console.log(record,' its record',this.state.partnerEmail,record.profileSubmittedBy);
                        // {this.state.partnerEmail !== record.profileSubmittedBy}
                        if (this.state.partnerEmail === record.profileSubmittedBy) {
                            return (
                                <span id={"Partner_EnrolledEvents_"+record._id}>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="Edit">
                                            <Icon id={"Partner_EnrolledEvents_Edit_"+record._id} type="form" onClick={() => this.editProfile(record)} />
                                        </Tooltip>
                                    </span>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="download resume">
                                            <a id={"Partner_Events_downloadResume_"+record._id} href={record.resumeUplodedUrl} ><Icon type="download" /></a>
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
                                    {/* <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="Edit">
                                            <Icon type="form" onClick={() => this.editProfile(record)} />
                                        </Tooltip>
                                    </span> */}
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="download resume">
                                            <a href={record.resumeUplodedUrl} ><Icon type="download" /></a>
                                        </Tooltip>
                                    </span>
                                    <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <Tooltip title="View Profile Rank"><Icon onClick={() => this.showProfileRank(record)} type="solution" /></Tooltip>
                                    </span>
                                </span>
                            )
                        }

                    },
                }
            ],

            data: [
                {
                    key: '1',
                    name: 'Java Developers',
                    address: 'New York No. 1 Lake Park',
                    applicantsCount: 32,
                    employed: <Progress percent={60} className="ant-progress-type-success" />,
                    status: <Checkbox>Active</Checkbox>,
                    actions: <Checkbox>Active</Checkbox>

                }
            ]

        }

        this.partnerService = new partnerService();
        this.errorHandler = new errorHandler();
        this.getAllProfiles = this.getAllProfiles.bind(this);
        this.onChange = this.onChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange(value) {
        if (value) {
            var splitter = value.split('_');
            var data = {
                applicantEmailId: splitter[0],
                status: splitter[1],
                eventId: this.state.eventId

            }
            this.partnerService.updateProfileStatus(data).then((res) => {
                if (res.data.status === true) {
                    if (this.state.partnerAdmin) {
                        this.getAllProfilesForAdmin(this.reqData);
                    }
                    else {
                        this.getAllProfiles(this.reqData);
                    }
                    // this.setState({tableData:res.data.data})
                    message.success(`${res.data.email} Profile Status Updated Successfully`);
                }
            }).catch((err) => {
                this.errorHandler.customErrorCheck(err);
            })
        }
    }



    componentDidMount() {
        // this.setState({ partnerEmail: localStorage.getItem('email'), isPartner: JSON.parse(localStorage.getItem('isPartner')) });
        if (this.state.partnerAdmin) {
            this.getAllProfilesForAdmin(this.reqData);
        }
        else {
            this.getAllProfiles(this.reqData);
        }

    }
    // Edit profile
    editProfile = (key) => {
        //  console.log(key,' its value selected');
        if (key) {
            localStorage.setItem('ClickedApplicantId', key._id);
            var data = {
                name: key.applicantName,
                email: key.applicantEmailId,
                phone: JSON.stringify(key.applicantPhone),
                experience: key.applicantExperience,
                currentcompany: key.applicantCurrentCompany,
                ctc: key.applicantExpectedCTC,
                notice: key.applicantNoticePeriod,
                profileSubmittedBy: this.state.emailId,
                eventId: this.state.eventId,
                companyName: this.state.companyName,
                ObjectId: this.state.ObjectID,
                resumeUrl: key.resumeUplodedUrl,
                isPartner: this.state.partnerAdmin,
                unavailable: key.status[0] === "UNAVAILABLE" ? true : false,
                comments: key.comments
            }
            this.setState({ profileDetails: data, updateProfile: true, showAddModal: !this.state.showAddModal });
        }
    }



    showAddRecruiterModal = () => {
        // localStorage.setItem("editRecruiterId",0);
        this.checkSubscription();

    }

    // check for active Subscription
    checkSubscription() {
        if (this.state.partnerAdmin) {
            this.partnerService.getSubscription().then((res) => {
                // console.log(res, ' its res of subsscripe');
                if (res.data.status === true) {
                    this.setState({ subscriptionInfo: res.data.data });
                    if (res.data.data && res.data.data.length > 0 && res.data.data[0].txStatus !== '') {
                        var txStatus = res.data.data[0].txStatus;
                        var expiryDate = res.data.data[0].subscriptionExpiryDate;
                        // console.log(txStatus, ' its txStatus');
                        if (txStatus === 'SUCCESS' && moment(expiryDate) > moment.utc()) {
                            var data = {
                                name: '',
                                email: "",
                                phone: "",
                                experience: '',
                                currentcompany: '',
                                expectedCTC: '',
                                noticeperiod: '',
                                profileSubmittedBy: "",
                                ObjectId: this.state.ObjectID,
                                companyName: this.state.companyName

                            }
                            // console.log(this.state.isSubscribed,' its sub');
                            this.setState({ isSubscribed: txStatus === 'SUCCESS' ? true : false, profileDetails: data, updateProfile: false, updateRecruiter: false, showAddModal: true });
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
                                    <p>Please subscribe any plans for Add Candidates</p>
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
                            ObjectId: this.state.ObjectID,
                            companyName: this.state.companyName

                        }
                        // console.log(this.state.isSubscribed,' its sub');
                        this.setState({ isSubscribed: true, profileDetails: data, updateProfile: false, updateRecruiter: false, showAddModal: true });
                    }
                    else {
                        message.error('Please subscribe any plans');
                        this.subscriptionStatusNotification();
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
            var msg = "";
            var title = "";
            msg = "Please subscribe any plans to use full features!";
            title = "Subscribe Plans";
            SubscriptionNotification(msg, title);
            this.setState({ isCalledSubscription: true });
        }
        // }

    }



    closeAddRecruiterModal() {
        //refresh Table data 
        this.setState({ showAddModal: false });
        if (this.state.partnerAdmin) {
            this.getAllProfilesForAdmin(this.reqData);
        }
        else {
            this.getAllProfiles(this.reqData);
        }
        // console.log(this.props,' its props');
        // this.props.Reload(false);
    }
    showProfileRank = (record) => {
        this.setState({selectedCandidate:record.applicantName})
        let data ={
            emailId: record.applicantEmailId,
            eventId :this.props.eventData.eventId,
            jobId:""

        }
        this.partnerService.getProfileRankScore(data).then((res) => {
            if (res.data.status === true) {
                this.setState({ showSlider: true ,profileRank:res.data.rank})
            }
        })
        .catch((err) => {
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
    onSubmit() {
        this.setState({ showAddModal: false, profileDetails: {} });
        if (this.state.partnerAdmin) {
            this.getAllProfilesForAdmin(this.reqData);
        }
        else {
            this.getAllProfiles(this.reqData);
        }
    }

    eventProfileMatch(profileEmailId, profileName, jobEventId) {
        //TODO Call api for job/event profile match
        let data = {
            email: profileEmailId, name: profileName, eventId: jobEventId, type: "Event"
        }
        console.log(data)
        this.partnerService.updateEventProfileMatch(data).then((res) => {
            // console.log(res.data, ' its res');
            if (res.data.status === true) {
                // this.setState({ tableData: res.data.listofApplicants, isloading: false })
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    //update table data if sucess



    // }

    // get All Candidates Profile After added
    getAllProfiles(data) {
        if (data) {
            this.partnerService.getAllProfile(data).then((res) => {
                if (res.data.status === true) {
                    this.setState({ tableData: res.data.listofApplicants, isloading: false })
                    console.log(this.state.tableData);
                }
            }).catch((err) => {
                this.setState({ isloading: false });
                this.errorHandler.customErrorCheck(err);
                console.log(err);

            })
        }
    }
    // get all Candidates Profile For Partner Admin
    getAllProfilesForAdmin = (data) => {
        if (data) {
            this.partnerService.getAllProfileForPartnerAdmin(data).then((res) => {
                // console.log(res,' its res');
                if (res.data.status === true) {
                    this.setState({ tableData: res.data.listofApplicants, isloading: false })
                    // console.log(this.state.tableData);
                }
            }).catch((err) => {
                this.setState({ isloading: false });
                this.errorHandler.customErrorCheck(err);
                console.log(err);

            })
        }
    }

    showViewRecruiterModal = () => {
        this.setState({ showViewModal: true });
    }
    closeViewRecruiterModal() {
        this.setState({ showViewModal: false });
    }
    redirectToDashboard = () => {
        this.props.onChangeTable("events");
    }
    confirmDelete = (key) => {
        // console.log(key);
        //call inactivate 
        this.partnerService.deactivaterecruiter(key).then((d) => {
            this.fetchAllRecruiterData();
            message.success("Recruiter account deactivated", 5);
        }).catch((err) => {
            message.error("Failed to deactivate recruiter id.", 5)
        })
    }
    cancelDelete = (e) => {
        // console.log(e);
        message.error('Click on No');
    }

    componentWillReceiveProps(props) {
        console.log(props, ' its props');
        this.setState({ isSubscribed: this.props.isSubscribed });
        if (this.state.partnerAdmin) {
            this.getAllProfilesForAdmin(this.reqData);
        }
        else {
            this.getAllProfiles(this.reqData);
        }
    }

    closeSubscriptionModal = () => {
        this.setState({ showSubscriptionModal: false })
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
        // const tableData = this.props.data;
        let tableData = this.props.applicantData;
        // console.log(tableData, ' its tableData');
        // const marginRight = {
        //     marginRight: '15px',
        //     paddingTop: '6px',
        //     color: '#fff',
        //     fontSize: '20px',
        // }

        let sortedData=tableData.sort(function(a,b){
            return new Date(b.ProfileSubmittedTimeStamp) - new Date(a.ProfileSubmittedTimeStamp);
          });

        // console.log("sortedData",sortedData);

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
                <div className="recruiter-table-wrapper">

                     <FilterComponent visible={this.state.visible} 
                    userData={sortedData} closeModal={this.closeModal.bind(this)} 
                    sendDataToParent={this.sendDataToParent.bind(this)} 
                    showSelectedRow={this.state.selectRow} 
                    changeButton={this.changeButton.bind(this)} />

                    <CandidateAddToEventModal
                        visible={this.state.showAddModal}
                        onClose={this.closeAddRecruiterModal.bind(this)}
                        submitProfile={this.onSubmit.bind(this)}
                        eventProfileMatch={this.eventProfileMatch.bind(this)}
                        editRecruiter={this.state.profileDetails}
                        isEdit={this.state.updateProfile}></CandidateAddToEventModal>
                    {
                        this.state.showSubscriptionModal ? (<HIRINGSubscription showData={this.state.showSubscriptionModal} closeModal={this.closeSubscriptionModal} />) : ''
                    }

                    <div className="justify-content-between" style={{
                        borderRadius: '6px 6px 0 0',
                        display: 'flex', padding: '10px', width: '100%',
                        background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                    }}>
                        <span style={{ display: 'inline-block' }}>
                            {/* <Icon style={marginRight} type="left" onClick={this.redirectToDashboard} /> */}
                            <h3 style={headingStyle} >Candidates List for {this.props.eventData.eventName}</h3>
                        </span>
                        <div style={{ position:"absolute",right:"130px",top:"10px" }}>
                        <Button onClick={this.state.btnValue?this.cancleFilter:this.openModal}>{this.state.btnValue ? "Clear Filter":"Filter"}</Button>
                        </div>
                        <Button id="Partner_enrolledEvents_Upload_Button" icon="upload" onClick={this.showAddRecruiterModal}>Upload</Button>
                    </div>
                    <Table
                        columns={this.state.columns}
                        dataSource={this.state.noData ? this.state.filteredData.length ? this.state.filteredData : sortedData : []}
                        style={{ minHeight: '600px' }}
                        scroll={{ x: 1000 }}
                        pagination={pagination}
                    />
                                        <div>
                        <Modal title={"Profile rank for "+this.state.selectedCandidate+" for Event: "+this.props.eventData.eventName}
                               visible={this.state.showSlider}
                               onCancel={this.handleCancel}
                               onOk={this.handleOk}
                               destroyOnClose={true}
                               footer={"Total candidates applied are "+this.props.eventData.listofApplicants.length}
                        >
                        <Slider defaultValue={this.state.profileRank} disabled tooltipVisible></Slider>
                        </Modal>
                    </div> 
                    <div>
                        <Modal title={"Failed to fetch Profile rank for "+this.state.selectedCandidate+" for Event: "+this.props.eventData.eventName}
                               visible={this.state.responseStatusFalseModal}
                               onCancel={this.handleCancelForResponseFalseModal}
                               onOk={this.handleOk}
                               destroyOnClose={true}
                               footer={"Total candidates applied are "+this.props.eventData.listofApplicants.length}
                        >
                        {/* <Slider defaultValue={0}  disabled tooltipVisible></Slider> */}
                        </Modal>
                    </div>
                </div>
            )
    }
}

export default EnrolledEventsCandidatesListTable;