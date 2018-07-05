
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
      columns: [
        {
          title: '预约编号',
          dataIndex: 'id',
          width: 65,
          key: 'id',
          align:"center"
        },
        {
          title: '试驾类型',
          dataIndex: 'type',
          width: 65,
          key: 'type',
          align:"center"
        },
        {
          title: '称呼',
          dataIndex: 'call',
          width: 65,
          key: 'call',
          align:"center"
        },
        {
          title: '预约人姓名',
          dataIndex: 'name',
          width: 75,
          key: 'name',
          align:"center",
          size:"small"
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          width: 65,
          key: 'phone',
          align:"center"
        },
        {
          title: '试驾车型',
          dataIndex: 'cartype',
          width: 65,
          key: 'cartype',
          align:"center"
        },
        {
          title: '车牌',
          dataIndex: 'card',
          width: 65,
          key: 'card',
          align:"center"
         
        },
        {
          title: '预约时间',
          dataIndex: 'subtime',
          width: 65,
          key: 'subtime',
          align:"center"
        },
        {
          title: '试驾城市',
          dataIndex: 'city',
          width: 65,
          key: 'city',
          align:"center"
        },
        {
          title: '销售店',
          dataIndex: 'store',
          width: 60,
          key: 'store',
          align:"center"
        },
        {
          title: '预约地址',
          dataIndex: 'address',
          width: 65,
          key: 'address',
          align:"center"
        },
        {
          title: '状态',
          dataIndex: 'sta',
          width: 65,
          key: 'sta',
          className:"zt",
          align:"center",
          render: (text, record) => {
    

          },
        },
        {
          title: '创建时间',
          dataIndex: 'createtime',
          width: 65,
          key: 'createtime',
          align:"center"
        },
        {
          title: '首席顾问',
          dataIndex: 'advisor',
          width: 65,
          key: 'advisor',
          align:"center"
        },
        {
          title: '鉴赏工程师',
          dataIndex: 'engineer',
          width: 70,
          key: 'engineer',
          align:"center"
          
        },

        {
          title: '操作',
          key: 'operation',
          // fixed: 'right',
          width: 70,
          align:"center",
          render: (text, record) => {
            const { onAction } = this
            return (
              <span>
                <a href="javascript:void(0)" onClick={() => { this.setState({ action: 'detail', currentData: record, eitShow: true }) }}>详情</a>

                {record['status'] == 1001 || record['status'] == 1004
                  ? <Divider type="vertical" />
                  : ""}
                {record['status'] == 1001 || record['status'] == 1004
                  ? <a href="javascript:void(0)" onClick={() => { this.setState({ action: 'edit', currentData: record, eitShow: true }) }}>编辑</a>
                  : ""}


                {record['status'] != 1002
                  ? <Divider type="vertical" />
                  : ""}

                {record['status'] != 1002
                  ?
                  <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onConfirm={onAction.bind(this, 'delete', record)}>
                    <a href="javascript:void(0)">删除</a>
                  </Popconfirm>
                  : ""}
              </span>
            )

          },
        },
      ],
      dataList: [
        {
          id:"1",
          type:"预约到店",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"未确认",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"2",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"3",
          type:"预约到店",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"4",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"5",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"6",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"7",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"8",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"9",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"10",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"11",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        },
        {
          id:"12",
          type:"送车上门",
          call:"女士",
          name:"贞子",
          phone:"13912304567",
          cartype:"MK2",
          card:"湘A12345",
          subtime:"2017-04-28 10：10：10",
          city:"岳阳",
          store:"",
          address:"中山公园",
          sta:"待接单",
          createtime:"2017-04-25 11:11:11",
          advisor:" ",
          engineer:"黄小琥"
        }
      ],
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
    console.log(this.state.dataList[0].state)
    this.state.dataList[0].state=="未确认"?1:2
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
                <Input value={formFieldValues.title} onChange={onInputChange.bind(this, 'title')} style={{height:30,"margin-left":16,width:280}} placeholder="请输入预约人姓名、电话"/>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`试驾类型`} style={{ width: '100%' }}>
                <Select defaultValue={""} style={{height:30,width:280}}>
                  <Option value={""}>全部</Option>
                  <Option value={1001}>预约到店</Option>
                  <Option value={1002}>送车上门</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`状态`} style={{ width: '100%','margin-left':-40 }}>
                <Select defaultValue={""}  style={{height:30,'margin-left':42,width:280}}>
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
                <Select defaultValue={""}  style={{height:30,width:280}}>
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
                <Select defaultValue={""}  style={{height:30,width:280,"margin-left":15}}>
                  <Option value={""} TreeSelect>全部</Option>
                  <Option value={1001}>岳阳</Option>
                  
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`预约时间`} style={{ width: '100%' }}>
                <RangePicker
                  style={{ width:280,height:30 ,'margin-left':15}}
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
                <Select defaultValue={""}  style={{height:30,width:280}}>
                  <Option value={""} TreeSelect>全部</Option>
                  <Option value={1001}>MKC</Option>
                  <Option value={1002}>MKZ</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`销售顾问`} style={{ width: '100%','margin-left':5}}>
                <Select defaultValue={""}  style={{height:30,width:280}}>
                  <Option value={""} TreeSelect>黄晓明</Option>
                  <Option value={1001}>张三</Option>
                  <Option value={1001}>里斯</Option>
                  
                </Select>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label={`鉴赏工程师`} style={{ width: '100%',"margin-left":15 }}>
                <Select defaultValue={""}  style={{width:"100%",height:30,width:280}}>
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
          style={{align:"center"}}
          // rowKey={record => Math.random(4) + 'uuid'}
          bordered

          dataSource={this.state.dataList}
          pagination={this.state.pagination}
          // onChange={this.handleTableChange}
          scroll={{ x: 2900 }}
        />

      </div>
    );
  };

}



const InfoWithForm = Form.create()(Info);

export default InfoWithForm;
