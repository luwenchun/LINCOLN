/**
 *编辑活动
 */

import React from 'react';
import QRCode from 'qrcode';
import Http from '../../../utils/http';
import history from '../../../utils/history';
import PropTypes from 'prop-types';
import '../style/news.edit.scss';
import DMCUtil from '../../../utils/DMCUtil'
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../../global.config';
import {
  Form, Select, InputNumber, Switch, Radio,
  Slider, Button, Upload, Icon, Rate, Input, Checkbox,
  Row, Col, Modal, message, TreeSelect
} from 'antd';
import RichText from '../../../components/RichText/RichText';
// import RichText from '../../../components/RichText/UEditor';
import Preview from '../../../components/Preview/index';
import 'plyr/dist/plyr.css';
import Plyr from 'plyr/dist/plyr';


const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const controls = ['play-large', 'play', 'current-time', 'volume', 'airplay', 'fullscreen'];
let uuid = 0;
const apis = [
  { "id": "insertNews", "url": "community/news/insertNews", "format": false },
  { "id": "updateNews", "url": "community/news/updateNews", "format": false },
  { "id": "deleteNews", "url": "community/news/web/deleteNews", "format": false },
];
const Authorization = DMCUtil.getJWTFromCookie()

message.config({
  top: 400,
  duration: 2,
})

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

const orderChildren = [];
for (let i = 1; i <= 99; i++) {
  orderChildren.push(<Option value={i} key={i}>{i}</Option>)
}

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

    let imgArr = [], imgsFileList = {};
    if (this.props.data.contentType == 3) {   // 图片
      let arr = eval(this.props.data.content);
      for (let i = 0, e; (e = arr[i]) != undefined; i++) {
        imgArr.push({
          url: e.url,
          summary: e.summary,
          status: 'done'
        })

        imgsFileList['imgsFileList' + i] = {
          uid: i + 1,
          name: "",
          status: "done",
          thumbUrl: e.url
        }

      }
    }


    this.state = {
      richOpt: { UPLOAD_IMAGE_PATH },
      tagList: [],
      previewVisible: false,
      previewPhonesAsArray: [],
      previewImage: '',
      previewUrl: 'http://localhost:9900/fed/admin/device-support',
      fileList: this.props.data.titleImage && this.props.data.titleImage.length
        ? [{
          uid: 1,
          name: "",
          status: "done",
          thumbUrl: this.props.data.titleImage
        }]
        : [],
      imgArr,
      imgsFileList,
      formFieldValues: { ...this.props.data },
      fileListVedio: [
        {
          uid: 1,
          name: "",
          status: "done",
          thumbUrl: this.props.data.content
        }
      ],
      hasValidate: { ...initValidates },
      editDiff: {
        editType: 'add'
      },
      isSave: false,
      isRequest: false,
      drShow: false,
      type: this.props.action,
      next: this.props.action === "detail" || this.props.data.contentType,
      disabled: this.props.action == "detail" ? true : false,
    }

    this.onContentTypeChange = this.onContentTypeChange.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.onPreviewPhoneChange = this.onPreviewPhoneChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);

  };



  componentWillMount() {
    document.addEventListener('DOMContentLoaded', () => {
      const player = new Plyr('#player', { controls });
    });

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
    document.addEventListener('DOMContentLoaded', () => {
      const player = new Plyr('#player', { controls });
    })
  }

  init = () => {

    const { formFieldValues } = this.props
    const editDiff = {}

    editDiff['editType'] = Object.hasOwnProperty.call(formFieldValues, 'id') ? 'mod' : 'add'

    this.setState({ editDiff })

  }

  removeMobile = (i) => {
    const { form } = this.props;
    const { imgArr, imgsFileList } = { ...this.state }
    if (imgArr.length === 1) {
      return;
    }

    imgArr.splice(i, 1)
    delete imgsFileList['imgsFileList' + i]

    this.setState({
      imgsFileList,
      imgArr,
    })

  }

  addMobile = (i) => {
    const { form } = this.props;
    const { imgArr } = { ...this.state }
    uuid++;

    imgArr[i] = { url: '', summary: '', status: '' };
    this.setState({ imgArr });
  }

  normFile = (e) => {
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
        if (item['response']['status'] == '302') {
          window.top.location.href = item['response']['location'];
        }
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


  genTagDropdown = () => {
    const { onInputChange } = this
    const { getFieldDecorator } = this.props.form
    const { tagList } = this.state
    return (
      <FormItem
        {...formItemLayout}
        label="资讯标签"
      >

        <Row gutter={12}>
          <Col span={16}>
            {getFieldDecorator('tag', {
              rules: [
                { required: true, message: '请选择活动标签！' },
              ],
            })(
              <Select placeholder="请选择" onChange={onInputChange.bind(this, 'labelId')}>
                {
                  tagList.map((item, index) => {
                    return (<Option value={item['value']} key={index}>{item['label']}</Option>)
                  })
                }

              </Select>
            )}
          </Col>
          <Col span={8}>
            <Button icon="tag" style={{ width: '100%' }} onClick={() => this.setState({ tagShow: true })}>设置</Button>
          </Col>
        </Row>

      </FormItem>
    )
  }

  jump = (url) => {
    this.props.history.push(url);
  }


  /**
   * 普通输入框，下拉框的值处理
   */
  onInputChange = (field, event, obj) => {
    const isSelectTarget = !Object.hasOwnProperty.call(event, 'target')
    const value = isSelectTarget ? event : event.target.value
    const tempState = {}
    tempState[field] = value
    if (field === 'labelId') {
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
   * @description 图片备注
   */
  onPreviewPhoneChange = (v, index) => {
    // debugger;
    const { imgArr } = { ...this.state }
    imgArr[index]['summary'] = v;
    this.setState({ imgArr })

  }

  removeMobile = (i) => {
    const { form } = this.props;
    const { imgArr, imgsFileList } = { ...this.state }
    if (imgArr.length === 1) {
      return;
    }

    imgArr.splice(i, 1)
    delete imgsFileList['imgsFileList' + i]

    this.setState({
      imgsFileList,
      imgArr,
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

    this.setState({ drShow: true })


    // if (!this.state.isSave) {
    //   message.error('请先保存！')
    // }
    // this.genQRCodeWithUrl()
  }

  /**
   * @description 富文本编辑时触发
   */

  onRichChange = (activityContent) => {

    // var reg = /<([a-zA-Z0-9]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/ig;
    // while (reg.test(activityContent)) {
    //   activityContent = activityContent.replace(reg, "").replace(/(\r\n)|(\n)/g, '');
    // }

    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...{ content: activityContent } }
    }, () => {
      console.log('onRichChange.formFieldValues===', this.state.formFieldValues)

    })

  }

  /**
   * 清楚自定义验证的错误信息
   */
  clearErrorMsg = () => {
    setTimeout(() => {
      this.setState({
        hasValidate: { ...this.state.hasValidate, ...{ isThirdPartLinkValidate: true, isContentValidate: true, isUploadValidate: true } }
      })
    }, 2000)
  }

  /**
   * @description 检查富文本，第三方链接及上传图片是否填写完整
   */
  checkVaildate = () => {
    const { formFieldValues, imgArr } = { ...this.state }
    const { contentType } = formFieldValues
    let result = true, images = [];
    if (contentType == 1) {

    } else if (contentType == 3) {   // 图片验证
      for (let i = 0, e; (e = imgArr[i]) != undefined; i++) {
        if (!e.status.length) {

        } else if (e['url'] && e['url'].length && e['summary'] && e['summary'].length) {
          // images.push(e['url'])
          // images.push(e['summary'])
          images.push({
            url: e['url'],
            summary: e['summary']
          })
        } else {
          return !1;
        }
      }

      if (!images.length) return !1
      formFieldValues.content = JSON.stringify(images);
    } else if (contentType == 4) {  // 视频验证

    }

    for (let k in formFieldValues) {

      if (typeof formFieldValues[k] === 'string' && !formFieldValues[k].length) {
        if (k === 'content') {
          result = result.replace(/<[(p|\/p)^>]+>/g, "");
          result = result.replace(/\s+/g, "").length;
        } else {
          return !1

        }
        // if (typeof formFieldValues[k] === 'string') {
        //     let reg = /<([a-zA-Z0-9]+?)(?:\s+?[^>]*?)?>\s*?<\/\1>/ig;
        //     formFieldValues[k] = formFieldValues[k].trim();
        //     while (reg.test(formFieldValues[k])) {
        //         result = formFieldValues[k].replace(reg, "").replace(/(\r\n)|(\n)/g, '');
        //     }
        //     result = result.replace(/\s+/g, "").length
      }
    }


    // for (let k in formFieldValues) {
    //   if (typeof formFieldValues[k] === 'string' && !formFieldValues[k].length) {
    //     if (k === 'content') {
    //       result = formFieldValues[k].replace(/<[^>]+>/g, "").length
    //     } else {
    //       return !1
    //     }
    //   }
    // }

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
    const { formFieldValues } = { ...this.state }
    if (!this.checkVaildate()) return message.error('请填写完整！');

    this.setState({
      formFieldValues: { ...formFieldValues, ...tempStatus },
      isSave: btnType === 'save' ? true : this.state.isSave,
      isRequest: true
    }, () => {
      debugger
      console.log(this.state.formFieldValues)
      Http.post('updateNews', { ...this.state.formFieldValues, 'oldStatus': formFieldValues.status }, (callback) => {
        console.log('submit-callback=====', callback)
        if (callback['success']) {
          message.success('操作成功')
          // history.go(0);
          this.props.cancel(false);
          this.props.refurbish();
        } else if (callback && callback['status']) {
          location.href = callback['location'] + "?_t=" + (new Date()).getMilliseconds();
        } else {
          message.error(`${callback['errMsg']}，请重试！`)
          this.setState({ isRequest: false })
        }
      })

    })



  }


  goBack() {
    let { formFieldValues } = { ...this.state };
    formFieldValues['contentType'] = 0;
    formFieldValues['content'] = "";
    formFieldValues['thirdPartLink'] = "";
    formFieldValues['sort'] = "";
    formFieldValues['isShow'] = 0;
    formFieldValues['isFullpush'] = 0;

    this.setState({
      next: false,
      formFieldValues: { ...formFieldValues },
      fileList: []
    })
  }


  handleRemove() {
    const { formFieldValues } = { ...this.state }
    this.setState({
      formFieldValues: { ...formFieldValues, titleImage: '' },
      fileList: []
    })
  }

  imgsloadChange = (i, info) => {
    const { imgsFileList, imgArr } = { ...this.state }
    const { fileList } = info
    const status = info.file.status
    let imgURLAsArr = ""
    imgArr[i]['status'] = 'loading'
    if (status === 'done') {
      console.log('fileupload-done====', fileList)
      fileList.map((item, index) => {
        if (item['response']['status'] == '302') {
          window.top.location.href = item['response']['location'];
        }
        imgURLAsArr = item['response']['data']

      })

      imgArr[i]['url'] = imgURLAsArr;
      this.setState({
        imgArr
      }, () => {
        console.log('handleUploadChange===', this.state.imgArr)
      })

    }

    imgsFileList['imgsFileList' + i] = fileList;
    this.setState({ imgsFileList })

  }

  imgsRemove(i, file) {
    const { imgsFileList, imgArr } = { ...this.state }
    delete imgsFileList['imgsFileList' + 1]
    imgArr[i]['url'] = '';
    this.setState({ imgsFileList, imgArr })
  }


  vedioUploadChange(info) {
    const { fileList } = info
    const status = info.file.status
    let imgURLAsArr = ""

    if (status === 'done') {
      fileList.map((item, index) => {
        if (item['response']['status'] == '302') {
          window.top.location.href = item['response']['location'];
        }
        imgURLAsArr = item['response']['data']
      })

      this.setState({
        formFieldValues: { ...this.state.formFieldValues, ...{ content: imgURLAsArr } }
      }, () => {
        console.log('handleUploadChange===', this.state.formFieldValues)
      })
    }
    this.setState({ fileListVedio: fileList })

  }

  render() {
    const { onContentTypeChange, handlePreview, onPreviewPhoneChange, onInputChange, onRichChange, handleSubmit, } = this
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form
    const { previewVisible, previewImage, fileList, imgArr, formFieldValues, richOpt, editDiff, hasValidate, next, disabled, type, fileListVedio } = this.state
    const { findOfficialUser } = { ...this.props }

    const { contentType } = formFieldValues
    const uploadUrl = UPLOAD_IMAGE_PATH;
    //setFieldsValue({fileList})
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">添加</div>
      </div>
    );

    console.log('111111', imgArr)
    console.log('222222', this.state.imgsFileList.imgsFileList0)
    // debugger;
    // 图片模板
    const ImgTemplate = (
      <div>
        {imgArr.map((k, index) => {
          return (
            <FormItem
              {...formItemRichText}
              key={index}
            >
              <Row gutter={24} style={{ border: '1px solid #ccc', padding: '5px 0', borderRadius: '5px', position: 'relative' }}>
                <Col span={5} >
                  <Upload
                    action={uploadUrl}
                    listType="picture-card"
                    multiple={false}
                    fileList={[this.state.imgsFileList['imgsFileList' + index]]}
                    onChange={this.imgsloadChange.bind(this, index)}
                    onRemove={this.imgsRemove.bind(this, index)}
                    showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                  >
                    {k['url'].length >= 1 || k['status'].length >= 1 ? null : uploadButton}
                  </Upload>

                </Col>
                <Col span={19}>
                  {getFieldDecorator(`names[${index}]`, {
                    initialValue: k['summary'],
                  })(
                    <TextArea disabled={disabled} maxLength={100} autosize={{ minRows: 3, maxRows: 3 }} placeholder="图片描述" style={{ width: '100%', }} onChange={e => onPreviewPhoneChange(e.target.value, index)} />
                  )}
                  {imgArr.length > 0 ? (
                    <Button style={{ width: '20%', float: 'right', marginTop: '5px' }}
                      icon='delete'
                      disabled={index < imgArr.length - 1 || index === 0 || disabled}
                      onClick={() => this.removeMobile(index)}
                    >移除</Button>
                  ) : null}
                </Col>
              </Row>
            </FormItem>
          );
        })}
        <FormItem {...formItemRichText}>
          <Button type="dashed" onClick={this.addMobile.bind(this, imgArr.length)} style={{ width: '100%' }}>
            {/* <Button type="dashed" disabled={imgArr.length >= 9} onClick={this.addMobile.bind(this, imgArr.length)} style={{ width: '100%' }}> */}
            <Icon type="plus" /> 点击添加
                  </Button>
        </FormItem>
      </div>
    )
    return (
      <div className='wrap' style={{ 'padding': '12px' }}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="资讯标题"
          >
            {getFieldDecorator('title', {
              initialValue: formFieldValues['title'],
              rules: [{ required: true, whitespace: true, message: '请填写标题！' }]

            })(
              <Input maxLength={100} disabled={disabled} onChange={onInputChange.bind(this, 'title')} />
            )}
          </FormItem>



          <FormItem
            {...formItemLayout}
            label="发布号"
          >

            {getFieldDecorator('userId', {
              initialValue: formFieldValues['name'],
              rules: [
                { required: true, message: '请选择发布号！' },
              ],
            })(
              // <Input disabled={disabled} onChange={onInputChange.bind(this, 'userId')} />
              <TreeSelect
                disabled={disabled}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择"
                showSearch
                value={formFieldValues.userId}
                filterTreeNode={(i, t) => {
                  if (t.props.title.indexOf(i) != -1) {
                    return t
                  }
                }}
                onChange={e => { this.setState({ formFieldValues: { ...formFieldValues, userId: e } }) }}
              >
                {findOfficialUser.map((e, i) => {
                  return (
                    <TreeNode key={i} title={e.nickName} ch value={e.saicUserId} />
                  )
                })}

              </TreeSelect>
            )}
          </FormItem>

          {next && contentType != 2
            ? <FormItem
              {...formItemLayout}
              label={<span className="required">主题图片</span>}
            >
              <Upload
                action={uploadUrl}
                listType="picture-card"
                multiple={false}
                fileList={fileList}
                onChange={this.handleUploadChange.bind(this)}
                onRemove={this.handleRemove.bind(this)}
                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              <span style={{ color: 'red' }}>* 请设置图片宽高比例 350:180(像素)</span>
              <div style={{ color: '#f5222d', display: hasValidate['isUploadValidate'] ? 'none' : 'block' }}>请添加主题图片！</div>
            </FormItem>
            : ""}


          {next && (contentType == 1 || contentType == 3)
            ? <FormItem
              {...formItemLayout}
              label="内容概要"
            >
              {getFieldDecorator('newsSummary', {
                initialValue: formFieldValues['newsSummary'],
                rules: [{ required: true, whitespace: true, message: '请填写内容概要！' }],
              })(
                <TextArea maxLength={30} autosize={{ minRows: 4, maxRows: 4 }} onChange={onInputChange.bind(this, 'newsSummary')} />
              )}
            </FormItem>
            : ""}

          <FormItem
            {...formItemLayout}
            label={<span className="required">资讯模板</span>}
          >
            <div>
              <Radio disabled={disabled} name="contentType" value={1} checked={contentType === 1 ? true : false} onChange={onContentTypeChange}>图文</Radio>
              <Radio disabled={disabled} name="contentType" value={3} checked={contentType === 3 ? true : false} onChange={onContentTypeChange}>图片</Radio>
              <Radio disabled={disabled} name="contentType" value={4} checked={contentType === 4 ? true : false} onChange={onContentTypeChange}>视频</Radio>
              {/* <Radio disabled={disabled} name="contentType" value={2} checked={contentType === 2 ? true : false} onChange={onContentTypeChange}>第三方模块</Radio> */}
            </div>
          </FormItem>


          {next && contentType == 4
            ? <FormItem
              {...formItemLayout}
              // label={<span className="required"></span>}
              label={<span>上传视频</span>}
            >
              <Upload
                action={uploadUrl}
                listType="text"
                multiple={false}
                fileList={fileListVedio}
                onChange={this.vedioUploadChange.bind(this)}
                onRemove={() => { this.setState({ fileListVedio: [] }) }}
                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
              >
                {fileListVedio.length >= 1
                  ? null
                  : <Button>
                    <Icon type="upload" /> 选择视频
                                    </Button>}

              </Upload>
              <span style={{ color: 'red' }}>* 请上传50MB以内的视频文件！</span>

              <div>
                <video id="player" style={{ width: '100%' }} controls crossorigin playsinline poster={require('../../../components/Preview/images/ViewFrom.png')}>
                  <source src={formFieldValues.content} type="video/mp4" />
                </video>
              </div>
              {getFieldDecorator('newsSummary', {
                rules: [{ required: true, whitespace: true, }],
              })(
                <TextArea maxLength={30} autosize={{ minRows: 4, maxRows: 4 }} onChange={onInputChange.bind(this, 'newsSummary')} />
              )}
            </FormItem>
            : ""}



          {next && contentType === 1
            ? <FormItem {...formItemRichText}>
              <RichText
                richOpt={richOpt}
                defaultValue={formFieldValues.content}
                result={formFieldValues.content}
                onChange={onRichChange.bind(this)}>
              </RichText>
              <div style={{ color: '#f5222d', display: hasValidate['isContentValidate'] ? 'none' : 'block' }}>请填写富文本！</div>
            </FormItem>
            : ""
          }

          {next && contentType === 2
            ? <FormItem {...formItemLink} >
              <Input disabled={disabled} name="thirdPartLink" placeholder="请输入链接地址" onChange={onInputChange.bind(this, 'thirdPartLink')} />
              <div style={{ color: '#f5222d', display: hasValidate['isThirdPartLinkValidate'] ? 'none' : 'block' }}>请填写第三方链接！</div>
            </FormItem>
            : ""
          }

          {/* 图片模板 */}
          {next && contentType == 3
            ? ImgTemplate
            : ''}

          {next && contentType != 2
            ? <FormItem {...formItemLink}>
              <Checkbox disabled={disabled} defaultChecked={formFieldValues['isFullpush']} onChange={e => { this.setState({ formFieldValues: { ...this.state.formFieldValues, isFullpush: e.target.checked ? 1 : 0 } }) }}>全站推送</Checkbox>
              <Checkbox disabled={disabled} defaultChecked={formFieldValues['isShow']} onChange={e => { this.setState({ formFieldValues: { ...this.state.formFieldValues, isShow: e.target.checked ? 1 : 0 } }) }}>是否显示</Checkbox>
            </FormItem>
            : ""
          }


          {next && contentType != 2
            ? <FormItem {...formItemLink}>
              <span style={{ marginRight: "20px" }}>排序</span>
              <Select
                disabled={disabled}
                defaultValue={formFieldValues['sort']}
                style={{ display: 'inline-block', width: '80px' }}
                onChange={v => { this.setState({ formFieldValues: { ...this.state.formFieldValues, sort: v } }) }}>
                {orderChildren}
                {/* <Option value={0} key={0}>无排序需求</Option>
                <Option value={1} key={1}>排序需求</Option> */}
              </Select>
            </FormItem>
            : ""
          }

          <div>
            {/* <div dangerouslySetInnerHTML={{ __html: this.genQRCodeWithUrl() }}></div> */}
          </div>




          <div style={{ textAlign: "right" }}>
            <Button type="default" disabled={this.state.isRequest} htmlType="button" style={{ marginLeft: 8, float: "left", display: type == 'edit' && next && contentType ? 'inline-block' : 'none' }} onClick={this.goBack.bind(this)}>上一步</Button>
            <Button type="default" disabled={this.state.isRequest} htmlType="button" style={{ marginLeft: 8 }} onClick={() => { this.props.cancel(false) }}>取消</Button>
            {type === 'edit'
              ? <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="save" style={{ marginLeft: 8, display: next && contentType && formFieldValues['status'] == 1001 ? 'inline-block' : 'none' }} onClick={handleSubmit.bind(this, 'save')}>保存</Button>
              : ""}

            <Button type="default" disabled={this.state.isRequest} htmlType="button" icon="search" style={{ marginLeft: 8, display: next && contentType ? 'inline-block' : 'none' }} onClick={() => { this.setState({ drShow: true }) }}>预览</Button>

            {type === 'edit'
              ? <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="export" style={{ marginLeft: 8, display: next && contentType ? 'inline-block' : 'none' }} onClick={handleSubmit.bind(this, 'pub')}>发布</Button>
              : ""}
            <Button type="primary" disabled={this.state.isRequest} htmlType="button" style={{ marginLeft: 8, display: !next ? 'inline-block' : 'none' }} onClick={() => { this.setState({ next: contentType ? true : false }) }}>下一步</Button>
          </div>
        </Form>

        {this.state.drShow
          ? <Modal
            width={600}
            visible={this.state.drShow}
            onCancel={() => { this.setState({ drShow: false }) }}
            onOk={() => { this.setState({ drShow: false }) }}
            footer={null}
          >
            <Preview type={formFieldValues.contentType == 1 ? 'Default' : (formFieldValues.contentType == 3 ? 'NewsImg' : (formFieldValues.contentType == 4 ? 'NewsVedio' : ''))} data={formFieldValues} />
          </Modal>
          : ""
        }

        {/* 图片预览 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleUploadCancel}>
          <img alt="uploadimage" style={{ width: '100%' }} src={previewImage} />
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