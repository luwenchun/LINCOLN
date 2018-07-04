/**
 *咨询管理列表
 */

import React from 'react';
import Http from '../../utils/http';
import PropTypes from 'prop-types';
import moment from 'moment';
import './style/info.scss';
import { Form, Row, Col, Input, Select, DatePicker, TimePicker, Button, Table, Icon, Divider, Menu, Dropdown, Popconfirm, Modal } from 'antd';
import history from '../../utils/history';

import Store from 'store';
import DMCUtil from '../../utils/DMCUtil'
import QRcode from '../../components/common/QRCode';
import { SERVER_BASE_PATH } from '../../global.config';
import PushNews from './compontents/push';
import EditNews from './compontents/edit';

const { Column, ColumnGroup } = Table;
const FormItem = Form.Item;
const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;

const title = '资讯管理';


const apis = [
  { "id": "demoList", "url": "demo/list" },
  { "id": "infoList", "url": "community/infoWeb/page" },
  { "id": "ActivityDelete", "url": "community/activity/delete" },
  { "id": "NewsUpdateNews", "url": "community/news/updateNews" },
  { "id": "deleteNews", "url": "community/news/web/deleteNews" },
  { "id": "previewReady", "url": "template/preview/ready" },
  { "id": "queryListNews", "url": "/community/news/queryListNews" },

];
const Authorization = DMCUtil.getJWTFromCookie()
Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);

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


class Info extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
      columns: [
        {
          title: '排序',
          dataIndex: 'sort',
          width: 60,
          key: 'sort',
          fixed: 'left',
        },
        {
          title: '发布时间',
          dataIndex: 'releaseDate',
          width: 180,
          key: 'releaseDate',
          // fixed: 'left',
        },
        {
          title: '创建人',
          dataIndex: 'createBy',
          width: 220,
          key: 'createBy',
          // fixed: 'left',
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 200,
          key: 'title',
        },
        {
          title: '发布号',
          dataIndex: 'releaseNumber',
          width: 120,
          key: 'releaseNumber',
        },
        {
          title: '资讯情况',
          width: 120,
          key: 'hshsh',
          render: (text, record) => {
            return (
              <span>
                {record['browseNumber']},
                {record['commentNumber']},
                {record['praiseNumber']}
              </span>
            )
          }
        },
        {
          title: '链接',
          dataIndex: 'newsUrl',
          width: 200,
          key: 'newsUrl',
        },

        {
          title: '是否显示',
          dataIndex: 'isShow',
          width: 200,
          key: 'isShow',
        },

        {
          title: '操作',
          key: 'operation',
          fixed: 'right',
          width: 180,
          render: (text, record) => {
            const { onAction } = this
            return (
              <span>
                <a href="javascript:void(0)" onClick={() => { this.setState({ action: 'detail', currentData: record, eitShow: true }) }}>详情</a>

                {/* {record['status'] != 1002
                  ? <Divider type="vertical" />
                  : ""}
                {record['status'] != 1002
                  ? <a href="javascript:void(0)" onClick={onAction.bind(this, 'preview', record)}>预览</a>
                  : ""} */}

                {record['status'] == 1001
                  ? <Divider type="vertical" />
                  : ""}
                {record['status'] == 1001
                  ? <a href="javascript:void(0)" onClick={() => { this.setState({ action: 'edit', currentData: record, eitShow: true }) }}>编辑</a>
                  : ""}


                {record['status'] != 1002
                  ? <Divider type="vertical" />
                  : ""}

                {record['status'] != 1002
                  ?
                  // <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onConfirm={onAction.bind(this, 'delete', record)}>
                  <a href="javascript:void(0)">删除</a>
                  // </Popconfirm>
                  : ""}
              </span>
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

      },
      formFieldValues: {
        "activityType": "",
        "businessType": "",
        "limit": 10,
        "page": 1,
        "publishDate": null,
        "status": "",
        "title": "",
        "releaseNumber": '',
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
    }

  };

  openDetail(e, type) {
    if (type === 'detail') {

    }
  }

  goto = (url) => {
    console.log('history===', url, history)

    history.push(url);
  }

  getDataList = (param = {}) => {
    const params = { ...this.state.formFieldValues, ...param }
    for (let k in params) {
      if ((params[k] == null) || (typeof params[k] === 'string' && !params[k].length)) {
        delete params[k]
      }
    }

    this.setState({ loading: true });
    Http.post('queryListNews', params, callback => {
    // const callback = { "total": 167, "rows": [{ "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 94, "labelId": null, "title": "晚间新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 4, "shareNumber": null, "browseNumber": 86, "commentNumber": 40, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-08 15:40", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 1, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 95, "labelId": null, "title": "卖车喽!", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 5, "shareNumber": null, "browseNumber": 18, "commentNumber": 8, "contentType": null, "previewPhone": null, "newsUrl": "", "releaseDate": "2018-04-25 14:30", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 2, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 96, "labelId": null, "title": "卖车喽!", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 6, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": "", "releaseDate": "2018-04-25 14:31", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 3, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 97, "labelId": null, "title": "新闻测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 8, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 4, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 98, "labelId": null, "title": "新闻测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 10, "commentNumber": 2, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-09 03:23", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 5, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 99, "labelId": null, "title": "标题字数过多展示测试测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 33, "commentNumber": 2, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-09 03:31", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 6, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 100, "labelId": null, "title": "今天测试下发布新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 44, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 7, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 101, "labelId": null, "title": "今天测试下发布新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 55, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 8, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 104, "labelId": null, "title": "新闻新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 66, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-13 07:36", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 9, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 105, "labelId": null, "title": "新闻新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1002, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 77, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-13 07:36", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 10, "createBy": 1 }] }
    const pagination = { ...this.state.pagination };
    pagination.total = callback['total'] || 0;
    let dataList = callback['rows'];
    dataList.forEach((item, index) => {
      item.title = item.title && item.title.length > 12 ? item.title.slice(0, 12) + '……' : item.title;
    })
    this.setState({
      loading: false,
      dataList,
      pagination
    })
    })
  }



  handleTableChange = (pagination, filters, sorter) => {

    const pager = { ...this.state.pagination, ...pagination };
    const formFieldValues = { ...{}, ...this.state.formFieldValues }
    pager.current = pagination.current;

    formFieldValues['limit'] = pager.pageSize;
    formFieldValues['page'] = pager.current;
    formFieldValues['publishDate'] = this.state.selectedDate;
    this.setState({
      pagination: pager,
      formFieldValues
    }, () => {
      this.getDataList();
    });
  }


  componentDidMount() {

    this.getDataList();

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

  handleSearch = () => {
    const { selectedDate, formFieldValues } = this.state
    const params = { ...formFieldValues }
    params['publishDate'] = selectedDate

    this.getDataList(params);
  }

  handleReset = () => {

    this.setState({
      selectedDate: null
    })
    this.setState({
      formFieldValues: { ...this.state.formFieldValues }
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
    Http.get('previewReady', query, (res) => {
      if (res) {
        _this.setState({
          QRcodeShow: true,
          previewUrl: res.previewUrl
        })
      }
    })


  }

  handleDelete = (record) => {
    let dataList = Object.assign([], this.state.dataList);
    const _this = this;
    dataList.forEach((item, index) => {
      if (record.businessId === item.businessId) {
        dataList.splice(index, 1)
      }
    })

    let Url = Http.getApi("ActivityDelete");
    Url = Url.split('?')[0];
    Url += `?activityId=${record.businessId}`
    Http.setApi('ActivityDelete', Url, undefined, false);

    // 1004 新闻资讯
    // 1003 报名活动
    record.businessType == 1003
      ? Http.post("ActivityDelete", { activityId: record.businessId }, (res) => {
        _this.setState({ dataList })
      })
      : (record.status === 1001
        ? Http.post('NewsUpdateNews', { status: 1002, id: record.businessId }, (res) => {
          _this.setState({ dataList })
        })
        : Http.post("deleteNews", { status: 1002, id: record.businessId }, (res) => {
          _this.setState({ dataList })
        }))
  }

  handleEdit = (record) => {
    const url = `?businessType=${record['businessType']}&businessId=${record['businessId']}&handle=edit`;
    if (record['businessType'] == 1003) {
      history.push('./act/detailEditDealer' + url)
    } else if (record['businessType'] == 1004) {
      history.push('./news/detailEditDealer' + url)
    }
  }

  handleDetail(record) {
    const url = `?businessType=${record['businessType']}&businessId=${record['businessId']}&handle=detail`;
    if (record['businessType'] == 1003) {
      history.push('./act/detailEditDealer' + url)
    } else if (record['businessType'] == 1004) {
      history.push('./news/detailEditDealer' + url)
    }
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
      selectedDate: dateAsStr
    })
    this.setState({
      formFieldValues: { ...this.state.formFieldValues, ...{ publishDate: dateAsMoment } }
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
    const { handleReset, handleSearch, handlePreview, handleEdit, handleDelete, handleDetail } = this;
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
        handleEdit(record)
        break;
      case 'detail':
        handleDetail(record)
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
    const { dataList, columns, formFieldValues } = this.state
    const menu = (
      <Menu onClick={handleAdd.bind(this)}>
        <Menu.Item key="1">发布新闻</Menu.Item>
        <Menu.Item key="2">发布活动</Menu.Item>
      </Menu>
    );
    return (
      <div className="wrap" style={{ 'padding': '5px' }}>
        <Form layout={'inline'} className='ant-search-form'>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`标题`} style={{ width: '100%' }}>

                <Input value={formFieldValues.title} onChange={onInputChange.bind(this, 'title')} />

              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`发布时间`} style={{ width: '100%' }}>

                <DatePicker value={formFieldValues.publishDate} placeholder="" style={{ width: '100%' }} format="YYYY-MM-DD" onChange={onPublishDateChange.bind(this)} />

              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`创建人`} style={{ width: '100%' }}>
                <Input value={formFieldValues.title} onChange={onInputChange.bind(this, 'userName')} />
              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem {...formItemLayout} label={`发布号`} style={{ width: '100%' }}>
                <Input value={formFieldValues.title} onChange={onInputChange.bind(this, 'releaseNumber')} />
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`状态`} style={{ width: '100%' }}>

                <Select value={formFieldValues.status} onChange={onInputChange.bind(this, 'status')} >
                  <Option value={""}>全部</Option>
                  <Option value={1001}>草稿</Option>
                  <Option value={1002}>已删除</Option>
                  <Option value={1003}>未开始</Option>
                  <Option value={1004}>有效</Option>
                  <Option value={1005}>已满额</Option>
                  <Option value={1006}>已过期</Option>
                </Select>

              </FormItem>
            </Col>

            <Col span={8}>
              <FormItem {...formItemLayout} className='ant-form-item' label={`是否显示`} style={{ width: '100%' }}>
                <Select value={formFieldValues.isTop} onChange={onInputChange.bind(this, 'isTop')}>
                  <Option value={""}>全部</Option>
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right', paddingTop: '5px' }}>
              <Button type="primary" htmlType="button" icon="search" onClick={onAction.bind(this, 'search')}>查询</Button>
              <Button style={{ margin: '0 8px' }} onClick={onAction.bind(this, 'reset')}>重置</Button>
              <Button type="primary" htmlType="button" onClick={() => { this.setState({ addShow: true }) }}>新建</Button>
              {/* <Dropdown overlay={menu}>
                <Button style={{ marginLeft: 8 }} type="primary" htmlType="button" icon="plus">
                  新增<Icon type="down" /></Button>
              </Dropdown> */}

            </Col>
          </Row>
        </Form>

        <Table columns={columns}
          size="small"
          rowKey={record => Math.random(4) + 'uuid'}
          dataSource={this.state.dataList}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          scroll={{ x: 1400 }}
        />

        {/* 新增 */}
        <Modal
          width={800}
          visible={this.state.addShow}
          onCancel={() => { this.setState({ addShow: false }) }}
          onOk={() => { this.setState({ addShow: false }) }}
          footer={null}
        >
          <PushNews form={this.props.form} history={this.props.history} />
        </Modal>

        {/* 查看 */}
        <Modal
          width={800}
          visible={this.state.eitShow}
          onCancel={() => { this.setState({ eitShow: false }) }}
          onOk={() => { this.setState({ eitShow: false }) }}
          footer={null}
        >
          <EditNews form={this.props.form} history={this.props.history} action={this.state.action} data={this.state.currentData} />
        </Modal>

        {/* 二维码预览 */}
        <QRcode show={this.state.QRcodeShow} URL={this.state.previewUrl} OK={() => { this.setState({ QRcodeShow: false }) }} />
      </div>
    );
  };

}
const InfoWithForm = Form.create()(Info);

export default InfoWithForm;
