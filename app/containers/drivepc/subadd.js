
import React from 'react';

import './style/subadd.scss';
import Antd from 'antd'
import { Form, Input, Tooltip, Icon, Cascader, DatePicker,Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const Radio = Antd.Radio;
const RadioGroup = Antd.Radio.Group;
const RadioButton = Antd.Radio.Button;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const AutoCompleteOption = AutoComplete.Option;

const title = '预约新增';


// Http.setMutiApi(apis);

function onChange(e) {
  console.log('radio checked:' + e.target.value);
}

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    setState:[]
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }
  onPublishDateChange = (dateAsMoment, dateAsStr) => {
    this.setState({
      selectedDate: dateAsMoment,
      formFieldValues: { ...this.state.formFieldValues, ...{ startDate: dateAsStr[0] + ":00", endDate: dateAsStr[1] + ":00" } }
    }, () => {
      console.log('onPublishDateChange.formFieldValues====', this.state.formFieldValues)
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const { onPublishDateChange } = this
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 44,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));
    
    return (
 

      <Form onSubmit={this.handleSubmit} className="formadd">
      <FormItem  label="预约编号" className="formitem">
        <span style={{'margin-left':80}}>123</span>
      </FormItem>
      <FormItem  label="称呼" className="formitem">
        <RadioGroup onChange={onChange} defaultValue="m" style={{'margin-left':110}}>
          <Radio value="m">先生</Radio>
          <Radio value="w">女士</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem  label="预约人姓名" className="formitem">
        <Input style={{height:30,'margin-left':65,width:300}}/>
      </FormItem>
      <FormItem  label="联系电话" className="formitem">
        <Input style={{height:30,'margin-left':80,width:300}}/>
      </FormItem>
      <FormItem label='试驾类型' className="formitem2">
        <Select defaultValue={""} style={{'margin-left':80,width:300}}>
          <Option value={""}>预约到店</Option>
          <Option value={1001}>送车上门</Option>
        </Select>
      </FormItem>
      <FormItem  label='试驾地区' className="formitem2">
        <Select defaultValue={""} style={{'margin-left':80,width:300}}>
          <Option value={""} TreeSelect>请选择</Option>
          <Option value={1001}>岳阳</Option>
          <Option value={1002}>株洲</Option>
          <Option value={1003}>益阳</Option>
          <Option value={1004}>怀化</Option>
          <Option value={1005}>张家界</Option>
        </Select>
      </FormItem>
      <FormItem label='销售店' className="formitem2">
        <Select defaultValue={""} style={{'margin-left':95,width:300}}>
          <Option value={""} TreeSelect>请选择</Option>
          <Option value={1001}>岳阳</Option>
        </Select>
      </FormItem>
      <FormItem label='试驾车型' className="formitem">
        <RadioGroup onChange={onChange} defaultValue="s" style={{'margin-left':80}}>
          <Radio value="bx" style={{"margin-right":55}}>不限</Radio>
          <Radio value="s" style={{"margin-right":55}}>SUV</Radio>
          <Radio value="jc">轿车</Radio>
        </RadioGroup>
        <Select defaultValue={""}  style={{height:30,'margin-left':80,width:300,display:"block"}} className="formitem2">
          <Option value={""} TreeSelect>不限</Option>
          <Option value={1001}>轿车</Option>
          <Option value={1002}>火车</Option>
        </Select>
      </FormItem>
      <FormItem label='预约时间' >
        <RadioGroup onChange={onChange} defaultValue="zd" className="formitem2" style={{'margin-left':80}}>
          <Radio value="zd">指定时间日期</Radio>
        </RadioGroup>
                <RangePicker
                  style={{ width:260,height:30} }
                  value={this.state.selectedDate}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                
                  onChange={onPublishDateChange.bind(this)}
                  onOk={(value) => { console.log('onOk: ', value); }}
                />
                <Button type="primary" style={{width:100,"margin-left":30,height:30,background:"#10CF64"}}>查看资源</Button>
        <RadioGroup onChange={onChange} style={{display:'block','margin-left':80}}>
          <Radio value="bx">不限</Radio>
          <Radio value="js">节假日上午</Radio>
          <Radio value="jx">节假日下午</Radio>
          <Radio value="gs">工作日上午</Radio>
          <Radio value="gx">工作日下午</Radio>

        </RadioGroup>
      </FormItem>
      <FormItem label='标签' >
      <RadioGroup onChange={onChange} style={{'margin-left':110}}>
        <RadioButton value="jr" style={{"margin-right":30}}>带家人</RadioButton>
        <RadioButton value="bh">不要黑色</RadioButton>
      </RadioGroup>
              
      </FormItem>
      <FormItem label='备注' >
      <div className="ant-form-item">
      <div style={{'margin-left':110}}>
      <textarea className="ant-input2" id="remark" placeholder="随便写"></textarea>
    </div>
  </div>
              
      </FormItem>
        <FormItem style={{'margin-left':350}}>
          <Button type="primary" htmlType="register" style={{background:"#F7BB28"}}>返回</Button>
          <Button type="primary" htmlType="submit" style={{background:"#10CF64"}}>提交</Button>
        </FormItem>
      </Form>
    );
  }
}



const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;
