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
import s from './style/orderDetail.scss';
const title = '试驾预约';

const apis = [
  {"id":"userInfo","url":"bsd/ads","mock":"bsd/ads","format":false},

  {"id":"carInfo","url":"bsd/post", "mock":"user/post","format":false},
];

Http.setDomainUrl("http://localhost:8081/yyauto-web/api/")

Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};

class testdrive extends React.Component {
  constructor(props){
      super(props);
      this.state={
          number:false,
          add:[],
          number:0,
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
            statusName: "已试驾",
            updateBy: 0,
            updateDate: "2017-12-22T05:22:34.160Z",
            userName: "唐坤",
            userPhone: "13977444"
           },
      }
      this.lose=this.lose.bind(this);
      this.plus=this.plus.bind(this);
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
  };
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
  }
  render() {
    return (
        <div className={s.order} style={{height:'auto'}}>
          <div className={s.head}>
            <ul>
              <li>
                  <div>NO:{this.state.driveId}</div>
                  <div style={{color:'red'}}>{this.state.driverInfo.statusName}</div>
              </li>
              <li>预约时间:{this.state.driverInfo.applyTime}</li>
              <li>试驾车型:{this.state.driverInfo.carCode}</li>
              <li>试驾地址:{this.state.driverInfo.address}</li>
              <li>预约人:{this.state.driverInfo.userName}</li>
              <li>联系电话:{this.state.driverInfo.userPhone}</li>
              <li>备注:{this.state.driverInfo.remark}</li>
              <li>车辆:{this.state.driverInfo.carCode}{this.state.driverInfo.licenseNo}
              </li>
            </ul>
          </div> 
          <div className={s.meterial}>
              <ul>
                {
                  this.state.add.map((items,index)=>{
                     return(
                      <li key={index} style={{borderBottom:'1px solid #afacac'}}>
                        <div>试驾人</div>
                        <div>
                            <span onClick={this.lose}><i className={s.iconfont} style={{float:'right'}}>&#xe68d;</i></span>
                        </div>
                        <div style={{float:'none'}}>
                            <span style={{float:'left'}}>
                                  联系电话
                            </span>
                            <span>
                                 <input type="text" style={{float:'right',marginTop:'0.3rem'}}/>
                            </span>
                          </div>
                      </li>
                     )
                  })
                }
                  <li>
                    <div>试驾人</div>
                    <div>
                        <span onClick={this.plus}><i className={s.iconfont} style={{float:'right'}}>&#xe631;</i></span>
                    </div>
                    <div style={{float:'none'}}>
                        <span  style={{float:'left'}}>
                              联系电话
                        </span>
                        <span>
                              <input type="text" style={{float:'right',marginTop:'0.3rem'}}/>
                        </span>
                    </div>
                  </li>
              </ul>
          </div>
          <div className={s.meterial}>
            <ul>
                <li><i className={s.iconfont}>&#xe61a;</i>结果反馈</li>
                <li>
                  <div>车辆状况</div>
                  <div className={s.action}>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                  </div>
                </li>
                <li>
                    <div>服务体验</div>
                    <div className={s.action}>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    </div>
                </li>
                <li>
                    <div>专业度</div>
                    <div className={s.action}>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    </div>
                </li>
                <li>
                    <div>服务态度</div>
                    <div className={s.action}>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    <i className={s.iconfont}>&#xe62e;</i>
                    </div>
                </li>
            </ul>
          </div>
          <div className={s.remark}>
             <div>备注:</div>
             <div>
                  <textarea placeholder='说说有点和美中不足的地方'></textarea>
             </div>
          </div>
          <div className={s.back}>
               <div>
                   <span><i className={s.iconfont}>&#xe69f;</i></span>
               </div>
               <div>
                 <span>反馈上传</span>
                 <span>点击上传图片</span>
               </div>
          </div>
           <div className={s.testdrive} onClick={this.goIndex.bind(this)}>
                立即反馈
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
      })
  }
  plus(){
    if(this.state.number<=2){
      this.setState({
        number:this.state.number+1,
        add:Object.assign(this.state.add,this.state.add.push('1')),
      })
    }
  }
  goIndex(){
    const userId = this.props['title']['query']['userId'];
    const mobile = this.props['title']['query']['mobile'];
    location.href = '/wx/pub/drive?userId='+userId+'&mobile='+mobile;    
  }
}

const TESTDRIVE=withStyles(s)(testdrive);

function action(title) {
  return {
    chunks: ['driveTest'],
    title,
    component: (
      <Layout  hide={true}>
        <TESTDRIVE title={title} />
      </Layout>
    ),
  };
}

export default action;
