/**
 *试驾待试驾
 */

import React from 'react';
import { Toast } from 'antd-mobile';
import Layout from '../../components/Layout';
import Http from '../../utils/http'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './style/drive.todo.scss';
const title = '试驾待试驾';

const apis = [
  { "id": "driverInfo", "url": "dealer/api/v1/driverInfo" },
  { "id": "goodsList", "url": "dealer/api/v1/goodsList" },
  { "id": "start", "url": "dealer/api/v1/start" },
];

Http.setDomainUrl("/wx/ent/api/");

Http.setMutiApi(apis);

function separateGoodList(data = []) {
  let result = {}, s1 = [], s2 = [];
  data.forEach((item) => {
    item['goodsStatus'] === '1' ? s1.push(item) : s2.push(item);
  })
  return { s1, s2 };
}

var checkList = {};

class DriveTodo extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = Object.assign({}, this.props['user']);
    this.state = {
      userInfo: {},
      driverInfo: {},
      formValue: {
        driveId: '',
        carCode: '',
      },
      checkList: {},
      requireGoods: [],
      unrequireGoods: [],
      driveId: userInfo.driveId,
    }

    this.state['userInfo']['userId'] = userInfo['userId'];
    this.state['userInfo']['mobile'] = userInfo['mobile'];
    this.state['userInfo']['driveId'] = userInfo['driveId'];
    this.state['userInfo']['carCode'] = userInfo['carCode'];
    this.state['formValue']['driveId'] = userInfo['driveId'];
    this.state['formValue']['carCode'] = userInfo['carCode'];

    this.start = this.start.bind(this);
  }

  goBack = () => {
    const requireInfo = {
      userid: this.state['userInfo']['userId'],
      mobile: this.state['userInfo']['mobile'],
    }
    console.log('跳转不同详情====', requireInfo);
    window.location.href = `/wx/ent/drive${Http.transGetParams(requireInfo)}`;
  }

  componentWillMount() {
    Http.get('goodsList', (callback) => {
      let result = separateGoodList(callback);
      // result['s1'].forEach((item, index) => {
      //   const key = index + 1;
      //   checkList[key] = '1';
      // })
      this.setState({
        requireGoods: result['s1'],
        unrequireGoods: result['s2'],
        // checkList: checkList
      })
      console.log('===requireGoods==', this.state['requireGoods'], '====unrequireGoods===', this.state['unrequireGoods']);
    })
    const driveId = this.state.driveId;
    if (driveId) {
      Http.get('driverInfo', { driveId }, (driverInfo) => {
        this.setState({ driverInfo });
      })
    }


  }
  render() {
    const info = this.state.driverInfo;
    return (
      <div className={s.order} style={{ height: 'auto' }}>
        <div className={s.head}>
          <ul>
            <li>
              <div>预约编号：</div>
              <div>{info.driveId}</div>
            </li>
            <li>
              <div>预约状态：</div>
              <div style={{ color: 'red' }}>待试驾</div>
            </li>
            <li><span>预约时间:</span>{(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}</li>
            <li><span>试驾车型:</span>{(info['carTypeName'] ? info['carTypeName'] : '') + (info['carTypeName'] && info['carName'] ? ' , ' : '') + (info['carName'] ? info['carName'] : '')}</li>
            <li><span>试驾地址:</span>{(info['proviceName'] ? info['proviceName'] : '') + (info['regionName'] ? info['regionName'] : '') + (info['address'] ? info['address'] : '')}</li>
            <li><span>预约人:</span>{info['userName'] + ` , ${info['appellation'] ? info['appellation'] : '女士'}`}</li>
            <li><span>联系电话:</span><a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={s.iconfont}>&#xe8a0;</i>{info.userPhone}</a></li>
            <li><span>标签:</span>{info['tagsName'] ? info['tagsName'] : ''}</li>
            <li><span>备注:</span>{info.remark}</li>
            <li className={s.car}>
              <span>车辆:</span>
              <span>{info.carCode}</span>
              <span>{info.licenseNo}</span>

            </li>
          </ul>
        </div>
        <div className={s.meterial}>
          <ul>
            <li><i className={s.iconfont}>&#xe62c;</i>行情确认</li>
            <li>
              必须物品
                  </li>
          </ul>
        </div>
        <div className={s.mat}>
          <ul>
            {
              this.state['requireGoods'].map((item, index) => {
                console.log(item, '======');
                return (
                  <li key={index}>
                    <div>
                      <input type="checkbox" name={item['goodsStatus']} onChange={this.onCheckChanged} value={item['goodsId']} />
                    </div>
                    <div>{item['goodsName']}</div>
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className={s.choose}>可选物品</div>
        <div className={s.mat + ' ' + s.met}>
          <ul>
            {
              this.state['unrequireGoods'].map((item, index) => {
                console.log(item, '======');
                return (
                  <li key={index} style={{ width: '100%' }}>
                    <div>
                      <input type="checkbox" name={item['goodsStatus']} onChange={this.onCheckChanged} value={item['goodsId']} />
                    </div>
                    <div>{item['goodsName']}</div>
                  </li>
                )
              })

            }

          </ul>
        </div>
        <div className={s.testdrive} onClick={this.start}>立即出发</div>
      </div>
    );
  }
  onCheckChanged = (event) => {
    const target = event.target;
    const isChecked = target.checked;
    const value = target.value + '';
    const status = target.name;
    console.log(status);
    console.log(value);
    if (isChecked) {
      this.state.checkList[value] = status;
    } else {
      delete this.state.checkList[value];
    }

    console.log('====checkList==', this.state.checkList);
  }


  start() {
    let temp1 = [], temp2 = [], flag = {}, driveId = this.state['formValue']['driveId'];
    console.log('==drivderid===', this.state['formValue'])
    for (let gid in this.state['checkList']) {
      let item = {};
      item['driveId'] = parseInt(driveId);
      if (this.state['checkList'][gid] == 1) {
        item['goodsId'] = parseInt(gid);
        temp1.push(item);
      } else {
        item['goodsId'] = parseInt(gid);
        temp2.push(item);
      }
    }

    if (temp1.length < this.state.requireGoods.length) {
      Toast.fail('请确认必须物品！', 2);
      return
    }

    let params = temp1.concat(temp2);
    const that = this;
    console.log('立即出发传递参数====', params);
    Http.post('start', params, (result) => {
      Toast.success('成功出发！', 1);
      let timer = setTimeout(() => {
        that.goBack();
        clearTimeout(timer);
      }, 1500)
    })
  }


}

const DriveTodoComp = withStyles(s)(DriveTodo);

function action({ path, query, hash }) {
  return {
    chunks: ['drive.todo'],
    title,
    component: (
      <Layout hide={true}>
        <DriveTodoComp user={query} />
      </Layout>
    ),
  };
}

export default action;
