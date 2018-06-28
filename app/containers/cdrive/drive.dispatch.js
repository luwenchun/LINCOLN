/**
 *试驾待分拨
 */

import React from 'react';
import moment from 'moment';
import Layout from '../../components/Layout';
import Http from '../../utils/http'
import PropTypes from 'prop-types';
import { Flex, Toast, Picker, DatePicker, InputItem, WhiteSpace, WingBlank, List, TextareaItem, Button } from 'antd-mobile';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import disSheet from './style/drive.dispatch.scss';
const title = '试驾待分拨';
const Item = List.Item;
const Brief = Item.Brief;

const apis = [
  { "id": "driverInfo", "url": "dealer/api/v1/driverInfo" },
  { "id": "dispatchCarList", "url": "dealer/api/v1/dispatchCarList" },
  { "id": "dispatchs", "url": "dealer/api/v1/dispatchs" },
  { "id": "engineer", "url": "dealer/api/v1/engineer" },
  { "id": "dispatch", "url": "dealer/api/v1/dispatch" },
];

Http.setDomainUrl("/wx/ent/api/");
//Http.setDomainUrl("http://121.196.193.149:9020/");
Http.setMutiApi(apis);

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm');
}

const engineerList = [];

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



class DriveDispatch extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = Object.assign({}, this.props['user']);
    this.state = {
      userInfo: {},
      pickerCarList: [],
      pickerObjectList: [],
      pickerEngineerList: [],
      driverInfo: {

      },
      formValue: {
        appreciationEngineer: '',
        driveId: '',
        dispatchObject: '',
        licenseNo: '',
        carCode: '',
      },

    };

    console.log('===userInfo-----', userInfo)
    this.state['userInfo']['userId'] = userInfo['userId'];
    this.state['userInfo']['mobile'] = userInfo['mobile'];
    this.state['userInfo']['driveId'] = userInfo['driveId'];
    this.state['userInfo']['carCode'] = userInfo['carCode'];
    this.state['formValue']['driveId'] = userInfo['driveId'];
    this.state['formValue']['carCode'] = userInfo['carCode'];



    const code={
      driveId:this.state['userInfo']['driveId']
    }
    Http.get('dispatchs',code, (callback) => {
      console.log('===获取分拨对象列表====', callback);
      const genData = genPickData(callback, 'centerName', 'centerCode');
      console.log('===获取分拨对象列表返回值genData====', genData);
      this.setState({ pickerObjectList: genData }, (state) => {
        console.log(state);
      });
    });





  }

  componentDidMount() {
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

  goBack = () => {
    const requireInfo = {
      userid: this.state['userInfo']['userId'],
      mobile: this.state['userInfo']['mobile'],
    }
    console.log('跳转不同详情====', requireInfo);
    window.location.href = `/wx/ent/drive${Http.transGetParams(requireInfo)}`;
  }


  dispatch = () => {

    const params = Object.assign({}, this.state['formValue']);
    if (params['dispatchObject'] == '') {
      Toast.fail('请选择分拨对象！', 1);
      return
    }

    if (params['licenseNo'] == '') {
      Toast.fail('请选择车辆！', 1);
      return
    }

    if (params['appreciationEngineer'] == '') {
      Toast.fail('请选择鉴赏工程师！', 1);
      return
    }



    params['licenseNo'] = params['licenseNo'].join(',');
    params['appreciationEngineer'] = params['appreciationEngineer'].join(',');
    params['dispatchObject'] = params['dispatchObject'].join(',');
    delete params['carCode'];
    console.log('params==ok===', params)
    const that = this;
    Http.post('dispatch', params, function (callback) {
      console.log('试驾单分拨返回值====', callback);
      if(callback.errorCode=="1"){
        Toast.success(callback.errorMsg, 1);
        let timer = setTimeout(() => {
          that.goBack();
          clearTimeout(timer);
        }, 2000)
        }else{
          Toast.fail(callback.errorMsg, 1);
        }
     
    })

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

  clearEngineer() {
    this.setState({
      pickerEngineerList: [],
      formValue: Object.assign(this.state['formValue'], { appreciationEngineer: '' })
    })
  }

  clearCarList() {
    this.setState({
      pickerCarList: [],
      formValue: Object.assign(this.state.formValue, { licenseNo: '' })
    })
  }

  getEngineerPickerList(licenseNo) {
    this.clearEngineer();
    Http.get('engineer', { licenseNo: licenseNo }, (callback) => {
      const genData = genPickData(callback, 'userName', 'userId');
      console.log(genData);
      this.setState({ pickerEngineerList: genData })
    })

  }

  getCarPickerList(dispatchObject) {
    console.log('===获取分拨车辆===', this.state['formValue']['carCode']);
    this.clearEngineer();
    this.clearCarList();
    const carListParams = {
      dispatchObject: dispatchObject,
      driveId: this.state['driverInfo']['driveId']
    }


    Http.get('dispatchCarList', carListParams, (callback) => {
      console.log('===获取分拨车辆列表返回值====', callback);
      const genData = genPickData(callback);
      console.log('===获取分拨车辆列表返回值genData====', genData);
      this.setState({ pickerCarList: genData }, (state) => {
        console.log(state);
      });
    });

  }

  pickerObjectChanged = (v) => {
    console.log('pickerCarChanged===v==', v);
    // this.setState({ formValue: Object.assign(this.state.formValue,{carCode:v}) })

    this.getCarPickerList(v[0]);
  }

  pickerCarChanged = (v) => {
    console.log('pickerCarChanged===v==', v);
    // this.setState({ formValue: Object.assign(this.state.formValue,{carCode:v}) })

    this.getEngineerPickerList(v[0]);
  }


  render() {
    const that = this;
    const info = this.state['driverInfo'];
    function getData() {
      Http.get('driverInfo', function (data) {
        that.state['detailInfo'] = Object.assign({}, data);
      })
    }

    return (
      <div className={disSheet.wrap}>
        <form>
          <List style={{ backgroundColor: 'white' }} className="picker-list">
            <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{float:'right'}}>{info['driveId']}</span></div>}>
              预约编号
          </Item>
          <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{float:'right',color:'red'}}>{info['statusName']}</span></div>}>
              预约状态
          </Item>
            <Item multipleLine extra={(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}>
              预约时间
          </Item>
            <Item multipleLine extra={(info['carTypeName'] ? info['carTypeName'] : '') + (info['carTypeName'] && info['carName'] ? ' , ' : '') + (info['carName'] ? info['carName'] : '')}>
              试驾车型
          </Item>

            <Item multipleLine extra={(info['proviceName'] ? info['proviceName'] : '') + (info['regionName'] ? info['regionName'] : '') + (info['address'] ? info['address'] : '')}>
              试驾地址
          </Item>

            <Item multipleLine extra={info['userName'] + ' , ' + (info['appellation'] ? info['appellation'] : '女士')}>
              预约人
          </Item>

            <Item multipleLine extra={<a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={disSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a>}>
              联系电话
          </Item>

            <Item multipleLine extra={info['tagsName'] ? info['tagsName'] : ''}>
              标签
          </Item>

            <Item multipleLine extra={this.state['driverInfo']['remark']}>
              备注
          </Item>

            <Picker
              cols={1}
              data={this.state['pickerObjectList']}
              cascade={false}
              extra="请选择"
              value={this.state.formValue['dispatchObject']}
              onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { dispatchObject: v }) })}
              onOk={v => this.pickerObjectChanged.bind(this, v)(v)}
            >
              <List.Item arrow="horizontal">分拨对象</List.Item>
            </Picker>

            <Picker
              cols={1}
              data={this.state['pickerCarList']}
              cascade={false}
              extra="请选择"
              value={this.state.formValue['licenseNo']}
              onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { licenseNo: v }) })}
              onOk={v => this.pickerCarChanged.bind(this, v)(v)}
            >
              <List.Item arrow="horizontal">车辆</List.Item>
            </Picker>

            <Picker
              cols={1}
              data={this.state['pickerEngineerList']}
              cascade={false}
              extra="请选择"
              value={this.state.formValue['appreciationEngineer']}
              onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { appreciationEngineer: v }) })}
              onOk={v => this.setState({ formValue: Object.assign(this.state.formValue, { appreciationEngineer: v }) })}
            >
              <List.Item arrow="horizontal">鉴赏工程师</List.Item>
            </Picker>


          </List>
          <WhiteSpace />
          <WingBlank>
            <Flex>

              <Flex.Item><Button type="primary" onClick={this.btnAction.bind(this, 'dispatch')}>分拨</Button></Flex.Item>

            </Flex>
          </WingBlank>
        </form>
      </div>

    );
  }

}

const DriveDispatchComp = withStyles(disSheet)(DriveDispatch);

function action({ path, query, hash }) {
  const userInfo = query;
  return {
    chunks: ['drive.dispatch'],
    title,
    component: (
      <Layout hide={true}>
        <DriveDispatchComp user={userInfo} />
      </Layout>
    ),
  };
}

export default action;
