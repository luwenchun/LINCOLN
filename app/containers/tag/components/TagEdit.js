/**
 *编辑咨询标签
 */

import React from 'react';
import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Form, Row, Col, Input, Select, Button, Table, Icon, message } from 'antd';
import '../style/tag.edit.scss';
const { Column, ColumnGroup } = Table;
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 空方法
 */
function noop() {}

const editLayout = {
  labelCol: {
    xs: { span: 24 },
    md: {span: 6},
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: {span: 12},
    sm: { span: 12 },
  },
};

//不优雅的暂存编辑时要填充的数据😊
let tempFormFieldValues = {};

class TagEdit extends React.Component {

    static propTypes = {
        editType:PropTypes.string,
        formFieldValues:PropTypes.object,
        onConfirm:PropTypes.func,
        onCancel:PropTypes.func,
    }

    static defaultProps = {
        formFieldValues: {},
        onConfirm: noop,
        onCancel: noop,
    }

  constructor(props) {
      super(props);
      
      this.state = {}
  
    };

    componentWillMount(){
        
    }

    componentWillReceiveProps(nextProps) {
        

    }

    componentDidMount() {
        
    }

    onConfirm = () => {
        const { props, state } = this
        const { getFieldsValue,resetFields,validateFieldsAndScroll } = props.form
        const currentFieldValues = getFieldsValue()
        validateFieldsAndScroll((errors,values) => {
            if(errors){
                console.log('===errors===',errors,'==values==',values)
                return
            }
            currentFieldValues['statusDesc'] = currentFieldValues['status'] === 1?'启用':'停用'
            props.onConfirm({...tempFormFieldValues,...currentFieldValues})
            
            //props.onConfirm(currentFieldValues)
            resetFields()
            
        })
        
        

    }

    onCancel = () => {
        const { props } = this
        props.onCancel();
    }

 
  render() {
    const { props } = this
    const { state } = this
    const { getFieldDecorator } = props.form
    tempFormFieldValues = {...{},...props.formFieldValues}

    console.log(tempFormFieldValues)

    const { id } = tempFormFieldValues;
    
      return (
        <div className="wrap" style={{'padding':'5px'}}>
          <Form>

            <FormItem
                {...editLayout}
                label="标签名称"
                >
                {getFieldDecorator('tagName', {
                    rules: [{ required: true, message: '请填写标签名称！' }],
                })(
                    <Input />
                )}
            </FormItem>

            <FormItem
                {...editLayout}
                label="业务类型"
                >
                {getFieldDecorator('businessType', {
                    rules: [
                    { required: true, message: '请选择业务类型' },
                    ],
                })(
                    <Select allowClear disabled={id===''?false:true}>
                    <Option value={1001}>话题</Option>
                    <Option value={1002}>动态</Option>
                    <Option value={1003}>活动</Option>
                    <Option value={1004}>新闻资讯</Option>
                    </Select>
                )}
                </FormItem>

            <FormItem
                {...editLayout}
                label="状态"
                >
                {getFieldDecorator('status', {
                    initialValue: 1,
                    rules: [
                    { required: true, message: '请选择状态' },
                    ],
                })(
                    <Select placeholder="请选择状态" allowClear>
                    <Option value={1}>启用</Option>
                    <Option value={0}>停用</Option>
                    </Select>
                )}
                </FormItem>

                <FormItem
                {...editLayout}
                label="描述"
                >
                {getFieldDecorator('tagDesc', {
                    rules: [{ required: false, message: '请填写描述！' }],
                })(
                    <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
                )}
                </FormItem>

            </Form>
            <hr className="line" />
            <div className="toolbar">
                <Button type="default" onClick={this.onCancel}>取消</Button>
                <Button type="primary" style={{marginLeft:'8px'}} htmlType="submit" onClick={this.onConfirm}>确认</Button>
            </div>
        </div>
      );
    };
 
}

/**
 * init初始化form表单😭
 */
const TagEditWithForm = Form.create({
    mapPropsToFields(props) {

        return (() => {
            let fields = {}
            let {formFieldValues} = props
            for(let field in formFieldValues){
                fields[field] = Form.createFormField({
                    value: formFieldValues[field]
                })
            }

            return fields
        })()
        
      },
})(TagEdit);

export default TagEditWithForm;

