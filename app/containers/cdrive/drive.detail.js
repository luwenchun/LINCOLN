/**
 * 我的试驾预约详情
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import './style/drive.detail.scss';
import {SERVER_BASE_PATH} from '../../global.config';
import HomeLink from './components/home.link';
import Helper from '../../utils/helper';
import Ui from '../../utils/weixin';
import code from './images/1528178378.png';
import FileUploader from './components/file.upload';

const apis = [
  {"id":"cancelDrive", "url":"/dealer/api/v1/disDrive", format: false},
  {"id":"qrcodeDrive", "url":"/dealer/api/v1/getQrcode", format: false},
  {"id":"driveInfo", "url":"/dealer/api/v1/userDriveInfo", format: false}
];

Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);
let _this;

class CDriveDetail extends React.Component {
  constructor(props) {
    super(props);

    let data = Helper.getData('drive_detail', true);
    this.state = {
        status: 0, // 试驾状态
        bookingStatus: 0, // 预约状态
        statusName: data.typeName,
        bookingStatusName: data.statusName,
        id: data.driveId || 0,
        driveType: data.carName,
        contact: data.userName,
        mobile: data.userPhone,
        bookingDate: data.applyTime,
        address: data.address,
        driveDate: data.driveStartTime,
        saler: data.managerName,
        salerMobile: data.engineerPhone,
        memo: data.remark
    };

    _this = this;
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
   // _this.state.driveId = params.id;
    
    if (params.id) {
        Http.get('driveInfo', {driveId: params.id}, function(res) {
            let data = res && res.data ? res.data : null;
            //data.statusName = '已反馈';
            if (data) {  
                _this.setState({
                    status: 0, 
                    bookingStatus: 0, 
                    statusName: data.typeName,
                    bookingStatusName: data.statusName,
                    id: data.driveId || 0,
                    driveType: data.carName,
                    contact: data.userName,
                    mobile: data.userPhone,
                    bookingDate: data.applyTime,
                    address: data.address,
                    driveDate: data.driveStartTime,
                    saler: data.managerName,
                    salerMobile: data.engineerPhone,
                    memo: data.remark
                });
            }
        });
    }
    
  }


  btnAction(_name){
    console.log(_name);
    window.location.href = `./drive/${_name}`;
  }

  subComment() {
     document.location.href = '/wchat/cdriveFeeback?id=' + _this.state.id + '&type=' + _this.state.driveType;
  }  

  getCode() {
      Http.get('qrcodeDrive', {driveId: _this.state.id}, function(res) {
         if (res && res.data) {
            Ui.dialog('<img src="' + res.data.imgUrl + '" width="180"/>');
         }
      });
  }

  cancelReservation() {
      Http.post('cancelDrive', {driveId: _this.state.id}, function(res) { 
          if (res && res.data) {
              Ui.toast(res.data.errorMsg);
              setTimeout(() => {
                 window.location.reload();
              }, 1500);
          }
      });
  }

  viewFeedback() {
      document.location.href = '/wchat/cdriveFeedbackList?id=' + _this.state.id + '&type=' + _this.state.driveType;
  }
 
  render() {
    let stStyle = 'none',
        bstStyle = 'none',
        cStyle = 'none',
        uStyle = 'none',
        fbStyle = 'none';

    if (this.state.bookingStatusName === '待接单' || this.state.bookingStatusName === '待确认') {
        cStyle = 'block';
    } else if (this.state.bookingStatusName === '待试驾') {
        uStyle = 'block'; 
    } else if (this.state.bookingStatusName === '试驾中') {
        bstStyle = 'block';
    } else if (this.state.bookingStatusName === '已试驾') {
        stStyle = 'block';
    } else if (this.state.bookingStatusName === '已反馈') {
        fbStyle = 'block';
    }
    const title = '我的试驾预约';
    return (
      <div className={"mui-content cdrive-detail-page"}>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content="{title}" />
            </Helmet>
          <ul className={"mui-table-view mui-table-view-striped mui-table-view-condensed"}>
            <li className={"mui-table-view-cell"}>
                <div className={"mui-table"}>
                    <div className={"mui-table-cell mui-col-xs-8"}>
                        <h4 className={"mui-ellipsis"}>NO: {this.state.id}</h4>
                        <h5>试驾车型：{this.state.driveType}</h5>
                    </div>
                    <div className={"mui-table-cell mui-col-xs-3 mui-text-right"}>
                        <span className={"mui-h5"}>{this.state.statusName}</span>
                    </div>
                </div>
            </li>
            <li className={"mui-table-view-cell"}>
                <p>联系人：{this.state.contact}</p> 
                <p>手机号码：{this.state.mobile}</p>
                <p>预约时间：{this.state.bookingDate}</p>
                <p className={'f-bold'}>{this.state.address}</p>
                <p>试驾时间：{this.state.driveDate}</p>
                <p>销售顾问：{this.state.saler}<a className={'cdrive-call'} href="tel:13303934221"></a></p>
                <p>备注：{this.state.memo}</p>
            </li>
            <li className={"mui-table-view-cell cdrive-status"}>
                <p>预约状态：{this.state.bookingStatusName}</p>
            </li>
          </ul>  
          <FileUploader show={uStyle} id={this.state.id}/>
          <div className={'buttons-set'}>
              <p style={{display: bstStyle}}><strong>*</strong>结束试驾后请提供二维码供试驾工程师扫描</p>
              <button className={'mui-btn mui-btn-primary mui-btn-block'} onClick={this.subComment} style={{display: stStyle}}>立即评价</button>
              <button className={'mui-btn mui-btn-primary mui-btn-block'} onClick={this.getCode} style={{display: bstStyle}}>获取二维码</button>
              <button className={'mui-btn mui-btn-primary mui-btn-block'} onClick={this.cancelReservation} style={{display: cStyle}}>取消预约</button>
              <button className={'mui-btn mui-btn-primary mui-btn-block'} onClick={this.viewFeedback} style={{display: fbStyle}}>查看评价结果</button>
          </div>
          <HomeLink />
      </div>
    );
  }
 
}

export default CDriveDetail;
