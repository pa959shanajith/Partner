import React from 'react';
import { Table, Icon, Progress, Checkbox, Tooltip, Popconfirm, message, Tag } from 'antd';
import AddTraining from './AddTraining';
import ViewRecruiter from './ViewRecruiter';
import partnerService from "../../../services/partnerService";
import InviteTraineeModal from './InviteTraineeModal';

class TrainingsTable extends React.Component {
    constructor(props) {
        super(props);
        var email = localStorage.getItem('email');
        var auth = localStorage.getItem('authToken');
        var companyName = localStorage.getItem('companyName');
        this.state = {
            showInviteTraineeModal: false,
            confirmDirty: false,
            loading: false,
            showAddModal: false,
            showViewModal: false,
            emailId: email,
            authtoken: auth,
            companyName: companyName,
            recruiterDetails: {},
            updateRecruiter: false,
            allActiveRecruiters: [],
            columns: [
                {
                    title: 'Recruiter Name',
                    dataIndex: 'recruiterName',
                    // sorter: (a, b) => a.name.length - b.name.length,
                    // sortDirections: ['descend', 'ascend'],
                    render: text => <a onClick={this.showViewRecruiterModal.bind(this)} >{text}</a>,
                    ellipsis: true,
                    fixed: 'left',
                    width: 125
                },
                {
                    title: 'Location',
                    dataIndex: 'location',
                    // ellipsis: true,
                    width: 125
                },
                {
                    title: 'Email Id',
                    dataIndex: 'emailId',
                    // ellipsis: true,
                    width: 160
                },
                {
                    title: 'Contact Number',
                    dataIndex: 'contactNo',
                    width: 120
                },
                {
                    title: 'Status',
                    dataIndex: 'accountStatus',
                    render: (text, record) => (
                        <span>
                            {record.accountStatus ? (<Tag color='green'>Active</Tag>) : ((<Tag color='geekblue'>Inactive</Tag>))}
                        </span>
                    ),
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Invite Participants">
                                    <Icon type="user-add" onClick={() => this.showCandidatesJobEnrolledModal()} />
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Deactivate">
                                    <Popconfirm
                                        title="Are you sure delete this task?"
                                        onConfirm={() => this.confirmDelete.bind(this)(record.emailId)}
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
    showAddTrainingModal = () => {
        var data = {
            emailId: "", password: "", recruitername: "",
            companyName: this.state.companyName, address: "",
            linkedinId: "", contactNo: "", location: "", logo: ""
        }
        this.setState({ recruiterDetails: data });
        this.setState({ updateRecruiter: false });
        this.setState({ showAddModal: true });
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
    showInviteTraineeModal = () => {
        this.setState({ InviteTraineeModal: true });
    }
    closeInviteTraineeModal = () => {
        this.setState({ InviteTraineeModal: false });
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
    editRecruiter = (key) => {
        //  console.log(key);
        this.partnerService.getrecruiterdetailsbyid(key).then((d) => {
            var data = {
                emailId: key, password: d.data.data.password, recruitername: d.data.data.recruiterName,
                companyName: this.state.companyName, address: d.data.data.address,
                linkedinId: d.data.data.linkedinId, contactNo: d.data.data.contactNo, location: d.data.data.location, logo: d.data.data.logo
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

    render() {
        const marginRight = {
            marginRight: '15px',
            paddingTop: '6px',
            color: '#fff',
            fontSize: '20px'
        }
        const headingStyle = {
            marginRight: '15px',
            fontWeight: '600',
            color: '#fff',
            fontSize: '28px'
        }
        return (
            <div>
                <AddTraining
                    visible={this.state.showAddModal}
                    onClose={this.closeAddTrainingModal.bind(this)}
                    editRecruiter={this.state.recruiterDetails}
                    isEdit={this.state.updateRecruiter}></AddTraining>

                <ViewRecruiter visible={this.state.showViewModal} onClose={this.closeViewRecruiterModal.bind(this)} />
                <InviteTraineeModal visible={this.state.showInviteTraineeModal} onClose={this.closeInviteTraineeModal.bind(this)} />

                <div style={{
                    borderRadius: '6px 6px 0 0',
                    display: 'flex', padding: '10px', width: '100%',
                    background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                }}>
                    <Icon style={marginRight} type="left" onClick={this.redirectToDashboard} />
                    <h3 style={headingStyle} >Recruiters</h3>
                    <Icon style={marginRight} type="plus-circle-o" onClick={this.showAddTrainingModal} />
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.allActiveRecruiters}
                    scroll={{ x: 1000 }}
                />
            </div>
        )
    }
}

export default TrainingsTable;