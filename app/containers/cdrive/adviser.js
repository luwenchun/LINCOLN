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
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './style/adviser.scss';
import b from 'antd-mobile/dist/antd-mobile.css';
import { DatePicker, List } from 'antd-mobile';
import moment from 'moment';
const title = '试驾预约';

const apis = [
  {"id":"cancel","url":"/cancel","mock":"","format":false},
  {"id":"confirmOrder","url":"/confirmOrder","mock":"","format":false},
  {"id":"engineer","url":"/engineer","mock":"","format":false},
  {"id":"carModel","url":"/carModel","mock":"","format":false},
  {"id":"carList","url":"/carList","mock":"","format":false},
  {"id":"driverInfo","url":"/driverInfo","mock":"","format":false},
];

Http.setDomainUrl("http://121.196.193.149:9020/dealer/api/v1")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

class adviser extends React.Component {
  constructor(props){
    super(props);
    this.state={
       driveId:'2',
       statusName:'',
       remain:{display:'block'},
       engineer:[],
       carModel:[],
       carList:[],
       addss:'',
       text:'',
       date:'',
       carCode:'',
       text:'',
       appreciationEngineerName:'',
       userName:'',
       driverInfo:{
        address: "上海",
        appellation: "string",
        applyTime: "2017-12-22T05:22:34.160Z",
        appreciationEngineerName: "糖霜",
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
    this.cancel=this.cancel.bind(this);
    this.confirm=this.confirm.bind(this);
    this.lation=this.lation.bind(this);
    this.pation=this.pation.bind(this);
    this.appreciate=this.appreciate.bind(this);
    this.text=this.text.bind(this);
  }
  // static propTypes = {
  //   title: PropTypes.string.isRequired,
  // };
  componentWillMount(){
    if(this.props['title']['query']['driveId']){
      this.setState({
        driveId:this.props['title']['query']['driveId'],
        statusName:this.props['title']['query']['statusName'],
      })
      const code={
        driveId:this.state.driveId
      }
      Http.get('driverInfo',code,(result)=>{
        this.setState({
          driverInfo:result.data
        })
     })
    }
   
    Http.get('carModel',(result)=>{
      this.setState({
        carModel:result.data
      })
   })
    
  }
  componentDidMount(){
    
  }
  render() {
    const remain=this.state.remain;
    return (
        <div className={s.order}>
          <div className={s.head}>
            <ul>
              <li>
                  <div>NO:</div>
                  <div style={{color:'red'}}>{this.state.driverInfo.statusName}</div>
              </li>
               <li>试驾车型:<div className={s.mation}>{this.state.driverInfo.carCode}</div></li>
               <li className={s.bet}>
               <div className={s.arrow}>
                  <List className="date-picker-list" style={{ backgroundColor: 'white'}}>
                        <DatePicker
                          value={this.state.date}
                          onChange={date => this.setState({ date })}
                        >
                          <List.Item arrow="horizontal">预约时间</List.Item>
                        </DatePicker>
                    </List>
               </div>
               <div className={s.arrowed}>
                   查看资源
               </div>
               </li>
              <li className={s.address}>试驾地址:
                <div className={s.mation} style={{height:'1rem'}}>{this.state.driverInfo.address}</div>
                <div className={s.rit+' '+s.ritt}><input type='text' onChange={this.lation} defaultValue={this.state.addss}/></div>
              </li>
              <li>预约人:<div className={s.mation} >{this.state.driverInfo.userName}</div></li>
              <li>联系电话:<div className={s.mation}><a href={this.state.driverInfo.userPhone?'tel'+this.state.driverInfo.userPhone:''}>{this.state.driverInfo.userPhone?this.state.driverInfo.userPhone:''}<i className={s.iconfont}>&#xe8a0;</i></a></div></li>
              <li className={s.comment}>
                <div>
                  备注:
                </div>
                <div style={{height:'2.5rem',border:'1px solid #afacac',paddingLeft:'0'}} className={s.rit}>
                  <textarea onChange={this.text} defaultValue={this.state.text}></textarea>
                </div>
              </li>
              <li style={{marginTop:'0.3rem'}}>车辆:
               <div className={s.rit}>
               <select style={{marginRight:'0.3rem'}} onChange={this.pation}>
                  {
                    this.state.carModel.map((items,index)=>{
                         return(
                          <option value={items.carCode} key={index}>{items.carName}</option>
                         )
                    })
                  }                   
                </select>
                <select style={{width:'5rem'}} onChange={this.license}>
                   {
                     this.state.carList.map((items,index)=>{
                          return(
                           <option value={items.licenseNo} key={index}>{items.licenseNo}</option>
                          )
                     })
                   }
                </select>
               </div>
               
              </li>
              <li>首席顾问:<div className={s.mation}>{this.state.driverInfo.counselor}</div></li>
              <li style={{marginTop:'0.3rem'}}>
                  鉴赏工程师: 
                  <div className={s.rit}>
                    <select style={{width:'5rem'}} onChange={this.appreciate}>
                      {
                        this.state.engineer.map((items,index)=>{
                            return(
                              <option value={items.userName} key={index}>{items.userName}</option>
                            )
                        })
                      }
                  </select> 
                  </div>
                  
              </li>
            </ul>
          </div> 
          <div className={s.boldbox} style={remain}>
            <div onClick={this.cancel}>
                 用户取消
            </div>
            <div onClick={this.confirm}>
                 确认
            </div>
          </div>
      </div>

    );
  }
  cancel(){
    const param={
      driveId:this.state.driveId
    }
    Http.get('cancel',param,(result)=>{
      
    })
  }
  pation(event){
    this.setState({
      carCode:event.target.value
    })
    let code={
        driveId:this.state.driveId,
        carCode:event.target.value,
      }
     Http.get('carList',code,(result)=>{
      this.setState({
        carList:result.data
      })
   })
  }
  license(event){
    this.setState({
      licenseNo:event.target.value
    })
    const code={
      licenseNo:event.target.value
    }
    Http.get('engineer',code,(result)=>{
      this.setState({
        engineer:result.data
      })
    })
  }
  confirm(){
     const param={
      address: this.state.driverInfo.address+this.state.addss,	//预约具体地址
      applyTime:moment(this.state.date).format('YYYY-MM-DD HH:mm:ss'),	//预约时间
      appreciationEngineerName: this.state.userName,	//鉴赏工程师
      cityCode: "string",	//预约地址中的城市CODE
      driveId:this.state.driveId,			//单号
      licenseNo: this.state.licenseNo,	//车牌号
      carCode: this.state.carCode,		//车型编号
      proviceCode: "string",	//预约地址中的省份CODE
      remark: this.state.text
     }
     Http.get('confirmOrder',param,(result)=>{
      
    })
  }
  lation(event){
    this.setState({
      addss:event.target.value
    })
  }
  text(event){
    this.setState({
      text:event.target.value
    })
  }
  appreciate(event){
    this.setState({
      userName:event.target.value
    })
  }
}

const Adviser=withStyles(s,b)(adviser);

function action(title) {
  return {
    chunks: ['driveAdviser'],
    title,
    component: (
      <Layout  hide={true}>
        <Adviser title={title} />
      </Layout>
    ),
  };
}

export default action;
