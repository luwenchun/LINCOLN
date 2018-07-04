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
const title = '试驾预约详情';

const apis = [
  {"id":"driverInfo","url":"/dealer/api/v1/driverInfo"},
];

Http.setDomainUrl(SERVER_BASE_PATH);

Http.setMutiApi(apis);


class DriveDetail extends React.Component {
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
    var mockData = JSON.parse('{"resultCode":1,"data":{"driveId":1719,"sex":null,"userName":"飒飒飒飒","userPhone":"13512148624","proviceCode":"430000","cityCode":"4305","address":"飒飒飒飒","carType":1,"carCode":"GMC6440E","applyTimeType":5,"applyTime":"2020-07-08 17:18:00","tags":null,"remark":"11","dispatchObject":"CS001","manager":"39986","licenseNo":"浙C88921","appreciationEngineer":"17","counselor":"26","driveStartTime":null,"driveEndTime":null,"status":10131004,"createDate":"2018-02-05 15:14:34","createBy":null,"updateDate":null,"updateBy":null,"feedbackUrl":null,"centerName":"长沙虚拟中心","regionName":"邵阳市","appellation":"先生","carName":"林肯MKC","statusName":"待接单","managerName":"陆丹丹","couselorName":"首席顾问C","appreciationEngineerName":"鉴赏工程师B","engineerPhone":"13466961040","color":null,"remind":"","applyTimeName":"指定日期","carTypeName":"SUV","couselorPhone":"18156252217","proviceName":"湖南省","tagsName":"","key":null},"errMsg":"","time":"2018-05-28 17:30:42","success":true,"elapsedMilliseconds":0}');

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
              <button type="button" className={'btn-primary'} style={{width:90,height:34}} onClick={this.btnAction.bind(this,'detail')}>查看资源</button>
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

            <div className={'row'}>
              <div className={'rt'}>首席顾问：</div>
              <div className={'rc'}>
              <select style={{width:100}}>
                <option>黄晓米</option>
                <option>111</option>
                <option>222</option>
                <option>333</option>
                
              </select>
              </div>
            </div>



             
              <div className={'toolbox'}>
                <button type="button" className={'btn-primary'} style={{width:180}} onClick={this.btnAction.bind(this,'detail')}>放弃接单</button>
                <button type="button" className={'btn-primary'} style={{width:180}} onClick={this.btnAction.bind(this,'detail')}>立即接单</button>
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

export default DriveDetail;
