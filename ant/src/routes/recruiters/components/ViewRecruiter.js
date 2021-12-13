
import { Form, Modal } from 'antd';
import React from 'react';
const propfile_image = {
    height: '100px',
    // width: '100px',
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
class ViewRecruiter extends React.Component {
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
        var data = this.props.recruiterData;
        // console.log(data);
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
                                <img src={data.logo} style={propfile_image} alt={data.recruiterName} />
                            </div>
                            <div className="col-9">
                                <h3 style={{ fontSize: '24px', color: '#707070', fontWeight: '600' }}>{data.recruiterName}</h3>
                                <h3 style={{ fontSize: '24px', color: '#707070', fontWeight: '600' }}>{data.location}</h3>
                            </div>
                            {/* <div className="col-3">
                                <Button icon="form" onClick={this.handlePostAJob} style={StyleSheet_DefaultButton}>Edit</Button>
                                <br />
                                <Button icon="delete" onClick={this.handlePostAJob} style={StyleSheet_DefaultButton}>Delete</Button>
                            </div> */}
                        </div>
                        <hr style={{ border: '2px solid #D45895' }} />

                        <Form
                            {...layout}
                            name="basic"
                        >
                            {/* <FormItem label="Profile Image">
                                <span className="ant-form-text">Name Long Name</span>
                            </FormItem> */}
                            <FormItem label="Company">
                                <span className="ant-form-text">{data.companyName}</span>
                            </FormItem>
                            <FormItem label="Mail">
                                <span className="ant-form-text">{data.emailId}</span>
                            </FormItem>
                            <FormItem label="Contact">
                                <span className="ant-form-text">{data.countryCode}-{data.contactNo}</span>
                            </FormItem>
                            <FormItem label="Recruiter Address">
                                <span className="ant-form-text">{data.address}</span>
                            </FormItem>
                            <FormItem label="Recruiter LinkedIn">
                                <span className="ant-form-text">{data.linkedinId ? <a href={data.linkedinId} target="_blank" rel="noopener noreferrer">{data.linkedinId}</a> : "Not available"}</span>
                            </FormItem>
                            <FormItem label="Recruiter Location">
                                <span className="ant-form-text">{data.location}</span>
                            </FormItem>
                        </Form>
                    </section>
                </Modal>
            </div>
        );
    }
}
export default ViewRecruiter;