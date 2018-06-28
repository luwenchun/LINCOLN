/**
 *试驾待接单
 */

import React from 'react';
import { Flex, Toast, Picker, DatePicker, InputItem, WhiteSpace, WingBlank, List, TextareaItem, Button } from 'antd-mobile';
import Layout from '../../components/Layout';
import Http from '../../utils/http'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import receSheet from './style/drive.receipt.scss';
import { setTimeout } from 'timers';
const title = '试驾待接单';

const Item = List.Item;
const Brief = Item.Brief;

const apis = [
  { "id": "driverInfo", "url": "dealer/api/v1/driverInfo" },
  { "id": "dealer", "url": "dealer/api/v1/dealer" },
  { "id": "counselor", "url": "dealer/api/v1/counselor" },
  { "id": "manager", "url": "dealer/api/v1/manager" },
  { "id": "unableToRespond", "url": "dealer/api/v1/unableToRespond" },
];

Http.setDomainUrl("/wx/ent/api/");

Http.setMutiApi(apis);

function genPickData(sourceArr = [], label, value) {
  let result = [];
  sourceArr.forEach((item) => {
    console.log(item)
    let obj = {};
    obj['label'] = typeof item === 'object' ? item[label] : item;
    obj['value'] = typeof item === 'object' ? item[value] : item;
    result.push(obj);
  })
  return [result];
}

class DriveReceipt extends React.Component {
  constructor(props) {
    super(props);

    super(props);
    const userInfo = Object.assign({}, this.props['user']);
    this.state = {
      userInfo: {},
      pickerDealerList: [],
      pickerCounselorList: [],
      driverInfo: {

      },
      formValue: {
        dealerCode: '',
        driveId: '',
        licenseNo: '',
        carCode: '',
        counselor: '',
      },

    };

    console.log('===userInfo-----', userInfo)
    this.state['userInfo']['userId'] = userInfo['userId'];
    this.state['userInfo']['mobile'] = userInfo['mobile'];
    this.state['userInfo']['driveId'] = userInfo['driveId'];
    this.state['userInfo']['carCode'] = userInfo['carCode'];
    this.state['formValue']['driveId'] = userInfo['driveId'];
    this.state['formValue']['carCode'] = userInfo['carCode'];

    const dealerListParams = {
      driveId: userInfo['driveId'],
    }


    Http.get('dealer', dealerListParams, (callback) => {
      console.log('===获取销售店列表返回值====', callback);
      const genData = genPickData(callback, 'dealerName', 'dealerCode');
      console.log('===获取销售店列表返回值genData====', genData);
      this.setState({ pickerDealerList: genData }, (state) => {
        console.log(state);
      });
    });


  }


  componentDidMount() {
    // this.createdTag('link', 'https://unpkg.com/antd@3.0.1/dist/antd.min.css');
    console.log("this.state['userInfo']=====", this.state['userInfo'])
    const driverInfoParams = {
      driveId: this.state['userInfo']['driveId'],
      userId: this.state['userInfo']['userId']
    }
    Http.get('driverInfo', driverInfoParams, (callback) => {

      console.log('待接单详情数据=====', callback);
      this.setState({
        driverInfo: Object.assign({}, callback)
      })


    })

  }



  /**
   * 立即接单
   */
  receipt() {
    const params = Object.assign({}, this.state['formValue']);
    if (params['dealerCode'] == '') {
      Toast.fail('请选择销售店！', 1);
      return
    }

    if (params['counselor'] == '') {
      Toast.fail('请选择首席顾问！', 1);
      return
    }

    let postParams = {
      counselor: params['counselor'].join(','),
      driveId: params['driveId']
    }

    const that = this;
    Http.post('manager', postParams, (_callback) => {
      console.log('立即接单返回值====', _callback);

      Toast.success('成功接单！', 1);
      let timer = setTimeout(() => {
        that.goBack();
        clearTimeout(timer);
      }, 2000)

    })
  }

  /**
   * 无法响应
   */
  disable() {
    const params = Object.assign({}, this.state['formValue']);
    const that = this;
    Http.get('unableToRespond', { driveId: params['driveId'] }, (_callback) => {

      console.log('无法响应返回值====', _callback);

      Toast.success('操作成功！', 1);
      let timer = setTimeout(() => {
        that.goBack();
        clearTimeout(timer);
      }, 2000)


    })
  }

  goBack = () => {
    const requireInfo = {
      userid: this.state['userInfo']['userId'],
      mobile: this.state['userInfo']['mobile'],
    }
    console.log('跳转不同详情====', requireInfo);
    window.location.href = `/wx/ent/drive${Http.transGetParams(requireInfo)}`;
  }



  btnAction(typeName) {
    console.log('===typeName===', typeName);
    console.log('===formValue===', this.state['formValue']);
    this[typeName]();

  }

  handleChange(key, value) {
    let arrName = key.split('.');
    let newState = {};
    newState[arrName[0]] = {};
    newState[arrName[0]][arrName[1]] = value;
    const temp = Object.assign({}, this.state[arrName[0]], newState[arrName[0]]);
    const tar = {};
    tar[arrName[0]] = temp;
    this.setState(tar);
  }

  clearCounselor() {
    this.setState({
      pickerCounselorList: [],
      formValue: Object.assign(this.state['formValue'], { counselor: '' })
    })
  }

  getCounselorPickerList(dealerCode) {
    this.clearCounselor();
    Http.get('counselor', { dealerCode: dealerCode }, (callback) => {
      const genData = genPickData(callback, 'userName', 'userId');
      console.log(genData);
      this.setState({ pickerCounselorList: genData })
    })

  }


  pickerDealerChanged = (v) => {
    console.log('pickerCarChanged===v==', v);
    // this.setState({ formValue: Object.assign(this.state.formValue,{carCode:v}) })

    this.getCounselorPickerList(v[0]);
  }

  createdTag(tagName, href) {
    let tag;
    if (tagName === 'link') {
      tag = document.createElement('link');
      tag.setAttribute('rel', 'stylesheet');
      tag.setAttribute('type', 'text/css');
      tag.setAttribute('href', href);
    } else if (tagName === 'script') {
      tag = document.createElement('script');
      tag.setAttribute('src', href);
    }
    document.head.appendChild(tag);
  }
  render() {
    const info = this.state.driverInfo;
    return (

      <div className={receSheet.wrap}>
        {this.state.driverInfo.userName
          ? <form>
              <List style={{ backgroundColor: 'white' }} className="picker-list">
                <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{ float: 'right' }}>{info['driveId']}</span></div>}>
                  预约编号
                </Item>
                <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{ float: 'right', color: 'red' }}>{info['statusName']}</span></div>}>
                  预约状态
                </Item>
                  <Item wrap={true} multipleLine extra={(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}>
                    预约时间
                </Item>
                  <Item multipleLine extra={(info['carTypeName'] ? info['carTypeName'] : '') + (info['carTypeName'] && info['carName'] ? ' , ' : '') + (info['carName'] ? info['carName'] : '')}>
                    试驾车型
                </Item>

                <Item wrap={true} multipleLine extra={(info['proviceName'] ? info['proviceName'] : '') + (info['regionName'] ? info['regionName'] : '') + (info['address'] ? info['address'] : '')}>
                  试驾地址
                </Item>

                <Item multipleLine extra={info['userName'] + ' , ' + (info['appellation'] ? info['appellation'] : '女士')}>
                  预约人
                </Item>

                <Item multipleLine extra={<a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={receSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a>}>
                  联系电话
                </Item>
                <Item wrap={true} multipleLine extra={info['tagsName'] ? info['tagsName'] : ''}>
                  标签
                </Item>

                <Item wrap={true} multipleLine extra={info['remark']}>
                  备注
                </Item>

                <Picker
                  cols={1}
                  data={this.state['pickerDealerList']}
                  styles={{width:"100%"}}
                  cascade={false}
                  extra="请选择"
                  value={this.state.formValue['dealerCode']}
                  onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { dealerCode: v }) })}
                  onOk={v => this.pickerDealerChanged.bind(this, v)(v)}
                >
                  <List.Item arrow="horizontal">销售店</List.Item>
                </Picker>

                <Picker
                  cols={1}
                  data={this.state['pickerCounselorList']}
                  styles={{width:"100%"}}
                  cascade={false}
                  extra="请选择"
                  value={this.state.formValue['counselor']}
                  onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { counselor: v }) })}
                  onOk={v => this.setState({ formValue: Object.assign(this.state.formValue, { counselor: v }) })}
                >
                  <List.Item arrow="horizontal">首席顾问</List.Item>
                </Picker>

                <Item multipleLine extra={this.state.driverInfo['licenseNo']}>
                  车辆
                </Item>

                <Item multipleLine extra={this.state.driverInfo['appreciationEngineerName']}>
                  鉴赏工程师
                </Item>
              </List>
              <WhiteSpace />
              <WingBlank>
                <Flex>
                  <Flex.Item><Button type="primary" onClick={this.btnAction.bind(this, 'disable')}>无法响应</Button></Flex.Item>
                  <Flex.Item><Button type="primary" onClick={this.btnAction.bind(this, 'receipt')}>立即接单</Button></Flex.Item>
                </Flex>
              </WingBlank>
            </form>
          : ''}

      </div>

    );
  }

}

const DriveReceiptComp = withStyles(receSheet)(DriveReceipt);

function action({ path, query, hash }) {
  const userInfo = query;
  return {
    chunks: ['drive.receipt'],
    title,
    component: (
      <Layout hide={true}>
        <DriveReceiptComp user={userInfo} />
      </Layout>
    ),
  };
}

export default action;
