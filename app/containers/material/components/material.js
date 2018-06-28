/**
 *编辑活动
 */

import React from 'react';
import QRCode from 'qrcode';
import Http from '../../../utils/http';
import PropTypes from 'prop-types';
import history from '../../../utils/history';
import '../style/news.edit.scss';
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
  { "id": "uploadFile", "url": "/material/uploadFile" },
  // { "id": "getTagList", "url": "cmyManage/tag/getTagList" },
  { "id": "insertNews", "url": "/material/uploadMedia"},
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
        "contentType": 1,
        "mediaType": -1,
        "labelName": "",
        "newsSummary": "",
        "imgUrl":"",
        // "previewPhone": "",
        "status": 0,
        "title": "",
        "titleImage": ""
      },
      hasValidate: { ...initValidates },
      editDiff: {
        editType: 'add'
      },
      isSave: false,
      isRequest: false,
      tagShow: false,

    }

    this.onContentTypeChange = this.onContentTypeChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.onPreviewPhoneChange = this.onPreviewPhoneChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

  };



  componentWillMount() {
  }

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
      const newState = { previewPhone: this.state.previewPhonesAsArray.join(',') }
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
    console.log('info', info)
    const { fileList } = info
    const status = info.file.status
    let imgURLAsArr = ""
    if (status === 'done') {

      console.log('fileupload-done====', fileList)
      fileList.map((item, index) => {
        // 上传成功后的操作，需要判断是否成功
        // console.info('item===', item['response']['data'])
        imgURLAsArr = item['response']['data']
        if (!imgURLAsArr) {
          message.error('文件上传失败，请再次尝试！')
          return
        }
      })

      console.log(this.state.formFieldValues.titleImage)
      this.setState({
        formFieldValues: { ...this.state.formFieldValues, ...{ imgUrl: imgURLAsArr.url } }
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


  genTagDropdown = () => {
    const { onInputChange } = this
    const { getFieldDecorator } = this.props.form
    const { tagList } = this.state
    return (
      <FormItem
        {...formItemLayout}
        label="类型"
      >

        <Row gutter={12}>
          <Col span={24}>
            {getFieldDecorator('mediaType', {
              rules: [
                { required: true, message: '请选择类型！' },
              ],
            })(
              <Select placeholder="请选择" onChange={onInputChange.bind(this, 'mediaType')}>
                <Option value={1}>图片</Option>
                <Option value={2}>音频</Option>
                <Option value={3}>视频</Option>
                <Option value={4}>图文</Option>
              </Select>
            )}
          </Col>
          {/* <Col span={8}>
            <Button icon="tag" style={{ width: '100%' }} onClick={() => this.setState({ tagShow: true })}>设置</Button>
          </Col> */}
        </Row>

      </FormItem>
    )
  }

  jump = (url) => {
    history.push(url);
  }


  /**
   * 普通输入框，下拉框的值处理
   */
  onInputChange = (field, event, obj) => {
    const isSelectTarget = !Object.hasOwnProperty.call(event, 'target')
    const value = isSelectTarget ? event : event.target.value
    const tempState = {}
    tempState[field] = value
    if (field === 'mediaType') {
      tempState['labelName'] = obj.props.children
    }

    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...tempState }
    }, () => {
      console.log('onInputChange.formFieldValues=====', this.state.formFieldValues)
    })

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
    const prevPhonesAsArray = [...this.state.previewPhonesAsArray]

    prevPhonesAsArray[index] = currentValue
    this.setState({
      previewPhonesAsArray: [...prevPhonesAsArray]
    }, () => {
      console.log('onPreviewPhoneChange.index====', index, '===onPreviewPhoneChange.previewPhonesAsArray====', this.state.previewPhonesAsArray)
      const newState = { previewPhone: this.state.previewPhonesAsArray.join(',') }
      this.setState({
        formFieldValues: { ...this.state.formFieldValues, ...newState }
      }, () => {
        console.log('this.state.formFieldValues====', this.state.formFieldValues)
      })
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
     console.log(activityContent)
    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...{ content: activityContent } }
    }, () => {
      console.log('onRichChange.formFieldValues===', this.state.formFieldValues)
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

    if (formFieldValues['titleImage'].length > 0) {
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
    //console.log(this.state.formFieldValues)
    if (!this.state.formFieldValues.title) {
      message.error('请输入标题')
      return
    }
    if (!this.state.formFieldValues.newsSummary) {
      message.error('请输入描述')
      return
    }
    if (this.state.formFieldValues.mediaType === -1) {
      message.error('请选择类型')
      return
    }
    // if(!this.state.formFieldValues.labelId !== 3 && this.state.formFieldValues.I){
    //   message.error('请选择类型')
    //   return
    // }
    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...tempStatus },
      isSave: btnType === 'save' ? true : this.state.isSave,
      isRequest: true,
    }, () => {
      // return console.log(this.state.formFieldValues)
      Http.post('insertNews', { ...this.state.formFieldValues }, (callback) => {
        console.log('submit-callback=====', callback)
        if (callback['errorCode']==='200') {
          message.success('操作成功')
          // history.push('../infoManu');
        } else {
          message.error(`${callback['errorMsg']}，请重试！`);
          this.setState({ isArray: false })
        }
      })
    })
  }




  render() {
    const { onContentTypeChange, handlePreview, onPreviewPhoneChange, onInputChange, onRichChange, handleSubmit } = this
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
    const uploadButtonx = (
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
                <Input placeholder="手机号" style={{ width: '100%', }} onChange={onPreviewPhoneChange.bind(this, k)} />
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
          <FormItem
            {...formItemLayout}
            label="标题"
          >
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请正确填写！' }],
            })(
              <Input onChange={onInputChange.bind(this, 'title')} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="描述"
          >
            {getFieldDecorator('newsSummary', {
              rules: [{ required: false, whitespace: true, }],
            })(
              <TextArea autosize={{ minRows: 4, maxRows: 4 }} onChange={onInputChange.bind(this, 'newsSummary')} />
            )}
          </FormItem>
          {this.genTagDropdown()}
          <FormItem
            {...formItemLayout}
            label={<span className="required">上传文件</span>}
            style={{ display: formFieldValues.mediaType === 4 ? 'none' : 'block' }}
          >
            <Upload
              // 文件地址
              name='photo'
              action={uploadUrl}
              listType="picture-card"
              multiple={true}
              supportServerRender={true}
              onPreview={this.handleUploadPreview}
              onChange={this.handleUploadChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {/* <span style={{ color: 'red' }}>* 请设置图片宽高比例 290:180(像素)</span> */}
            <div style={{ color: '#f5222d', display: hasValidate['isUploadValidate'] ? 'none' : 'block' }}>请添加文件！</div>
          </FormItem>
          {/*  */}
          <FormItem
            {...formItemLayout}
            label={<span className="required">标题图片</span>}
            style={{ display: formFieldValues.mediaType === 4 ? 'block' : 'none' }}
          >
            <Upload
              // 文件地址
              name='photo'
              action={uploadUrl}
              listType="picture-card"
              multiple={true}
              supportServerRender={true}
              onPreview={this.handleUploadPreview}
              onChange={this.handleUploadChange}
            >
              {fileList.length >= 1 ? null : uploadButtonx}
            </Upload>
            {/* <span style={{ color: 'red' }}>* 请设置图片宽高比例 290:180(像素)</span> */}
            <div style={{ color: '#f5222d', display: hasValidate['isUploadValidate'] ? 'none' : 'block' }}>请添加文件！</div>
          </FormItem>

          <FormItem style={{ display: formFieldValues.mediaType === 4 ? 'block' : 'none' }}
            {...formItemRichText}
          >
            <RichText
              richOpt={richOpt}
              defaultValue={formFieldValues.content}
              result={formFieldValues.content}
              onChange={onRichChange.bind(this)}>
            </RichText>
            <div style={{ color: '#f5222d', display: hasValidate['isContentValidate'] ? 'none' : 'block' }}>请填写富文本！</div>
          </FormItem>



          <FormItem {...tailFormItemLayout}>
            <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="save" onClick={handleSubmit.bind(this, 'save')}>保存</Button>
            {/* <Button type="default" disabled={this.state.isRequest} htmlType="button" icon="search" style={{ marginLeft: 8 }} onClick={handlePreview}>预览</Button> */}
            <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="export" style={{ marginLeft: 8 }} onClick={handleSubmit.bind(this, 'pub')}>发布</Button>
          </FormItem>
        </Form>



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
