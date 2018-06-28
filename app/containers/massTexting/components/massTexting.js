/**
 *编辑活动
 */

import React from 'react';
import QRCode from 'qrcode';
import Http from '../../../utils/http';
import PropTypes from 'prop-types';
import history from '../../../utils/history';
import Tag from '../../tag/TagComp';
import '../style/news.edit.scss';
// import DealerTree from '../../../components/common/dealerTree';
import DMCUtil from '../../../utils/DMCUtil'
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../../global.config';
import {
  Form, Select, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Rate, Input, Checkbox,
  Row, Col, Modal, message,
} from 'antd';
import RichText from '../../../components/RichText/RichText';
//import {uploadImageUrl} from '../../../middleware/config';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
let uuid = 0;
const apis = [
  // { "id": "uploadFile", "url": "//carapp.gtmc.com.cn/api/cmyManage/sys/uploadFile" },
  // { "id": "getTagList", "url": "sendNews/send" },
  { "id": "insertNews", "url": "sendNews/send", "format": false },
  { "id": "mediaList", "url": "material/mediaList", "format": false }
  // { "id": "updateNews", "url": "community/news/updateNews", "format": false },
];

const Authorization = DMCUtil.getJWTFromCookie()
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

let initValidates = {
  isContentValidate: true,
  isThirdPartLinkValidate: true,
  isUploadValidate: true,
}
message.config({
  top: 400,
  duration: 2,
})

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 },
};


const formItemLink = {
  wrapperCol: {
    xs: {
      span: 12,
      offset: 6,
    },
    sm: {
      span: 12,
      offset: 6,
    },
    md: {
      span: 12,
      offset: 6,
    },

  }
};

const formItemRichText = {
  wrapperCol: {
    xs: {
      span: 18,
      offset: 6,
    },
    sm: {
      span: 18,
      offset: 6,
    },
    md: {
      span: 18,
      offset: 6,
    },

  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 12,
      offset: 6,
    },
    sm: {
      span: 12,
      offset: 6,
    },
    md: {
      span: 12,
      offset: 6,
    },

  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
  },
};

/**
 * 空方法
 */
function noop() { }

//不优雅的暂存编辑时要填充的数据😊
let tempFormFieldValues = {};


let initCount = 0

class NewsEdit extends React.Component {

  static propTypes = {
    editType: PropTypes.string,
    formFieldValues: PropTypes.object,
  }

  static defaultProps = {
    formFieldValues: {},
    onCancel: noop,
  }

  constructor(props) {
    super(props);

    this.state = {
      richOpt: { UPLOAD_IMAGE_PATH },
      tagList: [],
      previewVisible: false,
      previewPhonesAsArray: [],
      previewImage: '',
      previewUrl: 'http://localhost:9900/fed/admin/device-support',
      fileList: [],
      formFieldValues: {
        // content: 1,
        // openIdList: [],
        // type:0
        // "labelId": 0,
        // "labelName": "",
        // "newsSummary": "",
        // "previewPhone": "",
        // "status": 0,
        // "title": "",
        // "titleImage": "",
        // "dealerCode":[],
      },
      hasValidate: { ...initValidates },
      editDiff: {
        editType: 'add'
      },
      isSave: false,
      isRequest: false,
      tagShow: false,
      optList: []
    }

    this.onContentTypeChange = this.onContentTypeChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.onPreviewPhoneChange = this.onPreviewPhoneChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

  };



  // componentWillMount() {
  //   //获取标签下拉列表
  //   Http.get('getTagList', { dealerCode: '00000', businessType: 1004 }, (callback) => {
  //     this.setState({ tagList: callback })
  //     console.log('tagList--->', callback)
  //   })


  // }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps===', nextProps)
    //编辑时只初始化一次
    if (initCount > 0) return !1
    const { formFieldValues } = nextProps

    if (Object.hasOwnProperty.call(formFieldValues, 'id') && formFieldValues['id'] !== null) {
      ++initCount
      this.init()
    }

  }

  componentDidMount() {
    this.addMobile()
  }

  init = () => {

    const { formFieldValues } = this.props
    const editDiff = {}

    editDiff['editType'] = Object.hasOwnProperty.call(formFieldValues, 'id') ? 'mod' : 'add'

    this.setState({ editDiff })

  }

  removeMobile = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }


    const prevPhonesAsArray = [...this.state.previewPhonesAsArray]
    prevPhonesAsArray.splice(k, 1)

    this.setState({
      previewPhonesAsArray: [...prevPhonesAsArray]
    }, () => {
      console.log('removeMobile.index====', k, '===removeMobile.previewPhonesAsArray====', this.state.previewPhonesAsArray)
      const newState = { openIdList: this.state.previewPhonesAsArray }
      this.setState({
        formFieldValues: { ...this.state.formFieldValues, ...newState }
      }, () => {
        console.log('this.state.formFieldValues====', this.state.formFieldValues)
      })
    })


    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  addMobile = () => {

    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;

    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  normFile = (e) => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  handleUploadCancel = () => this.setState({ previewVisible: false })
  handleUploadChange = (info) => {
    const { fileList } = info
    const status = info.file.status
    let imgURLAsArr = ""

    if (status === 'done') {

      console.log('fileupload-done====', fileList)
      fileList.map((item, index) => {
        console.info('item===', item['response']['data'])
        imgURLAsArr = item['response']['data']

      })


      this.setState({
        formFieldValues: { ...this.state.formFieldValues, ...{ titleImage: imgURLAsArr } }
      }, () => {
        console.log('handleUploadChange===', this.state.formFieldValues)
      })

    }


    this.setState({ fileList })


  }

  handleUploadPreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  getTag() {
    Http.get('getTagList', { businessType: 1004 }, (callback) => {
      this.setState({ tagList: callback })
      console.log('tagList--->', callback)
    })
  }


  // genTagDropdown = () => {
  //   const { onInputChange } = this
  //   const { getFieldDecorator } = this.props.form
  //   const { tagList } = this.state
  //   return (
  //     <FormItem
  //       {...formItemLayout}
  //       // label="资讯标签"
  //     >

  //       <Row gutter={12}>
  //         <Col span={16}>
  //           {getFieldDecorator('tag', {
  //             rules: [
  //               { required: true, message: '请选择活动标签！' },
  //             ],
  //           })(
  //             <Select placeholder="请选择" onChange={onInputChange.bind(this, 'labelId')}>
  //                 <Option value={0}>图文</Option>
  //                 <Option value={1}>文本</Option>
  //                 <Option value={2}>图片</Option>
  //                 <Option value={3}>语音</Option>
  //                 <Option value={4}>视频</Option>
  //             </Select>
  //           )}
  //         </Col>
  //         <Col span={8}>
  //           <Button icon="tag" style={{ width: '100%' }} onClick={() => this.setState({ tagShow: true })}>设置</Button>
  //         </Col>
  //       </Row>

  //     </FormItem>
  //   )
  // }

  jump = (url) => {
    history.push(url);
  }


  /**
   * 普通输入框，下拉框的值处理
   */
  onInputChange = (field, event, obj) => {
    console.log(field);
    console.log(event);
    console.log(obj);
    const isSelectTarget = !Object.hasOwnProperty.call(event, 'target')
    const value = isSelectTarget ? event : event.target.value
    console.log(value)
    const tempState = {}
    tempState[field] = value
    if (field === 'type') {
      tempState['labelName'] = obj.props.children
    }
    console.log(tempState);
    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...tempState }
    }, () => {
      console.log('onInputChange.formFieldValues=====', this.state.formFieldValues)
    })
    // 重置数据
    // this.state.optList["title"]="";
    if (field == 'type') {
      Http.get('mediaList', { type: value }, res => {
        console.log('optList', res.data.list)
        if (res) {
          this.setState({ optList: res.data.list, formFieldValues:{...this.state.formFieldValues, lableCode:''} })
        }
      })
    }

  }


  /**
   * @description 活动内容radio切换时触发
   */
  onContentTypeChange = (event) => {
    console.log('onContentTypeChange---->', event)
    const contentType = event.target.value
    const { formFieldValues } = this.state
    if (event.target.value === 1) {
      delete formFieldValues['thirdPartLink']
    } else {
      delete formFieldValues['content']
    }

    this.setState({
      formFieldValues: { ...formFieldValues, ...{ contentType } }
    }, () => {
      console.log('onContentTypeChange---->', this.state.formFieldValues)
    })
  }

  /**
   * @description 可预览手机号变化时触发
   */
  onPreviewPhoneChange = (index = 0, event) => {
    const target = event.target
    const currentValue = target.value
    console.log(this.state.previewPhonesAsArray)
    const prevPhonesAsArray = [...this.state.previewPhonesAsArray]
    !prevPhonesAsArray[index] && (prevPhonesAsArray[index] = {})
    prevPhonesAsArray[index] = currentValue
    this.setState({
      previewPhonesAsArray: [...prevPhonesAsArray]
    })
  }



  /**
   * @description 通过URL生成二维码
   */
  genQRCodeWithUrl = () => {
    return (async () => {
      let str = await QRCode.toString('http://www.baidu.com')
      return str
    })()

  }

  /**
   * @description 点击预览按钮触发，todo先保存，后通过链接生成二维码
   *
   */
  handlePreview = () => {
    if (!this.state.isSave) {
      message.error('请先保存！')
    }
    // this.genQRCodeWithUrl()
  }

  /**
   * @description 富文本编辑时触发
   */

  onRichChange = (activityContent) => {

    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...{ content: activityContent } }
    }, () => {
      console.log('onRichChange.formFieldValues===', this.state.formFieldValues)
    })

  }
  /**
     * 销售店选择时触发
     */
  onDealerCodeChange = (v) => {
    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...{ dealerCode: v['value'] } }
    }, () => {
      console.log('onDealerCodeChange====', this.state.formFieldValues)
    })
  }

  /**
   * @description 检查富文本，第三方链接及上传图片是否填写完整
   */
  checkVaildate = () => {
    const { formFieldValues } = this.state
    const { contentType } = formFieldValues
    let result = true
    if (contentType === 1) {

      if (Object.hasOwnProperty.call(formFieldValues, 'content') && formFieldValues['content'].length > 8) {
        console.info('content------>', formFieldValues['content'].length, '-----formFieldValues---', formFieldValues['content'].length > 8)
        initValidates = { ...initValidates, ...{ isContentValidate: true, isThirdPartLinkValidate: true } }
        // this.setState({

        //   hasValidate: { isContentValidate: true, isThirdPartLinkValidate: true }
        // }, () => {
        //   console.info('contentValidate------>', this.state.hasValidate)
        // })
      } else {
        result = false
        initValidates = { ...initValidates, ...{ isContentValidate: false, isThirdPartLinkValidate: true } }
        // this.setState({
        //   hasValidate: { isContentValidate: false, isThirdPartLinkValidate: true }
        // }, () => {
        //   console.info('contentVaildate--error---->', this.state.hasValidate)
        // })
      }
    } else {
      if (Object.hasOwnProperty.call(formFieldValues, 'thirdPartLink') && formFieldValues['thirdPartLink'].length > 0) {

        initValidates = { ...initValidates, ...{ isContentValidate: true, isThirdPartLinkValidate: true } }
        // this.setState({
        //   hasValidate: { isContentValidate: true, isThirdPartLinkValidate: true }
        // }, () => {
        //   console.info('thirdPartLinkValidate-pass----->', this.state.hasValidate)
        // })
      } else {
        result = false
        initValidates = { ...initValidates, ...{ isContentValidate: true, isThirdPartLinkValidate: false } }
        // this.setState({
        //   hasValidate: { isContentValidate: true, isThirdPartLinkValidate: false }
        // }, () => {
        //   console.info('thirdPartLinkValidate--error---->', this.state.hasValidate)
        // })
      }
    }

    if (formFieldValues['openIdList'].length > 0) {
      initValidates = { ...initValidates, ...{ isUploadValidate: true } }
      // this.setState({
      //   hasValidate: { isUploadValidate: true }
      // }, () => {
      //   console.info('uploadValidate--pass---->', this.state.hasValidate)
      // })
    } else {
      result = false
      initValidates = { ...initValidates, ...{ isUploadValidate: false } }
      // this.setState({
      //   hasValidate: { isUploadValidate: false }
      // }, () => {
      //   console.info('uploadValidate--error---->', this.state.hasValidate)
      // })
    }

    this.setState({
      hasValidate: { ...initValidates }
    }, () => {
      console.log('hasValidate---->', this.state.hasValidate)
    })
    //this.clearErrorMsg()

    return result

  }

  /**
   * @description 保存与发布触发
   * DRAFT(1001, "草稿"),
   * DELETED(1002, "已删除"),
   * UNSTART(1003, "未开始"),
   * EFFECTIVE(1004, "有效"),
   * FULL(1005, "已满额"),
   * EXPIRED(1006, "已过期");
   */
  handleSubmit = (btnType) => {
    if (this.state.isRequest) return !1;
    const { validateFieldsAndScroll } = this.props.form
    const statusMap = { save: 1001, pub: 1004 }
    const tempStatus = { status: statusMap[btnType] }

    // if (!this.checkVaildate()) return

    // validateFieldsAndScroll((errors, values) => {
    //   if (errors) {
    //     console.log('===errors===', errors, '==values==', values)
    //     return
    //   }
    let temp = this.state.previewPhonesAsArray.filter((item) => {
      return item !== ''
    })
    console.log(temp.length);
    if (temp.length === 0) {
      message.error('请输入openId');
      return
    }
    if(temp.length<2){
      message.error('openId至少需要两条');
      return
    }
    console.log(this.state.formFieldValues);
    if (this.state.formFieldValues.type == 1 && !this.state.formFieldValues.newsSummary) {
      message.error('请输入内容');
      return
    }
    if (this.state.formFieldValues.type !== 1 && !this.state.formFieldValues.lableCode) {
      message.error('请选择类型');
      return
    }
    if(this.state.formFieldValues.type ==1){
        // content = this.state.formFieldValues.newsSummary;
        // console.log("dedede",this.state.formFieldValues.newsSummary)
        
        var conup = this.state.formFieldValues.newsSummary;
        // debugger
    }else{
        var conup = this.state.formFieldValues.lableCode;
        console.log("dededex",this.state.formFieldValues.lableCode)
    }
    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...tempStatus },
      isSave: btnType === 'save' ? true : this.state.isSave,
      isRequest: true,
    }, () => {

      let dataUp = [{
        content: conup,
        openIdList: temp,
        type: this.state.formFieldValues.type
        // summary: this.state.formFieldValues.newsSummary
      }]
      // debugger
      console.log(dataUp)
      Http.post('insertNews', dataUp, (callback) => {
        // console.log(this.state.formFieldValues);
        if (callback['success']) {
          message.success('操作成功')
          history.push('../infoManu');
        } else {
          console.log(callback);
          message.error(`${callback['errMsg']}，请重试！`);
          this.setState({ isArray: false })
        }
      })
    })



    // })

  }




  render() {
    const { onContentTypeChange, handlePreview, onPreviewPhoneChange, onInputChange, onRichChange, handleSubmit, onDealerCodeChange } = this
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form
    const { previewVisible, previewImage, fileList, formFieldValues, richOpt, editDiff, hasValidate } = this.state


    const { contentType } = formFieldValues

    const uploadUrl = UPLOAD_IMAGE_PATH;
    //setFieldsValue({fileList})
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">添加</div>
      </div>
    );
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    console.log('keys===', keys)
    const formItems = keys.map((k, index) => {
      return (

        <FormItem
          {...formItemLayoutWithOutLabel}
          key={k}
        >
          <Row gutter={12}>
            <Col span={16}>
              {getFieldDecorator(`names[${k}]`)(
                <Input placeholder="输入OPENID" style={{ width: '100%', }} onChange={onPreviewPhoneChange.bind(this, k)} />
              )}
            </Col>
            <Col span={8}>
              {keys.length > 0 ? (

                <Button style={{ width: '100%' }}
                  icon='delete'
                  disabled={index === 0}
                  onClick={() => this.removeMobile(k)}
                >移除</Button>

              ) : null}
            </Col>
          </Row>
        </FormItem>
      );
    });

    return (
      <div className='wrap' style={{ 'padding': '12px' }}>
        <Form>
          {/* <FormItem
            {...formItemLayout}
            label="资讯标题"
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请正确填写！' }],
            })(
              <Input onChange={onInputChange.bind(this, 'title')} />
            )}
          </FormItem> */}

          {/* {this.genTagDropdown()} */}
          <FormItem
            {...formItemLayout}
            label="类型选择"
          >
            {formItems}
            <Button type="dashed" onClick={this.addMobile} style={{ width: '100%' }}>
              <Icon type="plus" /> 点击添加
              </Button>
          </FormItem>

          <FormItem {...formItemLayout} label={`群发内容`} style={{ width: '100%' }}>
            {/* {this.genTagDropdown()} */}
            <Row gutter={12}>
              <Col span={5}>
                <Select placeholder="请选择" onChange={onInputChange.bind(this, 'type')}>
                  <Option value={''}>文本</Option>
                  <Option value={1}>图片</Option>
                  <Option value={2}>语音</Option>
                  <Option value={3}>视频</Option>
                  <Option value={4}>图文</Option>
                </Select>
              </Col>
              <Col span={5} style={{ display: formFieldValues.type == "" ? 'none' : 'block' }}>
                  <Select placeholder="请选择" value={formFieldValues.lableCode} onChange={onInputChange.bind(this, 'lableCode')}>
                    {this.state.optList.map((item, i) => {
                      return (<Option value={item.id}>{item.title}</Option>)
                    })}
                  </Select>
                </Col>

            </Row>
          </FormItem>

          <FormItem style={{ display: formFieldValues.type !== "" ? 'block' : 'none' }}
            {...formItemLayout}
            label="内容概要"
          >
            {getFieldDecorator('newsSummary', {
              rules: [{ required: false, whitespace: true, }],
            })(
              <TextArea autosize={{ minRows: 4, maxRows: 4 }} onChange={onInputChange.bind(this, 'newsSummary')} />
            )}
          </FormItem>

          {/* <FormItem
            {...formItemLayout}
            label={<span className="required">资讯内容</span>}
          >
            <div>
              <Radio name="contentType" value={1} checked={contentType === 1 ? true : false} onChange={onContentTypeChange}>图文</Radio>
              <Radio name="contentType" value={2} checked={contentType === 2 ? true : false} onChange={onContentTypeChange}>第三方模块</Radio>
            </div>

          </FormItem> */}


          {/* <FormItem style={{ display: contentType === 1 ? 'block' : 'none' }}
            {...formItemRichText}
          >
            <RichText
              richOpt={richOpt}
              defaultValue={formFieldValues.content}
              result={formFieldValues.content}
              onChange={onRichChange.bind(this)}>
            </RichText>
            <div style={{ color: '#f5222d', display: hasValidate['isContentValidate'] ? 'none' : 'block' }}>请填写富文本！</div>
          </FormItem> */}

          {/* <FormItem style={{ display: contentType === 2 ? 'block' : 'none' }}
            {...formItemLink}
          >
            <Input name="thirdPartLink" placeholder="请输入链接地址" onChange={onInputChange.bind(this, 'thirdPartLink')} />
            <div style={{ color: '#f5222d', display: hasValidate['isThirdPartLinkValidate'] ? 'none' : 'block' }}>请填写第三方链接！</div>
          </FormItem> */}

          <div>
            {/* <div dangerouslySetInnerHTML={{ __html: this.genQRCodeWithUrl() }}></div> */}
          </div>




          <FormItem {...tailFormItemLayout}>
            <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="save" onClick={handleSubmit.bind(this, 'save')}>保存</Button>
            {/* <Button type="default" disabled={this.state.isRequest} htmlType="button" icon="search" style={{ marginLeft: 8 }} onClick={handlePreview}>预览</Button> */}
            <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="export" style={{ marginLeft: 8 }} onClick={handleSubmit.bind(this, 'pub')}>发布</Button>
          </FormItem>
        </Form>

        <Modal
          width={800}
          visible={this.state.tagShow}
          onCancel={() => { this.getTag(); this.setState({ tagShow: false }) }}
          onOk={() => { this.getTag(); this.setState({ tagShow: false }) }}
        >
          <Tag businessType={1004} />
        </Modal>

      </div>
    );
  };

}

/**
 * init初始化form表单😭
 */
const NewsEditWithForm = Form.create({
  mapPropsToFields(props) {

    return (() => {
      let fields = {}
      let { formFieldValues } = props
      for (let field in formFieldValues) {
        fields[field] = Form.createFormField({
          value: formFieldValues[field]
        })
      }

      return fields
    })()

  },
})(NewsEdit);

export default NewsEditWithForm;
