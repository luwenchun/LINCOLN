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
import Preview from '../../../components/Preview/index';

const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const orderChildren = [];

message.config({
    top: 400,
    duration: 2,
})
for (let i = 1; i <= 99; i++) {
    orderChildren.push(<Option value={i} key={i}>{i}</Option>)
}

let uuid = 0;
const apis = [
    { "id": "insertNews", "url": "community/news/insertNews", "format": false },
    { "id": "updateNews", "url": "community/news/updateNews", "format": false },
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
                "contentType": 0,
                // "labelName": "",
                // "newsSummary": "",
                // "previewPhone": "",
                "status": 0,
                "title": "",
                "titleImage": "",
                //"sort": "", 
                "isShow": 1,
                "isFullpush": 0,
                "newsSummary": '',
                "userId": null,
                "content": "",
            },
            hasValidate: { ...initValidates },
            editDiff: {
                editType: 'add'
            },
            isSave: false,
            isRequest: false,
            drShow: false,
            next: false,
            messageShow: false,
            message: "",
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
        if (event.target.value === 1) { //图文
            delete formFieldValues['thirdPartLink']
        } else if (event.target.value === 2) { // 第三方
            delete formFieldValues['thirdPartLink']
            delete formFieldValues['content']
        } else if (event.target.value === 3) { // 图片
            delete formFieldValues['thirdPartLink']
            delete formFieldValues['content']
        } else if (event.target.value === 4) { // 视频
            delete formFieldValues['thirdPartLink']
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
        const { formFieldValues } = this.state
        const { contentType } = formFieldValues
        let result = true

        for (let k in formFieldValues) {
            if (typeof formFieldValues[k] === 'string' && !formFieldValues[k].length) {
                if (k === 'content') {
                    result = formFieldValues[k].replace(/<[^>]+>/g, "").length
                } else {
                    result = false
                }
            }
        }
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
    cancelMsg() {
        this.setState({ messageShow: false });
        // return this.props.cancel(false);
    }

    confirmMsg() {
        const { btnType } = { ...this.state }
        const _this = this;
        if (this.state.isRequest) return !1;
        const { validateFieldsAndScroll } = this.props.form
        const statusMap = { save: 1001, pub: 1004 }
        const tempStatus = { status: statusMap[btnType || 'save'] }

        this.setState({
            formFieldValues: { ...this.state.formFieldValues, ...tempStatus },
            isSave: btnType === 'save' ? true : this.state.isSave,
            isRequest: true
        }, () => {
            console.log(JSON.stringify(this.state.formFieldValues))
            Http.post('insertNews', { ...this.state.formFieldValues }, (callback) => {
                console.log('submit-callback=====', callback)
                if (callback['success']) {
                    message.success('操作成功')
                    // history.go(0);
                    _this.setState({ messageShow: false });
                    _this.props.cancel();
                    _this.props.refurbish();
                } else if (callback && callback['status']) {
                    location.href = callback['location'] + "?_t=" + (new Date()).getMilliseconds();
                } else {
                    message.error(`${callback['errMsg']}，请重试！`)
                    this.setState({ isRequest: false })
                }
            })
        })
    }

    handleSubmit = (btnType) => {
        if (!this.checkVaildate()) return message.error('请填写完整！');
        if (btnType == 'pub') {
            const message = '发布后用户将直接读到发布内容，是否确认发布？';
            this.setState({ message, messageShow: true, btnType })
        } else {
            debugger;
            this.confirmMsg();
        }


    }


    goBack() {
        let { formFieldValues } = { ...this.state };
        formFieldValues['contentType'] = 0;
        formFieldValues['content'] = "";
        formFieldValues['thirdPartLink'] = "";
        // formFieldValues['sort'] = "";
        formFieldValues['isShow'] = 1;
        formFieldValues['isFullpush'] = 0;

        this.setState({
            next: false,
            formFieldValues: { ...formFieldValues },
            fileList: []
        })
    }

    cotrlPreview() {
        const v = { ...this.state.formFieldValues };
        const check = v.contentType == 1 && v.userId && v.title.length && v.content && v.content.length && v.titleImage.length;
        if (check) {
            this.setState({ drShow: true })
        } else {
            message.error(`请选择图文模式,并填写完整后再预览！`)
        }
    }

    cotrlNext() {
        const { contentType, title, userId } = { ...this.state.formFieldValues }
        // if (!title.length) return message.error('请填写标题！');
        // if (!userId) return message.error('请选择发布号！');
        if (!contentType) return message.error('请选择资讯模板！');
        this.setState({ next: contentType ? true : false })
    }

    render() {
        const { onContentTypeChange, handlePreview, onPreviewPhoneChange, onInputChange, onRichChange, handleSubmit, } = this
        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form
        const { previewVisible, previewImage, fileList, formFieldValues, richOpt, editDiff, hasValidate, next } = this.state
        const { findOfficialUser } = { ...this.props }
        console.info('render-hasValidate---->', hasValidate.isContentValidate)

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

        // 图片模板
        const ImgTemplate = (
            <div>
                {keys.map((k, index) => {
                    return (
                        <FormItem
                            {...formItemRichText}
                            key={k}
                        >
                            <Row gutter={24} style={{ border: '1px solid #ccc', padding: '5px 0', borderRadius: '5px',position:'relative' }}>
                                <Col span={19}>
                                
                                    {getFieldDecorator(`names[${k}]`)(
                                        <TextArea maxLength={30} autosize={{ minRows: 4, maxRows: 4 }} placeholder="图片描述" style={{ width: '100%', }} onChange={onPreviewPhoneChange.bind(this, k)} />
                                    )}
                                </Col>
                                <Col span={5} style={{ position: 'absolute' ,right:'5px', bottom:'5px'}}>
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
                })}
                <FormItem {...formItemRichText}>
                    <Button type="dashed" onClick={this.addMobile} style={{ width: '100%' }}>
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
                            rules: [{ required: true, message: '请填写标题！' }],
                        })(
                            <Input maxLength={100} onChange={onInputChange.bind(this, 'title')} />
                        )}
                    </FormItem>



                    <FormItem
                        {...formItemLayout}
                        label="发布号"
                    >

                        {getFieldDecorator('userId', {
                            rules: [
                                { required: true, message: '请选输入发布号！' },
                            ],
                        })(
                            // <Input onChange={onInputChange.bind(this, 'releaseNumber')} />
                            <TreeSelect
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="请选择"
                                allowClear
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

                    {next && contentType === 1
                        ? <FormItem
                            {...formItemLayout}
                            label={<span className="required">主题图片</span>}
                        >
                            <Upload
                                action={uploadUrl}
                                listType="picture-card"
                                multiple={false}
                                supportServerRender={true}
                                onPreview={this.handleUploadPreview}
                                onChange={this.handleUploadChange}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                            <span style={{ color: 'red' }}>* 请设置图片宽高比例 290:180(像素)</span>
                            <div style={{ color: '#f5222d', display: hasValidate['isUploadValidate'] ? 'none' : 'block' }}>请添加主题图片！</div>
                        </FormItem>
                        : ""}

                    {next && contentType === 1
                        ? <FormItem
                            {...formItemLayout}
                            label="内容概要"
                        >
                            {getFieldDecorator('newsSummary', {
                                rules: [{ required: true, whitespace: true, }],
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
                            <Radio name="contentType" value={1} checked={contentType === 1 ? true : false} onChange={onContentTypeChange}>图文</Radio>
                            <Radio name="contentType" value={3} checked={contentType === 3 ? true : false} onChange={onContentTypeChange}>图片</Radio>
                            <Radio name="contentType" value={4} checked={contentType === 4 ? true : false} onChange={onContentTypeChange}>视频</Radio>
                            {/* <Radio name="contentType" value={2} checked={contentType === 2 ? true : false} onChange={onContentTypeChange}>第三方模块</Radio> */}
                        </div>
                    </FormItem>

                    {/* 富文本 */}
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


                    {/* 第三方模块 */}
                    {next && contentType === 2
                        ? <FormItem {...formItemLink} >
                            <Input name="thirdPartLink" placeholder="请输入链接地址" onChange={onInputChange.bind(this, 'thirdPartLink')} />
                            <div style={{ color: '#f5222d', display: hasValidate['isThirdPartLinkValidate'] ? 'none' : 'block' }}>请填写第三方链接！</div>
                        </FormItem>
                        : ""
                    }


                    {/* 图片模板 */}
                    {next && contentType == 3
                        ? ImgTemplate
                        : ''}

                    {/* 全站推送/是否显示 */}
                    {next && contentType != 2
                        ? <FormItem {...formItemLink}>
                            <Checkbox defaultChecked={formFieldValues['isFullpush']} onChange={e => { this.setState({ formFieldValues: { ...formFieldValues, isFullpush: e.target.checked ? 1 : 0 } }) }}>全站推送</Checkbox>
                            <Checkbox defaultChecked={formFieldValues['isShow']} onChange={e => { this.setState({ formFieldValues: { ...formFieldValues, isShow: e.target.checked ? 1 : 0 } }) }}>是否显示</Checkbox>
                        </FormItem>
                        : ""
                    }

                    {/* 排序 */}
                    {next && contentType != 2
                        ? <FormItem {...formItemLink}>
                            <span style={{ marginRight: "20px" }}>排序</span>
                            <Select
                                // defaultValue={}
                                style={{ display: 'inline-block', width: '80px' }}
                                onChange={v => { this.setState({ formFieldValues: { ...this.state.formFieldValues, sort: v } }) }}>
                                {orderChildren}
                                {/* <Option value={0} key={0}>无排序需求</Option>
                                <Option value={1} key={1}>排序需求</Option> */}
                            </Select>
                        </FormItem>
                        : ""
                    }



                    {/* <FormItem
            {...formItemLayout}
            label={<span className="required">主题图片</span>}
          >
            <Upload
              action={uploadUrl}
              listType="picture-card"
              multiple={true}
              supportServerRender={true}
              onPreview={this.handleUploadPreview}
              onChange={this.handleUploadChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <span style={{ color: 'red' }}>* 请设置图片宽高比例 290:180(像素)</span>
            <div style={{ color: '#f5222d', display: hasValidate['isUploadValidate'] ? 'none' : 'block' }}>请添加主题图片！</div>
          </FormItem>


          <FormItem
            {...formItemLayout}
            label="可预览手机号"
          >
            {formItems}
            <Button type="dashed" onClick={this.addMobile} style={{ width: '100%' }}>
              <Icon type="plus" /> 点击添加
              </Button>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="内容概要"
          >
            {getFieldDecorator('newsSummary', {
              rules: [{ required: false, whitespace: true, }],
            })(
              <TextArea autosize={{ minRows: 4, maxRows: 4 }} onChange={onInputChange.bind(this, 'newsSummary')} />
            )}
          </FormItem> */}


                    <div>
                        {/* <div dangerouslySetInnerHTML={{ __html: this.genQRCodeWithUrl() }}></div> */}
                    </div>


                    <div style={{ textAlign: "right" }}>
                        <Button type="default" disabled={this.state.isRequest} htmlType="button" style={{ marginLeft: 8, float: "left", display: next ? 'inline-block' : 'none' }} onClick={this.goBack.bind(this)}>上一步</Button>
                        <Button type="default" disabled={this.state.isRequest} htmlType="button" style={{ marginLeft: 8, display: next ? 'inline-block' : 'none' }} onClick={() => { this.props.onMsg() }}>取消</Button>
                        <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="save" style={{ marginLeft: 8, display: next ? 'inline-block' : 'none' }} onClick={handleSubmit.bind(this, 'save')}>保存</Button>
                        <Button type="default" disabled={this.state.isRequest} htmlType="button" icon="search" style={{ marginLeft: 8, display: next ? 'inline-block' : 'none' }} onClick={this.cotrlPreview.bind(this)}>预览</Button>
                        <Button type="primary" disabled={this.state.isRequest} htmlType="button" icon="export" style={{ marginLeft: 8, display: next ? 'inline-block' : 'none' }} onClick={handleSubmit.bind(this, 'pub')}>发布</Button>
                        <Button type="default" disabled={this.state.isRequest} htmlType="button" style={{ marginLeft: 8, display: !next ? 'inline-block' : 'none' }} onClick={() => { this.props.cancel(false) }}>取消</Button>
                        <Button type="primary" disabled={this.state.isRequest} htmlType="button" style={{ marginLeft: 8, display: !next ? 'inline-block' : 'none' }} onClick={this.cotrlNext.bind(this)}>下一步</Button>
                    </div>
                </Form>

                {this.state.drShow
                    ? <Modal
                        title={'预览'}
                        width={600}
                        visible={this.state.drShow}
                        onCancel={() => { this.setState({ drShow: false }) }}
                        onOk={() => { this.setState({ drShow: false }) }}
                        footer={null}
                    >
                        <Preview data={this.state.formFieldValues} />
                    </Modal>
                    : ""
                }

                {this.state.messageShow
                    ? <Modal
                        title={'提示'}
                        width={300}
                        style={{ top: '350px' }}
                        maskClosable={false}
                        visible={this.state.messageShow}
                        onCancel={this.cancelMsg.bind(this)}
                        onOk={this.confirmMsg.bind(this)}
                    >
                        {this.state.message}
                    </Modal>
                    : ""}







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