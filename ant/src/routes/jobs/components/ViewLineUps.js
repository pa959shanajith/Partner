
import React from 'react';
import { Modal, Tag, Table, Icon, Tooltip } from 'antd';

class ViewLineUps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            current: 0,

            columns: [
                {
                    title: 'Name',
                    dataIndex: 'applicantName',
                    sorter: (a, b) => a.name.length - b.name.length,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Email',
                    dataIndex: 'applicantEmailId'
                },
                {
                    title: 'Exp.',
                    dataIndex: 'applicantExperience',
                },
                {
                    title: 'Notice Period',
                    dataIndex: 'applicantNoticePeriod',
                },
                {
                    title: 'Expected CTC',
                    dataIndex: 'applicantExpectedCTC'
                },
                {
                    title: 'Status',
                    key: 'status',
                    render: (text, record) => (
                        <span>
                            {record.status[0] === 'SUBMITTED' ? (<Tag color='green'>SUBMITTED</Tag>) : ((<Tag color='geekblue'>record.status[0]</Tag>))}
                        </span>
                    ),
                },
                {
                    title: 'Actions',
                    key: 'actions',
                    render: (text, record) => (
                        <span style={{textAlign: 'center'}} >
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Download Resume">
                                    <a href={record.resumeUplodedUrl} style={{ marginRight: 8 }} >
                                        <Icon type="download" />
                                    </a>
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Shortlist Candidate"><Icon type="mail" /></Tooltip>
                            </span>
                        </span>
                    ),
                },
            ]
        };
    }
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };

    handleCancel = () => {
        this.props.onClose();
    };
    downloadResume = () => {
        this.props.onClose();
    };

    render() {
        // const { loading } = this.state;
        const { data, visible } = this.props;
        return (
            <div>
                <Modal
                    visible={visible}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='85%'
                    className="view-lineups-modal"
                >
                    <section className="col-12 form-v1-container">
                        <div className="">
                            <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>Attendees List</h3>
                        </div>

                        <Table className="LineUpsTable" columns={this.state.columns} dataSource={data} />

                    </section>
                </Modal>
            </div>
        );
    }

}
export default ViewLineUps;