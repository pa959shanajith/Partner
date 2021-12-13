
import React from 'react';
import { Modal, Table } from 'antd';
// import DEMO from '../../../constants/demoData';
// import moment from 'moment';
import Moment from 'react-moment';

class CandidateRegisteredModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            current: 0,

            columns: [
                {
                    title: 'Name',
                    dataIndex: 'name',
                    sorter: (a, b) => a.name.length - b.name.length,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Contact Number',
                    dataIndex: 'contactNo'
                },
                {
                    title: 'Location',
                    dataIndex: 'currentLocation',
                    // dataIndex: 'workExperiences.0.noticePeriod',
                },
                {
                    title: 'Fee-Paid',
                    key: 'fee',
                    render: (text, record) => (
                        <span style={{ textAlign: 'center' }} >
                            {this.props.trainingCost}
                        </span>
                    ),
                },
                {
                    title: 'Registered Date',
                    key: 'fee',
                    render: (text, record) => (
                        <span style={{ textAlign: 'center' }} >
                           <Moment format="DD MMMM YYYY">
                                {record.registerDate}
                            </Moment>
                        </span>
                    ),
                }
            ],
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

    // sendShortListMail = (profileEmail, text) => {
    //     // console.log(text, ' its text');
    //     var companyName = localStorage.getItem('companyName');
    //     var jobTitle = localStorage.getItem('jobTitle');
    //     var openMail = DEMO.headerLink.shortlist + `${profileEmail}` + '?subject=Profile Shortlisted' + ` for ${jobTitle} in ${companyName}`
    //     // +`&body= <h4>Hi ${profileEmail} </h4>`+' ,';
    //     window.open(openMail);
    // }

    render() {
        // const { loading } = this.state;
        const visible = this.props.showModal;
        var data = this.props.profileData;
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
                            <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>Registered Candidates</h3>
                        </div>
                        <Table className="LineUpsTable" columns={this.state.columns} dataSource={data} />
                    </section>
                </Modal>
            </div>
        );
    }

}
export default CandidateRegisteredModal;