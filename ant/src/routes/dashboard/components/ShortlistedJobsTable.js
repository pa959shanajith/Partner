import { Icon, message, Popconfirm, Table, Tooltip, Button } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import partnerService from "../../../services/partnerService";
import ViewAllJobsModal from './ViewAllJobsModal';
import ExcelUtils from "../export-excel/ExcelUtils";
import FilterComponent from './filterComponent';
import AssignModal from './AssignJobModal';
import { FaTasks } from "react-icons/fa";

class ShortlistedJobsTable extends React.Component {
    constructor(props) {
        super(props);
        var companyName = localStorage.getItem('companyName');
        var isPartner = JSON.parse(localStorage.getItem("isPartner"));
        this.state = {
            companyName: companyName,
            showViewAllJobsModal: false,
            shortlistedJobs: [],
            filteredData: [],
            visible: false,
            btnValue: false,
            noData: true,
            isPartner: isPartner,
            selectRow: [{ "Title": "jobTitle", "type": "string" }, { "JobId": "jobId", "type": "number" }, { "Location": "jobLocation", "type": "arrayString" }, { "Company Name": "companyName", "type": "string" }],
            columns: [
                {
                    title: 'Title',
                    dataIndex: 'jobTitle',
                    render: (text, record) => (
                        <p id={"Partner_jobs_shortlistedJobs_" + record.jobId} className="hyperlink" onClick={() => this.showJobDetails(record)}>{text}</p>
                    ),
                    // ellipsis: true,
                    width: 100,
                    sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
                },
                {
                    title: 'JobId',
                    dataIndex: 'jobId',
                    render: (text, record) => (
                        <p id={"Partner_jobs_shortlistedJobs_" + record.jobId}>{text}</p>
                    ),
                    // ellipsis: true,
                    width: 100,
                    sorter: (a, b) => a.jobId - b.jobId,
                },
                {
                    title: 'Company Name',
                    dataIndex: 'companyName',
                    // ellipsis: true,
                    width: 100,
                    sorter: (a, b) => a.companyName.localeCompare(b.companyName),
                },
                {
                    title: 'Description',
                    dataIndex: 'jobDescription',
                    width: 100,
                    ellipsis: true,
                    render: text => (
                        <Tooltip placement="topLeft" title={<span dangerouslySetInnerHTML={{ __html: text }}></span>}>
                            <div className="jobdesc_table" dangerouslySetInnerHTML={{ __html: text }}></div>
                        </Tooltip>
                    ),
                },
                {
                    title: 'Location',
                    dataIndex: 'jobLocation',
                    ellipsis: true,
                    width: 125
                },
                {
                    title: 'Action',
                    key: 'action',
                    width: 75,
                    render: (text, record) => (
                        <span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Unlist">
                                    <Popconfirm
                                        title="Are you sure you want to unlist the job?"
                                        onConfirm={() => this.confirmDelete.bind(this)(record)}
                                        onCancel={this.cancelDelete.bind(this)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Icon type="delete" />
                                    </Popconfirm>
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Download Candidates List"><Icon id={"Partner_Jobs_DownloadCandidatesList_" + record.jobId} onClick={(e) => this.downloadExcel(record.profilesByPartner, record.jobId)} type="download" /></Tooltip>
                            </span>
                            <span>
                                {isPartner ?
                                    <Tooltip title="assign"><FaTasks style={{ cursor: "pointer" }} onClick={(e) => this.openAssignModal.bind(this)(e, record)} /> </Tooltip>
                                    :
                                    <div></div>
                                }

                            </span>
                            {/* <Tooltip title="Add your quires"></Tooltip> */}
                        </span>
                    ),
                },
            ],
            exportColumns: [
                { header: 'Applicant Name', key: 'applicantName', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Email Id', key: 'applicantEmailId', width: 40, style: { font: { bold: true } } },
                { header: 'Applicant Contact No', key: 'applicantPhone', width: 40, style: { font: { bold: true } } },
                { header: 'Applicant Experience', key: 'applicantExperience', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Notice Period', key: 'applicantNoticePeriod', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Expected CTC', key: 'applicantExpectedCTC', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Submitted By', key: 'profileSubmittedBy', width: 40, style: { font: { bold: true } } },
                { header: 'Applicant Status', key: 'status', width: 30, style: { font: { bold: true } } },
            ],
            showAssignModal: false,
            onClickRecord: {},
            allActiveRecruiters: []
        }
        this.ExcelUtils = new ExcelUtils();
        this.partnerService = new partnerService();
    }

    rowDataFunction = (rows) => {
        let rowData = [];
        this.state.exportColumns.forEach(function (o, key) {
            if (o.key === 'status') {
                rowData.push(rows[o.key][0]);
            } else {
                rowData.push(rows[o.key]);
            }
        });
        return rowData;
    }

    openAssignModal = (e, data) => {
        e.preventDefault();
        this.setState({ showAssignModal: !this.state.showAssignModal, onClickRecord: data });
    }
    closeAssignModal = () => {
        this.setState({ showAssignModal: !this.state.showAssignModal });
    }
    reload = () => {
        this.fetchAllRecruiterData();
    }
    downloadExcel = (listofApplicants, jobId) => {
        let rows = listofApplicants;
        let exportData = [];
        for (var i = 0; i < rows.length; i++) {
            if (localStorage.getItem('isPartner') === "false") {
                if ((rows[i].CompanySubmittedBy === localStorage.getItem('companyName')) && rows[i].profileSubmittedBy === localStorage.getItem('email')) {
                    let rowData = this.rowDataFunction(rows[i]);
                    exportData.push(rowData);
                    // console.log(exportData);
                }

            }
            else if (localStorage.getItem('isPartner') === "true") {
                if ((rows[i].CompanySubmittedBy === localStorage.getItem('companyName'))) {
                    let rowData = this.rowDataFunction(rows[i]);
                    exportData.push(rowData);
                    // console.log(exportData);
                }
            }
            else {
                exportData = []
            }
        }
        var props = {
            fileName: 'LineUps_' + jobId,
            columns: this.state.exportColumns,
            data: exportData
        }
        this.ExcelUtils.exportToExcel(props);
    };


    componentDidMount() {
        if (this.state.isPartner) {
            this.getShortlistedJobs();
        }
        else {
            this.getAssignedJobs();
        }
        this.fetchAllRecruiterData();
    }

    fetchAllRecruiterData = () => {
        this.partnerService.getRecruiterbyCompanyName().then((response) => {
            this.setState({ allActiveRecruiters: response.data.data });
        }).catch((err) => {
            console.log(err);
            message.error("Failed to fetch recruiters data, please refresh page.")
        });
    }

    redirectToDashboard = () => {
        this.props.onChangeTable("events");
    }
    confirmDelete = (record) => {
        var data = { jobId: record.jobId, id: record._id };
        this.partnerService.unlistJob(data).then((d) => {
            this.getShortlistedJobs();
            message.success("Job unlisted successfully", 5);
        }).catch((err) => {
            message.error("Failed to unlist the Job", 5)
        })
    }
    cancelDelete = (e) => {

    }
    showJobDetails(data) {
        this.props.showDetails(data);
    }
    getShortlistedJobs = () => {
        var data = {
            partnerEmail: this.props.isPartnerAdmin ? localStorage.getItem('email') : localStorage.getItem('partnerEmail')
        }
        this.partnerService.getShortlistedJobs(data).then((response) => {
            this.setState({ shortlistedJobs: response.data.data });
        }).catch((err) => {
            console.log(err);
            message.error("Failed to fetch shortlisted jobs.")
        });
    }
    getAssignedJobs = () => {
        this.partnerService.getAllAssignedJobs().then((response) => {
            this.setState({ shortlistedJobs: response.data.data });
        }).catch((err) => {
            console.log(err);
            message.error("Failed to fetch assigned jobs.")
        });
    }
    showAllJobsModal = () => {
        this.setState({ showViewAllJobsModal: true });
    }
    closeAllJobsModal = () => {
        this.setState({ showViewAllJobsModal: false });
    }

    openModal = () => {
        this.setState({ visible: true })
    }


    closeModal() {
        this.setState({ visible: false });
    }

    sendDataToParent = (data, value, bol) => {
        // console.log("from",data,"value",value);
        this.setState({ filteredData: data, noData: value, click: bol })
    }

    changeButton = (btnName) => {
        // console.log("btnName",btnName);
        this.setState({ btnValue: btnName })
    }

    cancleFilter = () => {
        this.setState({ filteredData: [], btnValue: false, noData: true })
    }


    render() {
        const headingStyle = {
            marginRight: '15px',
            fontWeight: '600',
            color: '#fff',
            fontSize: '28px',
            display: 'inline'
        }
        const { showViewAllJobsModal } = this.state;
        return (
            <div>
                <ViewAllJobsModal
                    visible={showViewAllJobsModal}
                    onClose={this.closeAllJobsModal.bind(this)} />

                <FilterComponent visible={this.state.visible}
                    userData={this.state.shortlistedJobs} closeModal={this.closeModal.bind(this)}
                    sendDataToParent={this.sendDataToParent.bind(this)}
                    showSelectedRow={this.state.selectRow}
                    changeButton={this.changeButton.bind(this)} />
                <AssignModal visible={this.state.showAssignModal}
                    activeRecruiters={this.state.allActiveRecruiters}
                    jobdetails={this.state.onClickRecord}
                    reloadList={this.reload.bind(this)}
                    onClose={this.closeAssignModal.bind(this)} />

                <div className="justify-content-between" style={{
                    borderRadius: '6px 6px 0 0',
                    display: 'flex', padding: '10px', width: '100%',
                    background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                }}>
                    <span>
                        {/* <Icon style={marginRight} type="left" onClick={this.redirectToDashboard} /> */}
                        <h3 style={headingStyle} >Shortlisted Jobs</h3>
                        <div style={{ position: "absolute", top: "10px", right: "25px" }}>
                            <Button onClick={this.state.btnValue ? this.cancleFilter : this.openModal}>{this.state.btnValue ? "Clear Filter" : "Filter"}</Button>
                            {/* {<Button onClick={this.cancleFilter}>Clear Filter</Button> : ""} */}
                        </div>
                    </span>
                    {/* {this.props.isPartnerAdmin ? <Button onClick={() => this.showAllJobsModal()}>All jobs </Button> : ""} */}
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.noData ? this.state.filteredData.length ? this.state.filteredData : this.state.shortlistedJobs : []}
                // scroll={{ x: 1100 }}
                />
            </div>
        )
    }
}

export default withRouter(ShortlistedJobsTable);