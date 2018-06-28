/**
 * 设置热点
 * 
 */
import React from 'react';
import moment from 'moment';
import Http from '../../utils/http';
import {
    Form, Select, InputNumber, Radio, DatePicker, Slider, Button, Upload, Icon, Rate, Input, Checkbox, Popconfirm,
    Row, Col, Modal, message, Table
} from 'antd'

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
};
const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD';
let newState = {}, title = '';

const apis = [
    { "id": "uploadFile", "url": "cmyManage/sys/uploadFile" },
    { "id": "addRecommend", "url": "cmyManage/recommend/web/addRecommend" },
    { "id": "delRecommend", "url": "cmyManage/recommend/web/delRecommend" },
    { "id": "addOrUpdateHotspot", "url": "cmyManage/hotspot/web/addOrUpdateHotspot", 'format': false },
    { "id": "delHotspot", "url": "cmyManage/hotspot/web/delHotspot" },
    { "id": "accusationList", "url": "community/accusation/searchPage" },
    { "id": "queryCommentList", "url": "community/comment/queryCommentList" },
];

Http.setDomainUrl("/fed/admin/api/");

Http.setMutiApi(apis);

const uploadUrl = "//carapptest.gtmc.com.cn/appweb/cmyManage/sys/uploadFile"


class Hot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hotShow: false,
            hotFileList: [],
            hotEditData: {
                businessId: props.params.businessId || 0,
                businessPic: props.params.businessPic || '',
                businessTitle: props.params.businessTitle || '',
                businessType: props.params.businessType || 0,
                endTime: props.params.endTime || '',
                startTime: props.params.startTime || '',
                hotOrder: 0
            }
        }
    }



    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.URL && nextProps.URL.length) {
        }
    }

    addEveHotspot() {
        const _this = this;
        const formFieldValues = { ...this.state.formFieldValues };
        formFieldValues['isHot'] = true;
        const hotEditData = { ...this.state.hotEditData };
        for (let k in hotEditData) {
            if (typeof hotEditData[k] === 'string' && !hotEditData[k].length) {
                return message.error('请填写完整！')
            }
        }

        Http.post('addOrUpdateHotspot', hotEditData, (res) => {
            if (res) {
                if (res.data == 1) {
                    _this.setState({ formFieldValues, setHotShow: false })
                    message.success('设置热点成功！');
                } else {
                    message.error('设置热点次数上限！');
                }
            }
        })
    }

    rmEveHotspot() {
        const _this = this;
        const formFieldValues = { ...this.state.formFieldValues };
        const query = {
            businessId: this.props.formFieldValues.id,
            businessType: this.props.query.businessType
        }

        formFieldValues['isHot'] = false;
        Http.post('delHotspot', query, (res) => {
            _this.setState({ formFieldValues, setHotShow: false })
            message.success('取消热点成功！');
        })
    }

    handleUploadPreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    hotUploadChange = (info) => {
        const { fileList } = info
        const status = info.file.status
        let imgURLAsArr = []

        if (status === 'done') {
            fileList.map((item, index) => {
                imgURLAsArr.push(item['response']['data'])
            })
            this.setState({
                hotEditData: { ...this.state.hotEditData, ...{ businessPic: imgURLAsArr.join(',') } }
            }, () => {
            })
        }
        this.setState({ hotFileList: fileList })
    }

    onHotDateChange = (dateAsMoment, dateAsStr) => {
        newState = { startTime: dateAsStr[0], endTime: dateAsStr[1] };
    }

    render() {
        const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
        const { params } = this.props;
        const { hotShow, hotEditData } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">添加</div>
            </div>
        );

        return (
            <div>
                {/* 设置编辑热点 */}
                <Modal
                    title={params.isHot ? '编辑热点' : "设置热点"}
                    width={700}
                    visible={hotShow}
                    onOk={() => { this.addEveHotspot() }}
                    cancelText={'取消'}
                    onCancel={() => { this.setState({ setHotShow: false }) }}>
                    <Row gutter={24} style={{ textAlign: 'right' }}>
                        {params.isHot
                            ? <Button type="primary" htmlType="button" onClick={this.rmEveHotspot.bind(this)}>取消热点</Button>
                            : ''}
                    </Row>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="热点标题"
                        >
                            {params.activityTitle}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="热点图片"
                        >
                            <Upload
                                action={uploadUrl}
                                listType="picture-card"
                                multiple={true}
                                fileList={this.state.hotFileList}
                                supportServerRender={true}
                                onPreview={this.handleUploadPreview}
                                onChange={this.hotUploadChange}
                            >
                                {this.state.hotFileList.length >= 1 ? null : uploadButton}
                            </Upload><span style={{ color: 'red' }}>* 请设置图片宽高比例 2.4 : 1</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="热点时间"
                        >
                            {getFieldDecorator('range-picker', { rules: [{ type: 'array', required: true, message: '请选择时间！' }] })(
                                <RangePicker style={{ width: '100%' }} onChange={this.onHotDateChange.bind(this)} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="显示序号"
                        >
                            <InputNumber width={80} onChange={v => { this.setState({ hotEditData: Object.assign({}, this.state.hotEditData, { hotOrder: v }) }) }} min={0} max={10} />
                        </FormItem>
                    </Form>
                </Modal>


            </div>
        )
    }

}


export default Hot;
// export default withStyles(s)(ActEdit);