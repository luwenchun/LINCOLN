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
import s from './style/resource.scss';
// import b from 'antd-mobile/dist/antd-mobile.css';
import { DatePicker, List } from 'antd-mobile';
import moment from 'moment';
const title = '试驾预约';

const apis = [
  {"id":"driverList","url":"/driverList","mock":"","format":false},
  {"id":"resourceDealer","url":"/resourceDealer","mock":"","format":false},
  {"id":"resourceEngineer","url":"/resourceEngineer","mock":"","format":false},
  {"id":"resourceUsage","url":"/resourceUsage","mock":"","format":false},
  
];

Http.setDomainUrl("http://121.196.193.149:9020/dealer/api/v1")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

class resource extends React.Component {
  constructor(props){
    super(props);
    this.state={
      resourceDealer:[],
      resourceEngineer:[],
      allot:'',
      sell:'',
      fation:{display:'block'},
      fations:{display:'block'},
    }
    this.allot=this.allot.bind(this);
    this.sell=this.sell.bind(this);
    this.fationOne=this.fationOne.bind(this);
  }
 componentWillMount(){
  Http.get('resourceDealer',(result)=>{
    this.setState({
      resourceDealer:result.data
    })
  })
  Http.get('resourceEngineer',(result)=>{
    this.setState({
      resourceEngineer:result.data
    })
  })
 }
 componentDidMount(){
   const code={
     date:this.state.date
   }
  Http.get('resourceUsage',code,(result)=>{
    this.setState({
      resourceEngineer:result.data
    })
  })
 }
  render() {
    return (
        <div className={s.resource} style={{height:'auto'}}>
                <div className={s.head} style={{marginBottom:'0.3rem'}}>
                  <ul>
                    <li>
                        <List className="date-picker-list" style={{ backgroundColor: 'white'}}>
                            <DatePicker
                              value={this.state.date}
                              onChange={date => this.setState({ date })}
                            >
                              <List.Item arrow="horizontal">日期</List.Item>
                            </DatePicker>
                        </List>
                    </li>
                    <li className={s.cell} onClick={this.allot}>
                        <div>分拨对象</div>
                        <div className={s.fat}>
                           {this.state.allot}    
                            <i className={s.iconfont}>&#xe600;</i>
                        </div>
                    </li>
                    <li className={s.cell} onClick={this.sell}>
                        <div>经销商</div>
                        <div className={s.fat}>
                            {this.state.sell}
                            <i className={s.iconfont}>&#xe600;</i>
                        </div>
                    </li>
                  </ul>
              </div> 
            <div className={s.shat}>
                <div className={s.defination}>资源名称</div>
                <div className={s.plate}>
                  <span><i className={s.iconfont}>&#xe6ec;</i></span>
                  <span>xxxxxxxxx</span>
                  <span><i className={s.iconfont}>&#xe600;</i></span>
                </div>
                <div className={s.action}>
                  <table border="0" cellSpacing="0" cellPadding="0">
                    <tbody>
                      <tr>
                        <td>8:00</td>
                        <td>2</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>8:30</td>
                        <td>2</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>9:00</td>
                        <td>2</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>10:00</td>
                        <td>2</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>10:30</td>
                        <td>2</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>11:00</td>
                        <td>2</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>11:30</td>
                        <td>2</td>
                        <td>3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
            <div className={s.swim} >
                <div className={s.swimNext}>
                    <ul>
                        {
                          this.state.resourceDealer.map((item,index)=>{
                            return(
                              <li value={item.dealerCode} key={index} onClick={this.fationOne}>{item.dealerShortName}</li>
                            )
                          })
                        }
                    </ul>
                </div>
            </div>
            <div className={s.swim}>
                <div className={s.swimNext}>
                    {/* <ul>
                        {this.state.resourceEngineer.map((item,index)=>{
                            return(
                              <li value={item.dealerCode} key={index} onClick={this.fationTwo}>{item.userName}</li>
                            )
                          })}
                    </ul> */}
                </div>
            </div>
      </div>

    );
      
  }
  allot(){

  }
  sell(){

  }
  fationOne(){
    
  }
  fationTwo(){

  }
}

const Resource=withStyles(s)(resource);

function action(title) {
  return {
    chunks: ['driveResource'],
    title,
    component: (
      <Layout>
        <Resource params={title} />
      </Layout>
    ),
  };
}

export default action;
