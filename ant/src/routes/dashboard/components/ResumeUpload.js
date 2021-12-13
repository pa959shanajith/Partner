import React from 'react';
import { Upload, Icon, Form, message, Button } from 'antd';
import { withRouter } from "react-router-dom";
import api from 'constants/pageRoutes';
import { connect } from 'react-redux';
import { multipleFiles, setButtonValue, setFileList } from 'actions/settingsActions';
// const Dragger = Upload.Dragger;
const FormItem = Form.Item;

const StyleSheet_UploadButton = {
    color: '#939393',
    fontSize: '16px',
    borderRadius: '4px',
    fontWeight: 900,
    height: '55px',
    margin: '4px 8px',
    textAlign: 'center',
}
class ResumeUpload extends React.Component {
    constructor(props) {
        super()
        let authToken = localStorage.getItem("authToken")
        this.state = {
            uploadPercentage: 0,
            fileList: [],
            fileObj: [],
            fileLength: 25,
            actionURL: api.endPointUrl.default + "partner/AddApplicant/resumeparser",
            uploadFileList: [],
            authToken: authToken
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            return values;
        })
    }

    handleChange = info => {
        let obj = {}
        const { handleMultipleUpload, buttonValue } = this.props
        let fileList = [...info.fileList];
        fileList = fileList.map((file, i) => {
            obj = {}
            obj.name = ""
            if (file.response) {

                if (file.response.status !== true) {
                    obj.name = ""
                    // obj.emailId = ""
                    // obj.mobileno = ""
                    // obj.City = ""
                    // obj.experince = ""
                    // obj.expectedctc = ""
                    // obj.noticePeriod = ""
                }
                else {
                    obj.name = ""
                    obj.emailId = file.response.data.email
                    obj.mobileno = file.response.data.phone
                    obj.City = file.response.data.city
                    obj.resumeURL = file.response.location
                    obj.experince = ""
                    obj.expectedctc = ""
                    obj.noticePeriod = ""
                    obj.currentCompany = ""
                    // obj.status = "pending..."

                }
            }
            // console.log("obj",obj);
            file.userData = obj
            return file;
        });
        let checkFileStatus = this.isUploadedFiles(fileList);
        buttonValue(checkFileStatus)
        if (checkFileStatus) {
            let listOfFiles = [];
            let newFileList = [];
            fileList.forEach((users) => {
                if (!users.error) {
                    listOfFiles.push(users.userData)
                    newFileList.push(users);
                }

            })
            fileList = newFileList;
            handleMultipleUpload(listOfFiles)
            // updateFileList(fileList)
            this.setState({ fileList });
        }
        this.setState({ fileList });
    };

    isUploadedFiles = (files) => {
        var arrayofFiles = []
        if (files.length) {
            files.forEach(el => {
                if (el.response) {
                    arrayofFiles.push(el.response.status)
                }
            });
        }
        return arrayofFiles.length !== files.length ? false : true
    }

    beforeUpload = (file, fileList) => {
        if (fileList.length <= this.state.fileLength) {
            this.setState({ uploadFileList: fileList })
            return true
        }
        else {
            fileList.length = this.state.fileLength;
            this.setState({ uploadFileList: fileList })
            message.info("You have exceed the maximum limit " + this.state.fileLength, 20)
        }
    }

    checkAPI = (data) => {
        let isValidFile;
        if (this.state.uploadFileList.length) {
            isValidFile = this.isFileExist(data);
        }
        return isValidFile ? this.state.actionURL : '';
    }
    isFileExist = (file) => {
        let value;
        if (Object.keys(file).length) {
            value = this.state.uploadFileList.find((each_file) => each_file.name === file.name)
        }
        return value ? true : false
    }

    render() {

        // const { getFieldDecorator } = this.props.form;
        // const props = {
        //     action: `${api.endPointUrl.default}partner/AddApplicant/resumeparser`,
        //     onChange: this.handleChange,
        //     multiple: true,
        // };

        // const uploadFileProps = {
        //     name: 'document',
        //     multiple: false,
        //     accept: '.pdf, .doc, .docx',
        // };
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        name="uploadResume"
                        rules={[{ required: true }]}
                        style={{ display: 'inline-block', }}
                    >

                        <Upload
                            // {...uploadFileProps}
                            // {...props}
                            action={this.checkAPI}
                            headers={{ Authorization: `Bearer ${this.state.authToken}` }}
                            multiple={true}
                            onChange={this.handleChange}
                            beforeUpload={this.beforeUpload}
                            fileList={this.state.fileList}
                            // customRequest={this.customFileUpload}
                            name="file">
                            <Button style={StyleSheet_UploadButton}>
                                <Icon type="upload" style={{ fontSize: '24px', marginTop: '4px' }} />
                                <p style={{ fontSize: '12px' }}>pdf/doc/docx</p>
                            </Button>
                        </Upload>
                        {/* {progress > 0 ? <Progress percent={progress} /> : null} */}
                        {/* <Modal
                                    title="Saved Video Profile"
                                    visible={this.state.videoModalVisible}
                                    // onOk={this.handleOk}
                                    footer={false}
                                    onCancel={this.closeVideoModal}
                                >
                                </Modal> */}
                        {/* {uploadPercentage > 0 && <Progress style={progressBarStyle} percent={uploadPercentage} status="active" />} */}
                    </FormItem>


                </Form>

            </div >
        )
    }
}


const mapStateToProps = (state) => ({
    listOfFiles: state.settings.listOfFiles,
});

const mapDispatchToProps = dispatch => ({
    handleMultipleUpload: (listOfFiles) => {
        dispatch(multipleFiles(listOfFiles));
    },
    buttonValue: (value) => {
        dispatch(setButtonValue(value));
    },
    updateFileList: (filelist) => {
        dispatch(setFileList(filelist));
    }
});


const WrappedResumeUpload = Form.create()(withRouter(connect(mapStateToProps, mapDispatchToProps)(ResumeUpload)));
export default WrappedResumeUpload;
