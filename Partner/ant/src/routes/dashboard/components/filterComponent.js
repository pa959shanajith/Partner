import React from "react";
import { Modal, Select, Button, message, Form, Input, DatePicker } from "antd";
import { withRouter } from "react-router-dom";
import moment from "moment";
const { Option } = Select;
const FormItem = Form.Item;
const {MonthPicker} = DatePicker;
class FilterComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            keys: [],
            selectedValue: "",
            searchValue: "",
            filteredData: [],
            childData: [],
            selectedRows: [],
            compareFields: false,
            selectedOperator: "",
            fieldType:"",
            whiteSpace:false
        }
    }

    handleChange = (e) => {
        // console.log(e.target.value);
        this.setState({ searchValue: e.target.value })
    }

    handleChange1 = (e) => {
        this.props.showSelectedRow.forEach((data) => {
            if ((Object.values(data)).includes(e)) {
                if (["number", "float", "arrayInt", "date","month"].indexOf(data.type) > -1) {
                    this.setState({ compareFields: true,fieldType:data.type })
                }
                else{
                    this.setState({ compareFields: false,fieldType:data.type })
                }
            }
        })
        this.setState({ selectedValue: e })

    }

    handleChange2 = (e) => {
        this.setState({ selectedOperator: e })

    }

    evaluateFun(value1,operator,value2)
    {
        if(operator === ">")
        {
            return (value1>value2)
        }
        if(operator === "<")
        {
            return (value1<value2)
        }
        if(operator === "===")
        {
            return (value1===value2)
        }
    }

    getDateFormat(value1,operator,value2)
    {
        if(operator === ">")
        {
            return (moment.utc(value1)).isAfter(moment.utc(value2))   
        }
        if(operator === "<")
        {
            return ((moment.utc(value1)).isBefore(moment.utc(value2)))
        }
        if(operator === "===")
        {
            return (moment.utc(value1)).isSame(moment.utc(value2))
        }
       
    }


    onDateChange=(e)=>{
        e.preventDefault()
    }

    inputChange=(e)=>{

        if((e.target.value).match(/^\s+$/))
        {
            this.setState({whiteSpace:true})
        }
        else{
            this.setState({whiteSpace:false})
        }
    }

    getField=()=>{
        switch(this.state.fieldType){

            case "date":
                return <DatePicker onChange={(e) => this.onDateChange.bind(this, e)} />

            case "month": 
                return <MonthPicker placeholder="Select Month" onChange={(e) => this.onDateChange.bind(this, e)}/>

            default:
                return <Input onChange={(e)=>this.inputChange(e)} disabled={this.state.selectedValue !== "" ? false : true} />
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log(err)
                return err
            }
            else if(this.state.whiteSpace)
            {
                return 
            }
            else {
                this.setState({ filteredData: this.props.userData, selectedRows: this.props.showSelectedRow }, () => {
                    var value = [];
                    this.state.selectedRows.forEach((data) => {
                        if ((Object.values(data)).includes(values.selectedField)) {
                            value = this.state.filteredData.filter((val) => {
                                if ((values.selectedField).includes(".") || (val[values.selectedField] !== null && val[values.selectedField] !== undefined)) {
                                    if (data.type === "number") {
                                        if((values.selectedField).includes("."))
                                        {
                                            let selectedFieldValue = values.selectedField.split(".")
                                            if((val[selectedFieldValue[0]])[selectedFieldValue[1]] !== undefined)
                                            {
                                            return this.evaluateFun(parseInt((val[selectedFieldValue[0]])[selectedFieldValue[1]]),this.state.selectedOperator,parseInt(values.searchValue))
                                            }
                                        }
                                        else{
                                        return this.evaluateFun(parseInt(val[values.selectedField]),this.state.selectedOperator,parseInt(values.searchValue))
                                        }
                                    }
                                    if (data.type === "float") {
                                       return this.evaluateFun(parseFloat(val[values.selectedField]),this.state.selectedOperator,parseFloat(values.searchValue))
                                    }
                                    if (data.type === "date") {
                                       return this.getDateFormat(moment(new Date(val[values.selectedField])).format('YYYY-MM-DD'),this.state.selectedOperator,moment(new Date(values.searchValue)).format('YYYY-MM-DD'))   
                                    }
                                    if (data.type === "month") {
                                        return this.getDateFormat(moment(new Date(val[values.selectedField])).format('YYYY-MM'),this.state.selectedOperator,moment(new Date(values.searchValue)).format('YYYY-MM'))  
                                     }                                   
                                    if (data.type === "arrayInt") {
                                      return this.evaluateFun(parseInt((val[values.selectedField]).length),this.state.selectedOperator,parseInt(values.searchValue))

                                    }
                                    if (data.type === "arrayString") {

                                        let reqData
                                        (val[values.selectedField]).forEach((data) => {
                                            reqData = (data.toLowerCase()).includes((values.searchValue).toLowerCase())
                                        })
                                        return reqData

                                    }
                                    if (data.type === "string") {
                                        if((values.selectedField).includes("."))
                                        {
                                            let selectedFieldValue = values.selectedField.split(".")
                                            if((val[selectedFieldValue[0]])[selectedFieldValue[1]] !== undefined)
                                            {
                                            return (((val[selectedFieldValue[0]])[selectedFieldValue[1]]).toLowerCase()).includes((values.searchValue).toLowerCase())
                                            }
                                        }
                                        else{
                                            return ((val[values.selectedField]).toLowerCase()).includes((values.searchValue).toLowerCase())
                                        }
                                    }
                                }
                            })
                        }

                    })
                    // console.log("val", value);
                    let noData = value.length ? true : false
                    this.props.sendDataToParent(value, noData,false)
                    this.handleCancel()
                    this.props.changeButton(true)
                    this.props.form.resetFields()
                    this.setState({ selectedValue: "", compareFields: false })
                })
            }
        })

    }

    handleCancel = () => {
        this.props.closeModal()
        // this.formRef.current.resetFields()
        this.setState({ selectedValue: "",fieldType:"", compareFields: false, whiteSpace:false })
        this.props.form.resetFields()
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        var data1 = []
        for (let value1 of this.props.showSelectedRow) {
            for (let [key, value] of Object.entries(value1)) {
                if (key !== 'type') {
                    data1.push({ [key]: value })
                }
            }
        }
        return (
            <div>
                <Modal
                    visible={this.props.visible}
                    onCancel={this.handleCancel}
                    // onOk={this.handleSubmit}
                    footer={null}
                >
                    <Form id="myForm" onSubmit={this.handleSubmit} className="form-v1">
                        <FormItem
                            // {...formItemLayout}
                            label="Select field:"
                        >
                            {getFieldDecorator('selectedField', {
                                rules: [{
                                    required: true, message: 'Please select the field',
                                }],
                            })(
                                <Select placeholder="Select an option" onChange={this.handleChange1.bind(this)}>
                                    {data1.map((m,i) => (
                                        Object.entries(m).map(([key, value],index) => (
                                            <Option key={index} value={value}>{key}</Option>
                                        ))))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={this.state.compareFields ? { display: 'block' } : { display: 'none' }}
                            // {...formItemLayout}
                            label="Select comparison:"
                        >
                            {getFieldDecorator('selectedCoparison', {
                                rules: [{
                                    required: this.state.compareFields ? true : false, message: 'Please select a value'
                                }],
                            })(
                                <Select placeholder="Select an option" onChange={this.handleChange2.bind(this)}>
                                    <Option value={">"}>Greaterthan</Option>
                                    <Option value={"<"}>Lessthan</Option>
                                    <Option value={"==="}>Equalto</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            // {...formItemLayout}
                            label="Type field value:"
                        >
                            {getFieldDecorator('searchValue', {
                                rules: [{
                                    required: true, message: 'Please input your field value'
                                }],
                            })(
                                   this.getField()
                            )}
                            {this.state.whiteSpace?<p style={{color:"red"}}>Please input proper field value</p>:""}
                        </FormItem>
                        <div style={{ paddingTop: "20px", alignItems: "center", display: "flex", justifyContent: "center" }}>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </div>

                    </Form>
                </Modal>
            </div>
        )
    }

}

// export default FilterComponent;
const WrappedFilterComponent = Form.create()(withRouter(FilterComponent));
export default WrappedFilterComponent;

