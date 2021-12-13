import React from 'react';
import { Table, Icon, Tag, Tooltip, message, Popconfirm } from 'antd';
import AddEvent from './AddEvent';
import ViewEvent from './ViewEvent';
import ViewLineUps from './ViewLineUps';


class SavedJobsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false,
            loading: false,
            showAddModal: false,
            showViewModal: false,
            showLineUpsModal: false,
            eventsLineUp: [],
            isEdit: false,
            rowData: {},
            columns: [
                {
                    title: 'Event Title',
                    dataIndex: 'eventName',
                    sorter: (a, b) => a.name.length - b.name.length,
                    sortDirections: ['descend', 'ascend'],
                    render: text => <p onClick={this.showViewEventModal.bind(this)} >{text}</p>,
                },
                {
                    title: 'Date',
                    dataIndex: 'eventDate',
                    // sorter: (a, b) => a.eventDate.length - b.eventDate.length,
                    // sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Company',
                    dataIndex: 'companyName',
                    // defaultSortOrder: 'descend',
                    // sorter: (a, b) => a.applicantsCount - b.applicantsCount,
                },
                {
                    title: 'Location',
                    dataIndex: 'eventLocation',
                    // defaultSortOrder: 'descend',
                    // sorter: (a, b) => a.applicantsCount - b.applicantsCount,
                },
                {
                    title: 'Status',
                    dataIndex: 'eventPostingApproved',
                    render: (text, record) => (
                        <span>
                            {record.eventPostingApproved ? (<Tag color='green'>Active</Tag>) : ((<Tag color='geekblue'>Inactive</Tag>))}
                        </span>
                    ),
                },
                {
                    title: 'Actions',
                    key: 'actions',
                    render: (text, record) => (
                        <span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="View Line-ups"><Icon onClick={() => this.showLineUpsModal(record.listofApplicants)} type="eye" /></Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Edit"><Icon onClick={() => this.showAddEventModal(true, record)} type="form" /></Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Deactivate">
                                    <Popconfirm
                                        title="Are you sure, you want to inactive the event?"
                                        onConfirm={() => this.confirmDelete.bind(this)(record.eventId)}
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
            ]
        }
    }

    showAddEventModal = (isEdit, rowData) => {
        if (rowData == null && !isEdit) {
            rowData = {
                recepientEmailAddress: "",
                forwardEmailAddress: "",
                companyName: "",
                eventAddress: "",
                eventDate: null,
                eventDescription: "",
                eventLocation: "",
                eventName: "",
                maxexperience: "",
                openPositions: "",
                expectedFootfall: null,
                maximumFootfall: null,
                notesToPartners: ""
            }
        }
        this.setState({ showAddModal: true, isEdit: isEdit, rowData: rowData });
    }
    closeAddEventModal = () => {
        this.setState({ showAddModal: false });
    }
    showViewEventModal = () => {
        this.setState({ showViewModal: true });
    }
    closeViewEventModal = () => {
        this.setState({ showViewModal: false });
    }
    showLineUpsModal = (lineUp) => {
        this.setState({ showLineUpsModal: true, eventsLineUp: lineUp });
    }
    closeLineUpsModal = () => {
        this.setState({ showLineUpsModal: false, eventsLineUp: [] });
    }
    confirmDelete = (key) => {
        this.props.deleteCB(key);
    }
    cancelDelete = (e) => {
        message.error('Click on No');
    }

    redirectToDashboard = () => {
        this.props.onChangeTable("");
    }

    render() {
        const { showAddModal, showViewModal, showLineUpsModal, rowData, isEdit } = this.state;
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
                <AddEvent visible={showAddModal} data={rowData} editMode={isEdit} onClose={this.closeAddEventModal.bind(this)}></AddEvent>
                <ViewEvent visible={showViewModal} onClose={this.closeViewEventModal.bind(this)}></ViewEvent>
                <ViewLineUps visible={showLineUpsModal} data={this.state.eventsLineUp} onClose={this.closeLineUpsModal.bind(this)}></ViewLineUps>

                <div style={{
                    borderRadius: '6px 6px 0 0',
                    display: 'flex', padding: '10px', width: '100%',
                    background: 'transparent linear-gradient(180deg, #D45895 0%, #EF5869 100%) 0% 0% no-repeat padding-box'
                }}>
                    <Icon style={marginRight} type="left" onClick={this.redirectToDashboard} />
                    <h3 style={headingStyle} >Saved Jobs</h3>
                    {/* <Icon style={marginRight} type="plus-circle-o" onClick={() => this.showAddEventModal(false, null)} /> */}
                </div>
                <Table columns={this.state.columns} dataSource={this.props.data} />
            </div>
        )
    }
}
export default SavedJobsTable;