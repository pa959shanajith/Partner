import { Modal, Table, Switch, message, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import Moment from 'react-moment';
import partnerService from "../../../services/partnerService";

class AssignModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            status: "",
            assignedJobId: 0,
            recruiterEmailId: "",
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'recruiterName',
                    // ellipsis: true,
                    // width: 100,
                    // sorter: (a, b) => a.companyName.localeCompare(b.companyName),
                },
                {
                    title: 'EmailId',
                    dataIndex: 'emailId',
                    // ellipsis: true,
                    // width: 100,
                    // sorter: (a, b) => a.companyName.localeCompare(b.companyName),
                },
                {
                    title: 'Assigned date',
                    // dataIndex: 'eventDate',
                    render: (text, record) => (
                        <span>
                            {this.getAssignedDate(record.AssignedJobs)}
                        </span>
                    ),
                    // ellipsis: true,
                    // width: 125
                    // defaultSortOrder: 'descend',
                    // sorter: (a, b) => moment(a.eventDate) - moment(b.eventDate),
                },
                {
                    title: 'Actions',
                    key: 'action',
                    // width: 80,
                    render: (text, record) => {
                        // console.log(record,' its record');
                        // console.log(text, 'its text');

                        return (
                            <span>
                                {/* <ExportXlsx csvData={record.listofApplicants} fileName={this.state.fileName} /> */}
                                <span style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                    <Tooltip title="Assign / Unassign">
                                        <Switch checked={this.getAssignedStatus(record.AssignedJobs)} onChange={(e) => this.onChange(e, record)} />
                                    </Tooltip>
                                </span>
                            </span>
                        )
                    }
                }

            ]
        };
        this.partnerService = new partnerService();
    }

    getAssignedDate = (assigned_jobs) => {
        const { jobdetails } = this.props;
        if (assigned_jobs.length) {
            let assgn_date = assigned_jobs.find(element => element.jobId === jobdetails.jobId);
            // console.log(assgn_date, ' assgn_date');
            if (assgn_date && Object.keys(assgn_date).length) {
                return (
                    <Moment format="DD MMMM YYYY">
                        {assgn_date.assignedDate}
                    </Moment>
                )
            }
            else {
                return (<span>
                    N/A
                </span>)
            }

        }
        else {
            return (<span>
                N/A
            </span>)
        }
    }

    getAssignedStatus = (assigned_jobs) => {
        const { jobdetails } = this.props;
        if (assigned_jobs.length) {
            let assgn_status = assigned_jobs.find(element => element.jobId === jobdetails.jobId && element.status === "Active");
            // console.log(assgn_status, ' assgn_status');
            if (assgn_status && Object.keys(assgn_status).length) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    handleCancel = () => {
        this.props.onClose();
    };
    findJob = (AssignedJobs, jobId, isChecked) => {
        let returnVal = {};
        if (AssignedJobs && AssignedJobs.length) {
            returnVal = AssignedJobs.find(el => el.jobId === jobId);
            if (returnVal && Object.keys(returnVal).length) {
                returnVal.status = isChecked === true ? 'Active' : 'Inactive';
                returnVal.assignedDate = isChecked === true ? moment.utc() : returnVal.assignedDate;
            }
            else {
                returnVal = {};
            }
        }
        return returnVal;
    }

    onChange = (e, recruiter) => {
        const { jobdetails } = this.props;
        let updateJobObj = [];
        if (recruiter && recruiter.AssignedJobs.length) {
            updateJobObj = recruiter.AssignedJobs;
            let getJobObj = this.findJob(recruiter.AssignedJobs, jobdetails.jobId, e);
            if (getJobObj && Object.keys(getJobObj).length) {
                let index_pos = updateJobObj.map((el) => el.jobId).indexOf(jobdetails.jobId);
                updateJobObj[index_pos] = getJobObj;
            }
            else {
                updateJobObj.push({
                    jobId: jobdetails.jobId,
                    assignedDate: moment.utc(),
                    status: e === true ? 'Active' : 'Inactive'
                });
            }
        }
        else {
            updateJobObj.push({
                jobId: jobdetails.jobId,
                assignedDate: moment.utc(),
                status: e === true ? 'Active' : 'Inactive'
            })
        }
        this.setState({ status: e === true ? 'Active' : 'Inactive', assignedJobId: jobdetails.jobId, recruiterEmailId: recruiter.emailId  })
        let type_msg = e === true ? 'assigned' : 'unassigned'
        let data = {
            recruiterEmailId: recruiter.emailId,
            jobObj: updateJobObj
        }
        this.partnerService.jobAssigntoRecruiter(data).then((res) => {
            if (res.data.status === true) {
                this.props.reloadList();
                message.success(`Job (${jobdetails.jobId})  ${type_msg} to ${recruiter.emailId}`);
            }
        this.sendMailNotificationToRecruiter()
        }).catch((err) => {
            console.log(err);
            message.error("something went wrong");
        })
    }
    sendMailNotificationToRecruiter = () => {
        if(this.state.status === "Active"){
            let data={
                jobId: this.state.assignedJobId,
                recruiterEmailId: this.state.recruiterEmailId
            }
            this.partnerService.sendMailNotificationToRecruiter(data).then((res) => {
                if(res.data.status === true){
                    console.log("Notification mail sent to recruiter successfully")
                } 
        }).catch((err) => {
            console.log(err);
            console.log("Error in sending notification mail sent to recruiter");
        })
    }
    }
    render() {
        const { visible, jobdetails, activeRecruiters } = this.props;
        const pagination = {
            pageSize: 10
        }
        return (
            <Modal
                visible={visible}
                maskClosable={true}
                onCancel={this.handleCancel}
                footer={null}
                width='50%'
            >
                <div className="d-flex flex-column">
                    <div className="p-2 h4">Assign recruiter for {jobdetails.jobTitle} (<b>{jobdetails.jobId}</b>)</div>
                    <div className="p-2 table">
                        <Table
                            columns={this.state.columns}
                            dataSource={activeRecruiters}
                            pagination={pagination}
                        />
                    </div>

                </div>
            </Modal>
        );
    }
}
export default AssignModal;