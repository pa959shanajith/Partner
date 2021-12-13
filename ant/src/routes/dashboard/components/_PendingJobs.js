import { Icon, Table, Tooltip, message, Popconfirm } from 'antd';
import React from 'react';

function confirmDelete(e) {
    console.log(e);
    message.success('Click on Yes');
}
function cancelDelete(e) {
    console.log(e);
    message.error('Click on No');
}

const columns = [
    {
        title: 'Job Title',
        dataIndex: 'name',
    },
    {
        title: 'Salary',
        dataIndex: 'salary',
    },
    {
        title: 'Experience',
        dataIndex: 'yearsOfExperience',
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
                    <Tooltip title="Deactivate">
                        <Popconfirm
                            title="Are you sure delete this task?"
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
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
];

const data = [
    {
        key: '1',
        name: 'Java Developers',
        salary: '32 LPA',
        yearsOfExperience: 3
    }
];

function onChange(pagination, filters, sorter, extra) {
    console.log('params', pagination, filters, sorter, extra);
}

const PendingJobs = () => {
    return (
        <div>
            <Table columns={columns} title={() => 'Pending Jobs'} pagination={false} showHeader={false} size={"small"} dataSource={data} onChange={onChange} />
        </div>
    )
}
export default PendingJobs;