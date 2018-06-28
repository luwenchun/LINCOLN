/**
 *试驾已试驾
 */

import React from 'react';
import moment from 'moment';
import Layout from '../../components/Layout';
import { Flex, Toast, Picker, DatePicker, InputItem, WhiteSpace, WingBlank, List, TextareaItem, Button } from 'antd-mobile';
import Http from '../../utils/http';
import { WECHAT_SERVER_CONF } from '../../middleware/config';
import jssha from 'jssha';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import donSheet from './style/drive.done.scss';
import { debug } from 'util';
import { fail } from 'assert';

const title = '试驾已试驾';

const apis = [
  { "id": "driverInfo", "url": "dealer/api/v1/driverInfo", "mock": "", "format": false },
  { "id": "driveFinished", "url": "dealer/api/v1/driveFinished", "mock": "", "format": false },
  { "id": "drivePotential", "url": "dealer/api/v1/drivePotential", "mock": "", "format": false },
  { "id": "evaluate", "url": "dealer/api/v1/evaluate", "mock": "", "format": false },
  { "id": "driveFinished", "url": "dealer/api/v1/driveFinished", "mock": "", "format": false },
  { "id": "getTicket", "url": "getTicket", 'format': false },
];

let accessToken = '';
let ticket = '';


Http.setDomainUrl("/wx/ent/api/");
//Http.setDomainUrl("http://121.196.193.149:9020/")
Http.setMutiApi(apis);

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD HH:mm');
}

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

class DriveDone extends React.Component {
  constructor(props) {
    super(props);
    const userInfo = Object.assign({}, props['user']);
    this.state = {
      number: false,
      add: [],
      number: 0,
      driveId: '',
      wxAuth: false,
      driveFinished: {
        list: [							//后一页面评价项目
          {
            detailId: 1,					//评价项目ID
            starContent: "对比车型",		//评价项目名
          },
          {
            detailId: 2,
            starContent: "购买类型",
            selected: '',
            type: [
              {
                label: '首购',
                value: 0,
              },
              {
                label: '增购',
                value: 1,
              },
              {
                label: '换购',
                value: 2,
              },
            ]
          },
          {
            detailId: 3,
            starContent: "目前座驾",
          },
          {
            detailId: 4,
            starContent: "购车方案",
            selected: '',
            type: [
              {
                label: '全款',
                value: 0
              },
              {
                label: '贷款',
                value: 1
              },
            ]
          },
          {
            detailId: 5,
            starContent: "预计购车时间",
            selected: '',
            type: [
              {
                label: '7天',
                value: 0
              },
              {
                label: '15天',
                value: 1
              },
              {
                label: '30天',
                value: 2
              },
              {
                label: '2-3个月',
                value: 3
              }
            ]
          },
          {
            detailId: 6,
            starContent: "意向交车方式",
            selected: '',
            type: [
              {
                label: '上门交车服务',
                value: 0
              },
              {
                label: '展厅交车服务',
                value: 1
              },

            ]

          },
        ],
      },
      driverInfo: {},
      locImages: [],
      wxImages: [],
      formValue: {
        compareModel: '',
        buyType: '',
        purchasingPlan: '',
        currentCar: "",
        deliveryTime: null,
        deliveryType: '',
        remark: '',
        // createBy: 0,
        // createDate: '',
        driveId: '',
        // updateBy: 0,
        // updateDate: ''
      },
      addDrive: [{
        name: '',
        phone: '',
      }],
    }
    this.lose = this.lose.bind(this);
    this.plus = this.plus.bind(this);
    this.but = this.but.bind(this);
    this.quick = this.quick.bind(this);
    this.state.driveId = this.props['user']['driveId'];
  }

  componentWillMount() {


    const code = {
      driveId: this.state.driveId
    }
    Http.get('driverInfo', code, (result) => {
      this.setState({
        driverInfo: result.data
      })
    })



  }
  componentDidMount() {

    const _this = this;
    this.createdTag('script', 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js');
    // const Totall = document.getElementById('one1').getElementsByTagName('i');
    //   for (let i = 0; i < Totall.length; i++) {
    //   console.log('11')
    //   let chat = Totall[i];
    //   chat.index = i;
    //   //  chat.addEventListener('click',function(e){

    //   //  },true);
    //   chat.addEventListener("click", function () {
    //     alert('111');
    //   })
    //   //  chat.onclick=function(){
    //   //    console.log(this.index)
    //   //  }
    // }
    // window.many = {
    //   hander: function (a) {
    //     for (let i = 0; i < a.length; i++) {
    //       let chat = Totall[i];
    //       chat.index = i;
    //       Totall[i].onClick = function () {
    //         alert(this.index)
    //       }
    //     }
    //   }
    // }


    const timer = setInterval(() => {
      try {
        _this.weixin();
        clearInterval(timer);
      } catch (e) {
        console.log(e.error)
      }
    }, 1000)

  }

  btnAction(_name) {
    console.log(_name);
    window.location.href = `./drive/${_name}`;
  }

  lose() {
    this.setState({
      number: this.state.number - 1,
    })
    this.state.add.pop()
    this.setState({
      add: this.state.add,
    })
  }

  plus() {
    if (this.state.number <= 2) {
      const addDrive = Object.assign([], this.state.addDrive);
      addDrive.push({
        name: '',
        phone: '',
      })
      this.setState({
        number: this.state.number + 1,
        add: Object.assign(this.state.add, this.state.add.push('1')),
        addDrive,
      })
    }
  }


  render() {
    const that = this;
    const info = this.state.driverInfo;
    const list = this.state.driveFinished.list;

    return (
      <div className={donSheet.wrap}>
        <div className={donSheet.order} style={{ height: 'auto' }}>
          <div className={donSheet.head}>
            <ul>
              <li>
                <div>NO:</div>
                <div>{info.driveId}</div>
              </li>
              <li>
                <div style={{ float: 'left' }}>预约状态:</div>
                <div style={{ float: 'right', color: 'red' }}>{info.statusName}</div>
              </li>
              <li>预约时间: {(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}</li>
              <li>试驾车型: {(info['carTypeName'] ? info['carTypeName'] : '') + (info['carTypeName'] && info['carName'] ? ' , ' : '') + (info['carName'] ? info['carName'] : '')}</li>
              <li>试驾地址: {(info['proviceName'] ? info['proviceName'] : '') + (info['regionName'] ? info['regionName'] : '') + (info['address'] ? info['address'] : '')}</li>
              <li>预约人: {info['userName'] + ' , ' + (info['appellation'] ? info['appellation'] : '女士')}</li>
              <li>联系电话: <a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={donSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a></li>
              <li>标签: {info['tagsName'] ? info['tagsName'] : ''}</li>
              <li>备注: {info.remark}</li>
              <li>车辆: {info.carCode}-{info.licenseNo}</li>
            </ul>
          </div>
          <div className={donSheet.meterial}>
            <ul>
              {
                this.state.add.map((items, index) => {
                  return (
                    <li key={index} style={{ borderBottom: '1px solid #afacac' }}>
                      <div>试驾人</div>
                      <div>
                        <input type="text" placeholder='请输入' onChange={this.addDriveValue.bind(this, 'name', (index + 1))} />
                        <span onClick={this.lose}><i className={donSheet.iconfont} style={{ float: 'right' }}>&#xe68d;</i></span>
                      </div>
                      <div style={{ float: 'none' }}>
                        <span style={{ float: 'left' }}>联系电话</span>
                        <span>
                          <input type="text" style={{ textAlign: 'left', marginTop: '0.3rem' }} placeholder='请输入' onChange={this.addDriveValue.bind(this, 'phone', (index + 1))} />
                        </span>
                      </div>
                    </li>
                  )
                })
              }
              <li>
                <div>试驾人</div>
                <div>
                  <input type="text" placeholder='请输入' value={this.state.addDrive[0]['name']} onChange={this.addDriveValue.bind(this, 'name', 0)} />
                  <span onClick={this.plus}><i className={donSheet.iconfont} style={{ float: 'right' }}>&#xe631;</i></span>
                </div>
                <div style={{ float: 'none' }}>
                  <span style={{ float: 'left' }}>联系电话</span>
                  <span>
                    <input type="text" style={{ textAlign: 'left', marginTop: '0.3rem' }} placeholder='请输入' value={this.state.addDrive[0]['phone']} onChange={this.addDriveValue.bind(this, 'phone', 0)} />
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div className={donSheet.meterial} onClick={this.but}>
            <ul>
              <li><i className={donSheet.iconfont}>&#xe61a;</i>结果反馈</li>
              <div className={donSheet.showImg}>
                {this.state.locImages.map((item, index) => {
                  return (
                    <a key={index}>
                      <img src={item} />
                      <span onClick={this.removeImg.bind(this, index)}>删除</span>
                    </a>
                  )

                })}
                {/* <a>
                  <img src={require("./images/drive.list.png")} />
                  <span onClick={this.removeImg.bind(this)}>删除</span>
                </a> */}
                <div className={`${donSheet.back} ${this.state.locImages.length <= 3 ? donSheet.show : donSheet.hide}`} onClick={this.fileChange.bind(this)}>
                  <div>
                    <span><i className={donSheet.iconfont}>&#xe69f;</i></span>
                  </div>
                  <div>
                    <span>反馈图片</span>
                    <span>点击上传</span>
                  </div>
                </div>
              </div>
              <li><i className={donSheet.iconfont}>&#xe61a;</i>购车意向</li>

              <li>
                <div>{list[0].starContent}</div>
                <div className={donSheet.action} id='one1'>
                  <input type="text" placeholder='请输入' onChange={this.inputChange.bind(this, 'compareModel')} />
                </div>
              </li>

              <Picker
                cols={1}
                data={[list[1]['type']]}
                cascade={false}
                extra="请选择"
                value={this.state['formValue']['buyType']}
                onChange={v => this.picChange.bind(this, v, 'buyType')(v, 'buyType')}>
                <List.Item arrow="horizontal">{list[1].starContent}</List.Item>
              </Picker>

              {this.state['formValue']['buyType'] != 0
                ? <li>
                  <div>{list[2].starContent}</div>
                  <div className={donSheet.action} id='one1'>
                    <input type="text" placeholder='请输入' onChange={this.inputChange.bind(this, 'currentCar')} />
                  </div>
                </li>
                : ''}

              <Picker
                cols={1}
                data={[list[3]['type']]}
                cascade={false}
                extra="请选择"
                value={this.state['formValue']['purchasingPlan']}
                onChange={v => this.picChange.bind(this, v, 'purchasingPlan')(v, 'purchasingPlan')}>
                <List.Item arrow="horizontal">{list[3].starContent}</List.Item>
              </Picker>

              <Picker
                cols={1}
                data={[list[4]['type']]}
                cascade={false}
                extra="请选择"
                value={this.state['formValue']['deliveryTime']}
                onChange={v => this.picChange.bind(this, v, 'deliveryTime')(v, 'deliveryTime')}>
                <List.Item arrow="horizontal">{list[4].starContent}</List.Item>
              </Picker>

              <Picker
                cols={1}
                data={[list[5]['type']]}
                cascade={false}
                extra="请选择"
                value={this.state['formValue']['deliveryType']}
                onChange={v => this.picChange.bind(this, v, 'deliveryType')(v, 'deliveryType')}>
                <List.Item arrow="horizontal">{list[5].starContent}</List.Item>
              </Picker>

            </ul>
          </div>
          <div className={donSheet.remark}>
            <div>备注:</div>
            <div>
              <textarea placeholder='说说有点和美中不足的地方' onChange={this.inputChange.bind(this, 'remark')}></textarea>
            </div>
          </div>

          <div className={donSheet.testdrive} onClick={this.quick}>
            立即反馈
             </div>
        </div>
      </div>

    );
  }

  addDriveValue(key, i, e) {
    const addDrive = Object.assign([], this.state.addDrive);
    addDrive[i][key] = e.target.value;
    this.setState({ addDrive })
  }
  // 选择图片上传
  fileChange(e) {
    const _this = this;
    if (this.state.wxAuth) {
      // 判断当前客户端版本是否支持指定JS接口
      wx.checkJsApi({
        jsApiList: ['chooseImage', 'uploadImage', 'previewImage', 'getLocalImgData'],// 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res) {
          // 以键值对的形式返回，可用的api值true，不可用为false
          // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
          var check = res.checkResult.chooseImage;
          if (check) {
            // 拍照或从手机相册中选图接口
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['original', 'compressed'],  // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                var localIds = res.localIds;
                // 上传图片接口
                wx.uploadImage({
                  localId: localIds[0],
                  isShowProgressTips: 1,
                  success: function (res) {
                    // _this.sendImage(res.serverId);   // res.serverId 微信服务器ID
                    let wxImages = Object.assign([], _this.state.wxImages);
                    wxImages.push(res.serverId);
                    _this.setState({ wxImages });
                    if (window.__wxjs_is_wkwebview) {
                      // IOS 预览
                      wx.getLocalImgData({
                        localId: localIds[0],
                        success: (res) => {
                          // var localData = res.localData;  // 图片的localID 本地src
                          let locImages = Object.assign([], _this.state.locImages);
                          locImages.push(res.localData);
                          _this.setState({ locImages }, () => {
                            // alert(JSON.stringify(_this.state.locImages));
                          });

                        },
                        fail: (res) => { },
                        compvare: (res) => { },

                      })
                    } else {    // Android 预览
                      let locImages = Object.assign([], _this.state.locImages);
                      locImages.push(localIds[0]);
                      _this.setState({ locImages });
                    }
                  },
                  fail: function (res) {
                    // alert(JSON.stringify(res));
                    alert("发送图片失败！");
                  }
                });
              },
              fail: function (res) {
                // alert(JSON.stringify(res));
                alert("该版本不支持发送图片！！！");
              }
            });

          } else {
            // alert("该版本不支持发送图片！！");
          }
        }
      });
    } else {
      // alert("该版本不支持发送图片！");
    }

  }

  async weixin() {
    // 获取Token、jsapi_ticket
    await Http.get('getTicket', (res) => {
      accessToken = res["ENT-WECHAT-DRIVE-ACCESSTOKEN"];
      ticket = res['JSAPI_TICKET'];
    });
    const _this = this;
    let ticketRst = 'jsapi_ticket=' + ticket + '&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=' + location.href.split('#')[0];
    let sha = new jssha("SHA-1", "TEXT");
    sha.update(ticketRst);
    let signatures = sha.getHash("HEX");
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      beta: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: WECHAT_SERVER_CONF.corpid, // 必填，企业号的唯一标识，此处填写企业号corpid
      timestamp: 1414587457, // 必填，生成签名的时间戳
      nonceStr: "Wm3WZYTPz0wzccnW", // 必填，生成签名的随机串
      signature: signatures,// 必填，签名，见附录1
      jsApiList: ['chooseImage', 'uploadImage', 'getLocalImgData', 'previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.error(function (res) {
      console.log("wx:error" + JSON.stringify(res));
      _this.setState({ wxAuth: false });
    });
    wx.ready(function () {
      wx.hideOptionMenu();
      _this.setState({ wxAuth: true });
    });
  }
  but() {

  }
  picChange(val, key) {
    // const cur = Object.assign({}, this.state.driveFinished);
    const obj = {};
    obj[key] = val;
    this.setState({
      formValue: { ...this.state.formValue, ...obj }
    });
    // console.log('val===', val, '===key===', key);

  }
  inputChange(key, e) {
    const obj = {};
    obj[key] = e.target.value;
    this.setState({
      formValue: { ...this.state.formValue, ...obj }
    });
  }
  removeImg(index) {
    let locImages = Object.assign([], this.state.locImages);
    let wxImages = Object.assign([], this.state.wxImages);
    locImages.splice(index, 1);
    wxImages.splice(index, 1);
    this.setState({ wxImages, locImages })
  }
  async quick() {
    if (!this.state.locImages.length || !this.state.wxImages.length) {
      Toast.fail('请上传图片!!!', 1);
      return false;
    }

    if (!(this.state.formValue.compareModel)) {
      Toast.fail('请填写对比车型!!!', 1);
      return false;
    }
    if (!(this.state.formValue.deliveryTime)) {
      Toast.fail('请选择预计购车时间!!!', 1);
      return false;
    }
    if (!this.state.formValue.deliveryType) {
      Toast.fail('请选择意向交车方式!!!', 1);
      return false;
    }
    const userId = this.props['user']['userId'];
    const mobile = this.props['user']['mobile'];
    const param = {
      accessToken,
      driveId: this.state.driveId + '',
      driveMediaIdList: Object.assign([], this.state.wxImages)
    }

    const query = Object.assign({}, this.state.formValue);
    query['driveId'] = this.state.driverInfo.driveId;
    query['purchasingPlan'] = query['purchasingPlan'][0]
    query['deliveryTime'] = query['deliveryTime'][0]
    query['deliveryType'] = query['deliveryType'][0]
    query['buyType'] = query['buyType'][0]

    // 购车意向
    await Http.post('drivePotential', query, (res) => {
    })


    // 新增试驾人
    let driveQuery = {
      driveId: this.state.driverInfo.driveId,
    }
    this.state.addDrive.forEach((item, index) => {
      if (item.name.length && item.phone.length) {
        driveQuery['driveName' + (index + 1)] = item.name;
        driveQuery['drivePhone' + (index + 1)] = item.phone;
      }
    })
    if (driveQuery['driveName1']) {
      await Http.post('driveFinished', driveQuery, (res) => {
        // console.log(res)
      })
    }

    console.log('drive-done传递参数===', param);
    await Http.post('evaluate', param, (callback) => {
      Toast.success('操作成功！', 1);
      let timer = setTimeout(function () {
        clearTimeout(timer);
        location.href = '/wx/ent/drive?userid=' + userId + '&mobile=' + mobile;
      }, 1200)
    })

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

}

const DriveDoneComp = withStyles(donSheet)(DriveDone);

function action({ path, query, hash }) {
  const userInfo = query;
  return {
    chunks: ['drive.done'],
    title,
    component: (
      <Layout hide={true}>
        <DriveDoneComp user={userInfo} />
      </Layout>
    ),
  };
}

export default action;
