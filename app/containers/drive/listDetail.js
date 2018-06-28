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
import s from './style/listDetail.scss';
import { DatePicker, List } from 'antd-mobile';
const title = '试驾预约';

const apis = [
  {"id":"driverList","url":"/driverList","mock":"","format":false},
  {"id":"city","url":"/city","mock":"","format":false},
  {"id":"carModel","url":"/carModel","mock":"","format":false},
  {"id":"saveDrive","url":"/saveDrive","mock":"","format":false},
  
];

Http.setDomainUrl("http://121.196.193.149:9020/dealer/api/v1")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

class listDetail extends React.Component {
  constructor(props){
    super(props);
    this.state={
      date:'',
      content:'',
      city:[],
      citycode:'',
      carModel:[],
      }
    this.see=this.see.bind(this);
    this.close=this.close.bind(this);
    this.white=this.white.bind(this);
    this.exist=this.exist.bind(this);
    this.citycode=this.citycode.bind(this);
  }
  // static propTypes = {
  //   params: PropTypes.string.isRequired,
  // };
  componentWillMount(){
    Http.get('city',(result)=>{
      this.setState({
        city:result.data
      })
    })
    Http.get('carModel',(result)=>{
      this.setState({
        carModel:result.data
      })
    })
  }
  render() {
    return (
        <div className={s.listDetail} style={{height:'auto'}}>
                <div className={s.head} style={{marginBottom:'0.3rem'}}>
                  <ul>
                    <li>
                        <div className={s.name}>称呼</div>
                        <div className={s.fat} className={s.action}><input type='text' /></div>
                    </li>
                    <li>
                        <div className={s.name}>预约人姓名</div>
                        <div className={s.fat} className={s.action}><input type='text' /></div>
                    </li>
                    <li>
                        <div className={s.name}>联系电话</div>
                        <div className={s.fat} className={s.action}><input type='text' /></div>
                    </li>
                    <li style={{height:'3.2rem'}}>
                        <div className={s.name}>试驾地址</div>
                        <div className={s.action}>
                            <select onChange={this.citycode}>
                              {
                                this.state.city.map((item,index)=>{
                                  return(
                                    <option value={item.id} key={index}>{item.name}</option>
                                  )  
                                })
                              }
                            </select>
                        </div>
                        <div className={s.fat} style={{width:'69%',marginTop:'0.5rem',float:'right'}}>
                            <input type='text' />
                        </div>
                    </li>
                    <li>
                        <div>试驾车型</div>
                        <div className={s.fat+' '+s.action}>
                          <select>
                              {
                                this.state.carModel.map((item,index)=>{
                                  return(
                                    <option value={item.carCode} key={index}>{item.carName}</option>
                                  )  
                                })
                              }
                          </select>
                        </div>
                    </li>
                    <li className={s.alter}>
                        <div style={{width:'31%'}} className={s.name}>试驾时间</div>
                        <div style={{width:'40%',float:'left',height:'1rem'}} className={s.action}>
                          <List className="date-picker-list" style={{ backgroundColor: 'white'}}>
                              <DatePicker
                                value={this.state.date}
                                onChange={date => this.setState({ date })}
                              >
                                <List.Item arrow="horizontal"></List.Item>
                              </DatePicker>
                          </List>
                        </div>
                        <div style={{float:'left'}} className={s.check} onClick={this.see}>查看资源</div>
                    </li>
                    <li>
                      <div style={{float:'none'}} className={s.name}>备注</div>
                      <div style={{width:'96%',height:'3rem'}} className={s.action}>
                        <textarea onChange={this.white} defaultValue={this.state.content}></textarea>
                      </div>
                    </li>
                  </ul>
              </div> 
            <div className={s.shut}>
               <div onClick={this.close}>关闭</div>
               <div onClick={this.exist}>暂存</div>
            </div>
      </div>

    );
      
  }
  see(){
    location.href="/wx/pub/drive/resource";
  }
  close(){
    location.href="/wx/pub/drive/order";
  }
  citycode(event){
    this.setState({
      citycode:event.target.value
    })
  }
  exist(){
    code={
      address: "string",	//预约具体地址
      applyTime: "2017-12-14T08:45:46.387Z",		//预约时间
      cityCode: "string",		//预约地址中的城市CODE
      driveId: '',				//预约单号
      carCode: "string",	//车型编号
      proviceCode: "string",	//预约地址中的省份CODE
      remark: "string",		//备注
      sex: 0,					//称呼1：男;2：女
      userName: "string",		//预约人姓名
      userPhone: "string"		//联系电话
      }
    Http.post('saveDrive',code,(result)=>{
     
    })
  }
  white(event){
    this.setState({
      content:event.target.value
    })
  }
  
}

const ListDetail=withStyles(s)(listDetail);

function action(params) {
  return {
    chunks: ['driveListDetail'],
    title,
    component: (
      <Layout>
        <ListDetail params={params} />
      </Layout>
    ),
  };
}

export default action;
