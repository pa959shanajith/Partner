// import moment from 'moment';
import { Radio, Table, Tooltip, Button } from 'antd';
import moment from 'moment';
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import ExcelUtils from "../../../../services/excelUtils";
import partnerService from "../../../../services/partnerService";
import FilterComponent from '../../../dashboard/components/filterComponent';

class ProfileSubmissionsTable extends React.Component {
    constructor(props) {
        super(props);
        this.ExcelUtils = new ExcelUtils();
        this.state = {
            profileSubmissionsCount: 0,
            profileSubmissions: [],
            duplicateprofileSubmissions: [],
            value: 'Any',
            filteredData: [],
            visible: false,
            btnValue: false,
            noData: true,
            selectRow: [{ "Name": "Name", "type": "string" }, { "Job Id": "jobId", "type": "number" }, { "Email ID": "EmailId", "type": "string" }, { "Event Id": "eventId", "type": "number" }, { "Submitted On": "submittedOn", "type": "date" }, { "Submitted By": "submittedBy", "type": "string" }],
            columns: [
                {
                    title: <Tooltip title='Name' >Name</Tooltip>,
                    render: (text, record) => (
                        record.Name
                    ),
                    sorter: (a, b) => a.Name.localeCompare(b.Name),
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: <Tooltip title='Job Id' ><div >Job Id</div></Tooltip>,
                    render: (text, record) => (
                        record.jobId ? record.jobId : ""
                    )
                    // dataIndex: 'partnerProfileTracking.jobId',
                    // ellipsis: true
                },
                {
                    title: <Tooltip title='Event Id' ><div >Event Id</div></Tooltip>,
                    render: (text, record) => (
                        record.eventId ? record.eventId : ""
                    )
                    // dataIndex: 'partnerProfileTracking.eventId',
                    // ellipsis: true
                },
                {
                    title: <Tooltip title='Email ID' ><div >Email ID</div></Tooltip>,
                    render: (text, record) => (
                        record.EmailId
                    ),
                    // dataIndex: 'emailId',
                    // ellipsis: true,
                    sorter: (a, b) => a.EmailId.localeCompare(b.EmailId),
                    sortDirections: ['descend', 'ascend'],
                },
                // {
                //     title: <Tooltip title='Verified'><div >Verified</div></Tooltip>,
                //     dataIndex: 'emailIdVerified',
                //     render: (text, record) => (<p>{text.toString()}</p>),
                //     ellipsis: true
                // },
                {
                    title: <Tooltip title='Submitted On'><div >Submitted On</div></Tooltip>,
                    // dataIndex: 'profileCreatedDate',
                    render: (record, text) => (<>{moment(record.submittedOn).format('MMMM Do YYYY')}</>),
                    // ellipsis: true,
                    sorter: (a, b) => moment(a.submittedOn) - moment(b.submittedOn),
                    sortDirections:['descend', 'ascend']
                },
                {
                    title: <Tooltip title='Submitted By'><div >Submitted By</div></Tooltip>,
                    render: (text, record) => (
                        record.submittedBy
                    )
                    // dataIndex: 'partnerProfileTracking.partnerEmailId',
                    // // render:(text) =>(<>{moment(text).format('MMMM Do YYYY')}</>),
                    // ellipsis: true
                }
            ],
            exportColumns: [
                { header: 'Name', key: 'Name', width: 30, style: { font: { bold: true } } },
                { header: 'JobId', key: 'jobId', width: 40, style: { font: { bold: true } } },
                { header: 'EventId', key: 'eventId', width: 40, style: { font: { bold: true } } },
                { header: 'EmailId', key: 'EmailId', width: 40, style: { font: { bold: true } } },
                // { header: 'EmailIdVerified', key: 'emailIdVerified', width: 40, style: { font: { bold: true } } },
                { header: 'profileCreatedDate', key: 'submittedOn', width: 30, style: { font: { bold: true } } },
                { header: 'SubmittedBy', key: 'submittedBy', width: 40, style: { font: { bold: true } } },

            ]
        }
        this.partnerService = new partnerService();
    }

    rowDataFunction = (rows) => {
        let rowData = [];
        this.state.exportColumns.forEach(function (o, key) {
            if (o.header === 'Name') {
                rowData.push(rows[o.key]);
            }
            else if (o.header === 'JobId') {
                rowData.push(rows[o.key] ? rows[o.key] : "");
            }
            else if (o.header === 'EventId') {
                rowData.push(rows[o.key] ? rows[o.key] : "")
            }
            else if (o.header === 'EmailId') {
                rowData.push(rows[o.key]);
            }
            // else if (o.header === 'EmailIdVerified') {
            //     rowData.push(rows[o.key])
            // } 
            else if (o.header === 'SubmittedBy') {
                rowData.push(rows[o.key])
            }
            else {
                rowData.push(rows[o.key]);
            }
        });
        return rowData;
    }

    downloadExcel = () => {
        let rows = this.state.profileSubmissions;
        let exportData = [];
        for (var i = 0; i < rows.length; i++) {
            let rowData = this.rowDataFunction(rows[i]);
            exportData.push(rowData);
        }
        // console.log("exportData", exportData);
        var props = {
            fileName: 'ProfileSubmissions',
            columns: this.state.exportColumns,
            data: exportData
        }
        this.ExcelUtils.exportToExcel(props);
    };

    onChange = (e) => {
        console.log('radio checked', typeof (e.target.value));
        if (e.target.value === 'Any') {
            this.fetchAllProfileSubmissions(e)
        } else {
            const { profileSubmissions } = this.state
            let result = []
            let hour = 24;
            let currDate = moment().utc();
            let sevDayFormat = moment().subtract(7, 'd').format('YYYY-MM-DD');
            let monthFormat = moment().subtract(1, 'months').format('YYYY-MM-DD');
            switch (e.target.value) {
                case 1:
                    result = profileSubmissions.filter((t) => currDate.diff(moment(t.submittedOn), 'h') <= hour)
                    break;
                case 2:
                    result = profileSubmissions.filter((t) => moment(t.submittedOn).utc().format('YYYY-MM-DD') >= sevDayFormat);
                    break;
                case 3:
                    result = profileSubmissions.filter((t) => moment(t.submittedOn).utc().format('YYYY-MM-DD') >= monthFormat);
                    break;
                default:

                    break;
            }
            console.log("FILTERED RESULTS", result)
            this.setState({
                value: e.target.value,
                duplicateprofileSubmissions: result,
                profileSubmissionsCount: result.length
            });
        }

    };

    fetchAllProfileSubmissions = (e) => {
        let companyName = localStorage.getItem('companyName')
        let email=localStorage.getItem('email')
        let data = {
            partnerCompanyName: companyName,
            partnerEmail:email
        }
        this.partnerService.getNetProfileSubmissions(data)
            .then((response) => {
                console.log("RESULTS", response.data.data)
                // this.setState({ profileSubmissions: response.data.data, duplicateprofileSubmissions: response.data.data, profileSubmissionsCount: response.data.data.length, value: e.target.value })
                let tableData = this.getSortedData(response.data.data)
                this.setState({ duplicateprofileSubmissions: tableData, profileSubmissions: tableData, profileSubmissionsCount: tableData.length, value: e.target.value })
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    getSortedData(data) {
        let value = []
        data.forEach((user) => {
            if (user.jobId) {
                value.push({
                     jobId: user.jobId,
                     Name: user.profilesByPartner.applicantName, 
                     EmailId: user.profilesByPartner.applicantEmailId, 
                     submittedOn: user.profilesByPartner.ProfileSubmittedTimeStamp, 
                     submittedBy: user.profilesByPartner.profileSubmittedBy
                     })
            }
            else {
                value.push({ 
                        eventId: user.eventId,
                        Name: user.listofApplicants.applicantName,
                        EmailId: user.listofApplicants.applicantEmailId,
                        submittedOn: user.listofApplicants.ProfileSubmittedTimeStamp, 
                        submittedBy: user.listofApplicants.profileSubmittedBy 
                    })
            }
        })
        let userData = (value).sort(function (a, b) {
            return new Date(b.submittedOn) - new Date(a.submittedOn);
        })
        // console.log("userData",userData);
        return userData
    }

    componentDidMount() {
        let companyName = localStorage.getItem('companyName')
        let email=localStorage.getItem('email')
        let data = {
            partnerCompanyName: companyName,
            partnerEmail:email
        }
        this.partnerService.getNetProfileSubmissions(data)
            .then((response) => {
                // console.log("RESULTS", response.data.data)
                let tableData = this.getSortedData(response.data.data)
                this.setState({ duplicateprofileSubmissions: tableData, profileSubmissions: tableData, profileSubmissionsCount: tableData.length })
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    openModal = () => {
        this.setState({ visible: true })
    }

    closeModal() {
        this.setState({ visible: false });
    }

    sendDataToParent = (data, value) => {
        this.setState({ filteredData: data, noData: value })
    }

    changeButton = (btnName) => {
        this.setState({ btnValue: btnName })
    }

    cancleFilter = () => {
        this.setState({ filteredData: [], btnValue: false, noData: true })
    }

    render() {
        const headingStyle = {
            // marginRight: '15px',
            fontWeight: '600',
            color: '#fff',
            fontSize: '28px',
            // display: 'inline'
        }
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div style={{ overflowX: 'hidden' }}>
                <FilterComponent visible={this.state.visible}
                    userData={this.state.duplicateprofileSubmissions} closeModal={this.closeModal.bind(this)}
                    sendDataToParent={this.sendDataToParent.bind(this)}
                    showSelectedRow={this.state.selectRow}
                    changeButton={this.changeButton.bind(this)} />
                <div className="row">
                    <div className="col-lg-3" style={{ marginTop: '30px' }}>
                        <div className="filters-wrapper">
                            <div className="justify-content-between" style={{
                                borderRadius: '6px 6px 0 0',
                                display: 'flex', padding: '10px',
                                marginLeft: '20px',
                                background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                            }}>
                                <span>
                                    <h5 style={headingStyle} >Filter By Freshness</h5>
                                </span>
                            </div>
                            <Radio.Group onChange={this.onChange} style={{ marginLeft: '20px' }} value={this.state.value}>
                                <Radio style={radioStyle} value={1}>
                                    Last 24 Hours
                                </Radio>
                                <Radio style={radioStyle} value={2}>
                                    Last Week
                                </Radio>
                                <Radio style={radioStyle} value={3}>
                                    Last Month
                                </Radio>
                                <Radio style={radioStyle} value={'Any'}>
                                    Any
                                </Radio>
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="col-lg-9" >
                        <div className="d-flex justify-content-end">
                            <Tooltip title='Download Excel' >
                                <FaDownload style={{ cursor: 'pointer', marginBottom: '10px', marginRight: '5px' }} className="export-icon" onClick={this.downloadExcel.bind(this)} />
                            </Tooltip>
                        </div>
                        <div className="justify-content-between" style={{
                            borderRadius: '6px 6px 0 0',
                            display: 'flex',
                            padding: '10px',
                            background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                        }}>
                            <span>
                                <h3 style={headingStyle}>Net New Profiles Report</h3>
                                <h3 style={headingStyle} >Total Profiles: {this.state.profileSubmissionsCount}</h3>
                            </span>
                            <span style={{ float: "right" }}>
                                <Button onClick={this.state.btnValue ? this.cancleFilter : this.openModal}>{this.state.btnValue ? "Clear Filter" : "Filter"}</Button>
                                {/* {<Button onClick={this.cancleFilter}>Clear Filter</Button> : ""} */}
                            </span>
                        </div>
                        <Table columns={this.state.columns} dataSource={this.state.noData ? this.state.filteredData.length ? this.state.filteredData : this.state.duplicateprofileSubmissions : []} />
                    </div>
                </div>
            </div>
        )
    }
}

export default ProfileSubmissionsTable