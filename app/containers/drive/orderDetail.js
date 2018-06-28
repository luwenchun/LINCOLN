/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Http from '../../utils/http'
import PropTypes, { number } from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './style/orderDetail.scss';
import moment from 'moment';
const title = '试驾预约';

const apis = [
  {"id":"driverInfo","url":"/driverInfo","mock":"","format":false},
  {"id":"counselor","url":"/counselor","mock":"","format":false},
];

Http.setDomainUrl("http://121.196.193.149:9020/dealer/api/v1")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

class orderDetail extends React.Component {
  
  // static propTypes = {
  //   title: PropTypes.string.isRequired,
  // };
  constructor(props){
     super(props);
     this.state={
       driveId:'',
       statusName:'',
       managerPhone:'',
       phone:'',
       counselor: [
        {
          birthday: "2017-12-22T05:22:34.132Z",
          createBy: 0,
          createDate: "2017-12-22T05:22:34.132Z",
          dealerCode: "string",
          emial: "string",
          failureNum: 0,
          iconsPhoto: "string",
          identityCard: "string",
          loginName: "糖某",
          password: "string",
          phone: "string",
          quartersId: "string",
          quartersSideIds: "string",
          sex: 0,
          status: 0,
          updateBy: 0,
          updateDate: "2017-12-22T05:22:34.133Z",
          userCode: "string",
          userId: 0,
          userName: "string",
          userType: "string",
          vcode: "string"
        }
      ],
       driverInfo:{
        address: "上海",
        appellation: "string",
        applyTime: "2017-12-22T05:22:34.160Z",
        appreciationEngineer: "糖霜",
        cityCode: "string",
        counselor: "string",
        createBy: 0,
        createDate: "2017-12-22T05:22:34.160Z",
        dispatchCity: "string",
        dispatchObject: "string",
        driveAgreementUrl: "string",
        driveEndTime: "2017-12-22T05:22:34.160Z",
        driveId: 0,
        driveStartTime: "2017-12-22T05:22:34.160Z",
        engineerPhone: "string",
        licenseNo: "沪牌",
        manager: "string",
        carCode: "宝马",
        oddNumber: "string",
        proviceCode: "string",
        remark: "x1x1x1x1x1",
        sex: 0,
        status: 0,
        statusName: "待接单",
        updateBy: 0,
        updateDate: "2017-12-22T05:22:34.160Z",
        userName: "唐坤",
        userPhone: "13977"
       },
       remain:{display:'block'}
     }
     this.response=this.response.bind(this);
     this.order=this.order.bind(this);
  }
  componentWillMount(){
    if(this.props['title']['query']['driveId']){
      this.setState({
        driveId:this.props['title']['query']['driveId'],
        statusName:this.props['title']['query']['statusName'],
      })
      const param={
        driveId:this.state.driveId
      }
      Http.get('driverInfo',param,(result)=>{
        this.setState({
          driverInfo:result.data
        })
      })
      // const phone={
      //   phone:this.state.phone                      //需要获得手机号码
      // }
      // Http.get('counselor',phone,(result)=>{
      //   this.setState({
      //     counselor:result.data
      //   })
      // })
    }
    
  }
  componentDidMount(){
  
  }
  render() {
    const remain=this.state.remain;
    const applyTime=moment(this.state.driverInfo.applyTime).format('YYYY-MM-DD HH:mm:ss')
    return (
        <div className={s.order}>
          <div className={s.head}>
            <ul>
              <li>
                  <div>NO:{this.state.driverInfo.driveId?this.state.driverInfo.driveId:''}</div>
                  <div style={{color:'red'}}>{this.state.driverInfo.statusName?this.state.driverInfo.statusName:''}</div>
              </li>
              <li>预约时间:{applyTime?applyTime:''}</li>
              <li>试驾车型:{this.state.driverInfo.carCode?this.state.driverInfo.carCode:''}</li>
              <li>试驾地址:{this.state.driverInfo.address?this.state.driverInfo.address:''}</li>
              <li>预约人:{this.state.driverInfo.userName?this.state.driverInfo.userName:''}</li>
              <li>联系电话:{this.state.driverInfo.userPhone?this.state.driverInfo.userPhone:''}<a href={this.state.driverInfo.userPhone?'tel:'+this.state.driverInfo.userPhone:''}><i className={s.iconfont}></i></a></li>
              <li>备注:{this.state.driverInfo.remark}</li>
              <li>车辆:{this.state.driverInfo.carCode+' '}{' '+this.state.driverInfo.licenseNo}</li>
              <li>首席顾问:
                 <div className={s.rit}>
                    <select style={{width:'5rem',marginRight:'0.2rem'}}>
                        <option>22</option>
                    </select>
                    <select style={{width:'5rem'}}>
                     
                               <option>11</option>
                       
                    </select>
                  </div> 
              </li>
              <li>
                  鉴赏工程师:{this.state.driverInfo.appreciationEngineer}
              </li>
            </ul>
          </div> 
          <div className={s.boldbox}>
            <div onClick={this.response} onClick={this.response}>
                 无法响应
            </div>
            <div onClick={this.order} onClick={this.order}>
                 立即接单
            </div>
          </div>
      </div>

    );
  }
  response(){
    const param={
      driveId:this.state.driveId,
      managerPhone:this.state.managerPhone,               //获得经理 的手机号码
    }
    Http.get('unableToRespond',param,(result)=>{        //无法响应
      
    })
  }
  order(){
    param={
      counselor: this.state.counselor,	                        //顾问
      manager: this.state.managerPhone,	                         //经理-这里填该经理手机号
      driveId: this.state.driveId	              
    }
    Http.get('manager',param,(result)=>{            //立即接单
      
    })
  }
}

const ORDERDETAIL=withStyles(s)(orderDetail);

function action(title) {
  return {
    chunks: ['driveOrderdetail'],
    title,
    component: (
      <Layout>
        <ORDERDETAIL title={title} />
      </Layout>
    ),
  };
}

export default action;
