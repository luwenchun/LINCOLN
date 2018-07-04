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
const title = '试驾中';

const apis = [
  {"id":"driverInfo","url":"/dealer/api/v1/driverInfo"},
];

Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);


class DriveDoing extends React.Component {
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
    var mockData = JSON.parse('{"resultCode":1,"data":{"driveId":1719,"sex":null,"userName":"飒飒飒飒","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"飒飒飒飒","carType":1,"carCode":"GMC6440E","applyTimeType":5,"applyTime":"2020-07-08 17:18:00","tags":null,"remark":"11","dispatchObject":"CS001","manager":"39986","licenseNo":"浙C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 15:14:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":"林肯MKC","statusName":"试驾中","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":"13466961040","color":null,"remind":"","applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":"18156252217","proviceName":"湖南省","tagsName":"","key":null},"errMsg":"","time":"2018-05-28 17:30:42","success":true,"elapsedMilliseconds":0}');

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

            <div className={'row'}>
              <div className={'rt'}>预约人：</div>
              <div className={'rc'}>{this.state.detailInfo['userName']+','+1}</div>
            </div>
            
            <div className={'row'}>
              <div className={'rt'}>联系电话：</div>
              <div className={'rc'}>{this.state.detailInfo['statusName']=="待接单"?"接单后显示详情":this.state.detailInfo['userPhone']}</div>
             
              <div className={'row'}>
              <div className={'rt'}>标签：</div>
              <div className={'rc'}>{this.state.detailInfo['userName']+','+1}</div>
            </div>

           



             
              <div className={'toolbox'}>
                <button type="button" className={'btn-primary'}  onClick={this.btnAction.bind(this,'detail')}>扫描二维码完成试驾</button>
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

export default DriveDoing;

