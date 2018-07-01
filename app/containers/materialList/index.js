
import React from 'react';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http';
import PropTypes from 'prop-types';
import moment from 'moment';
import './style/info.scss';
import { Form, Row, Col, TreeSelect, Input, Select, DatePicker, TimePicker, Button, message, Table, Icon, Divider, Dropdown, Popconfirm, Modal } from 'antd';
import history from '../../utils/history';
import Store from 'store';
import DMCUtil from '../../utils/DMCUtil'
import { SERVER_BASE_PATH } from '../../global.config';
import Add from './components/material'
message.config({
  top: 400,
  duration: 2,
})

const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const { TextArea } = Input;

const title = '资讯管理';


const apis = [
  { "id": "mediaList", "url": "material/materialList" },
  { "id": "deleteNews", "url": "community/news/web/deleteNews", "format": false },
  { "id": "previewReady", "url": "template/preview/ready" },
  { "id": "sendNews", "url": "sendNews/send", "format": false },


];
const Authorization = DMCUtil.getJWTFromCookie()
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

const formItemLayout = {
  labelCol: {
    xs: { span: 22 },

    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 26 },

    sm: { span: 18 },
  },
};


class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
      columns: [
        {
          title: '创建时间',
          dataIndex: 'updateDate',
          key: 'updateDate',
          // fixed: 'left',
        },
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          render: (text, record) => {
            return (
              <span onClick={() => { this.setState({ action: 'edit', currentData: record, eitShow: true }) }}>{text}</span>
            )
          }
        },
        {
          title: '资源地址',
          dataIndex: 'url',
          key: 'url',
        },
        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 80,
          render: (text, record) => {
            const { onAction } = this
            return (
              <a onClick={this.groupHair.bind(this, record)}>群发</a>
            )
          },
        },

      ],
      dataList: [],
      pagination: {
        size: 'small',
        showSizeChanger: true,
        onShowSizeChange: (current, size) => {
          console.log('ddd', current)
          console.log('aaaaa', size)
        },
        showQuickJumper: true,
      },
      formFieldValues: {
        "type": "news",
        "pageSize": 10,
        "pageNum": 1,
        // type: "",
        // limit: 10,
        // page: 1
      },
      selectedDate: '',
      selectedRowKeys: [],
      loading: false,
      QRcodeShow: false,
      previewUrl: '',
      addShow: false,
      eitShow: false,
      action: '',
      currentData: {},
      drShow: false,
      previewData: {},
      messageShow: false,
      groupShow: false,
      groupValues: {},
    }

  };

  openDetail(e, type) {
    if (type === 'detail') {

    }
  }

  goto = (url) => {
    history.push(url);
  }

  getDataList = (param = {}) => {
    const params = { ...this.state.formFieldValues, ...param }
    // params['publishDate'] = params['publishDate'] ? moment(params['publishDate']).format('YYYY-MM-DD') : params['publishDate'];
    for (let k in params) {
      if ((params[k] == null) || (typeof params[k] === 'string' && !params[k].length)) {
        delete params[k]
      }
    }

    this.setState({ loading: true });
    console.log(JSON.stringify(params))
    Http.get('mediaList', params, callback => {
      // const callback = { "total": 167, "rows": [{ "limit": 10, "page": 1, "releaseNumber": 1, "orderName": null, "orderType": null, "id": 94, "labelId": null, "title": "晚间新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 4, "shareNumber": null, "browseNumber": 86, "commentNumber": 40, "contentType": 1, "previewPhone": null, "newsUrl": 'http://www.baidu.com', "releaseDate": "2018-03-08 15:40", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 8, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 95, "labelId": null, "title": "卖车喽!", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 5, "shareNumber": null, "browseNumber": 18, "commentNumber": 8, "contentType": null, "previewPhone": null, "newsUrl": "", "releaseDate": "2018-04-25 14:30", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 2, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 96, "labelId": null, "title": "卖车喽!", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 6, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": "", "releaseDate": "2018-04-25 14:31", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 3, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 97, "labelId": null, "title": "新闻测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 8, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 4, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 98, "labelId": null, "title": "新闻测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 10, "commentNumber": 2, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-09 03:23", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 5, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 99, "labelId": null, "title": "标题字数过多展示测试测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 33, "commentNumber": 2, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-09 03:31", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 6, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 100, "labelId": null, "title": "今天测试下发布新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 44, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 7, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 101, "labelId": null, "title": "今天测试下发布新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 55, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 8, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 104, "labelId": null, "title": "新闻新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 66, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-13 07:36", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 9, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 105, "labelId": null, "title": "新闻新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1002, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 77, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-13 07:36", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 10, "createBy": 1 }] }
      const pagination = { ...this.state.pagination };
      if (callback && callback['rows']) {
        pagination.total = Number(callback['total']) || 0;
        let dataList = callback['rows'];
        dataList.forEach((item, index) => {
          item.title = item.title && item.title.length > 12 ? item.title.slice(0, 12) + '……' : item.title;
        })
        this.setState({
          loading: false,
          dataList,
          pagination
        })
      } else if (callback && callback['status']) {
        debugger;
        location.href = callback['location'] + "?_t=" + (new Date()).getMilliseconds();
      }

    })
  }

  handleSubmit (){
    let { openIdList } = { ...this.state.groupValues }
    if (!openIdList || !openIdList.length) return message.error('请输入OPENID！');
    openIdList = openIdList.replace(/<\/?.+?>/g, ',');
    openIdList = openIdList.replace(/[\r\n]/g, ',');
    openIdList = openIdList.replace(/，/g, ',');
    openIdList = openIdList.replace(/,,|,,,|,,,,|,,,,,|,,,,,,/g, ',');
    openIdList = openIdList.split(',');
    if (openIdList.length < 2) return message.error('请至少输入两个OPENID！')

    let dataUp = [{
      openIdList,
      mediaId: this.state.groupValues.mediaId
    }]
    console.log(dataUp)
    Http.post('sendNews', dataUp, (callback) => {
      // console.log(this.state.formFieldValues);
      if (callback&&callback['resultCode'] == 200) {
        message.success('操作成功')
        this.setState({ groupShow: false, groupValues: {} })
      } else {
        console.log(callback);
        message.error(callback?`${callback['errMsg']}，请重试！`:'后台接口异常');
        this.setState({ groupShow: false })
      }
    })




  }


  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination, ...pagination };
    const formFieldValues = { ...{}, ...this.state.formFieldValues }
    pager.current = pagination.current;

    formFieldValues['pageSize'] = pager.pageSize;
    formFieldValues['pageNum'] = pager.current;
    this.setState({
      pagination: pager,
      formFieldValues
    }, () => {
      this.getDataList();
    });
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.getDataList();
  }

  groupHair(r) {
    this.setState({
      groupShow: true,
      groupValues: { mediaId: r.mediaId }

    })
  }



  /**
   * 普通输入框，下拉框的值处理
   */
  onInputChange = (field, event) => {

    const isSelectTarget = !Object.hasOwnProperty.call(event, 'target')
    const value = isSelectTarget ? event : event.target.value
    const tempState = {}
    tempState[field] = value


    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...tempState }
    }, () => {
      console.log('onInputChange.formFieldValues=====', this.state.formFieldValues)
    })
  }

  groupChange(field, event) {
    const isSelectTarget = !Object.hasOwnProperty.call(event, 'target')
    const value = isSelectTarget ? event : event.target.value
    const tempState = {}
    tempState[field] = value
    this.setState({
      groupValues: { ...this.state.groupValues, ...tempState }
    }, () => {
      console.log('onInputChange.formFieldValues=====', this.state.formFieldValues)
    })
  }




  handleSearch = () => {
    const params = { limit: 10, page: 1 }
    this.getDataList(params);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      selectedDate: null,
      formFieldValues: { page: 1, limit: 10, id: "", type: "" }
    }, () => {
      console.log('reset.formFieldValues=====', this.state.formFieldValues)
    })
    this.handleSearch()
  }

  handlePreview = (record) => {
    const _this = this;
    const query = {
      businessType: record.businessType,
      businessId: record.businessId
    }

  }

  handleDelete = (record) => {
    const _this = this;
    let dataList = JSON.stringify(this.state.dataList);
    dataList = JSON.parse(dataList);
    // dataList.forEach((item, index) => {
    //   if (record.id == item.id) {
    //     dataList.splice(index, 1)
    //   }
    // })

    // 1004 新闻资讯
    // 1003 报名活动
    Http.post("deleteNews", { status: 1002, id: record.id }, (res) => {
      if (res && res.resultCode == 200) {
        history.go(0);
      } else if (res && res['status']) {
        location.href = res['location'] + "?_t=" + (new Date()).getMilliseconds();
      }
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
   * 选择发布时间时触发
   */
  onPublishDateChange = (dateAsMoment, dateAsStr) => {
    this.setState({
      selectedDate: dateAsMoment,
      formFieldValues: { ...this.state.formFieldValues, ...{ startDate: dateAsStr[0] + ":00", endDate: dateAsStr[1] + ":00" } }
    }, () => {
      console.log('onPublishDateChange.formFieldValues====', this.state.formFieldValues)
    })
  }

  /**
   * 内容太多，跳转新增界面😂
   */
  handleAdd = ({ item, key, keyPath }) => {
    let pathMap = { 1: './act/edit', 2: './news/edit' }
    this.goto(pathMap[key]);
  }

  /**
   * 列表页面操作分发方法
   */
  onAction = (type, record) => {
    const { handleReset, handleSearch, handlePreview, handleDelete } = this;
    console.log('onAction---->', type)
    switch (type) {
      case 'search':
        handleSearch()
        break;
      case 'reset':
        handleReset()
        break;
      case 'preview':
        handlePreview(record)
        break;
      case 'edit':
        break;
      case 'detail':
        break;
      case 'delete':
        handleDelete(record)
        break;
      default:
        break;
    }
  }


  render() {
    const { onDealerCodeChange, onInputChange, onPublishDateChange, onAction, handleAdd } = this
    const { getFieldDecorator } = this.props.form;
    const { dataList, columns, formFieldValues, groupChange } = this.state;
    return (
      <div className="wrap" style={{ 'padding': '5px' }}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={title} />
        </Helmet>
        <Form layout={'inline'} className='ant-search-form'>
          {/* <Row gutter={24}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`ID`} style={{ width: '100%' }}>
                <Input value={formFieldValues.title} onChange={onInputChange.bind(this, 'id')} />
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem {...formItemLayout} label={`类型`} style={{ width: '100%' }}>
                <Select value={formFieldValues.type} onChange={onInputChange.bind(this, 'type')} >
                  <Option value={""}>全部</Option>
                  <Option value={1}>文本</Option>
                  <Option value={2}>图文</Option>
                  <Option value={3}>语音</Option>
                  <Option value={4}>图片</Option>
                  <Option value={5}>视频</Option>
                </Select>
              </FormItem>
            </Col>

          </Row> */}
          {/* <Row>
            <Col span={24} style={{ textAlign: 'right', paddingTop: '5px' }}>
              <Button type="primary" htmlType="button" onClick={onAction.bind(this, 'search')}>查询</Button>
              <Button style={{ margin: '0 8px' }} onClick={onAction.bind(this, 'reset')}>重置</Button>
              <Button type="primary" htmlType="button" onClick={() => { this.setState({ addShow: true }) }}>新建</Button>
            </Col>
          </Row> */}
          {/* <Row>
            <Col span={24} style={{ textAlign: 'right', paddingTop: '5px' }}>
              <Button type="primary" htmlType="button" onClick={() => { this.setState({ addShow: true }) }}>新建</Button>
            </Col>
          </Row> */}
        </Form>

        <Table columns={columns}
          size="small"
          rowKey={record => Math.random(4) + 'uuid'}
          dataSource={this.state.dataList}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          scroll={{ x: 1900 }}
        />

        {/* 新增 */}
        {this.state.addShow
          ? <Modal
            width={800}
            maskClosable={false}
            form={this.props.form}
            style={{ zIndex: 999 }}
            visible={this.state.addShow}
            onCancel={() => { this.setState({ addShow: false }) }}
            onOk={() => { this.setState({ addShow: false }) }}
            footer={null}
          >
            <Add
              form={this.props.form}
              cancel={(e = false) => { this.setState({ addShow: e }) }}
              Ok={() => { this.setState({ addShow: false }); this.getDataList() }} />
          </Modal>
          : ""
        }
        {/* 查看 */}
        {this.state.eitShow
          ? <Modal
            width={800}
            maskClosable={false}
            form={this.props.form}
            visible={this.state.eitShow}
            onCancel={() => { this.setState({ eitShow: false }) }}
            onOk={() => { this.setState({ eitShow: false }) }}
            footer={null}
          >
            <div></div>
          </Modal>
          : ""}


        {/* 群发 */}
        {this.state.groupShow
          ? <Modal
            width={800}
            maskClosable={false}
            form={this.props.form}
            visible={this.state.groupShow}
            onCancel={() => { this.setState({ groupShow: false }) }}
            onOk={this.handleSubmit.bind(this)}
          >
            <div style={{ padding: '55px  60px 30px 0' }}>
              <Form layout={'inline'}>
                <FormItem
                  style={{ width: "100%" }}
                  {...formItemLayout}
                  label="群发OPENID:"
                >
                  {getFieldDecorator('openIdList', {
                    rules: [{ required: false, whitespace: true, }],
                  })(
                    <TextArea
                      autosize={{ minRows: 4, maxRows: 14 }}
                      onChange={this.groupChange.bind(this, 'openIdList')}
                      placeholder='请输入至少两个OPENID，用【逗号】或【回车符】进行分隔~' />
                  )}
                </FormItem>
              </Form>
            </div>
          </Modal>
          : ""}




        {/* 预览 */}
        {this.state.drShow
          ? <Modal
            title={'预览'}
            width={600}
            visible={this.state.drShow}
            form={this.props.form}
            onCancel={() => { this.setState({ drShow: false }) }}
            onOk={() => { this.setState({ drShow: false }) }}
            footer={null}
          >
            <div></div>
          </Modal>
          : ""
        }
        {this.state.messageShow
          ? <Modal
            title={'提示'}
            width={300}
            style={{ zIndex: 9999999999, top: '350px' }}
            maskClosable={false}
            visible={this.state.messageShow}
            form={this.props.form}
            onCancel={() => { this.setState({ messageShow: false }) }}
            onOk={() => { this.setState({ addShow: false, messageShow: false }) }}
          >
            {"未保存的数据将丢失，是否确认关闭当前页面？"}
          </Modal>
          : ""}

      </div>
    );
  };

}


const InfoWithForm = Form.create()(Info);

export default InfoWithForm;
