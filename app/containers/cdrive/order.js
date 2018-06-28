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
import s from './style/order.scss';
const title = '试驾预约';

const apis = [
  {"id":"driverList","url":"/driverList","mock":"","format":false},
];

Http.setDomainUrl("http://121.196.193.149:9020/dealer/api/v1")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

class order extends React.Component {
  constructor(props){
    super(props);
    this.state={
      driverList:[],
      flag:0,
      goods:{display:'none'},
      goodto:'',
      count:0,
    }
    this.detail=this.detail.bind(this);
    this.away=this.away.bind(this);
    this.raise=this.raise.bind(this);
  }
  // static propTypes = {
  //   params: PropTypes.string.isRequired,
  // };
  componentWillMount(){
    const param={
      pageNum:'1',
      pageSize:'10',
    }
   Http.get('driverList',param,(result)=>{
          this.setState({
            driverList:result.data.list
          })
     })
  }
  componentDidMount(){
     window.addEventListener('scroll',this.away)
  }
  render() {
    const good=this.state.goods;
    return (
        <div className={s.order} style={{height:'auto'}}>
        {
          this.state.driverList.map((items,index)=>{
              return(
                <div className={s.head} style={{marginBottom:'0.3rem'}} key={index}>
                  <ul>
                    <li>
                        <div>NO:{items.driveId}</div>
                        <div className={s.back}>{items.statusName}</div>
                    </li>
                    <li>预约时间:{items.applyTime}</li>
                    <li>试驾车型:{items.carCode}</li>
                    <li>试驾地址:{items.address}</li>
                    <li>预约人:{items.userName}</li>
                    <li>
                        <div>联系人电话:{items.userPhone}</div>
                        <div onClick={this.detail.bind(this,items.driveId,items.statusName)}>详情</div>
                    </li>
                  </ul>
              </div> 
              )
          })
        }
        <div className={s.pations} onClick={this.raise}><i className={s.iconfont}>&#xe6a7;</i></div>
      </div>

    );
  }
  componentWillUnmount(){
    window.removeEventListener('scroll',this.away)
  }
  detail(driveId,statusName){
     switch(statusName)
     {
       case '待分拨':
         location.href="/wx/pub/drive/resource?driveId="+driveId+"statusName"+statusName;
       break;
       case '待接单':
         location.href="/wx/pub/drive/orderDetail?driveId="+driveId+"statusName"+statusName;
       break;
       case '待确认':
         location.href="/wx/pub/drive/adviser?driveId="+driveId+"statusName"+statusName;
       break;
       case '待试驾':
          location.href="/wx/pub/drive/wait?driveId="+driveId+"statusName"+statusName;
       break;
       case '已出发':
          location.href="/wx/pub/drive/complete?driveId="+driveId+"statusName"+statusName;     //需判断complete
       break;
       case '试驾中':
          location.href="/wx/pub/drive/complete?driveId="+driveId+"statusName"+statusName;     //需判断complete
       break;
       case '已试驾':
          location.href="/wx/pub/drive/testdrive?driveId="+driveId+"statusName"+statusName;
       break;
      
     }
      
  }
  away(){
    const scrollTop=document.documentElement.scrollTop||document.body.scrollTop||window.pageYOffset  //滚动条离顶的高度
    const scrollHeight=document.documentElement.scrollHeight||document.body.scrollHeight   //滚动条高度
    const clientHeight=document.documentElement.clientHeight||document.body.clientHeight  //窗口的高度
    if(clientHeight+scrollTop==scrollHeight){
      this.setState({
       count:this.state.count+1,
     })
      const param={
        pageNum:String(this.state.count),
        pageSize:'10',
      }
     Http.get('driverList',param,(result)=>{
            this.setState({
              driverList:this.state.driverList.push(result.data.list)
            })
       })
    }
  }
  raise(){
    location.href="/wx/pub/drive/listDetail"
  }
}

const ORDER=withStyles(s)(order);

function action(params) {
  return {
    chunks: ['driveOrder'],
    title,
    component: (
      <Layout>
        <ORDER params={params} />
      </Layout>
    ),
  };
}

export default action;
