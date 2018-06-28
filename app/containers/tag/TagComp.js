/**
 *咨询标签列表
 */

import React from 'react';
import TagEdit from './components/TagEdit';
import Http from '../../utils/http';
import PropTypes from 'prop-types';
import DMCUtil from '../../utils/DMCUtil'
import { SERVER_BASE_PATH } from '../../global.config'
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
import './style/tag.scss';
import { Form, Switch, Row, Col, Input, Select, Button, Table, Icon, Divider, message, Modal, } from 'antd';
const { Column, ColumnGroup } = Table;
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;


const apis = [
  { "id": "tagPagerList", "url": "cmyManage/tag/queryTagPage", "format": false },
  { "id": "setTag", "url": "cmyManage/tag/setTag", "format": false },
];
const Authorization = DMCUtil.getJWTFromCookie()
Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);
Http.setRequestHeader(Authorization)

let tagDto = {
  "businessType": "",
  "id": '',
  "status": 1,
  "statusDesc": "启用",
  "tagDesc": "",
  "tagName": ""
};

let queryDto = {
  "businessType": null,
  "limit": 10,
  "page": 1,
  "tagName": ""
}





const searchLayout = {
  labelCol: {
    xs: { span: 24 },
    md: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 24 },
    sm: { span: 16 },
  },
};

let pageStartIndex = 1
let pageSize = 10

class TagComp extends React.Component {
  constructor(props) {
    super(props);
    queryDto['businessType'] = props.businessType ? props.businessType : queryDto['businessType'];
    this.state = {
      columns: [
        {
          title: '序号',
          width: 120,
          dataIndex: 'id',
          key: 'id',
          fixed: 'left',
          render: (text, record, index) => {
            console.log(text, index)
            return (
              <span>{(pageStartIndex - 1) * pageSize + index + 1}</span>
            )
          }
        },
        {
          title: '标签名',
          dataIndex: 'tagName',
          width: 320,
          key: 'tagName',
          fixed: 'left',
        },
        {
          title: '描述',
          dataIndex: 'tagDesc',
          key: 'tagDesc',
        },

        {
          title: '操作',
          key: 'operation',
          width: 140,
          fixed: 'right',

          render: (text, record) => {
            console.log('----switch----')
            return (

              <span>
                <Switch checkedChildren="启用" unCheckedChildren="停用" checked={record['status'] === 1 ? true : false} onChange={this.onSwitchChange.bind(this, record)} />
                <Divider type="vertical" />
                <a href="javascript:void(0)" onClick={this.handleEdit.bind(this, record)}>编辑</a>
              </span>
            )
          },
        },
      ],
      dataList: [],
      modalTitle: '新增',
      pagination: {
        size: 'small',
        showSizeChanger: true,
        onShowSizeChange: (current, size) => {

        },

      },
      formFieldValues: {},
      selectedRowKeys: [],
      modalVisible: false,
      loading: false,
    }

  };


  /**
   * 新增／更新标签，包括更新标签状态🌤
   */
  updateTag = (currentItem, fnCallback) => {

    const copyTagDto = { ...tagDto, ...currentItem };

    Http.post('setTag', copyTagDto, (callback) => {
      console.log('updatecallback---->', callback)
      if (callback['success']) {
        message.success('操作成功')
        fnCallback && fnCallback()
      } else {
        message.error(`${callback['errMsg']}，请重试！`)
      }

    })
  }

  onSwitchChange = (currentItem, checked) => {
    if (Object.hasOwnProperty.call(currentItem, 'status') && Object.hasOwnProperty.call(currentItem, 'statusDesc')) {
      if (checked) {
        currentItem['status'] = 1
        currentItem['statusDesc'] = '启用'
      } else {
        currentItem['status'] = 0
        currentItem['statusDesc'] = '停用'
      }
    }
    this.updateTag(currentItem)
  }


  /**
   * 👌获取标签列表
   */
  getDataList = (params = {}) => {
    console.log('params::', params);

    this.setState({ loading: true });

    Http.post('tagPagerList', params, callback => {
      const pagination = { ...this.state.pagination };
      if (callback && callback['data']) {
        pagination.total = callback['data']['total'] || 0;
        pagination.pageSize = params['limit'];
        this.setState({
          loading: false,
          dataList: callback['data']['rows'],
          pagination
        })
      }
    })


  }



  handleTableChange = (pagination, filters, sorter) => {

    const pager = { ...this.state.pagination, ...pagination };
    const copyQueryDto = { ...{}, ...queryDto }
    pager.current = pagination.current;

    copyQueryDto['limit'] = pager.pageSize;
    copyQueryDto['page'] = pager.current;
    pageStartIndex = pager.current
    pageSize = pager.pageSize
    console.log(pager)

    this.setState({
      pagination: pager,
    });


    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ', values);
      this.getDataList({ ...copyQueryDto, ...values });
    });



  }


  componentDidMount() {

    this.getDataList(queryDto);

  }

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('查询条件: ', values);
      this.getDataList({ ...queryDto, ...values });
    });
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.getDataList(queryDto);
  }


  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  modalVisible = (modalVisible) => {
    this.setState({ modalVisible })
  }


  setModalTitle = (modalTitle) => {
    this.setState({ modalTitle })
  }

  setFormFieldValues = (formFieldValues = {}) => {
    this.setState({ formFieldValues: { ...tagDto, ...formFieldValues } })
  }

  handleAdd = () => {
    console.log('add===')
    this.setModalTitle('新增')
    this.setFormFieldValues()
    this.modalVisible(true)
  }

  handleEdit = (currentItem) => {
    console.log('currentItem===', currentItem)
    this.setModalTitle('编辑')
    this.setFormFieldValues(currentItem)
    this.modalVisible(true)
  }

  onSave = (formFieldValues) => {
    this.updateTag(formFieldValues, this.getDataList);
    this.modalVisible(false)
  }

  onCancel = () => {
    console.log('===cancel===')
    this.modalVisible(false)
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowKeys, columns, modalTitle, formFieldValues } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      hideDefaultSelections: true,
      onSelection: this.onSelection,
    }

    return (
      <div className={'wrap'} style={{ 'padding': '5px' }}>
        <Form layout={'inline'} className={'ant-search-form'}>
          <Row gutter={24}>

            <Col span={5}>
              <FormItem
                {...searchLayout}
                style={{ width: '100%' }}
              >
                {getFieldDecorator('businessType')(
                  <Select value={this.props.businessType} placeholder="业务类型">
                    <Option value={null}>全部</Option>
                    <Option value={1001}>话题</Option>
                    <Option value={1002}>动态</Option>
                    <Option value={1003}>活动</Option>
                    <Option value={1004}>新闻资讯</Option>
                  </Select>
                )}
              </FormItem>
            </Col>

            <Col span={5}>
              <FormItem {...searchLayout} style={{ width: '100%' }}>
                {getFieldDecorator(`tagName`)(
                  <Input placeholder='标签名称' />
                )}
              </FormItem>
            </Col>

            <Col span={14} style={{ textAlign: 'right' }}>

              <div style={{ marginTop: '5px', float: 'right' }}>
                <Button type="primary" htmlType="button" icon="search" onClick={this.handleSearch}>查询</Button>
                {/* <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button> */}
                <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleAdd}>新增</Button>
              </div>
            </Col>

          </Row>

        </Form>

        <Table columns={columns}
          // rowSelection={rowSelection}
          size="small"
          rowKey={record => record['id']}
          dataSource={this.state.dataList}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          scroll={{ x: 1000 }}

        />

        <Modal
          title={`${modalTitle + '资讯标签'}`}
          wrapClassName="vertical-center-modal"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.modalVisible(false)}
        >
          <TagEdit formFieldValues={formFieldValues} onConfirm={this.onSave} onCancel={this.onCancel} />

        </Modal>

      </div>
    );
  };

}

const TagWithForm = Form.create()(TagComp);

export default TagWithForm;
