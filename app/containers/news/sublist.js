
import React from 'react';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http';
import {Layout} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
// import './style/info.scss';
import './style/sublist.scss';
import { Form, Row, Col, TreeSelect, Input, Select, DatePicker, TimePicker, Button, message, Table, Icon, Divider, Dropdown, Popconfirm, Modal } from 'antd';
import {Menu,Breadcrumb,Pagination} from 'antd';
const {Header,Footer,Sider,Content}=Layout;
import history from '../../utils/history';
import Store from 'store';
import DMCUtil from '../../utils/DMCUtil'
import QRcode from '../../components/common/QRCode';
import { SERVER_BASE_PATH } from '../../global.config';
import PushNews from './compontents/push';
import EditNews from './compontents/edit';
import ClipboardJS from 'clipboard/dist/clipboard.min.js';
import Preview from '../../components/Preview/index';
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

const title = '预约列表';


// const apis = [
//   { "id": "deleteNews", "url": "community/news/web/deleteNews", "format": false },
//   { "id": "previewReady", "url": "template/preview/ready" },
//   { "id": "queryListNews", "url": "community/news/queryListNews" },
//   { "id": "findOfficialUser", "url": "community/user/saicUser/findOfficialUser" },

// ];
const Authorization = DMCUtil.getJWTFromCookie()
Http.setDomainUrl(SERVER_BASE_PATH);
// Http.setMutiApi(apis);

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
        "activityType": "",
        "businessType": "",
        "limit": 10,
        "page": 1,
        "publishDate": null,
        "status": "",
        "title": "",
        "releaseNumber": '',
        "isShow": "",
        "userId": "",
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
      findOfficialUser: [],
      drShow: false,
      previewData: {},
      messageShow: false,
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
    Http.post('queryListNews', params, callback => {
      // const callback = { "total": 167, "rows": [{ "limit": 10, "page": 1, "releaseNumber": 1, "orderName": null, "orderType": null, "id": 94, "labelId": null, "title": "晚间新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 4, "shareNumber": null, "browseNumber": 86, "commentNumber": 40, "contentType": 1, "previewPhone": null, "newsUrl": 'http://www.baidu.com', "releaseDate": "2018-03-08 15:40", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 8, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 95, "labelId": null, "title": "卖车喽!", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 5, "shareNumber": null, "browseNumber": 18, "commentNumber": 8, "contentType": null, "previewPhone": null, "newsUrl": "", "releaseDate": "2018-04-25 14:30", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 2, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 96, "labelId": null, "title": "卖车喽!", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 6, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": "", "releaseDate": "2018-04-25 14:31", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 3, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 97, "labelId": null, "title": "新闻测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 8, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 4, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 98, "labelId": null, "title": "新闻测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 10, "commentNumber": 2, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-09 03:23", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 5, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 99, "labelId": null, "title": "标题字数过多展示测试测试", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 33, "commentNumber": 2, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-09 03:31", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 6, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 100, "labelId": null, "title": "今天测试下发布新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 44, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 7, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 101, "labelId": null, "title": "今天测试下发布新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 55, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": null, "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 8, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 104, "labelId": null, "title": "新闻新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1004, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 0, "shareNumber": null, "browseNumber": 66, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-13 07:36", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 9, "createBy": 1 }, { "limit": 10, "page": 1, "orderName": null, "orderType": null, "id": 105, "labelId": null, "title": "新闻新闻", "titleImage": null, "startDate": null, "endDate": null, "status": 1002, "content": null, "newsSummary": null, "thirdPartLink": null, "dealerCode": null, "dealerName": null, "praiseNumber": 1, "shareNumber": null, "browseNumber": 77, "commentNumber": 0, "contentType": null, "previewPhone": null, "newsUrl": null, "releaseDate": "2018-03-13 07:36", "labelName": null, "isRecommend": 0, "userName": null, "photo_url": null, "userId": null, "isShow": null, "sort": 10, "createBy": 1 }] }
      const pagination = { ...this.state.pagination };
      if (callback && callback['rows']) {
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
      } else if (callback && callback['status']) {
        debugger;
        location.href = callback['location'] + "?_t=" + (new Date()).getMilliseconds();
      }

    })
  }



  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination, ...pagination };
    const formFieldValues = { ...{}, ...this.state.formFieldValues }
    pager.current = pagination.current;

    formFieldValues['limit'] = pager.pageSize;
    formFieldValues['page'] = pager.current;
    this.setState({
      pagination: pager,
      formFieldValues
    }, () => {
      this.getDataList();
    });
  }

  componentWillMount() {
    Http.get('findOfficialUser', res => {
      if (res) {
        this.setState({ findOfficialUser: res })
      }
    })

    // this.setState({
    //   findOfficialUser: [...
    //     {
    //       "id": 123,
    //       "saicUserId": 321,
    //       "name": "开发人员",
    //       "mobilePhone": "13024172788",
    //       "password": null,
    //       "photoUrl": "",
    //       "nickName": "",
    //       "accountStatus": "ACTIVATED",
    //       "createDate": 1524801465000,
    //       "updateDate": 1524805016000,
    //       "userType": 3,
    //       "email": null,
    //       "lastErrTs": null,
    //       "isUsernameUpdatable": null,
    //       "laiwang": null,
    //       "registerSource": null,
    //       "loginTs": null,
    //       "photoId": null,
    //       "lastLoginTs": null,
    //       "lowerName": null,
    //       "wangwang": null,
    //       "errCount": null,
    //       "qq": null
    //     },
    //   {
    //     "id": 321,
    //     "saicUserId": 123,
    //     "name": "开发人员",
    //     "mobilePhone": "13777898281",
    //     "password": null,
    //     "photoUrl": "",
    //     "nickName": "",
    //     "accountStatus": "ACTIVATED",
    //     "createDate": 1524808245000,
    //     "updateDate": 1524812216000,
    //     "userType": 3,
    //     "email": null,
    //     "lastErrTs": null,
    //     "isUsernameUpdatable": null,
    //     "laiwang": null,
    //     "registerSource": null,
    //     "loginTs": null,
    //     "photoId": null,
    //     "lastLoginTs": null,
    //     "lowerName": null,
    //     "wangwang": null,
    //     "errCount": null,
    //     "qq": null
    //   },
    //   {
    //     "id": 2323,
    //     "saicUserId": 323,
    //     "name": "开发人员表",
    //     "mobilePhone": "17712654474",
    //     "password": null,
    //     "photoUrl": "https://carapptest.gtmc.com.cn/fs01/20180309/test",
    //     "nickName": "",
    //     "accountStatus": "ACTIVATED",
    //     "createDate": 1524797805000,
    //     "updateDate": 1524797134000,
    //     "userType": 3,
    //     "email": null,
    //     "lastErrTs": null,
    //     "isUsernameUpdatable": null,
    //     "laiwang": null,
    //     "registerSource": null,
    //     "loginTs": null,
    //     "photoId": null,
    //     "lastLoginTs": null,
    //     "lowerName": null,
    //     "wangwang": null,
    //     "errCount": null,
    //     "qq": null
    //   }
    //   ]
    // })

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
    const params = { limit: 10, page: 1 }
    this.getDataList(params);
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({
      selectedDate: null,
      formFieldValues: { page: 1, limit: 10, status: "", isShow: "" }
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
    const { dataList, columns, formFieldValues, findOfficialUser } = this.state;
    return (
      <div className="wrap" style={{ 'padding': '5px' }}>
        <Header style={{'background':'white',height:70}}>
            <Icon type="home" style={{fontSize:20,color:'#6a6a6a'}}></Icon>
            <span style={{fontSize:15,color:'#7a7a7a',"margin-right":20}}>主页</span>
            <Icon type="right-square-o" style={{fontSize:15,color:'#6a6a6a',"margin-right":35}}></Icon>
            <span style={{fontSize:15,color:'#7a7a7a',"margin-right":25}}>试驾预约</span>
            <Icon type="right-square-o" style={{fontSize:15,color:'#6a6a6a',"margin-right":10}}></Icon>
            <span style={{fontSize:15,color:'#7a7a7a'}}>试驾预约列表</span>
          </Header>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={title} />
        </Helmet>
        <Form layout={'inline'} className='ant-search-form2'>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`关键字`} style={{ width: '100%'}}>
                <Input value={formFieldValues.title} onChange={onInputChange.bind(this, 'title')} style={{height:30,"margin-left":16,width:305}} placeholder="请输入预约人姓名、电话"/>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`试驾类型`} style={{ width: '100%' }}>
                <Select defaultValue={""} style={{height:30,width:305}}>
                  <Option value={""}>全部</Option>
                  <Option value={1001}>预约到店</Option>
                  <Option value={1002}>送车上门</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`状态`} style={{ width: '100%','margin-left':-40 }}>
                <Select defaultValue={""}  style={{height:30,'margin-left':42,width:305}}>
                  <Option value={""} TreeSelect>全部</Option>
                  <Option value={1001}>待接单</Option>
                  <Option value={1002}>待试驾</Option>
                  <Option value={1003}>待试驾</Option>
                  <Option value={1004}>已取消</Option>
                  <Option value={1005}>已取消</Option>
                  <Option value={1006}>超时取消</Option>
                </Select>
              </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`试驾地区`} style={{ width: '100%',"margin-left":11}}>
                <Select defaultValue={""}  style={{height:30,width:305}}>
                  <Option value={""} TreeSelect>全部</Option>
                  <Option value={1001}>岳阳</Option>
                  <Option value={1002}>株洲</Option>
                  <Option value={1003}>益阳</Option>
                  <Option value={1004}>怀化</Option>
                  <Option value={1005}>张家界</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`销售店`} style={{ width: '100%',"margin-left":-10}}>
                <Select defaultValue={""}  style={{height:30,width:305,"margin-left":15}}>
                  <Option value={""} TreeSelect>全部</Option>
                  <Option value={1001}>岳阳</Option>
                  
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`预约时间`} style={{ width: '100%' }}>
                <RangePicker
                  style={{ width:305,height:30 ,'margin-left':15}}
                  value={this.state.selectedDate}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['从', '至']}
                  onChange={onPublishDateChange.bind(this)}
                  onOk={(value) => { console.log('onOk: ', value); }}
                />

              </FormItem>
            </Col>
            </Row>
            <Row style={{"margin-top":10}}>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`试驾车型`} style={{ width: '100%',"margin-left":11}}>
                <Select defaultValue={""}  style={{height:30,width:305}}>
                  <Option value={""} TreeSelect>全部</Option>
                  <Option value={1001}>MKC</Option>
                  <Option value={1002}>MKZ</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`销售顾问`} style={{ width: '100%','margin-left':5}}>
                <Select defaultValue={""}  style={{height:30,width:305}}>
                  <Option value={""} TreeSelect>黄晓明</Option>
                  <Option value={1001}>张三</Option>
                  <Option value={1001}>里斯</Option>
                  
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`鉴赏工程师`} style={{ width: '100%',"margin-left":15 }}>
                <Select defaultValue={""}  style={{width:"100%",height:30,width:305}}>
                  <Option value={""} TreeSelect>黄晓明</Option>
                  <Option value={1001}>张三</Option>
                  <Option value={1001}>里斯</Option>
                  
                </Select>
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right', paddingTop: '20px' }}>
              {/* <Button type="primary" htmlType="button" icon="search" onClick={onAction.bind(this, 'search')}>查询</Button> */}
              <Button type="primary"  onClick={onAction.bind(this, 'search')}>新增</Button>
              <Button type="primary"  >查询</Button>
              <Button style={{background:"#F7BB2A",color:"#fff"}}>重置</Button>
              <Button style={{background:"#12CF66",color:"#fff"}}>下载<Icon type="download" style={{"margin-left":-1}}></Icon></Button>
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
        {this.state.addShow
          ? <Modal
            width={800}
            maskClosable={false}
            form={this.props.form}
            style={{ zIndex: 999 }}
            visible={this.state.addShow}
            onCancel={() => { this.setState({ messageShow: true }) }}
            onOk={() => { this.setState({ addShow: false }) }}
            footer={null}
          >
            <PushNews
              form={this.props.form}
              history={this.props.history}
              findOfficialUser={findOfficialUser}
              cancel={(e = false) => { this.setState({ addShow: e }) }}
              onMsg={() => { this.setState({ messageShow: true }) }}
              refurbish={this.getDataList.bind(this)}
            />
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
            <EditNews
              form={this.props.form}
              history={this.props.history}
              action={this.state.action}
              data={this.state.currentData}
              findOfficialUser={findOfficialUser}
              cancel={(e = false) => { this.setState({ eitShow: e }) }}
              refurbish={this.getDataList.bind(this)}
            />
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
            <Preview form={this.props.form} data={this.state.previewData} />
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

function copyToClipboard(node) {
  let clipboard = new ClipboardJS(node)
  clipboard.on('success', function (e) {
    message.success('复制链接成功！')
    console.log(e);

  });
  clipboard.on('error', function (e) {
    message.error('复制链接失败！')
    console.log(e);
  });
}

const InfoWithForm = Form.create()(Info);

export default InfoWithForm;
