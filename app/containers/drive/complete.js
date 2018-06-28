/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
//import Layout from '../../components/Layout';
import Http from '../../utils/http'
//import PropTypes, { number } from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import './style/orderDetail.scss';
import {SERVER_BASE_PATH} from '../../global.config';
const title = '试驾登记';

const apis = [
  {"id":"driverInfo","url":"/driverInfo","mock":"","format":false},
];

Http.setDomainUrl("http://121.196.193.149:9020/dealer/api/v1")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

class complete extends React.Component {
  // static propTypes = {
  //   title: PropTypes.string.isRequired,
  // };
  constructor(props){
    super(props);
    this.state={
      driveId:'',
      statusName:'',
      applyTime:'',
      carCode:'',
      address:'',
      userName:'',
      userPhone:'',
      licenseNo:'',
      appreciationEngineer:'',
      success:{display:'block'},
      determine:{display:'block'},
      width:['一','二','三','四'],
      add:[],
      number:0,
      numberTo:['一'],
      driverInfo:{
        address: "上海",
        appellation: "string",
        applyTime: "2017-12-22T05:22:34.160Z",
        appreciationEngineer: "糖霜",
        cityCode: "string",
        counselor: "2222",
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
        statusName: "待确认",
        updateBy: 0,
        updateDate: "2017-12-22T05:22:34.160Z",
        userName: "唐坤",
        userPhone: "13977444"
       },
    }
    this.lose=this.lose.bind(this);
    this.plus=this.plus.bind(this);
    this.successed=this.successed.bind(this);
  }
  componentWillMount(){
    // if(this.props['title']['query']['driveId']){
    //   this.setState({
    //     driveId:this.props['title']['query']['driveId'],
    //     statusName:this.props['title']['query']['statusName'],
    //   })
      
    //   const code={
    //     driveId:this.state.driveId
    //   }
    //   Http.get('driverInfo',code,(result)=>{
    //     this.setState({
    //       driverInfo:result.data
    //     })
    //  })
    // }
    if(this.state.statusName=='试驾中'){
      this.setState({
        determine:{display:'none'},  
      })
     }else if(this.state.statusName=='已出发'){
    this.setState({
        success:{display:'none'},
      })
    }
    
  }
  render() {
    const success=this.state.success;
    const determine=this.state.determine;
    return (
        <div className={'order'}>
          <div className={'head'}>
            <ul>
              <li>
                  <div>NO:</div>
                  <div style={{color:'red'}}>{this.state.driveId}</div>
              </li>
              <li>预约时间:{this.state.driverInfo.applyTime}</li>
              <li>试驾车型:{this.state.driverInfo.carCode}</li>
              <li>试驾地址:{this.state.driverInfo.address}</li>
              <li>预约人:{this.state.driverInfo.userName}</li>
              <li>联系电话:{this.state.driverInfo.userPhone}</li>
              <li>备注:{this.state.driverInfo.remark}</li>
              <li>车辆:{this.state.driverInfo.carCode}{this.state.driverInfo.licenseNo}</li>
            </ul>
          </div> 
          <div className={'meterial'}>
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
          </div>
           <div className={'complete'} style={success} onClick={this.successed}>
                完成试驾
           </div>
           <div className={'complete'} sytle={determine}>
                确定
           </div>
      </div>

    );
  }
  lose(){
    this.setState({
      number:this.state.number-1,
    })
      this.state.add.pop()
      this.setState({
        add:this.state.add,
        numberTo:this.state.width[this.state.number-1],
      })
  }
  plus(){
    this.setState({
      number:this.state.number+1,
    })
    if(this.state.number<=2){
      this.setState({
        add:Object.assign(this.state.add,this.state.add.push(this.state.width[this.state.number])),
        numberTo:this.state.width[this.state.number+1],
      })
    }
  }
  successed(){
    location.href='/wx/pub/drive/testdrive'
  }
}

//const COMPLETE=withStyles(s)(complete);

function action(title) {
  return {
    chunks: ['driveComplete'],
    title,
    component: (
    //  <Layout  hide={true}>
        <COMPLETE title={title} />
   //   </Layout>
    ),
  };
}

export default complete;
