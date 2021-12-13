import { Button, Checkbox, Icon, message, Modal, notification, Popconfirm, Progress, Table, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import { FaCreditCard } from 'react-icons/fa';
// import ViewRecruiter from './ViewRecruiter';
import partnerService from "../../../services/partnerService";
import HIRINGSubscription from '../../subscriptionModal/HIRINGSubscripePlans';
import AddRecruiter from './AddRecruiter';
import FilterComponent from '../../dashboard/components/filterComponent';

const { confirm } = Modal;

const SubscriptionNotification = (msg, title) => {
    notification.open({
        message: title,
        description: msg,
        duration: 8,
        icon: <FaCreditCard />,
    });
}
class RecruitersTable extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        // var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        var partnerAdmin = JSON.parse(localStorage.getItem('isPartner'));
        var partnerType = localStorage.getItem('partnerType'),
            customerPhone = localStorage.getItem('contactNo');
        this.state = {
            confirmDirty: false,
            loading: false,
            showAddModal: false,
            showViewModal: false,
            emailId: email,
            partnerType: partnerType,
            customerPhone: customerPhone,
            // authtoken: auth,
            companyName: companyName,
            partnerAdmin: partnerAdmin,
            recruiterDetails: {},
            updateRecruiter: false,
            allActiveRecruiters: [],
            isCalledSubscription: false,
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
            showSubscriptionModal: false,
            recruitersCount: null,
            filteredData: [],
            visible: false,
            btnValue: false,
            noData: true,
            selectRow: [{ "Recruiter Name": "recruiterName","type":"string" }, { "Location": "location","type":"string"  }, { "Email Id": "emailId","type":"string"  }],
            columns: [
                {
                    title: 'Recruiter Name',
                    dataIndex: 'recruiterName',
                    sorter: (a, b) =>a.recruiterName.localeCompare(b.recruiterName),
                    sortDirections: ['descend', 'ascend'],
                    render: (text, record) => <p id={"Partner_Recruiters_"+record._id} className="hyperlink" onClick={() => this.showViewRecruiterModal(record.emailId)} >{text}</p>,
                    ellipsis: true,
                    // fixed: 'left',
                    width: 180
                },
                {
                    title: 'Location',
                    dataIndex: 'location',
                    // ellipsis: true,
                    width: 175
                },
                {
                    title: 'Email Id',
                    dataIndex: 'emailId',
                    ellipsis: true,
                    width: 200,
                    sorter: (a, b) => a.emailId.localeCompare(b.emailId),
                },
                {
                    title: 'Contact Number',
                    dataIndex: 'contactNo',
                    // ellipsis: true
                    width: 200
                },
                // {
                //     title: 'Status',
                //     dataIndex: 'accountStatus',
                //     width: 100,
                //     render: (text, record) => (
                //         <span>
                //             {record.accountStatus ? (<Tag color='green'>Active</Tag>) : ((<Tag color='geekblue'>Inactive</Tag>))}
                //         </span>
                //     ),
                // },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Edit">
                                    <Icon type="form" onClick={() => this.editRecruiter(record.emailId)} />
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Deactivate">
                                    <Popconfirm
                                        title="Are you sure delete this task?"
                                        onConfirm={() => this.confirmDelete.bind(this)(record)}
                                        onCancel={this.cancelDelete.bind(this)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Icon type="delete" />
                                    </Popconfirm>
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
        // this.handleSubmit = this.handleSubmit.bind(this);
    }
    // componentWillMount(){
    //     console.log("Will Mount")
    // }
    componentDidMount() {
        this.fetchAllRecruiterData();
    }



    showAddRecruiterModal = () => {
        this.checkSubscription();
    }

    // check for active Subscription
    checkSubscription = () => {
        if (this.state.partnerAdmin) {
            this.partnerService.getSubscription().then((res) => {
                if (res.data.status === true) {
                    this.setState({ subscriptionInfo: res.data.data });
                    if (res.data.data && res.data.data.length > 0 && res.data.data[0].txStatus !== '') {
                        var txStatus = res.data.data[0].txStatus;
                        var expiryDate = res.data.data[0].subscriptionExpiryDate;
                        if (txStatus === 'SUCCESS' && moment(expiryDate) > moment.utc()) {
                            this.setState({ isSubscribed: txStatus === 'SUCCESS' ? true : false });
                            if (this.state.recruitersCount && this.state.recruitersCount > this.state.allActiveRecruiters.length) {
                                var data = {
                                    emailId: "",
                                    password: "",
                                    recruitername: "",
                                    companyName: this.state.companyName,
                                    address: "",
                                    linkedinId: "",
                                    contactNo: "",
                                    location: "",
                                    logo: ""
                                }
                                // console.log(this.state.isSubscribed,' its sub');
                                this.setState({ recruiterDetails: data, updateRecruiter: false, showAddModal: true });
                            }
                            else {
                                notification.open({
                                    message: 'Sorry you have reached maximum users. Please upgrade your plan or contact partners@shenzyn.com',
                                    // description: msg,
                                    duration: 12,
                                    icon: <FaCreditCard />,
                                });
                                // message.error('Sorry you have reached maximum users. Please upgrade your plan or contact partners@shenzyn.com');
                            }

                            // else {
                            //     confirm({
                            //         //   title: 'This is a warning message',
                            //         content: (
                            //             <div>
                            //                 <p>Sorry you have reached maximum users. <br />
                            //                     Please subscribe any plans for Add Recruiters</p>
                            //             </div>
                            //         ),
                            //         onOk: () => {
                            //             this.setState({ showSubscriptionModal: true });
                            //         },
                            //         onCancel: () => {
                            //             message.error('Please upgrade your plan or contact partners@shenzyn.com');
                            //             // this.subscriptionStatusNotification();
                            //         }

                            //     });
                            // }

                        }
                        else {
                            confirm({
                                //   title: 'This is a warning message',
                                content: (
                                    <div>
                                        <p>Sorry your plans expired,Please subscribe any plans for Add Recruiters </p>
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
                                    <p>Please subscribe any plans for Add Recruiters</p>
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
    }

    // componentWillReceiveProps(props) {
    //     console.log(' its props',props);
    //     if(props.recruitersCount){
    //     console.log("INSIDE componentWillReceiveProps: ",this.props.recruitersCount)
    //     this.setState({ recruitersCount: props.recruitersCount });
    //     }
    //     // if (props.recruitersCount !== this.props.recruitersCount) {
    //     //    console.log(props,' its props');
    //     // }
    // }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log(nextProps, ' its nextProps.someValue');
        if (nextProps.recruitersCount) {
            // console.log(nextProps.recruitersCount, ' its inside ');
            return { recruitersCount: nextProps.recruitersCount };
        }
        else return null;
    }

    // close Hiring partner Subscription
    closeHiringSubscription = () => {
        this.setState({ showHiringSubscription: false, hiringStatusTxt: '' });
        this.componentDidMount();
    }
    closeAddRecruiterModal() {
        //refresh Table data 
        this.fetchAllRecruiterData();
        this.setState({ showAddModal: false });
    }
    showViewRecruiterModal = (emailId) => {
        console.log(emailId)
        this.props.showRecruiterDetails(emailId);
    }
    redirectToDashboard = () => {
        this.props.onChangeTable("events");
    }
    confirmDelete = (key) => {
        // console.log(key);
        //call inactivate 
        let data ={
            emailId:key.emailId,
            name:key.recruiterName
        }
        this.partnerService.deactivaterecruiter(data).then((d) => {
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
    editRecruiter = (key) => {
        //  console.log(key);
        this.partnerService.getrecruiterdetailsbyid(key).then((d) => {
            // console.log(d.data.data);
            var data = {
                emailId: key,
                password: d.data.data.password,
                recruitername: d.data.data.recruiterName,
                companyName: this.state.companyName,
                address: d.data.data.address,
                linkedinId: d.data.data.linkedinId,
                countryCode: d.data.data.countryCode,
                contactNo: d.data.data.contactNo,
                location: d.data.data.location,
                logo: d.data.data.logo
            };
            this.setState({ recruiterDetails: data });
        }).catch((err) => {
            // onFinishFailed(err.response.data.message)
            message.error("Failed to fetch recruiter data.", 5)
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

    closeSubscriptionModal = () => {
        this.setState({ showSubscriptionModal: false })
    }

    openModal = () => {
        this.setState({ visible: true})
    }
    
    closeModal() {
        this.setState({ visible: false });
    }

    sendDataToParent = (data, value) => {
        // console.log("from",data,"value",value);
        this.setState({ filteredData: data, noData: value})
    }

    changeButton = (btnName) => {
        // console.log("btnName",btnName);
        this.setState({ btnValue: btnName })
    }

    cancleFilter = () => {
        this.setState({ filteredData: [], btnValue: false, noData: true})
    }

    render() {
        const headingStyle = {
            marginRight: '15px',
            fontWeight: '600',
            color: '#fff',
            fontSize: '28px',
            display: 'inline'
        }
        return (
            <div>
                 <FilterComponent visible={this.state.visible} 
                userData={this.state.allActiveRecruiters} closeModal={this.closeModal.bind(this)} 
                sendDataToParent={this.sendDataToParent.bind(this)} 
                showSelectedRow={this.state.selectRow} 
                changeButton={this.changeButton.bind(this)} />

                <AddRecruiter
                    visible={this.state.showAddModal}
                    onClose={this.closeAddRecruiterModal.bind(this)}
                    editRecruiter={this.state.recruiterDetails}
                    isEdit={this.state.updateRecruiter}></AddRecruiter>
                {
                    this.state.showSubscriptionModal ? (<HIRINGSubscription showData={this.state.showSubscriptionModal} closeModal={this.closeSubscriptionModal} />) : ''
                }

                {/* <ViewRecruiter visible={this.state.showViewModal} onClose={this.closeViewRecruiterModal.bind(this)}></ViewRecruiter> */}
                <div className="justify-content-between" style={{
                    borderRadius: '6px 6px 0 0',
                    display: 'flex', padding: '10px', width: '100%',
                    background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                }}>
                    <span>
                        {/* <Icon style={marginRight} type="left" onClick={this.redirectToDashboard.bind(this)} /> */}
                        <h3 style={headingStyle} >Recruiters</h3>
                    </span>
                    <div style={{ position:"absolute",top:"10px",right:"150px" }}>
                    <Button onClick={this.state.btnValue?this.cancleFilter:this.openModal}>{this.state.btnValue ? "Clear Filter":"Filter"}</Button>
                     {/* {<Button onClick={this.cancleFilter}>Clear Filter</Button> : ""} */}
                    </div>
                    <Button id="partner_Recruiter_AddRecruiter" onClick={this.showAddRecruiterModal} >Add Recruiter</Button>

                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.noData ? this.state.filteredData.length ? this.state.filteredData : this.state.allActiveRecruiters : []}
                    scroll={{ x:800}}
                />
            </div>
        )
    }
}

export default RecruitersTable;