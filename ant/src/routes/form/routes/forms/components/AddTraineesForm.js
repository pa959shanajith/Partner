import { Button, Form, Input, Icon, Upload, message, Table } from 'antd';
import React from 'react';
import { withRouter } from "react-router-dom";
import * as XLSX from 'xlsx';
import partnerService from '../../../../../services/partnerService';
import ExcelUtils from '../../../../../services/excelUtils'
// ../../../services/excelUtils
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

class AddTraineesForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        validateEmailStatus: '',
        errormsg: '',
        buttonDisable: true,
        showExcelFileUploadForm: false,
        excelUploadButon: true,
        traineeList: [],
        authToken: "",
        showTraineeTable: false,
        exportColumns: [
            
                { header: 'Email', width: 30, style: { font: { bold: true } } },
                { header: 'Name', width: 30, style: { font: { bold: true } } },
        ],
        columns: [
            {
                title: "Email",
                dataIndex: "Email"
            },
            {
                title: "Name",
                dataIndex: "Name"
            }
        ]
    };
    this.ExcelUtils = new ExcelUtils();
    this.partnerService = new partnerService();
  }

componentDidMount() {
    
  }

  

handleValidate = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      else {
        this.partnerService.validateTPOEmail(values.emailId).then((response) => {
            if(response.data.status === true)
            {
                this.setState({showExcelFileUploadForm : true,authToken: response.data.data.token})
            }
        }).catch((err) => {
            if (err.response.data.message === 'EmailId not found for Training and Placement Officer') {
                this.setState({ validateEmailStatus: 'error', errormsg: err.response.data.message });
              }
        })
      }
    })
    }
  
handleExcelFileSubmit = () => {
    this.state.traineeList.forEach(traineeDetails => {
            this.partnerService.addTraineesToJobSeeker(this.state.authToken,traineeDetails).then((d) => {
            if(d.data.status === true)
            {
                message.success("The users have been added successfully!!..")
                this.props.history.push('/user/tpo-upload');
            }
        }).catch((err) => {
              console.log(err)
              message.error(err)
        })
    });
    
}
downloadExcel = () => { 
    let exportdata = []
    var props = {
        fileName: "Excel_Template",
        columns: this.state.exportColumns,
        data: exportdata
    }
    this.ExcelUtils.exportToExcel(props);
}
customUpload = (componentsData) => {
        message.success("File uploaded successfuly")
        const reader = new FileReader();
        reader.onload = (event) => { // evt = on_file_select event
        const binaryString = event.target.result;
        const workBook = XLSX.read(binaryString, {type:'binary'});
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const parsedData = XLSX.utils.sheet_to_json(workSheet, {header:-1});
        this.setState({ traineeList : parsedData})
        }
        reader.readAsBinaryString(componentsData.file);
    this.setState({ excelUploadButon: false, showTraineeTable: true})
    componentsData.onSuccess()

}  

render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        md: { span: 18 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        md: { span: 21 },
        sm: { span: 16 },
      },
    };
    const uploadFileProps = {
            name: 'document',
            multiple: false,
            accept: '.xlsx'
    };
    
    return (
        <div>
            <div className="row">
            <div className="col-md-3">
                <Form onSubmit={this.handleValidate}>
                    <FormItem
                    {...formItemLayout}
                    // validateStatus={this.state.validateEmailStatus}
                    help={this.state.errormsg}
                    label="E-mail"
                    hasFeedback
                    >
                    {getFieldDecorator('emailId', {
                    initialValue: '',
                    rules: [{
                        type: 'email', message: 'Invalid EmailId',
                    }, {
                        required: true, message: 'Please input your e-mail!',
                    }],
                    })(
                        <Input style={{ width: 400 }}></Input> 
                    )}
                    </FormItem>
                    <FormItem >
                        <Button  type="primary" htmlType="submit" className="btn-cta" >Validate</Button>
                    </FormItem>
                </Form>
            </div>
            </div>
            { this.state.showExcelFileUploadForm ? 
            <div className="row">
            <div className="col-md-9">
            <Form>
            <FormItem>
                <Button type="primary" htmlType="submit" className="btn-cta" onClick={this.downloadExcel}>
                    Download Excel Template
                </Button>
            </FormItem>
            <FormItem
                                label="Excel File"
                                name="excelFile"
                                required={true}
                            >
                                {getFieldDecorator('excelFile', {
                                })(
                                    <Upload 
                                    {...uploadFileProps}
                                    customRequest={this.customUpload}
                                    >
                                        <Button style={StyleSheet_UploadButton}>
                                            <Icon type="upload" style={{ fontSize: '24px', marginTop: '4px' }} />
                                             <p style={{ fontSize: '12px' }}>xlsx</p>
                                        </Button>
                                    </Upload>
                                )}
                            </FormItem>
                            
            </Form>
            </div> 
            </div>
            : ""}
            { this.state.showTraineeTable ? 
            <div>
                <Table
                bordered
                columns={this.state.columns}
                dataSource={this.state.traineeList}
                width={"50%"}
                />
                <Form onSubmit={this.handleExcelFileSubmit}>
                     <FormItem >
                        <Button  disabled={this.state.excelUploadButon} type="primary" htmlType="submit" className="btn-cta" >Submit</Button>
                    </FormItem>
                </Form>
            </div>
            : "" }
        </div>
    );
  }
}

const WrappedAddTraineesForm = Form.create()(withRouter(AddTraineesForm));


export default WrappedAddTraineesForm;
