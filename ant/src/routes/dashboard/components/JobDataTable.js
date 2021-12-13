import React from 'react';
import { Icon, Table, Tooltip } from 'antd';
import partnerService from "../../../services/partnerService";

class JobDataTable extends React.Component {
    constructor() {
        super();
        var companyName = localStorage.getItem('companyName');
        this.state = {
            companyName: companyName,
            pendingData: [],
            columns: [
                {
                    title: 'Job Title',
                    dataIndex: 'jobTitle',
                },
                {
                    title: 'Salary',
                    dataIndex: 'maxannualCTC',
                },
                {
                    title: 'Experience',
                    dataIndex: 'maxexperience',
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (text, record) => (
                        <span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Edit"><Icon type="form" /></Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Deactivate"><Icon type="delete" /></Tooltip>
                            </span>
                        </span>
                    ),
                },
            ]
        }
        this.partnerService = new partnerService();
    }
  
    onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }
    render() {
        const {arrData, title} = this.props;
        return (
            <div>
                <Table columns={this.state.columns} dataSource={arrData} title={() => title} pagination={false} showHeader={false} size={"small"} onChange={this.onChange} />
            </div>
        )
    }
}
export default JobDataTable;