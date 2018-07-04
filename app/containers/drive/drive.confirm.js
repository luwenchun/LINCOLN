// /**
//  *试驾待确认
//  */

// import React from 'react';
// import moment from 'moment';
// import Layout from '../../components/Layout';
// import Resources from './components/drive.resources';
// import Http from '../../utils/http'
// import PropTypes from 'prop-types';
// import { Flex, Toast, Picker, DatePicker, InputItem, WhiteSpace, WingBlank, List, TextareaItem, Button } from 'antd-mobile';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import conSheet from './style/drive.confirm.scss';
// import history from '../../history';
// import index from 'antd-mobile/lib/locale-provider';
// import { debug } from 'util';
// const title = '试驾待确认';

// const Item = List.Item;
// const Brief = Item.Brief;

// const apis = [
//   { "id": "driverInfo", "url": "dealer/api/v1/driverInfo" },
//   { "id": "carList", "url": "dealer/api/v1/carList" },
//   { "id": "carTypeList", "url": "dealer/api/v1/carTypeList" },
//   { "id": "engineer", "url": "dealer/api/v1/engineer" },
//   { "id": "confirmOrder", "url": "dealer/api/v1/confirmOrder" },
//   { "id": "cancel", "url": "dealer/api/v1/cancel" },
//   { "id": "tagsList", "url": "dealer/api/v1/tagsList" },
// ];

// Http.setDomainUrl("/wx/ent/api/");

// Http.setMutiApi(apis);

// const nowTimeStamp = Date.now();
// const now = new Date(nowTimeStamp);
// function formatDate(date) {
//   return moment(date).format('YYYY-MM-DD HH:mm');
// }

// const engineerList = [];

// function genPickData(sourceArr = [], label, value) {
//   let result = [];
//   sourceArr.forEach((item) => {
//     console.log(item)
//     let obj = {};
//     obj['label'] = typeof item === 'object' ? item[label] : item;
//     obj['value'] = typeof item === 'object' ? item[value] : item;
//     result.push(obj);
//   })
//   return [result];
// }



// class DriveConfirm extends React.Component {
//   constructor(props) {
//     super(props);
//     const userInfo = Object.assign({}, this.props['user']);
//     this.state = {
//       userInfo: {},
//       pickerCarList: [],
//       pickerEngineerList: [],
//       driverInfo: {

//       },
//       formValue: {
//         address: '',
//         applyTime: null,
//         appreciationEngineer: '',
//         driveId: '',
//         licenseNo: '',
//         carCode: '',
//         remark: '',
//         tags: [],
//         carType: 0,
//       },
//       tagsList: [],
//       carTypeList: [],
//       resShow: false,
//       fet: true,
//       aa:{
//         bb:'w',
//         kk:'r'
//       }

//     };

//     console.log('===userInfo-----', userInfo)
//     this.state['userInfo']['userId'] = userInfo['userId'];
//     this.state['userInfo']['mobile'] = userInfo['mobile'];
//     this.state['userInfo']['driveId'] = userInfo['driveId'];
//     this.state['userInfo']['carCode'] = userInfo['carCode'];
//     this.state['formValue']['driveId'] = userInfo['driveId'];
//     this.state['formValue']['carCode'] = userInfo['carCode'];

//     const carListParams = {
//       driveId: userInfo['driveId'],
//       modelCodeNew: userInfo['carCode']
//     }


//     Http.get('carList', carListParams, (callback) => {
//       console.log('===获取车辆列表返回值====', callback);
//       const genData = genPickData(callback);
//       console.log('===获取车辆列表返回值genData====', genData);
//       this.setState({ pickerCarList: genData }, (state) => {
//         console.log(state);
//       });
//     });

//   }
//   componentDidMount() {
//     const _this = this;
//     let defaultTagsList = [];
//     const driverInfoParams = {
//       driveId: this.state['userInfo']['driveId'],
//       userId: this.state['userInfo']['userId']
//     }

//     Http.get('driverInfo', driverInfoParams, (callback) => {
//       console.log('待接单详情数据=====', callback);
//       const formValue = _this.state.formValue;
//       defaultTagsList = typeof callback['tagsName'] === 'string' ? callback['tagsName'].split(',') : [];
//       let tags = typeof callback['tags'] === 'string' ? callback['tags'].split(',') : [];
//       tags.forEach((item, index) => {
//         tags[index] = Number(item);
//       });
//       _this.setState({
//         driverInfo: Object.assign({}, callback),
//         formValue: Object.assign(formValue, {
//           address: callback['address'],
//           remark: callback['remark'],
//           tags,
//         })
//       });

//       if (callback['applyTime'] && callback['applyTime'].length) {
//         let Y = callback['applyTime'].slice(0, 4);
//         let M = callback['applyTime'].slice(5, 7);
//         let D = callback['applyTime'].slice(8, 10);
//         let H = callback['applyTime'].slice(11, 13);
//         let m = callback['applyTime'].slice(14, 16);
//         M = Number(M) + 1 ;
//         M = String(M > 9 ? M +'' : M +'0');
//         const applyTime = new Date(Y,M,D,H,m);
//         debugger;
//         _this.setState(Object.assign(formValue, {
//           applyTime
//         }))
//       } else {
//         _this.setState(Object.assign(formValue, {
//           applyTime: null
//         }))
//       }
//       Http.get('carTypeList', { carType: callback['carType'] }, (result) => {
//         const genData = genPickData(result, 'carName', 'carCode');
//         _this.setState({ carTypeList: genData });
//       })

//       Http.get('tagsList', (tagsList) => {
//         tagsList.forEach((item, index) => {
//           for (let i = 0, ele; (ele = defaultTagsList[i]) != undefined; i++) {
//             if (item['tagName'] === ele) {
//               item.selected = true;
//               break;
//             } else {
//               item.selected = false;
//             }
//           }
//         })
//         _this.setState({ tagsList })
//       })
//     })

//   }


//   goBack = () => {
//     const requireInfo = {
//       userid: this.state['userInfo']['userId'],
//       mobile: this.state['userInfo']['mobile'],
//     }
//     console.log('跳转不同详情====', requireInfo);
//     window.location.href = `/wx/ent/drive${Http.transGetParams(requireInfo)}`;
//   }


//   ok = () => {

//     const params = Object.assign({}, this.state['formValue']);

//     if (!this.state.formValue['applyTime']) {
//       Toast.fail('请确认预约时间！', 1);
//       return
//     }

//     if (!params['carType'][0]) {
//       Toast.fail('请确认预约车型！', 1);
//       return
//     }

//     if (params['licenseNo'] == '') {
//       Toast.fail('请确认预约车辆！', 1);
//       return
//     }

//     if (params['appreciationEngineer'] == '') {
//       Toast.fail('请确认预约鉴赏工程师！', 1);
//       return
//     }

//     if (params['address'] == '' && this.state.driverInfo['address'] == '') {
//       Toast.fail('请填写详细地址！', 1);
//       return
//     }

//     params['address'] = (params['address'] == '' ? this.state.driverInfo['address'] : params['address']);
//     params['applyTime'] = formatDate(params['applyTime']);
//     params['licenseNo'] = params['licenseNo'].join(',');
//     params['appreciationEngineer'] = params['appreciationEngineer'].join(',');
//     params['tags'] = params['tags'].join(',');
//     params['carCode'] = params['carType'][0];
//     params['carType'] = params['carType'][0];
//     console.log('params==ok===', params)
//     const that = this;
//     Http.post('confirmOrder', params, function (callback) {
//       console.log('试驾单确认返回值====', callback);
//       Toast.success('成功确认！', 1);
//       let timer = setTimeout(() => {
//         that.goBack();
//         clearTimeout(timer);
//       }, 2000)
//     })

//   }

//   cancel = () => {
//     console.log('====cancel')
//     const that = this;
//     const cancelParams = { driveId: this.state['formValue']['driveId'] };
//     Http.get('cancel', cancelParams, function (callback) {
//       console.log('试驾单取消返回值====', callback);
//       Toast.success('成功确认！', 1);
//       let timer = setTimeout(() => {
//         that.goBack();
//         clearTimeout(timer);
//       }, 2000)
//     })

//   }


//   btnAction(typeName) {
//     console.log('===typeName===', typeName);
//     console.log('===formValue===', this.state['formValue']);
//     this[typeName]();

//   }

//   handleChange(key, value) {
//     let arrName = key.split('.');
//     let newState = {};
//     newState[arrName[0]] = {};
//     newState[arrName[0]][arrName[1]] = value;
//     const temp = Object.assign({}, this.state[arrName[0]], newState[arrName[0]]);
//     const tar = {};
//     tar[arrName[0]] = temp;
//     this.setState(tar);
//   }

//   clearEngineer() {
//     this.setState({
//       pickerEngineerList: [],
//       formValue: Object.assign(this.state['formValue'], { appreciationEngineer: '' })
//     })
//   }

//   getEngineerPickerList(licenseNo) {
//     this.clearEngineer();
//     Http.get('engineer', { licenseNo: licenseNo }, (callback) => {
//       const genData = genPickData(callback, 'userName', 'userId');
//       console.log(genData);
//       this.setState({ pickerEngineerList: genData })
//     })

//   }


//   pickerCarChanged = (v) => {
//     console.log('pickerCarChanged===v==', v);
//     // this.setState({ formValue: Object.assign(this.state.formValue,{carCode:v}) })

//     this.getEngineerPickerList(v[0]);
//   }

//   selectResource() {
//     this.setState({
//       resShow: !this.state.resShow
//     })
//   }
//   conf(v) {
//     this.setState({ resShow: v })
//   }
//   render() {
//     const info = this.state.driverInfo;
//     return (
//       <div className={conSheet.wrap}>
//         <form>
//           <List style={{ backgroundColor: 'white' }} className="picker-list">
//             <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{ float: 'right' }}>{info['driveId']}</span></div>}>
//               预约编号
//           </Item>
//             <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{ float: 'right', color: 'red' }}>{info['statusName']}</span></div>}>
//               预约状态
//           </Item>
//             {/* {info['applyTimeName'] === '指定日期'
//               ? <Item multipleLine extra={(info['applyTime'] ? '指定日期,' + info['applyTime'] : '')}>
//                 预约时间
//                 </Item>
//               : <Item multipleLine extra={(info['applyTimeName'])}>
//                 预约时间
//                </Item>
//             }
//             <DatePicker
//                // value={this.state.formValue['applyTime']}
//                 onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { applyTime: v }) })}
//               >
//                 <List.Item arrow="horizontal">&nbsp;</List.Item>
//             </DatePicker> */}
//             <Item multipleLine extra={
//               <DatePicker
//                 extra={!this.state.formValue['applyTime'] ? "" : '请选择'}
//                 value={this.state.formValue['applyTime']}
//                 onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { applyTime: v }) })}

//               >
//                 <List.Item arrow="horizontal">{info['applyTimeName'] ? info['applyTimeName'] + ' , ' : ''}</List.Item>
//               </DatePicker>}>
//               预约时间
//             </Item>




//             <div className={conSheet.selectZY}><span onClick={this.selectResource.bind(this)}>查看资源</span></div>


//             <Picker
//               cols={1}
//               data={this.state['carTypeList']}
//               cascade={false}
//               extra={(info['carTypeName'] ? info['carTypeName'] : '')}
//               value={this.state.formValue['carType']}
//               onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { carType: v }) })}
//               onOk={v => this.setState({ formValue: Object.assign(this.state.formValue, { carType: v }) })}
//             >
//               <List.Item arrow="horizontal">试驾车型</List.Item>
//             </Picker>

//             <Item multipleLine extra={(info['proviceName'] ? info['proviceName'] : '') + (info['proviceName'] && info['regionName'] ? ' , ' : '') + (info['regionName'] ? info['regionName'] : '')}>
//               预约地址
//           </Item>
//             <InputItem
//               clear
//               style={{ textAlign: 'right' }}
//               onChange={this.handleChange.bind(this, 'formValue.address')}
//               value={this.state.formValue['address']}
//               defaultValue={this.state.driverInfo.address}
//               placeholder="请输入"
//             >详细地址</InputItem>
//             <Item multipleLine extra={info['userName'] + ' , ' + (info['appellation'] ? info['appellation'] : '女士')}>
//               预约人
//           </Item>
//             <Item multipleLine extra={<a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={conSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a>}>
//               联系电话
//           </Item>
//             <Item multipleLine extra={''}>
//               标签
//               <div className={conSheet['tagsList']}>{this.state.tagsList.map((item, index) => {
//                 return (
//                   <span key={index} className={item.selected ? conSheet['select'] : conSheet['noselect']} onClick={this.tagNameClick.bind(this, index)}>{item.tagName}</span>
//                 )
//               })}</div>
//             </Item>

//             <InputItem className={conSheet['input']}
//               clear
//               style={{ textAlign: 'right' }}
//               onChange={this.handleChange.bind(this, 'formValue.remark')}
//               value={this.state['formValue']['remark']}
//               placeholder="请输入"
//             >备注</InputItem>

//             <Picker
//               cols={1}
//               data={this.state['pickerCarList']}
//               cascade={false}
//               extra={!this.state.formValue['carType'][0] ? '请先选择车型！' : '请选择'}
//               disabled={!this.state.formValue['carType'][0]}
//               value={this.state.formValue['licenseNo']}
//               onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { licenseNo: v }), fet: false })}
//               onOk={v => this.pickerCarChanged.bind(this, v)(v)}
//             >
//               <List.Item arrow="horizontal">车辆</List.Item>
//             </Picker>

//             <Picker
//               cols={1}
//               data={this.state['pickerEngineerList']}
//               cascade={false}
//               extra="请选择"
//               disabled={this.state.fet}
//               value={this.state.formValue['appreciationEngineer']}
//               onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { appreciationEngineer: v }) })}
//               onOk={v => this.setState({ formValue: Object.assign(this.state.formValue, { appreciationEngineer: v }) })}
//             >
//               <List.Item arrow="horizontal">鉴赏工程师</List.Item>
//             </Picker>


//           </List>
//           <WhiteSpace />
//           <WingBlank>
//             <Flex>
//               <Flex.Item><Button type="primary" onClick={this.btnAction.bind(this, 'cancel')}>用户取消</Button></Flex.Item>
//               <Flex.Item><Button type="primary" onClick={this.btnAction.bind(this, 'ok')}>确认</Button></Flex.Item>
//             </Flex>
//           </WingBlank>
//         </form>
//         {this.state.resShow
//           ? <Resources isShow={this.state.resShow} confirm={this.conf.bind(this)} />
//           : ''
//         }
//       </div>

//     );
//   }
//   tagNameClick(i) {
//     const cur = Object.assign([], this.state.tagsList);
//     const curTag = Object.assign({}, this.state['formValue']);
//     let isBe = false, beIndex = 0;         // 是否存在
//     cur[i].selected = !cur[i].selected;

//     for (let j = 0, ele; (ele = curTag['tags'][j]) != undefined; j++) {
//       if (ele == cur[i]['tagId']) {
//         isBe = 0;
//         beIndex = index;
//         debugger;
//         break;
//       } else {
//         isBe = 1
//       }
//     }

//     isBe = !curTag['tags'].length ? 1 : isBe;
//     isBe ? curTag['tags'].push(cur[i]['tagId']) : curTag['tags'].splice(beIndex, 1);
//     this.setState({ tagsList: cur, formValue: curTag });
//     console.log(curTag.tags);
//   }

// }

// const DriveConfirmComp = withStyles(conSheet)(DriveConfirm);

// function action({ path, query, hash }) {
//   const userInfo = query;
//   return {
//     chunks: ['drive.confirm'],
//     title,
//     component: (
//       <Layout hide={true}>
//         <DriveConfirmComp user={userInfo} />
//       </Layout>
//     ),
//   };
// }

// export default action;
/**
 *试驾预约列表
 */

import React from 'react';
import './style/drive.detail.scss';
//import Layout from '../../components/Layout';
import Http from '../../utils/http';
import { Tag } from 'antd-mobile';
//import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';

import {SERVER_BASE_PATH} from '../../global.config';
const title = '试驾预约详情';

const apis = [
  {"id":"driverInfo","url":"/dealer/api/v1/driverInfo"},
];

Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);


class DriveConfirm extends React.Component {
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
    var mockData = JSON.parse('{"resultCode":1,"data":{"driveId":1719,"sex":null,"userName":"飒飒飒飒","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"飒飒飒飒","carType":1,"carCode":"GMC6440E","applyTimeType":5,"applyTime":"2020-07-08 17:18:00","tags":null,"remark":"11","dispatchObject":"CS001","manager":"39986","licenseNo":"浙C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 15:14:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":"林肯MKC","statusName":"待确认","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":"13466961040","color":null,"remind":"","applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":"18156252217","proviceName":"湖南省","tagsName":"","key":null},"errMsg":"","time":"2018-05-28 17:30:42","success":true,"elapsedMilliseconds":0}');

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
              <div className={'rc'}>{this.state.detailInfo['applyTimeName']+","+this.state.detailInfo['applyTime']}<br/>
              <div>
               日历
              <button type="button" className={'btn-primary'} style={{width:90,height:34,display:"block",float:"right"}} onClick={this.btnAction.bind(this,'detail')}>查看资源</button>
              </div>
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

            {
              this.state.detailInfo['status']=="20131004"?<div className={'row'}>
              <div className={'rt'}>试驾地址：</div>
              <div className={'rc'}>{this.state.detailInfo['address']}</div>
            </div>:""

            }



           

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
              <div className={'rc'} style={{width:240,height:80,background:"white",marginBottom:10}}>
              {this.state.detailInfo['remark']==""?"-":this.state.detailInfo['remark']}
             
              </div>
            </div>

         <div className={'row'}>
              <div className={'rt'}>车辆：</div>
              <div className={'rc'}>
              <select style={{width:100,height:38,marginRight:10}}>
                <option>{this.state.detailInfo['carTypeName']}</option>
                <option>1</option>
                <option>2</option>
              </select>
              <select style={{width:150,height:38}}>
                <option>{this.state.detailInfo['licenseNo']}</option>
                <option>1</option>
                <option>2</option>
              </select>
              </div>
            </div>

              <div className={'row'} style={{marginTop:10}}>
              <div className={'rt'}>鉴赏工程师：</div>
              <div className={'rc'}>
              <select style={{width:150,height:40}}>
                <option>{this.state.detailInfo['appreciationEngineerName']}</option>
                <option>1</option>
                <option>2</option>
              </select>
              </div>
              </div>


             
             
                <button type="button" className={'btn-primary'} style={{width:180,borderRadius:8}} onClick={this.btnAction.bind(this,'detail')}>用户取消</button>
                <button type="button" className={'btn-primary'} style={{width:180,borderRadius:8}} onClick={this.btnAction.bind(this,'detail')}>确认</button>
              
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

export default DriveConfirm;
