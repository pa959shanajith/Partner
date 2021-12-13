import { Icon, Modal } from 'antd';
import React from 'react';

class ViewAllEventsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            current: 0
        };
    }
    handleCancel = () => {
        this.props.onClose();
    };
    // redirectToDashboard = () => {
    //     this.props.onChangeTable("");
    // }

    render() {
        const visible = this.props.visible;

        return (
            <Modal
                visible={visible}
                maskClosable={true}
                onCancel={this.handleCancel}
                footer={null}
                width='65%'
                className="view-lineups-modal"
            >
                <div class="container">
                    <div class="row">
                        <div class="col-sm-5">
                            <h3 style={{ marginRight: '15px', fontWeight: '600', color: '#D45895', fontSize: '28px' }} >All Events</h3>
                        </div>
                        <div class="col-sm-7">
                            {/* <Form
                            initialValues={{
                                layout=inline
                            }}
                        >
                            <Form.Item label="Form Layout" name="layout">
                            </Form.Item>
                            <Form.Item label="Field A">
                                <Input placeholder="input placeholder" />
                            </Form.Item>
                            <Form.Item label="Field B">
                                <Input placeholder="input placeholder" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary">Submit</Button>
                            </Form.Item>
                        </Form> */}

                        </div>
                    </div>
                    <hr style={{ color: '1px solid rgba(112, 112, 112, .2)' }} />

                    <div className="event__list">
                        <div class="row">
                            <div class="col-sm-2 company__logo">
                                <div className="">
                                    <img src={'https://media-exp1.licdn.com/dms/image/C510BAQFio6MUF0Ss_A/company-logo_200_200/0?e=2159024400&v=beta&t=-zZu75UK27MXwJX9EEfqHnR9w0XIH_06yRq2z5E0wFk'} />
                                </div>
                            </div>
                            <div class="col-sm-10 company__event__details">
                                <div className="row">
                                    <h4 style={{ marginRight: '15px', fontWeight: '600', color: '#D45895', fontSize: '24px' }}>Event Name Long name</h4>
                                </div>
                                <div className="row pt-3">
                                    <div className="col-sm-4">
                                        <div className="col-sm-12 dis-in">
                                            <h5>Organisation:</h5>
                                            <p>4GenTech</p>
                                        </div>
                                        <div className="col-sm-12 dis-in">
                                            <h5>Date:</h5>
                                            <p>20/June/2020</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <div className="col-sm-12 dis-in">
                                            <h5>Location:</h5>
                                            <p>Bangalore</p>
                                        </div>
                                        <div className="col-sm-12 dis-in">
                                            <h5>Experience:</h5>
                                            <p>4GenTech</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-2">
                                        <div className="col-sm-12 dis-in">
                                            <h5>Positions:</h5>
                                            <p>24</p>
                                        </div>
                                        <div className="col-sm-12 dis-in">
                                            <h5>Footfall:</h5>
                                            <p>24</p>
                                        </div>
                                    </div>
                                    <div className="col-sm-2 company__enroll__icon">
                                        <div>
                                            <Icon type="user" style={{ fontSize: '24px', color: '#D45895', fontWeight: 600 }} />
                                            <h5 style={{ fontSize: '14px', color: '#D45895', fontWeight: 600 }}>APPROVE</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>


        );
    }

}
export default ViewAllEventsModal;