/**
 *试驾查看资源
 */

import React from 'react';
import moment from 'moment';
import { Flex, Toast, Picker, DatePicker, InputItem, WhiteSpace, WingBlank, List, TextareaItem, Carousel } from 'antd-mobile';
import Http from '../../../utils/http'
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../style/drive.resources.scss';
import index from 'antd-mobile/lib/modal';
import { debug } from 'util';
const title = '试驾查看资源';

const apis = [
  { "id": "resourceObject", "url": "dealer/api/v1/resourceObject" },
  { "id": "resourceDealer", "url": "dealer/api/v1/resourceDealer" },
  { "id": "resourceUsage", "url": "dealer/api/v1/resourceUsage" },
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

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const myDate=new Date();
const DateOne=myDate.getTime()+24*60*60*1000*1;

function formatDate(date = DateOne) {
  return moment(date).format('YYYY-MM-DD');
}

var params = {
  pageNum: 1,
  pageSize: 10,
  date: formatDate(),
  dispatchObject: '',
  dealerCode: '',
  modelCodeNew: '',
}

async function resourceUsage(callback) {
  await Http.get('resourceUsage', params, (res) => {
    callback && callback(res);
  })
}

class DriveResources extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: {
        data: now,
        dispatchObject: '',
        dealerCode: ''
      },
      resourceEngineer: [],
      resourceObject: [],
      resourceDealer: [],
      resourceUsage: [],
      tableHeight: 500,
      selectedIndex: 0,
      curTit: '',
    };
  }

  async componentWillMount() {
    const that = this;
    Http.get('resourceObject', function (data) {
      if (data) {
        const resourceObject = genPickData(data, 'centerName', 'centerCode');
        that.setState({ resourceObject })
      }
    })
    Http.get('resourceDealer', function (data) {
      if (data) {
        const resourceDealer = genPickData(data, 'dealerName', 'dealerCode');
        that.setState({ resourceDealer })
      }
    })
    resourceUsage((getD) => {
      that.setState({
        resourceUsage: getD['list'] || [],
        curTit: getD['list'][0]['modelName'] + ' - ' + getD['list'][0]['licenseNo'],
        selectedIndex: 0
      })
    });

  }


  componentDidMount() {
    // resourceUsage((result) => {
    //   console.log(result['list'])
    //   debugger;
    // });

  }

  // componentWillReceiveProps(nextProps){
  //   debugger;
  //   if(nextProps.isShow){
  //     debugger;
  //   }
  // }

  btnAction(_name) {
    console.log(_name);
    window.location.href = `./drive/${_name}`;
  }

  pagination(type) {
    let curNum = this.state.selectedIndex;
    type === 'add' ? ++curNum : --curNum;
    this.setState({ selectedIndex: curNum });
  }
  confirm() {
    this.props.confirm(false)
  }

  reset() {
    params = {
      pageNum: 1,
      pageSize: 10,
      date: formatDate(),
      dispatchObject: '',
      dealerCode: '',
      modelCodeNew: '',
    };
    this.setState({
      query: {
        data: formatDate(),
        resourceObject: '',
        resourceDealer: ''
      }
    })
  }
  PickerOK(v, key) {
    const _this = this;
    const obj = {
      key: v
    }
    params[key] = v;
    resourceUsage((getD) => {
      if (getD) {
        _this.setState({
          query: Object.assign(this.state.query, obj),
          resourceUsage: getD['list'] || [],
          curTit: getD['list'][0]['modelName'] + ' - ' + getD['list'][0]['licenseNo'],
          selectedIndex: 0
        });
      }
    });
  }
  render() {
    return (
      <div className={s.wrap}>
        <DatePicker
          mode="date"
          title="请选择日期"
          extra={formatDate()}
          value={this.state.query['date']}
          onChange={v => this.setState({ query: Object.assign(this.state.query, { date: v }) })}
          onOk={v => this.PickerOK.bind(this, v, 'date')()}
        >
          <List.Item arrow="horizontal">日期</List.Item>
        </DatePicker>

        <Picker
          cols={1}
          data={this.state['resourceObject']}
          cascade={false}
          extra={this.state.query['dispatchObject']}
          value={this.state.query['dispatchObject']}
          onChange={v => this.setState({ query: Object.assign(this.state.query, { dispatchObject: v }) })}
          onOk={v => this.PickerOK.bind(this, v, 'dispatchObject')()}
        >
          <List.Item arrow="horizontal">分拨对象</List.Item>
        </Picker>


        <Picker
          cols={1}
          data={this.state['resourceDealer']}
          cascade={false}
          extra={this.state.query['dealerCode']}
          value={this.state.query['dealerCode']}
          onChange={v => this.setState({ query: Object.assign(this.state.query, { dealerCode: v }) })}
          onOk={v => this.PickerOK.bind(this, v, 'dealerCode')()}
        >
          <List.Item arrow="horizontal">经销商</List.Item>
        </Picker>
        <div className={s.confirmSelect}>
          <span onClick={this.reset.bind(this)}>重 置</span>
          <span onClick={this.confirm.bind(this)}>返 回</span>
        </div>
        <div className={s.shat}>
          <div className={s.defination}>资源名称</div>
          <div className={s.plate}>
            <span><i className={s.iconfont} onClick={this.pagination.bind(this, 'subtract')}>&#xe6ec;</i></span>
            <span>{this.state.curTit}</span>
            <span><i className={s.iconfont} onClick={this.pagination.bind(this, 'add')}>&#xe600;</i></span>
          </div>
          {this.state.resourceUsage.length
            ? <Carousel
              autoplay={false}
              infinite
              selectedIndex={this.state.selectedIndex}
              beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
              afterChange={index => this.setState({ selectedIndex: index, curTit: this.state.resourceUsage[index]['modelName'] + ' - ' + this.state.resourceUsage[index]['licenseNo'] })}
            >
              {this.state.resourceUsage.map((item, index) => {
                return (<div className={s.action} key={index}>
                  <table border="0" cellSpacing="0" cellPadding="0">
                    <tbody>
                      {item.timeList.map((ite, i) => {
                        const l = (i + 1);
                        if (l % 2) {
                          return (
                            <tr key={i}>
                              <td>{ite.time}</td>
                              <td>{ite.resource}</td>
                              <td>{item.timeList[l] ? item.timeList[l].time : ''}</td>
                              <td>{item.timeList[l] ? item.timeList[l].resource : ''}</td>
                            </tr>
                          )
                        }
                      })}
                    </tbody>
                  </table>
                </div>)
              })}
            </Carousel>
            : ''}



        </div>

      </div>

    );
  }

}

export default withStyles(s)(DriveResources)

