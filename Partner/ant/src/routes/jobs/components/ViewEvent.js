
import React from 'react';
import { Modal, Button, Form } from 'antd';


const StyleSheet_DefaultButton = {
    color: '#fff',
    fontSize: '15px',
    background: 'linear-gradient(270deg, #B446FF 0%, #6D68FE 28%, #4C46E6 70%, #9700FF 100%)',
    border: '1px solid #E3E3E3',
    borderRadius: '8px',
    width: '120px',
    height: '40px',
    margin: '4px 8px',
}
const propfile_image = {
    height: '100px',
    width: '100px',
    borderRadius: '50%'
}

const FormItem = Form.Item;
// const { TextArea } = Input;

const layout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 12,
    },
};
// const tailLayout = {
//     wrapperCol: {
//         offset: 21,
//         span: 16,
//     },
// };
class ViewEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            current: 0
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
        // const { loading } = this.state;
        const visible = this.props.visible;
        return (
            <div>
                <Modal
                    visible={visible}
                    maskClosable={true}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='40%'
                    className="add-recruiter-modal"
                >
                    <section className="col-12 form-v1-container pt-4">
                        <div className="row">
                            <div className="col-3">
                                <img src={''} style={propfile_image} alt="Event" />
                                {/* <img src={'https://i.insider.com/5c1aab4cb3c21d0e2c0ee3d5?width=1100&format=jpeg&auto=webp'} style={propfile_image} /> */}
                            </div>
                            <div className="col-6">
                                <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>Event Name</h3>
                                <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>4Gen, HSR</h3>
                            </div>
                            <div className="col-3">
                                <Button icon="form" onClick={this.handlePostAJob} style={StyleSheet_DefaultButton}>Edit</Button>
                                <br/>
                                <Button icon="delete" onClick={this.handlePostAJob} style={StyleSheet_DefaultButton}>Delete</Button>
                            </div>
                        </div>
                        <hr style={{ border: '2px solid #D45895' }} />

                        <Form
                            {...layout}
                            name="basic"
                        >
                            <FormItem label="Event Name">
                                <span className="ant-form-text">Name Long Name</span>
                            </FormItem>
                            <FormItem label="Company">
                                <span className="ant-form-text">Google Inc</span>
                            </FormItem>
                            <FormItem label="Event Location">
                                <span className="ant-form-text">wehearyou@shenzyn.com</span>
                            </FormItem>
                            <FormItem label="Event Description">
                                <span className="ant-form-text">+91 94858858848</span>
                            </FormItem>
                            <FormItem label="Event Date">
                                <span className="ant-form-text">4/12/2019</span>
                            </FormItem>
                            <FormItem label="Position Open">
                                <span className="ant-form-text">23</span>
                            </FormItem>
                            <FormItem label="Event Address">
                                <span className="ant-form-text">HSR</span>
                            </FormItem>
                            <FormItem label="Footfall Expected">
                                <span className="ant-form-text">332</span>
                            </FormItem>
                            <FormItem label="Recipient Mail">
                                <span className="ant-form-text">shriram@gods.org</span>
                            </FormItem>
                            <FormItem label="Forward Mail">
                                <span className="ant-form-text">shivji@gods.org</span>
                            </FormItem>
                            <FormItem label="Notes to Recruiter">
                                <span className="ant-form-text">Rs 100 Note</span>
                            </FormItem>
                        </Form>
                    </section>
                </Modal>
            </div>
        );
    }
}
export default ViewEvent;