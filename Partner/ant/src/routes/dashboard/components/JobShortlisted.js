import React from 'react';
import { withRouter } from "react-router-dom";
import { Table, Icon, Tooltip, Popconfirm, message, Button } from 'antd';
import partnerService from "../../../services/partnerService";

class JobShortlisted extends React.Component {
    constructor(props) {
        super(props);
        var companyName = localStorage.getItem('companyName');
        this.state = {
            companyName: companyName,
            shortlistedJobs: [],
            columns: [
                {
                    title: 'Title',
                    dataIndex: 'jobTitle',
                    render: (text, record) => (
                        <a onClick={() => this.showJobDetails(record)}>{text}</a>
                    ),
                    ellipsis: true,
                    width: 100
                },
                {
                    title: 'Company Name',
                    dataIndex: 'companyName',
                    // ellipsis: true,
                    width: 100
                },
                {
                    title: 'Description',
                    dataIndex: 'jobDescription',
                    width: 100,
                    ellipsis: true,
                    render: text => (
                        <Tooltip placement="topLeft" title={<span dangerouslySetInnerHTML={{ __html: text }}></span>}>
                            <div dangerouslySetInnerHTML={{ __html: text }}></div>
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
                        </span>
                    ),
                },
            ],
        }
        this.partnerService = new partnerService();
    }
    componentDidMount() {
        this.getShortlistedJobs();
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
    gotoJobSearch() {
        this.props.history.push("jobsearch");
    }
    // onClickRow = (record) => {
    //     return {
    //         onClick: () => {
    //             this.showJobDetails(record);
    //         },
    //     };
    // }
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
            fontSize: '28px',
            display: 'inline'
        }
        return (
            <div>
                <div className="justify-content-between" style={{
                    borderRadius: '6px 6px 0 0',
                    display: 'flex', padding: '10px', width: '100%',
                    background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                }}>
                    <span>
                        <Icon style={marginRight} type="left" onClick={this.redirectToDashboard} />
                        <h3 style={headingStyle} >Shortlisted Jobs</h3>
                    </span>
                    {this.props.isPartnerAdmin ? <Button onClick={this.gotoJobSearch.bind(this)}  >All jobs </Button> : ""}
                </div>
                <Table
                    columns={this.state.columns}
                    dataSource={this.state.shortlistedJobs}
                    // scroll={{ x: 1100 }}
                // onRow={this.onClickRow}
                />
            </div>
        )
    }
}

export default withRouter(JobShortlisted);
