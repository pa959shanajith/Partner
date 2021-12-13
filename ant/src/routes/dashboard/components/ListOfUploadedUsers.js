import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { setMultiplefileslist } from 'actions/settingsActions';
import { Icon,Tooltip} from 'antd';

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.dataIndex === ('experince')) {
      return <InputNumber min={0} />;
    }
    if (this.props.dataIndex === ('expectedctc')) {
      return <InputNumber min={1} />;
    }
    if (this.props.dataIndex === ('noticePeriod')) {
      return <InputNumber min={0} />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
  const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
   // console.log(editing, " its editing");
    //console.log(dataIndex, " its dataIndex");
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: this.customRulevalidator(dataIndex,title),
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  customRulevalidator(dataIndex,title){
    let fieldRules=[{
       required: dataIndex === "currentCompany" ? false : true,
       message: `Please Input ${title}!`,
     }];
    if(dataIndex==="mobileno")
     {
       fieldRules.push(
         {
           pattern: /^\d{10}$/,
           message: `${title} should be 10 digits!`,
         }
         );
     }
     if(dataIndex==="name")
     {
       fieldRules.push(
         {
           whitespace:true,
           message: `Please enter ${title}!`,
         }
         );
     }
     return fieldRules;
   }

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    const { listOfFiles } = this.props
    this.state = { data: listOfFiles, editingKey: "" };
    this.columns = [
      {
        title: 'Action',
        dataIndex: 'operation',
        render: (text, record) => {
          {console.log(record)}
          const { editingKey } = this.state;
          // let value = record.userData && Object.keys(record.userData).length ? record.userData:record
          const editable = this.isEditing(record);
          return editable ? (
         
            <span>
              <EditableContext.Consumer>
                {form => (
                  <span
                    onClick={() => this.save(form, record)}
                    style={{ marginRight: 8,color:"red",cursor:"pointer",fontSize:"12px"}}
                  >
                    <b>Save</b>
                  </span>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record)}>
                <span style={{color:"red",cursor:"pointer",fontSize:"12px"}}><b>Cancel</b></span>
              </Popconfirm>
            </span>
          ) : (
            <div>
            <a disabled={editingKey !== ''} onClick={() => this.edit(record)} style={{color:"red",cursor:"pointer"}}>
              <b style={{color: "darkslategray"}}><Tooltip title="Edit">
                    <Icon type="edit" />
                   </Tooltip>
               </b>
            </a>
            <a href={record.resumeURL} target="_blank" style={{color:"red",cursor:"pointer",marginLeft:"18px"}}>
            <b style={{color: "darkslategray"}}><Tooltip title="Resume">           
                <Icon type="paper-clip" />
                 </Tooltip>
             </b>
             </a>
            </div>
            
            
          );
        },    
      },
      {
        title: 'Name',
        dataIndex: 'name',
        // width: '25%',
        // render:(text, record)=>(<p>{text && Object.keys(text.userData).length && text.userData.name ? text.userData.name:"N/A"}</p>),
        editable: true,
      },
      {
        title: 'EmailId',
        dataIndex: 'emailId',
        // width: '15%',
        // render:(text, record)=>(<p disabled={true}>{text.emailId?text.emailId:"N/A"}</p>),
        editable: false,
      },
      {
        title: 'Mobile No',
        dataIndex: 'mobileno',
        // width: '40%',
        // render:(text, record)=>(<p>{text && Object.keys(text.userData).length && text.userData.mobileno ? text.userData.mobileno:"N/A"}</p>),
        editable: true,
      },
      {
        title: 'Experience',
        dataIndex: 'experince',
        // width: '25%',
        editable: true,
      },
      {
        title: 'Expected CTC',
        dataIndex: 'expectedctc',
        // width: '25%',
        editable: true,
      },
      {
        title: 'Notice Period',
        dataIndex: 'noticePeriod',
        // width: '25%',
        editable: true,
      },
      {
        title: 'Current/Last Company',
        dataIndex: 'currentCompany',
        // width: '25%',
        editable: true,
      },
      {
        title: 'Comments',
        dataIndex: 'comments',
        // width: '25%',
        editable: true,
      }
     
    ];
  }

  isEditing = record => record.emailId === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {

      const { handleChangeTable } = this.props;
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key.emailId === item.emailId);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        handleChangeTable(newData);
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        handleChangeTable(newData);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key.emailId });
  }

  render() {
    // const { listOfFiles } = this.props;
    // console.log("listOfFiles",listOfFiles);
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'experince' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    // 'name' ? 'text' : 'number',
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          scroll={{ y: 500 }}
          tableLayout={'fixed'}
          pagination={{
            onChange: this.cancel,
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const mapStateToProps = (state) => ({
  listOfFiles: state.settings.listOfFiles,
});
const mapDispatchToProps = (dispatch) => {
  return {
    handleChangeTable: (tablefiles) => {
      dispatch(setMultiplefileslist(tablefiles));
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(withRouter(EditableTable)));
