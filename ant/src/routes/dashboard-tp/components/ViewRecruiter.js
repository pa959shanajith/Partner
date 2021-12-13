
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
                                <img src={''} style={propfile_image} alt="Profile"/>
                                {/* <img src={'https://i.insider.com/5c1aab4cb3c21d0e2c0ee3d5?width=1100&format=jpeg&auto=webp'} style={propfile_image} /> */}
                            </div>
                            <div className="col-6">
                                <h3 style={{ fontSize: '28px', color: '#707070', fontWeight: '600' }}>Name Name</h3>
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
                            <FormItem label="Profile Image">
                                <span className="ant-form-text">Name Long Name</span>
                            </FormItem>
                            <FormItem label="Company">
                                <span className="ant-form-text">Google Inc</span>
                            </FormItem>
                            <FormItem label="Mail">
                                <span className="ant-form-text">wehearyou@shenzyn.com</span>
                            </FormItem>
                            <FormItem label="Contact">
                                <span className="ant-form-text">+91 94858858848</span>
                            </FormItem>
                            <FormItem label="Recruiter Address">
                                <span className="ant-form-text">4th Floor, Tower E, RMZ Infinity, No. 3, Swami Vivekananda Rd, Sadanandanagar, Bennigana Halli, Bengaluru, Karnataka 560016</span>
                            </FormItem>
                            <FormItem label="Recruiter LinkedIn">
                                <span className="ant-form-text">https://www.linkedin.com/in/tanvi-singh1/</span>
                            </FormItem>
                            <FormItem label="Recruiter Location">
                                <span className="ant-form-text">HSR</span>
                            </FormItem>
                        </Form>
                    </section>
                </Modal>
            </div>
        );
    }
}
export default ViewRecruiter;