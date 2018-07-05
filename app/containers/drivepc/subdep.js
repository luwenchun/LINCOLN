
import React from 'react';

import './style/subadd.scss';
import Antd from 'antd'
import { Form, Input, InputNumber, DatePicker,Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const Radio = Antd.Radio;
const RadioGroup = Antd.Radio.Group;
const RadioButton = Antd.Radio.Button;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const AutoCompleteOption = AutoComplete.Option;


function onChange(e) {
  console.log('radio checked:' + e.target.value);
}
function onCha(value) {
  console.log('changed', value);
}
class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    setState:[]
  };

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
   

    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));
    
    return (
 
      <Form onSubmit={this.handleSubmit} className="formadd">
      
      <FormItem  label="是否开通试驾预约服务" className="formitem">
        <RadioGroup onChange={onChange} defaultValue="c" style={{'margin-left':110}}>
          <Radio value="o" style={{"margin-right":50}}>开通</Radio>
          <Radio value="c">不开通</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem  label="是否开通远程试驾预约服务" className="formitem">
        <RadioGroup onChange={onChange} defaultValue="c" style={{'margin-left':82}}>
          <Radio value="o" style={{"margin-right":50}}>开通</Radio>
          <Radio value="c">不开通</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem  label="可预约试驾时间" className="formitem">
      <RangePicker
                  style={{ width:260,height:30,"margin-left":150} }
                  value={this.state.selectedDate}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                
                  onChange={onPublishDateChange.bind(this)}
                  onOk={(value) => { console.log('onOk: ', value); }}
                />
      </FormItem>
      
      <FormItem  label="试驾车辆锁定时常" className="formitem">
        <InputNumber min={5} max={60} defaultValue={5} step={5}  onChange={onCha} style={{"margin-left":135}}/>
          <span>分钟</span>
      </FormItem>
      <FormItem  label="远程试驾车辆锁定时长" className="formitem">
        <InputNumber min={5} max={60} defaultValue={5} step={5}  onChange={onCha} style={{"margin-left":107}}/>
          <span>分钟</span>
      </FormItem>
      
      </Form>
    );
  }
}



const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;
