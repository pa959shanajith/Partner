
import React from 'react';
import { Modal, Tag, Checkbox, Table, Input, InputNumber, Radio, Icon, Tooltip, Upload } from 'antd';


class CandidatesEventEnrolledModal extends React.Component {
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
                    title: 'Expected CTC(Lac)',
                    dataIndex: 'applicantExpectedCTC'
                },
                {
                    title: 'Status',
                    key: 'status',
                    render: (text, record) => {
                        // return (
                        // <Tag color='green'>{text.status[0]}</Tag>
                        // );
                        //TODO: Below switch case can be replaced with above
                        switch (text.status[0]) {
                            case 'SUBMITTED':
                                if(text){
                                    return (
                                        <Tag color='green'>SUBMITTED</Tag>
                                    );
                                }
                                
                                break;
                            case 'SHORTLISTED':
                                if(text){
                                    return (
                                        <Tag color='green'>SHORTLISTED</Tag>
                                    );
                                }
                                break;
                            case 'REJECTED':
                                if(text){
                                    return (
                                        <Tag color='green'>REJECTED</Tag>
                                    );
                                }
                                break;
                            case 'SELECTED':
                                if(text){
                                    return (
                                        <Tag color='green'>SELECTED</Tag>
                                    );
                                }
                                break;
                            case 'OFFERED':
                                if(text){
                                    return (
                                        <Tag color='green'>OFFERED</Tag>
                                    );
                                }
                                break;
                            case 'JOINED':
                                if(text){
                                    return (
                                        <Tag color='green'>JOINED</Tag>
                                    );
                                }
                                break;
                            case 'UNAVAILABLE':
                                if(text){
                                    return (
                                        <Tag color='green'>UNAVAILABLE</Tag>
                                    );
                                }
                                break;
                            default:
                                break;

                        }
                    }
                },
                {
                    title: 'Actions',
                    key: 'actions',
                    render: (text, record) => (
                        <span style={{ textAlign: 'center' }} >
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Download Resume">
                                    {/* <a onClick={() => editJob(record.jobId)} style={{ marginRight: 8 }} > */}
                                    <Icon type="download" />
                                    {/* </a> */}
                                </Tooltip>
                            </span>
                            <span style={{ marginRight: 16, fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                <Tooltip title="Shortlist Candidate"><Icon type="mail" /></Tooltip>
                            </span>
                        </span>
                    ),
                },
            ],

            data: [
                {
                    key: '1',
                    name: 'Java Developers',
                    emailAddress: 'wehearyou@shenzyn.com',
                    experience: 12,
                    noticePeriod: 30,
                    expectedCTC: '18 LPA',
                    status: <Checkbox>Active</Checkbox>,
                    download: <Icon type="download" />
                }
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

    render() {
        const { loading } = this.state;
        const visible = this.props.visible;
        const listofApplicant = this.props.clickedEvent;
        // console.log(listofApplicant, ' its listofApplicant');

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
                            <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>Candidates Applied</h3>
                        </div>
                        <Table className="LineUpsTable" columns={this.state.columns} dataSource={listofApplicant} />
                    </section>
                </Modal>
            </div>
        );
    }

}
export default CandidatesEventEnrolledModal;