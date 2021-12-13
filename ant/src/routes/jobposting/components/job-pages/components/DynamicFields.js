import React, { Component, Fragment } from "react";
import { Form, Icon, Button } from "antd";
import PropTypes from "prop-types";

const FormItem = Form.Item;

class DynamicFields extends Component {
  id = 1;

  add = () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`),
      nextKeys = keys.concat(this.id++);
    setFieldsValue({
      [`${name}List`]: nextKeys
    });
    
  };

  remove = k => () => {
    const { getFieldValue, setFieldsValue, name } = this.props,
      keys = getFieldValue(`${name}List`);

    if (keys.length === 1) return;
    setFieldsValue({
      [`${name}List`]: keys.filter(key => key !== k)
    });
  };

  defaultValidation = name => ({
    validateTrigger: ["onChange", "onBlur"],
    rules: [
      {
        required: true,
        whitespace: true,
        message: `Please input ${name}.`
      }
    ]
  });

  addSingleField = () => {
    const { getFieldDecorator, getFieldValue, fields: obj, name } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    getFieldDecorator(`${name}List`, { initialValue: [0] });
    const fieldCounter = getFieldValue(`${name}List`);
    return fieldCounter.map(k => (
      <Form.Item key={k}
      >
        {getFieldDecorator(
          `${name}[${k}]`,
          obj.validation || this.defaultValidation(name)
        )(obj.field())}
        {fieldCounter.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));
  };

  addMultipleFields = () => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    const { getFieldDecorator, getFieldValue, fields, name,data,educationIndex } = this.props;
    console.log(this.props,' its props');
    console.log(data,' its data');
    var educationIn = educationIndex+1;
    var FieldLength = 6;
    var dataIndex = 0;
    getFieldDecorator(`${name}List`, { initialValue: [0] });
    const fieldCounter = getFieldValue(`${name}List`);
    // console.log(fieldCounter, ' its dynamic');
    //   console.log(' its inside if Condition');
      return fieldCounter.reduce((preResult, k) => {
        const row = fields.map((obj, i) =>{ 
          // console.log(i,' its index ',obj);
          // console.log(data[dataIndex].education,' its index based data');
          return (
          <FormItem key={`${obj.name}`} label={`${obj.label}`} {...formItemLayout}>
            {getFieldDecorator(
              `${obj.name}`,
              {
                initialValue: data[dataIndex].education[`${obj.name}`]
                // initialValue:obj.initialValue
              }
            )(obj.field())}
            {fieldCounter.length > 1 && fields.length - 1 === i ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={this.remove(k)}
              />
            ) : null}
          </FormItem>
        )
            }
        );
        // console.log(preResult,' its end of preResult ');
        // console.log(row,' its row ');
        return [...preResult, ...row];
      }, []);
    
  };

  render() {
    const { fields, name } = this.props;
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    return (
      <Fragment>
        {Array.isArray(fields)
          ? this.addMultipleFields()
          : this.addSingleField()}
        {/* <Form.Item {...tailFormItemLayout}>
          <Button type="dashed" onClick={this.add} style={{ width: "20%" }}>
            <Icon type="plus" /> Add {name}
          </Button>
        </Form.Item> */}
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.add}>
            <Icon type="plus" />  Add {name}
          </Button>
        </FormItem>
      </Fragment>
    );
  }
}

DynamicFields.propTypes = {
  name: PropTypes.string.isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object)
    //TODO: add object shape validation.
  ]).isRequired,
  getFieldValue: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired
};

export default DynamicFields;
