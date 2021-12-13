import React from 'react';
import { Comment, Avatar, Form, Button, List, Input, Modal } from 'antd';
// import moment from 'moment';
import companyService from "../../../services/companyService";


const { TextArea } = Input;
const pagination = { pageSize: 3 }
const CommentList = ({ quireMessages }) => (
    <List
        dataSource={quireMessages}
        header={`${quireMessages.length} ${quireMessages.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        pagination={pagination}
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <div>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
      </Button>
        </Form.Item>
    </div>
);
class AddQuires extends React.Component {
    constructor(props) {
        super(props);
        let CompanyName = localStorage.getItem('email')
        this.companyService = new companyService()
        this.state = {
            quireMessages: [],
            submitting: false,
            value: '',
            companyName:CompanyName
        }
    }

    componentDidMount() { }

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log(nextProps,prevState, ' its nextProps.someValue');
        if (nextProps.quireMessages && nextProps.quireMessages.length > prevState.quireMessages.length) {
            // console.log(nextProps.recruitersCount, ' its inside ');
            return { quireMessages: nextProps.quireMessages };
        }
        else if( nextProps.quireMessages.length === 0)
        {
            return { quireMessages:[]}
        }
        else return null;
    }

    //     submitPost = (text) =>{
    //       let CompanyName = localStorage.getItem('email')
    //         let data = {
    //             // profileImage:
    //             //   'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    //             name: CompanyName,
    //             content: text,
    //             date: new Date()
    //           }
    //           let jobId=this.props.jobId
    //           this.companyService.addQuires(jobId,data).then((res) => {
    //               this.props.reload(jobId)
    //          })

    // }


    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });
        let CompanyName = localStorage.getItem('email')
        let jobId=this.props.jobId
        let data = {
                        // avatar:
                        //   'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                        author: CompanyName,
                        content: this.state.value,
                        datetime: new Date(),
                        jobId:jobId

                      }
                      this.companyService.addQuires(data).then((res) => {
                          this.props.reload(jobId)
                          this.setState({
                                    submitting: false,
                                    value: '',
                                });
                     })
        
        // setTimeout(() => {
        //     this.setState({
        //         submitting: false,
        //         value: '',
        //     });
        // }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleCancel = () => {
        this.props.onClose();
    };

    render() {
        const { visible,jobTitle } = this.props;
        const { quireMessages, submitting, value,companyName } = this.state;
        return (
            <div>
                <Modal
                    title={jobTitle}
                    visible={visible}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                    footer={null}
                    width='80%'
                >
                    <div className="container">
                        {quireMessages.length > 0 && <CommentList quireMessages={quireMessages} />}
                        <Comment
                            avatar={
                                <Avatar>{companyName.charAt(0).toUpperCase()}</Avatar>}
                            content={
                                <Editor
                                    onChange={this.handleChange}
                                    onSubmit={this.handleSubmit}
                                    submitting={submitting}
                                    value={value}
                                />
                            }
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddQuires