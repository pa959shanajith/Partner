import React from 'react';
import { Table, Button, Icon, Progress, Checkbox, Tooltip, message, Spin, notification, Modal } from 'antd';
import AddTraining from './AddTraining';
import ViewRecruiter from './ViewRecruiter';
import InviteTraineeModal from './InviteTraineeModal';
import partnerService from "../../../services/partnerService";
import errorHandler from '../../../ErrorHandler/ErrorHandler';
import CandidateRegisteredModal from "./CandidateRegisteredModal";
import TRAININGSubscription from '../../subscriptionModal/TRAININGSubscripePlans';
import Moment from 'react-moment';
import moment from 'moment';
import { FaCreditCard } from 'react-icons/fa';

const { confirm } = Modal;

const loadingIcon = <Icon type="loading" style={{
    fontSize: 80, position: 'absolute',
    top: '50%',
    left: '50%',
    height: '100%',
    width: '100%',
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

class EnrolledEventsTable extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        // var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        var partnerAdmin = JSON.parse(localStorage.getItem('isPartner'));
        this.state = {
            confirmDirty: false,
            loading: false,
            showAddModal: false,
            showViewModal: false,
            showInviteModal: false,
            showSubscriptionModal: false,
            emailId: email,
            // authtoken: auth,
            companyName: companyName,
            partnerAdmin: partnerAdmin,
            subscriptionInfo: {},
            isSubscribed: '',
            recruiterDetails: {},
            updateRecruiter: false,
            allActiveRecruiters: [],
            trainingEvents: [],
            TrainingDetails: [],
            eventData: {},
            componentLoading: false,
            showRegisteredList: false,
            profileData: [],
            trainingCost: '',
            basicDetails: {},
            columns: [
                {
                    title: 'Training Name',
                    dataIndex: 'trainingName',
                    // sorter: (a, b) => a.name.length - b.name.length,
                    // sortDirections: ['descend', 'ascend'],
                    render: text => <p className="hyperlink">{text}</p>,
                    ellipsis: true
                },
                {
                    title: 'Date',
                    dataIndex: 'trainingDate',
                    render: text => <Moment format="DD MMMM YYYY">
                        {text}
                    </Moment>,
                    ellipsis: true
                },
                {
                    title: 'Training Mode',
                    dataIndex: 'trainingMode',
                    ellipsis: true,
                },
                {
                    title: 'Training Type',
                    dataIndex: 'trainingType',
                },
                {
                    title: 'Fee (Rs)',
                    dataIndex: 'trainingCost',
                    render: text => <span >{text}</span>,
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Invite Participants">
                                    <Icon type="user-add" onClick={() => this.showInviteTraineeModal(record, record._id)} />
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Edit">
                                    {/* <Popconfirm
                                        title="Are you sure delete this task?"
                                        onConfirm={() => this.confirmDelete.bind(this)(record.emailId)}
                                        onCancel={this.cancelDelete.bind(this)}
                                        okText="Yes"
                                        cancelText="No"
                                    > */}
                                    <Icon type="edit" onClick={() => this.editTraining(record._id)} />
                                    {/* </Popconfirm> */}
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Registered Profiles">
                                    <Icon type="profile" onClick={() => this.getAllRegisteredProfiles(record._id, record.trainingCost)} />
                                </Tooltip>

                            </span>
                        </span>
                    ),
                },
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
        this.getAlltrainingEvent = this.getAlltrainingEvent.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    // componentWillMount(){
    //     console.log("Will Mount")
    // }
    componentDidMount() {
        //fetch data
        // this.partnerService.getrecruitersbycompany(this.state.companyName).then((response) => {
        //     console.log(response.data.data);
        //     this.setState({ allActiveRecruiters: response.data.data });
        //   }).catch((err) => {
        //     console.log(err);
        //   });
        // this.fetchAllRecruiterData();
        this.getPartnerBasicDetails()
        this.getAlltrainingEvent();
    }
    getPartnerBasicDetails = () => {
        this.partnerService.getBasicDetails().then((response) => {
            // console.log(response,' its res');
            if (response.data.status === true) {
                // localStorage.setItem('isPartner', response.data.isPartner);
                this.setState({ basicDetails: response.data.data, isPartner: response.data.isPartner });
            }
        }).catch((err) => {
            console.log(err);
            this.errorHandler.customErrorCheck(err);
        });
    }


    // get all Training Event for user
    getAlltrainingEvent() {
        this.partnerService.getTrainingEvent().then((res) => {
            // console.log(res, ' its res of all events');
            if (res.data.status === true) {
                this.setState({ trainingEvents: res.data.data });
            }

        }).catch((err) => {
            console.log(err);
            this.errorHandler.customErrorCheck(err)
        })
    }

    // ShortListed Candidates LineUp
    getAllRegisteredProfiles = (TrainingId, trainingCost) => {
        this.setState({ componentLoading: true })
        localStorage.setItem('TrainingId', TrainingId);
        var data = {
            trainingId: TrainingId
        }
        this.partnerService.getallRegisteredProfile(data).then((res) => {
            if (res.data.status === true) {
                // console.log(res,' its candidateList');
                this.setState({ componentLoading: false, profileData: res.data.data, showRegisteredList: true, trainingCost: trainingCost });
                // var applicantListData = res.data.data.shortlistedProfiles;
                // var applicantList = []
                // if (applicantListData.length !== 0) {
                //     applicantListData.map((el) => {
                //         applicantList.push(el.candidateEmail);
                //     })
                //     var jsonObj = {
                //         "list": applicantList
                //     }
                // }
                // else {
                //     this.setState({componentLoading:false});
                //     message.warn("No candidates shortlisted for the Job", 5);
                // }


            }
        }).catch((err) => {
            this.setState({ componentLoading: false });
            this.errorHandler.customErrorCheck(err);
        })
    }


    showAddTrainingModal = () => {
        // localStorage.setItem("editRecruiterId",0);
        this.checkSubscription();

        // var data = {
        //     trainingName: "",
        //     trainingDescription: "",
        //     trainingDate: "",
        //     trainingDuration: "",
        //     trainingMode: "",
        //     trainingModeOnlineUrl: "",
        //     trainingModeOfflineLocation: "",
        //     trainingType: "",
        //     trainingCost: "",
        //     recepientEmailAddress: "",
        //     forwardEmailAddress: ""
        // }
        // this.setState({ TrainingDetails: data });
        // this.setState({ updateRecruiter: false });
        // this.setState({ showAddModal: true });
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
                            this.setState({ isSubscribed: txStatus === 'SUCCESS' ? true : false });
                            var data = {
                                trainingName: "",
                                trainingDescription: "",
                                trainingDate: "",
                                trainingDuration: "",
                                trainingMode: "",
                                trainingModeOnlineUrl: "",
                                trainingModeOfflineLocation: "",
                                trainingType: "",
                                trainingCost: "",
                                recepientEmailAddress: "",
                                forwardEmailAddress: ""
                            }
                            // console.log(this.state.isSubscribed,' its sub');
                            this.setState({ TrainingDetails: data, updateProfile: false, updateRecruiter: false, showAddModal: true });
                        }
                        else {
                            confirm({
                                //   title: 'This is a warning message',
                                content: (
                                    <div>
                                        <p>Sorry your plans expired,Please subscribe any plans for Add Trainings </p>
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
                    else if (this.state.basicDetails && this.state.basicDetails.OrderAmount.length > 0 && this.state.basicDetails.OrderAmount[0] === "FREE") {
                        let data = {
                            trainingName: "",
                            trainingDescription: "",
                            trainingDate: "",
                            trainingDuration: "",
                            trainingMode: "",
                            trainingModeOnlineUrl: "",
                            trainingModeOfflineLocation: "",
                            trainingType: "",
                            trainingCost: "",
                            recepientEmailAddress: "",
                            forwardEmailAddress: ""
                        }
                        // console.log(this.state.isSubscribed,' its sub');
                        this.setState({ TrainingDetails: data, updateProfile: false, updateRecruiter: false, showAddModal: true });
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

    }

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



    closeAddTrainingModal() {
        //refresh Table data 
        this.fetchAllRecruiterData();
        this.setState({ showAddModal: false });
    }
    showViewRecruiterModal = () => {
        this.setState({ showViewModal: true });
    }
    closeViewRecruiterModal() {
        this.setState({ showViewModal: false });
    }
    closeRegisterModal = () => {
        this.setState({ showRegisteredList: false })
    }
    showInviteTraineeModal = (data, key) => {
        let date = moment(data.trainingDate).format('YYYY-MM-DD');
        let now = moment().format('YYYY-MM-DD');
        let isValidDate = date > now
        if (isValidDate) {
            // console.log(data, ' its clicked data');
            // console.log(isValidDate, ' its isValidDate');
            localStorage.setItem('ObjectId', key);
            localStorage.setItem('trainingId', data.trainingId);
            this.setState({ showInviteModal: true, eventData: data });
        }
        else {
            Modal.error({
                content: (
                    <div>
                        <p>Sorry training has been expired please invite participants from valid training</p>
                    </div>
                ),
                // onOk: () => {
                //     this.props.history.push({
                        
                //     })
                // }
            });
        }

    }
    closeInviteTraineeModal = () => {
        this.setState({ showInviteModal: false });
    }
    redirectToDashboard = () => {
        this.props.onChangeTable("");
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
    editTraining = (key) => {
        //  console.log(key);
        var data = {
            ObjectId: key
        }
        localStorage.setItem('ObjectId', key);
        this.partnerService.getClickedTraining(data).then((res) => {
            // console.log(res,' its res of Training Data');
            if (res.data.status === true) {
                this.setState({ TrainingDetails: res.data.data })
            }
        }).catch((err) => {
            // onFinishFailed(err.response.data.message)
            message.error("Failed to fetch Training Details.", 5)
        })
        this.setState({ updateRecruiter: true });
        this.setState({ showAddModal: true });
        // this.props.updateRecruiter(key);
    }
    fetchAllRecruiterData = () => {
        this.partnerService.getRecruiterbyCompanyName().then((response) => {
            this.setState({ allActiveRecruiters: response.data.data });
        }).catch((err) => {
            console.log(err);
            message.error("Failed to fetch recruiters data, please refresh page.")
        });
    }

    reload = () => {
        this.componentDidMount();
    }

    closeSubscriptionModal = () => {
        this.setState({ showSubscriptionModal: false })
    }

    render() {
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
            fontSize: '28px'
        }
        return (
            <div>
                {
                    this.state.componentLoading ? <Spin indicator={loadingIcon} className="loading" size="large"></Spin> : ''
                }
                <AddTraining
                    visible={this.state.showAddModal}
                    onClose={this.closeAddTrainingModal.bind(this)}
                    editTraining={this.state.TrainingDetails}
                    reloadList={this.reload.bind(this)}
                    isEdit={this.state.updateRecruiter}></AddTraining>
                <CandidateRegisteredModal trainingCost={this.state.trainingCost} showModal={this.state.showRegisteredList} onClose={this.closeRegisterModal.bind(this)} profileData={this.state.profileData} />
                <ViewRecruiter visible={this.state.showViewModal} onClose={this.closeViewRecruiterModal.bind(this)}></ViewRecruiter>
                <InviteTraineeModal eventData={this.state.eventData} visible={this.state.showInviteModal} onClose={this.closeInviteTraineeModal.bind(this)} />
                {
                    this.state.showSubscriptionModal ? (<TRAININGSubscription showData={this.state.showSubscriptionModal} closeModal={this.closeSubscriptionModal} />) : ''
                }
                <div className="justify-content-between" style={{
                    borderRadius: '6px 6px 0 0',
                    display: 'flex', padding: '10px', width: '100%',
                    background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                }}>
                    <h3 style={headingStyle} >Training Details</h3>
                    <Button onClick={this.showAddTrainingModal} >Add Training</Button>
                    {/* <Icon style={marginRight} type="plus-circle-o" /> */}
                </div>
                <Table columns={this.state.columns} dataSource={this.state.trainingEvents} />
            </div>
        )
    }
}

export default EnrolledEventsTable;