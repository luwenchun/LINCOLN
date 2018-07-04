// /**
//  *试驾已出发
//  */

// import React from 'react';
// // import Layout from '../../components/Layout';
// import Http from '../../utils/http'
// // import { WECHAT_SERVER_CONF } from '../../middleware/config';
// // import jssha from 'jssha';
// import { Toast } from 'antd-mobile';
// // import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import s from './style/drive.startoff.scss';
// import $ from 'jquery';
// import { setInterval, clearInterval } from 'timers';
// import { debug } from 'util';

// const title = '试驾已出发';

// const apis = [
//   { "id": "driverInfo", "url": "dealer/api/v1/driverInfo" },
//   { "id": "driveAgreement", "url": "dealer/api/v1/driveAgreement" },
//   { "id": "getTicket", "url": "getTicket", 'format': false },
// ];

// Http.setDomainUrl("/wx/ent/api/");

// Http.setMutiApi(apis);

// let accessToken = '';
// let ticket = '';

// class DriveStartoff extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       driveId: '',
//       statusName: '',
//       applyTime: '',
//       carCode: '',
//       address: '',
//       userName: '',
//       userPhone: '',
//       licenseNo: '',
//       appreciationEngineerName: '',
//       success: { display: 'block' },
//       determine: { display: 'block' },
//       width: ['一', '二', '三', '四'],
//       add: [],
//       number: 0,
//       numberTo: ['一'],
//       // driveId: this.props.query.driveId,
//       driverInfo: {},
//       locImages: [],
//       wxImages: [],
//     }
//     this.successed = this.successed.bind(this);
//   }
//   componentWillMount() {
//     const driveId = this.state.driveId;
//     Http.get('driverInfo', { driveId }, (driverInfo) => {
//       this.setState({ driverInfo });

//     })
//     // if(this.props['title']['query']['driveId']){
//     //   this.setState({
//     //     driveId:this.props['title']['query']['driveId'],
//     //     statusName:this.props['title']['query']['statusName'],
//     //   })

//     //   const code={
//     //     driveId:this.state.driveId
//     //   }
//     //   Http.get('driverInfo',code,(result)=>{
//     //     this.setState({
//     //       driverInfo:result.data
//     //     })
//     //  })
//     // }
//     if (this.state.statusName == '试驾中') {
//       this.setState({
//         determine: { display: 'none' },
//       })
//     } else if (this.state.statusName == '已出发') {
//       this.setState({
//         success: { display: 'none' },
//       })
//     }

//   }
//   componentDidMount() {
//     const _this = this;
//     this.createdTag('script', 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js');
//     const timer = setInterval(() => {
//       try {
//         _this.weixin();
//         clearInterval(timer);
//       } catch (e) {
//         console.log(e.error)
//       }
//     }, 1000)

//   }
//   render() {
//     const success = this.state.success;
//     const determine = this.state.determine;
//     const info = this.state.driverInfo;
//     return (
//       <div className={s.order}>
//         <div className={s.head}>
//           <ul>
//             <li>
//               <div>NO:</div>
//               <div>{info.driveId}</div>
//             </li>
//             <li>
//               <div style={{float:'left'}}>预约状态:</div>
//               <div style={{color:'red',float:'right'}}>{info.statusName}</div>
//             </li>
//             <li><span>预约时间:</span>{(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}</li>
//             <li><span>试驾车型:</span>{(info['carName'] ? info['carName'] : '') + (info['carName'] && info['carCode'] ? ' , ' : '') + (info['carCode'] ? info['carCode'] : '')}</li>
//             <li><span>试驾地址:</span>{(info['proviceName']?info['proviceName']:'')+(info['regionName']?info['regionName']:'')+(info['address']?info['address']:'')}</li>
//             <li><span>预约人:</span>{info['userName'] + ' , ' + (info['appellation'] ? info['appellation'] : '女士')}</li>
//             <li><span>联系电话:</span><a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={s.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a></li>
//             <li><span>标签:</span>{info['tagsName'] ? info['tagsName'] : ''}</li>
//             <li><span>备注:</span>{info.remark}</li>
//             <li>
//               <span>车辆:</span>
//               <span>{info.carCode}</span>
//               <span>{info.licenseNo}</span>
//             </li>
//           </ul>
//         </div>
//         <div className={s.meterial}>
//           <ul>
//             <li><i className={s.iconfont}>&#xe661;</i>资料上传</li>
//             {
//               this.state.add.map((item, index) => {
//                 return (
//                   <li key={index}>
//                     <div>试驾协议{item}</div>
//                     <div>
//                       {this.state.locImages.length && this.state.locImages[index]
//                         ? <img src={this.state.locImages[index]} />
//                         : <span onClick={this.fileChange.bind(this)}><i className={s.iconfont} alt='选图'>&#xe69f;</i></span>}
//                       <span onClick={this.lose.bind(this, index)}><i className={s.iconfont} alt='移除'>&#xe68d;</i></span>
//                     </div>
//                   </li>
//                 )
//               })
//             }
//             <li>
//               <div>试驾协议{this.state.numberTo}</div>
//               <div>
//                 {this.state.locImages.length && this.state.locImages[3]
//                   ? <img src={this.state.locImages[3]} />
//                   : <span onClick={this.fileChange.bind(this)}><i className={s.iconfont} alt='选图'>&#xe69f;</i></span>}
                
//                 {this.state.locImages.length && this.state.locImages[3]
//                   ? <span onClick={this.lose.bind(this, 3)}><i className={s.iconfont} alt='移除'>&#xe68d;</i></span>
//                   : <span onClick={this.plus.bind(this, this)}><i className={s.iconfont} alt='添加'>&#xe631;</i></span>}
                
//               </div>
//             </li>
//           </ul>
//         </div>
//         {/* <div className={s.complete} style={success} onClick={this.successed}>
//           完成试驾
//            </div> */}
//         <div className={s.complete} sytle={determine} onClick={this.successed}>
//           开始试驾
//            </div>
//       </div>

//     );
//   }
//   // 选择图片上传
//   fileChange(e) {
//     const _this = this;
//     if (this.state.wxAuth) {
//       // 判断当前客户端版本是否支持指定JS接口
//       wx.checkJsApi({
//         jsApiList: ['chooseImage', 'uploadImage', 'previewImage', 'getLocalImgData'],// 需要检测的JS接口列表，所有JS接口列表见附录2,
//         success: function (res) {
//           // 以键值对的形式返回，可用的api值true，不可用为false
//           // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
//           var check = res.checkResult.chooseImage;
//           if (check) {
//             // 拍照或从手机相册中选图接口
//             wx.chooseImage({
//               count: 1, // 默认9
//               sizeType: ['original', 'compressed'],  // 可以指定是原图还是压缩图，默认二者都有
//               sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//               success: function (res) {
//                 var localIds = res.localIds;
//                 // 上传图片接口
//                 wx.uploadImage({
//                   localId: localIds[0],
//                   isShowProgressTips: 1,
//                   success: function (res) {
//                     // _this.sendImage(res.serverId);   // res.serverId 微信服务器ID
//                     let wxImages = Object.assign([], _this.state.wxImages);
//                     wxImages.push(res.serverId);
//                     _this.setState({ wxImages });
//                     if (window.__wxjs_is_wkwebview) { 
//                       // IOS 预览
//                       wx.getLocalImgData({
//                         localId: localIds[0],
//                         success: (res) => {
//                           // var localData = res.localData;  // 图片的localID 本地src
//                           let locImages = Object.assign([], _this.state.locImages);
//                           locImages.push(res.localData);
//                           _this.setState({ locImages }, ()=>{
//                             setTimeout(()=>{
//                               _this.plus(_this);
//                             }, 0)
//                           });
                         
//                         },
//                         fail: (res) => { },
//                         compvare: (res) => { },

//                       })
//                     } else {    // Android 预览
//                       let locImages = Object.assign([], _this.state.locImages);
//                       locImages.push(localIds[0]);
//                       _this.setState({ locImages }, ()=>{
//                         setTimeout(()=>{
//                           _this.plus(_this);
//                         }, 0)
//                       });
//                     }
//                   },
//                   fail: function (res) {
//                     // alert(JSON.stringify(res));
//                     alert("发送图片失败！");
//                   }
//                 });
//               },
//               fail: function (res) {
//                 // alert(JSON.stringify(res));
//                 alert("该版本不支持发送图片！！！");
//               }
//             });

//           } else {
//             // alert("该版本不支持发送图片！！");
//           }
//         }
//       });
//     } else {
//       // alert("该版本不支持发送图片！");
//     }

//   }

//   async weixin() {
//     // 获取Token、jsapi_ticket
//     await Http.get('getTicket', (res) => {
//       accessToken = res["ENT-WECHAT-DRIVE-ACCESSTOKEN"];
//       ticket = res['JSAPI_TICKET'];
//     });
//     const _this = this;
//     let ticketRst = 'jsapi_ticket=' + ticket + '&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=' + location.href.split('#')[0];
//     let sha = new jssha("SHA-1", "TEXT");
//     sha.update(ticketRst);
//     let signatures = sha.getHash("HEX");
//     wx.config({
//       debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//       beta: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//       appId: WECHAT_SERVER_CONF.corpid, // 必填，企业号的唯一标识，此处填写企业号corpid
//       timestamp: 1414587457, // 必填，生成签名的时间戳
//       nonceStr: "Wm3WZYTPz0wzccnW", // 必填，生成签名的随机串
//       signature: signatures,// 必填，签名，见附录1
//       jsApiList: ['chooseImage', 'uploadImage', 'getLocalImgData', 'previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//     });
//     wx.error(function (res) {
//       console.log("wx:error" + JSON.stringify(res));
//       _this.setState({ wxAuth: false });
//     });
//     wx.ready(function () {
//       wx.hideOptionMenu();
//       _this.setState({ wxAuth: true });
//     });
//   }
//   lose(index) {
//     let locImages = Object.assign([], this.state.locImages);
//     let wxImages = Object.assign([], this.state.wxImages);
//     locImages.splice(index, 1);
//     wxImages.splice(index, 1);
//     this.setState({
//       number: this.state.number - 1,
//     })
//     this.state.add.pop()
//     this.setState({
//       locImages,
//       wxImages,
//       add: this.state.add,
//       numberTo: this.state.width[this.state.number - 1],
//     })
//   }
//   plus(that) {
//     const _this = that;
//     if (_this.state.number <= 2) {
//       _this.setState({
//         add: Object.assign(_this.state.add, _this.state.add.push(_this.state.width[_this.state.number])),
//         numberTo: _this.state.width[_this.state.number + 1],
//         number: _this.state.number + 1,
//       })
//     }
//   }

//   successed() {
//     if(!this.state.locImages.length || !this.state.wxImages.length){
//       Toast.fail('请上传图片!!!', 1);
//       return !1;
//     }
//     const userId = this.props.query.userId;
//     const mobile = this.props.query.mobile;
//     const that = this;
//     const params = {
//       accessToken,
//       driveId: parseInt(this.state['driveId']),
//       userPhone: mobile,
//       driveMediaIdList: Object.assign([], this.state.wxImages)
//     }
//     Http.post('driveAgreement', params, (callback) => {
//       Toast.success('操作成功！', 1);
//       let timer = setTimeout(function () {
//         clearTimeout(timer);
//         location.href = '/wx/ent/drive?userid=' + userId + '&mobile=' + mobile;
//       }, 1200)
//     })

//   }
//   createdTag(tagName, href) {
//     let tag;
//     if (tagName === 'link') {
//       tag = document.createElement('link');
//       tag.setAttribute('rel', 'stylesheet');
//       tag.setAttribute('type', 'text/css');
//       tag.setAttribute('href', href);
//     } else if (tagName === 'script') {
//       tag = document.createElement('script');
//       tag.setAttribute('src', href);
//     }
//     document.head.appendChild(tag);
//   }

// }

// const DriveStartoffComp = withStyles(s)(DriveStartoff);

// function action({ path, query, hash }) {
//   return {
//     chunks: ['drive.startoff'],
//     title,
//     component: (
//       <Layout hide={true}>
//         <DriveStartoffComp query={query} />
//       </Layout>
//     ),
//   };
// }

// export default DriveStartoff;

// /**
//  *试驾预约试驾中
//  */

// import React from 'react';
// // import Layout from '../../components/Layout';
// import Http from '../../utils/http'
// // import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import doSheet from './style/drive.doing.scss';
// const title = '试驾中';

// const apis = [
//   {"id":"driverInfo","url":"dealer/api/v1/driverInfo"},
//   {"id":"driveFinished","url":"dealer/api/v1/driveFinished"},
// ];

// Http.setDomainUrl("/wx/ent/api/");

// Http.setMutiApi(apis);


// class DriveDoing extends React.Component {
//   constructor(props) {
   
//     super(props);

//     const userInfo = Object.assign({},this.props['user']);

//     this.state = {
//       userInfo:userInfo,
//       params:{
//         userId:'',
//         mobile:'',
//         carCode:''
//       },
//       driverInfo:{

//       }
//     };

//     this.state['params']['userId'] = this.props['user']['userId'];
//     this.state['params']['mobile'] = this.props['user']['mobile'];


//   }


//   btnAction(_driveId){

    
//     const userId = this.state['userInfo']['userId'];
//     const mobile = this.state['userInfo']['mobile'];
//     const params = {
//         userid:userId,
//         mobile:mobile
//     }

//     console.log('试驾中点击完成试驾按钮触发传递参数=====',{driveId:_driveId,userId:userId})
//     Http.get('driveFinished',{driveId:_driveId,userId:userId},(callback)=>{

//       console.log('完成试驾按钮callback=====',this.state['userInfo']['userId']); 


//       window.location.href = `/wx/ent/drive${Http.transGetParams(params)}`;
      
//     })
   
//   }


//   componentDidMount(){
    
//     const driverInfoParams = {
//       driveId:this.state['userInfo']['driveId'],
//       userId:this.state['userInfo']['userId']
//     }
//     Http.get('driverInfo',driverInfoParams,(callback)=>{

//       console.log('试驾中试驾详情数据=====',callback);
//       this.setState({
//         driverInfo:Object.assign({},callback)
//       })
      
//     })

//   }

 
//   render() {
//     const that = this;
//     const info = this.state.driverInfo;
//     return (
//       <div className={doSheet.wrap}>
//             <div className={doSheet['form']}>
//           <div className={doSheet['content']}>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']} style={{width:'28%'}}>预约编号：</div>
//               <div className={doSheet['rc']} style={{width:'60%'}}>{info['driveId']}</div>
//               <div className={doSheet['st']}>试驾中</div>
//             </div>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>试驾车型：</div>
//               <div className={doSheet['rc']}>{(info['carTypeName'] ? info['carTypeName'] : '')+(info['carTypeName']&&info['carName']?' , ':'')+(info['carName'] ? info['carName'] : '')}</div>
//             </div>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>预约时间：</div>
//               <div className={doSheet['rc']}>{(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}</div>
//             </div>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>试驾地址：</div>
//               <div className={doSheet['rc']}>{(info['proviceName']?info['proviceName']:'')+(info['regionName']?info['regionName']:'')+(info['address']?info['address']:'')}</div>
//             </div>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>预约人：</div>
//               <div className={doSheet['rc']}>{info['userName']+' , '+(info['appellation']?info['appellation']:'女士')}</div>
//             </div>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>联系电话：</div>
//               <div className={doSheet['rc']}><a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={doSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a></div>
//             </div>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>标签：</div>
//               <div className={doSheet['rc']}>{info['tagsName']?info['tagsName']:''}</div>
//             </div>
            
//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>备注：</div>
//               <div className={doSheet['rc']}>{info['remark']}</div>
//             </div>

//             <div className={doSheet['row']}>
//               <div className={doSheet['rt']}>车辆：</div>
//               <div className={doSheet['rc']}>{info['carCode']}-{info['licenseNo']}</div>
//             </div>

//           </div>
//         </div>

//       <div className={doSheet['toolbox']}>
//         <button type="button" className={doSheet['btn-primary']} onClick={this.btnAction.bind(this,info['driveId'])}>扫描二维码完成试驾</button>
//       </div>

//       </div>

//     );
//   }
 
// }

// // const DriveDoingComp = withStyles(doSheet)(DriveDoing);

// // function action({path, query, hash}) {
// //   const userInfo = query;
// //   return {
// //     chunks: ['drive.doing'],
// //     title,
// //     component: (
// //       <Layout hide={true}>
// //         <DriveDoingComp user={userInfo} />
// //       </Layout>
// //     ),
// //   };
// // }

// export default DriveDoing;

/**
 *试驾预约列表
 */

import React from 'react';
import './style/drive.detail.scss';
//import Layout from '../../components/Layout';
import Http from '../../utils/http'
//import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';

import {SERVER_BASE_PATH} from '../../global.config';
const title = '试驾预约开始';

const apis = [
  {"id":"driverInfo","url":"/dealer/api/v1/driverInfo"},
];

Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);


class DriveStartoff extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detailInfo:{
          
      }
    };
  }

  componentDidMount() {
    var params,
        that = this;

    function getUrlParams() {
       var url = location.href,
           params = {};
       url = url.split('?');
       url = url[1] ? url[1].split('&') : [];
       
       url.forEach((v, i) => {
          var item = v.split('='),
              key  = item[0];
          if (key && item[1]) {
              params[key] = item[1];
          }    
       });

       return params;
    }
    params = getUrlParams();
    // Test data
    var mockData = JSON.parse('{"resultCode":1,"data":{"driveId":1719,"sex":null,"userName":"飒飒飒飒","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"飒飒飒飒","carType":1,"carCode":"GMC6440E","applyTimeType":5,"applyTime":"2020-07-08 17:18:00","tags":null,"remark":"11","dispatchObject":"CS001","manager":"39986","licenseNo":"浙-C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 15:14:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":"林肯MKC","statusName":"已出发","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":"13466961040","color":null,"remind":"","applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":"18156252217","proviceName":"湖南省","tagsName":"","key":null},"errMsg":"","time":"2018-05-28 17:30:42","success":true,"elapsedMilliseconds":0}');

    this.setState({detailInfo: mockData.data});
    //that.state['detailInfo'] = Object.assign({},mockData.data); 
    // Http.get('driverInfo', params, function(data){
    //   that.state['detailInfo'] = Object.assign({},data);
    // });
  }


  btnAction(_name){
    console.log(_name);
    window.location.href = `./drive/${_name}`;
  }

 
  render() {
    const that = this;
    function getData(){
      Http.get('driverInfo',function(data){
        that.state['detailInfo'] = Object.assign({},data);
      })
    }
    console.log(this.state['detailInfo'])
    return (
      <div className={'wrap'}>
            <div className={'form'}>
            <div className={'header'}>
              <span>{this.state.detailInfo['applyTime']}</span>
              <span className={'status'}>{this.state.detailInfo['statusName']}</span>
            
            </div>
          <div className={'content'}>

            <div className={'row'}>
              <div className={'rt'}>NO：</div>
              <div className={'rc'}>{this.state.detailInfo['driveId']}</div>
            </div>
        
            <div className={'row'}>
              <div className={'rt'}>预约时间：</div>
              <div className={'rc'}>{this.state.detailInfo['applyTimeName']+","+this.state.detailInfo['applyTime']}
              {/* <button type="button" className={'btn-primary'} style={{width:90,height:30}} onClick={this.btnAction.bind(this,'detail')}>查看资源</button> */}
              </div>
              
            </div>


            <div className={'row'}>
              <div className={'rt'}>试驾车型：</div>
              <div className={'rc'}>{this.state.detailInfo['carCode']}</div>
            </div>

            <div className={'row'}>
              <div className={'rt'}>试驾地址：</div>
              <div className={'rc'}>{this.state.detailInfo['address']}</div>
            </div>

            {/* <div className={'row'}>
              <div className={'rt'}>预约人：</div>
              <div className={'rc'}>{this.state.detailInfo['userName']+','+1}</div>
            </div> */}
            
            {/* <div className={'row'}>
              <div className={'rt'}>联系电话：</div>
              <div className={'rc'}>{this.state.detailInfo['statusName']=="待接单"?"接单后显示详情":this.state.detailInfo['userPhone']}</div>
             
              <div className={'row'}>
              <div className={'rt'}>标签：</div>
              <div className={'rc'}>{this.state.detailInfo['userName']+','+1}</div>
            </div>

           



             
          </div> */}
           <div className={'row'}>
              <div className={'rt'}>预约人：</div>
              <div className={'rc'}>{this.state.detailInfo['userName']+','+this.state.detailInfo['appellation']}</div>
            </div>
            
            <div className={'row'}>
              <div className={'rt'}>联系电话：</div>
              <div className={'rc'}>{this.state.detailInfo['statusName']=="待接单"?"接单后显示详情":this.state.detailInfo['userPhone']}</div>
              
              <div className={'row'}>
              <div className={'rt'}>标签：</div>
              <div className={'rc'}>{this.state.detailInfo['userName']+','+1}</div>
            </div>

                <div className={'row'}>
              <div className={'rt'}>备注：</div>
              <div className={'rc'}>
              {this.state.detailInfo['remark']==""?"-":this.state.detailInfo['remark']}
             
              </div>
            </div>

         <div className={'row'}>
              <div className={'rt'}>车辆：</div>
              <div className={'rc'}>
             
               {this.state.detailInfo['carTypeName']}{this.state.detailInfo['licenseNo']}
            
              </div>
            </div>
            {/* <div className={'meterial'}>
              <ul>
                  <li><i className={'iconfont'}>&#xe661;</i>资料上传</li>
                  {
                    this.state.add.map((item,index)=>{
                       return(
                        <li key={index}>
                          <div>试驾协议{item}</div>
                          <div>
                              <span><i className={s.iconfont}>&#xe69f;</i></span>
                              <span onClick={this.lose}><i className={s.iconfont}>&#xe68d;</i></span>
                          </div>
                        </li>
                       )  
                    })
                  }
                  <li>
                  <div>试驾协议{this.state.numberTo}</div>
                  <div>
                      <span><i className={'iconfont'}>&#xe69f;</i></span>
                      <span onClick={this.plus}><i className={'iconfont'}>&#xe631;</i></span>
                  </div>
                  </li>
              </ul>
          </div> */}


              <div className={'toolbox'}>
                <button type="button" className={'btn-primary'}  onClick={this.btnAction.bind(this,'detail')}>开始试驾</button>
                {/* <button type="button" className={'btn-primary'} style={{width:150}} onClick={this.btnAction.bind(this,'detail')}>立即接单</button> */}
              </div>
            </div>

           

        </div>
      </div>
</div>
    );
  }
 
}

//const DriveDetailComp = withStyles(DLDSheet)(DriveDetail);

// function action(params) {
//   return {
//     chunks: ['drive.detail'],
//     title,
//     component: (
//       //<Layout  hide={true}>
//         <DriveDetailComp />
//       //</Layout>
//     ),
//   };
// }

export default DriveStartoff;

