import React from 'react';
import { withRouter } from 'react-router-dom'
import { Table, Icon, Tooltip, message, Button } from 'antd';
// import CandidatesEventEnrolledModal from './CandidatesEventEnrolledModal';
import Moment from 'react-moment';
import moment from 'moment';
// import ExportXlsx from '../export-excel/excel-service';
import ExcelUtils from "../export-excel/ExcelUtils";
import FilterComponent from './filterComponent';
import AssignModal from "./AssigneventModal";
import partnerService from "../../../services/partnerService";
import { FaTasks } from "react-icons/fa";

class EventEnrolled extends React.Component {
    constructor(props) {
        var isPartner = JSON.parse(localStorage.getItem("isPartner"));
        super(props);
        this.state = {
            confirmDirty: false,
            loading: false,
            fileName: 'Candidates',
            showCandidateModal: false,
            arrData: [],
            selectedEventProfiles: [],
            filteredData: [],
            visible: false,
            btnValue: false,
            noData: true,
            isPartner: isPartner,
            selectRow: [{ "Event Title": "eventName", "type": "string" }, { "EventId": "eventId", "type": "number" }, { "Date": "eventDate", "type": "date" }, { "Company": "companyName", "type": "string" }, { "Location": "eventLocation", "type": "string" }, { "Positions": "openPositions", "type": "number" }],
            columns: [
                {
                    title: 'Event Title',
                    dataIndex: 'eventName',
                    // sorter: (a, b) => a.eventTitle.length - b.eventTitle.length,
                    // sortDirections: ['descend', 'ascend'],
                    key: 'eventName',
                    render: (text, record) => (
                        <p id={"Partner_Events_EnrolledEvents_" + record.eventId} className="hyperlink" onClick={() => this.getClickedEventData(record)}>{text}</p>
                    ),
                    ellipsis: true,
                    // width: 120,
                    // fixed: 'left',
                    sorter: (a, b) => a.eventName.localeCompare(b.eventName),
                },
                {
                    title: 'EventId',
                    dataIndex: 'eventId',
                    // sorter: (a, b) => a.eventTitle.length - b.eventTitle.length,
                    // sortDirections: ['descend', 'ascend'],
                    key: 'eventId',
                    render: (text, record) => (
                        <p id={"Partner_Events_EnrolledEvents_" + record.eventId}>{text}</p>
                    ),
                    ellipsis: true,
                    // width: 120,
                    // fixed: 'left',
                    sorter: (a, b) => a.eventId - b.eventId,
                },
                {
                    title: 'Date',
                    dataIndex: 'eventDate',
                    render: (text, record) => (
                        <span>
                            <Moment format="DD MMMM YYYY">
                                {text}
                            </Moment>
                        </span>
                    ),
                    // ellipsis: true,
                    // width: 125
                    // defaultSortOrder: 'descend',
                    sorter: (a, b) => moment(a.eventDate) - moment(b.eventDate),
                },
                {
                    title: 'Company',
                    dataIndex: 'companyName',
                    render: text => <span>{text}</span>,
                    // ellipsis: true,
                    // width: 115
                    // sortDirections: ['descend', 'ascend'],
                    sorter: (a, b) => a.companyName.localeCompare(b.companyName),
                },
                {
                    title: 'Location',
                    dataIndex: 'eventLocation',
                    render: text => <span>{text}</span>,
                    ellipsis: true,
                    // width: 80
                },
                {
                    title: 'Positions',
                    dataIndex: 'openPositions',
                    render: text => <span>{text}</span>,
                    // width: 80,
                    sorter: (a, b) => a.openPositions - b.openPositions,
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
                                {/* style={{ fontSize: '18px', fontWeight: '600', textAlign: 'center' }} */}
                                <span className="mr-2">
                                    <Tooltip title="Download Candidates List"><Icon id={"Partner_Events_DownloadCandidates_" + record.eventId} onClick={(e) => this.downloadExcel(record.listofApplicants, record.eventId)} type="download" /></Tooltip>
                                </span>
                                <span>
                                    {isPartner ?
                                        <Tooltip title="assign"><FaTasks style={{ cursor: "pointer" }} onClick={(e) => this.openAssignModal.bind(this)(e, record)} /> </Tooltip>
                                        :
                                        <div></div>
                                    }

                                </span>
                            </span>
                        )
                    }
                },
            ],
            exportColumns: [
                { header: 'Applicant Name', key: 'applicantName', width: 30, style: { font: { bold: true } } },
                { header: 'Applicant Email Id', key: 'applicantEmailId', width: 40, style: { font: { bold: true } } },
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
        this.downloadExcel = this.downloadExcel.bind(this);
        this.getClickedEventData = this.getClickedEventData.bind(this);
        this.partnerService = new partnerService();
    }

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     // console.log(nextProps, ' its nextProps.someValue');
    //     if (nextProps.arrData.length > 0) {
    //         // console.log(nextProps.arrData, ' its inside ');

    //         return { arrData: nextProps.arrData };
    //     }
    //     else return null;
    // }

    rowDataFunction = (rows) => {
        let rowData = [];
        this.state.exportColumns.forEach((o, key) => {
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
    componentDidMount() {
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

    reload = () => {
        this.fetchAllRecruiterData();
    }

    downloadExcel = (listofApplicants, eventId) => {
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
            fileName: 'LineUps_' + eventId,
            columns: this.state.exportColumns,
            data: exportData
        }
        this.ExcelUtils.exportToExcel(props);
    };
    showCandidatesEventEnrolledModal = () => {
        this.setState({ showCandidateModal: true });
    }
    closeCandidatesEventEnrolledModal = () => {
        this.setState({ showCandidateModal: false });
    }
    cancelDelete = (e) => {
        // console.log(e);
        message.error('Click on No');
    }
    editJob = (key) => {
        // console.log(key);
        this.props.editJobCB(key);
    }
    confirmDelete = (key) => {
        // console.log(key);
        this.props.deleteJobCB(key);
        message.success('Click on Yes');
    }
    onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    }

    // Get Table Event Click Data
    getClickedEventData = (data) => {
        // console.log(data, ' its data');
        if (data) {
            this.setState({
                showCandidateModal: !this.state.showCandidateModal,
                selectedEventProfiles: data.listofApplicants
            });
            this.props.clickEvent(data);
            // console.log(this.props, ' its props');

        }
    }
    // onClickRow = (record) => {
    //     return {
    //         onClick: () => {
    //             this.getClickedEventData(record);
    //         },
    //     };
    // }

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
        const arrData = this.props.arrData;
        return (
            <div>
                <FilterComponent visible={this.state.visible}
                    userData={arrData} closeModal={this.closeModal.bind(this)}
                    sendDataToParent={this.sendDataToParent.bind(this)}
                    showSelectedRow={this.state.selectRow}
                    changeButton={this.changeButton.bind(this)} />
                {/* <CandidatesEventEnrolledModal clickedEvent={this.state.selectedEventProfiles} visible={this.state.showCandidateModal} onClose={this.closeCandidatesEventEnrolledModal.bind(this)}></CandidatesEventEnrolledModal> */}
                <AssignModal visible={this.state.showAssignModal}
                    activeRecruiters={this.state.allActiveRecruiters}
                    jobdetails={this.state.onClickRecord}
                    reloadList={this.reload.bind(this)}
                    onClose={this.closeAssignModal.bind(this)} />
                <div style={{
                    borderRadius: '6px 6px 0 0',
                    display: 'flex', padding: '10px', width: '100%',

                    background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                    // background: '#EF5869'
                }}>
                    <h3 style={{ marginRight: '15px', fontWeight: '600', color: '#fff', fontSize: '28px' }}>Enrolled Events</h3>
                    <div style={{ position: "absolute", top: "10px", right: "25px" }}>
                        <Button onClick={this.state.btnValue ? this.cancleFilter : this.openModal}>{this.state.btnValue ? "Clear Filter" : "Filter"}</Button>
                        {/* {<Button onClick={this.cancleFilter}>Clear Filter</Button> : ""} */}
                    </div>
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.noData ? this.state.filteredData.length ? this.state.filteredData : arrData : []}
                // scroll={{ x: 1000 }}
                // onRow={this.onClickRow}
                />
            </div>
        )
    }
}


export default withRouter(EventEnrolled);