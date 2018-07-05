
import React from 'react';
import './style/drive.detail.scss';
//import Layout from '../../components/Layout';
import Http from '../../utils/http';
import { Tag, List, Checkbox, Flex  } from 'antd-mobile';
//import PropTypes from 'prop-types';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';

import {SERVER_BASE_PATH} from '../../global.config';
const title = '试驾预约详情';

const apis = [
  {"id":"driverInfo","url":"/dealer/api/v1/driverInfo"},
];

Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class DriveDispatch extends React.Component {

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
    var mockData = JSON.parse('{"resultCode":1,"data":{"driveId":1719,"sex":null,"userName":"飒飒飒飒","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"飒飒飒飒","carType":1,"carCode":"GMC6440E","applyTimeType":5,"applyTime":"2020-07-08 17:18:00","tags":null,"remark":"11","dispatchObject":"CS001","manager":"39986","licenseNo":"浙-C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 15:14:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":"林肯MKC","statusName":"待试驾","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":"13466961040","color":null,"remind":"","applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":"18156252217","proviceName":"湖南省","tagsName":"","key":null},"errMsg":"","time":"2018-05-28 17:30:42","success":true,"elapsedMilliseconds":0}');

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

  onChange = (val) => {
    console.log(val);
  }
 
  render() {
    const data = [
      { value: 0, label: '《林肯中国远程试乘试驾客户反馈表》' },
      { value: 1, label: '《林肯车型宣传彩页》' },
      { value: 2, label: '好客包' },
      { value: 3, label: '《林肯中国试乘试驾协议》' },
      { value: 4, label: '林肯雨伞' },
      { value: 5, label: '干湿纸巾' },
      { value: 6, label: '手机充电器' },
      { value: 7, label: '水笔，写字板' },
    ];
     const data1 = [
      { value: 0, label: '个性化客户体验(毛毯，热水壶)' },
      { value: 1, label: 'iPad' },
      { value: 2, label: 'DVD' },
      { value: 3, label: '小礼品' }
    ];
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
              <div className={'rc'}>{this.state.detailInfo['tags']==null?"——":this.state.detailInfo['tags']}</div>
            </div>

                <div className={'row'}>
              <div className={'rt'}>备注：</div>
              <div className={'rc'} style={{width:240,height:60,marginBottom:10}}>
              {this.state.detailInfo['remark']==""?"-":this.state.detailInfo['remark']}
             
              </div>
            </div>

         <div className={'row'} style={{marginBottom:50}}>
              <div className={'rt'}>车辆：</div>
              <div className={'rc'}>
              <select style={{width:100,height:38,marginRight:10,background:"#f9f9f9"}}>
                <option>{this.state.detailInfo['carTypeName']}</option>
                <option>1</option>
                <option>2</option>
              </select>
              <select style={{width:150,height:38,background:"#f9f9f9"}}>
                <option>{this.state.detailInfo['licenseNo']}</option>
                <option>1</option>
                <option>2</option>
              </select>
              </div>
            </div>
            <div className={'row'} style={{height:10,background:"white"}}></div>
               <div className={'row'} >
                 <span style={{align:"center",marginLeft:150,marginBottom:20}}><i></i>行前确认</span>
            </div>
              <div className={'row'}>
              <div className={'row'}>必需物品：</div>
              <div className={'row'} style={{background:"white"}}>
        {data.map(i => (
          <CheckboxItem key={i.value} onChange={() => this.onChange(i.value)}>
            {i.label}
          </CheckboxItem>
        ))}
       
     </div>
     <div className={'row'}>可选物品：</div>
              <div className={'row'}>
        {data1.map(i => (
          <CheckboxItem key={i.value} onChange={() => this.onChange(i.value)}>
            {i.label}
          </CheckboxItem>
        ))}
       
     </div>
            </div>
                <button type="button" className={'btn-primary'} style={{borderRadius:8}} onClick={this.btnAction.bind(this,'detail')}>立即出发</button>
              
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

export default DriveDispatch;
// /**
//  *试驾待分拨
//  */

// import React from 'react';
// import moment from 'moment';
// // import Layout from '../../components/Layout';
// import Http from '../../utils/http'
// // import PropTypes from 'prop-types';
// import { Flex, Toast, Picker, DatePicker, InputItem, WhiteSpace, WingBlank, List, TextareaItem, Button } from 'antd-mobile';
// import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import disSheet from './style/drive.dispatch.scss';
// const title = '试驾待分拨';
// const Item = List.Item;
// const Brief = Item.Brief;

// const apis = [
//   { "id": "driverInfo", "url": "dealer/api/v1/driverInfo" },
//   { "id": "dispatchCarList", "url": "dealer/api/v1/dispatchCarList" },
//   { "id": "dispatchs", "url": "dealer/api/v1/dispatchs" },
//   { "id": "engineer", "url": "dealer/api/v1/engineer" },
//   { "id": "dispatch", "url": "dealer/api/v1/dispatch" },
// ];

// Http.setDomainUrl("/wx/ent/api/");
// //Http.setDomainUrl("http://121.196.193.149:9020/");
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



// class DriveDispatch extends React.Component {
//   constructor(props) {
//     super(props);
//     const userInfo = Object.assign({}, this.props['user']);
//     this.state = {
//       userInfo: {},
//       pickerCarList: [],
//       pickerObjectList: [],
//       pickerEngineerList: [],
//       driverInfo: {

//       },
//       formValue: {
//         appreciationEngineer: '',
//         driveId: '',
//         dispatchObject: '',
//         licenseNo: '',
//         carCode: '',
//       },

//     };

//     console.log('===userInfo-----', userInfo)
//     this.state['userInfo']['userId'] = userInfo['userId'];
//     this.state['userInfo']['mobile'] = userInfo['mobile'];
//     this.state['userInfo']['driveId'] = userInfo['driveId'];
//     this.state['userInfo']['carCode'] = userInfo['carCode'];
//     this.state['formValue']['driveId'] = userInfo['driveId'];
//     this.state['formValue']['carCode'] = userInfo['carCode'];



//     const code={
//       driveId:this.state['userInfo']['driveId']
//     }
//     Http.get('dispatchs',code, (callback) => {
//       console.log('===获取分拨对象列表====', callback);
//       const genData = genPickData(callback, 'centerName', 'centerCode');
//       console.log('===获取分拨对象列表返回值genData====', genData);
//       this.setState({ pickerObjectList: genData }, (state) => {
//         console.log(state);
//       });
//     });





//   }

//   componentDidMount() {
//     console.log("this.state['userInfo']=====", this.state['userInfo'])
//     const driverInfoParams = {
//       driveId: this.state['userInfo']['driveId'],
//       userId: this.state['userInfo']['userId']
//     }
//     Http.get('driverInfo', driverInfoParams, (callback) => {

//       console.log('待接单详情数据=====', callback);
//       this.setState({
//         driverInfo: Object.assign({}, callback)
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


//   dispatch = () => {

//     const params = Object.assign({}, this.state['formValue']);
//     if (params['dispatchObject'] == '') {
//       Toast.fail('请选择分拨对象！', 1);
//       return
//     }

//     if (params['licenseNo'] == '') {
//       Toast.fail('请选择车辆！', 1);
//       return
//     }

//     if (params['appreciationEngineer'] == '') {
//       Toast.fail('请选择鉴赏工程师！', 1);
//       return
//     }



//     params['licenseNo'] = params['licenseNo'].join(',');
//     params['appreciationEngineer'] = params['appreciationEngineer'].join(',');
//     params['dispatchObject'] = params['dispatchObject'].join(',');
//     delete params['carCode'];
//     console.log('params==ok===', params)
//     const that = this;
//     Http.post('dispatch', params, function (callback) {
//       console.log('试驾单分拨返回值====', callback);
//       if(callback.errorCode=="1"){
//         Toast.success(callback.errorMsg, 1);
//         let timer = setTimeout(() => {
//           that.goBack();
//           clearTimeout(timer);
//         }, 2000)
//         }else{
//           Toast.fail(callback.errorMsg, 1);
//         }
     
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

//   clearCarList() {
//     this.setState({
//       pickerCarList: [],
//       formValue: Object.assign(this.state.formValue, { licenseNo: '' })
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

//   getCarPickerList(dispatchObject) {
//     console.log('===获取分拨车辆===', this.state['formValue']['carCode']);
//     this.clearEngineer();
//     this.clearCarList();
//     const carListParams = {
//       dispatchObject: dispatchObject,
//       driveId: this.state['driverInfo']['driveId']
//     }


//     Http.get('dispatchCarList', carListParams, (callback) => {
//       console.log('===获取分拨车辆列表返回值====', callback);
//       const genData = genPickData(callback);
//       console.log('===获取分拨车辆列表返回值genData====', genData);
//       this.setState({ pickerCarList: genData }, (state) => {
//         console.log(state);
//       });
//     });

//   }

//   pickerObjectChanged = (v) => {
//     console.log('pickerCarChanged===v==', v);
//     // this.setState({ formValue: Object.assign(this.state.formValue,{carCode:v}) })

//     this.getCarPickerList(v[0]);
//   }

//   pickerCarChanged = (v) => {
//     console.log('pickerCarChanged===v==', v);
//     // this.setState({ formValue: Object.assign(this.state.formValue,{carCode:v}) })

//     this.getEngineerPickerList(v[0]);
//   }


//   render() {
//     const that = this;
//     const info = this.state['driverInfo'];
//     function getData() {
//       Http.get('driverInfo', function (data) {
//         that.state['detailInfo'] = Object.assign({}, data);
//       })
//     }

//     return (
//       <div className={disSheet.wrap}>
//         <form>
//           <List style={{ backgroundColor: 'white' }} className="picker-list">
//             <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{float:'right'}}>{info['driveId']}</span></div>}>
//               预约编号
//           </Item>
//           <Item multipleLine extra={<div style={{ display: 'inline-block' }}><span style={{float:'right',color:'red'}}>{info['statusName']}</span></div>}>
//               预约状态
//           </Item>
//             <Item multipleLine extra={(info['applyTimeName'] ? info['applyTimeName'] : '') + (info['applyTimeName'] && info['applyTime'] ? ' , ' : '') + (info['applyTime'] ? info['applyTime'] : '')}>
//               预约时间
//           </Item>
//             <Item multipleLine extra={(info['carTypeName'] ? info['carTypeName'] : '') + (info['carTypeName'] && info['carName'] ? ' , ' : '') + (info['carName'] ? info['carName'] : '')}>
//               试驾车型
//           </Item>

//             <Item multipleLine extra={(info['proviceName'] ? info['proviceName'] : '') + (info['regionName'] ? info['regionName'] : '') + (info['address'] ? info['address'] : '')}>
//               试驾地址
//           </Item>

//             <Item multipleLine extra={info['userName'] + ' , ' + (info['appellation'] ? info['appellation'] : '女士')}>
//               预约人
//           </Item>

//             <Item multipleLine extra={<a href={info.userPhone ? 'tel:' + info.userPhone : ''}><i className={disSheet.iconfont} style={{ color: 'red' }}>&#xe8a0;</i>{info.userPhone}</a>}>
//               联系电话
//           </Item>

//             <Item multipleLine extra={info['tagsName'] ? info['tagsName'] : ''}>
//               标签
//           </Item>

//             <Item multipleLine extra={this.state['driverInfo']['remark']}>
//               备注
//           </Item>

//             <Picker
//               cols={1}
//               data={this.state['pickerObjectList']}
//               cascade={false}
//               extra="请选择"
//               value={this.state.formValue['dispatchObject']}
//               onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { dispatchObject: v }) })}
//               onOk={v => this.pickerObjectChanged.bind(this, v)(v)}
//             >
//               <List.Item arrow="horizontal">分拨对象</List.Item>
//             </Picker>

//             <Picker
//               cols={1}
//               data={this.state['pickerCarList']}
//               cascade={false}
//               extra="请选择"
//               value={this.state.formValue['licenseNo']}
//               onChange={v => this.setState({ formValue: Object.assign(this.state.formValue, { licenseNo: v }) })}
//               onOk={v => this.pickerCarChanged.bind(this, v)(v)}
//             >
//               <List.Item arrow="horizontal">车辆</List.Item>
//             </Picker>

//             <Picker
//               cols={1}
//               data={this.state['pickerEngineerList']}
//               cascade={false}
//               extra="请选择"
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

//               <Flex.Item><Button type="primary" onClick={this.btnAction.bind(this, 'dispatch')}>分拨</Button></Flex.Item>

//             </Flex>
//           </WingBlank>
//         </form>
//       </div>

//     );
//   }

// }

// // const DriveDispatchComp = withStyles(disSheet)(DriveDispatch);

// // function action({ path, query, hash }) {
// //   const userInfo = query;
// //   return {
// //     chunks: ['drive.dispatch'],
// //     title,
// //     component: (
// //       <Layout hide={true}>
// //         <DriveDispatchComp user={userInfo} />
// //       </Layout>
// //     ),
// //   };
// // }

// export default DriveDispatch;
