/**
 * 试驾登记
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http';
import Ui from '../../utils/weixin';
import $ from 'jquery';
import Helper from '../../utils/helper';
import HomeLink from './components/home.link';
import {SERVER_BASE_PATH} from '../../global.config';
import './style/drive.add.scss';
import FileUploader from './components/file.upload';

const apis = [
    {"id":"driverType","url":"/dealer/api/v1/driveType", format:false},
    {"id":"driveCarType","url":"/dealer/api/v1/carType", format:false},
    {"id":"driveAgreement","url":"/dealer/api/v1/driveAgreement", format:false},
    {"id":"driveInfo", "url":"/dealer/api/v1/userDriveInfo", format: false}
];
const skey = 'cdrive_register';

Http.setDomainUrl(SERVER_BASE_PATH)
Http.setMutiApi(apis);

const headers = {"access-token":"balabala"};
let _this;

class CDriveRegister extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      params: {
        driveTypeName: '',
        driveType: '',
        carType: '',
        carTypeName: '',
        carCode : '',
        contact: '',
        mobile: '',
        address: '',
        isTermed: false,
        driveId: ''
      },
    };
    this.driveTypeList = [];
    this.driveCarTypeList = [];

    let data = Helper.getData(skey, true);

    if (data && data.driveType) {
        for (let item in data) {
            this.state.params[item] = data[item];
        } 
        this.show = true;
    }  

    _this = this;
    this.init();
  }

  init() {
      Http.get('driverType', {}, function(res) {
          if (res && Array.isArray(res.data)) { 
              _this.driveTypeList = res.data;
          }
      });

      Http.get('driveCarType', {}, function(res) {
        if (res && Array.isArray(res.data)) { 
            _this.driveCarTypeList = res.data;
        }
      });
  }

  selectDriveType(e) { 
      let target = $(e.target).parents('li'), data = [], p = {};
      target = target.find('.cdrive-cell-nav span');

      _this.driveTypeList.forEach((v) => {
          data.push({value: v.CODE, label: v.CODE_NAME});
      });

      if (_this.state.params.driveType) {
          p.defaultValue = [_this.state.params.driveType];
      }

      Ui.loadPicker(data, (res) => {
          let selectedItem = Helper.getSelectedValue(_this.driveTypeList, 'CODE', res[0]);  
          target.get(0).innerText = selectedItem.CODE_NAME;
          _this.state.params.driveTypeName = selectedItem.CODE_NAME;
          _this.state.params.driveType = selectedItem.CODE;
      }, p);
  }

  selectDriveCarType(e) {
      let target, data = [], p = {};
      target = $(e.target).parents('li');
      target = target.find('.cdrive-cell-nav span');

      _this.driveCarTypeList.forEach(function(v) {
          data.push({value: v.carCode, label: v.carName});
      });

      if (_this.state.params.carCode) {
          p.defaultValue = [_this.state.params.carCode];
      }

      Ui.loadPicker(data, (res) => {
          let selectedItem = Helper.getSelectedValue(_this.driveCarTypeList, 'carCode', res[0]);
          target.get(0).innerText = selectedItem.carName;
          _this.state.params.carTypeName = selectedItem.carName;
          _this.state.params.carType = selectedItem.carType;
          _this.state.params.carCode = selectedItem.carCode;
      }, p);
  }

  selectLocation() {
    _this.state.params.contact = document.querySelector('input[name="contact"]').value;
    _this.state.params.mobile = document.querySelector('input[name="mobile"]').value;    

    Helper.clear(skey);
    Helper.setData(skey, JSON.stringify(_this.state.params));
    document.location.href = '/wchat/cdriveMap?act=/wchat/cdriveRegister&key=' + skey;
  }

  componentDidMount() {
      if (this.show) {
        document.querySelector('input[name="contact"]').value = this.state.params.contact;
        document.querySelector('input[name="mobile"]').value = this.state.params.mobile;
        this.show = false;
         Helper.clear(skey);
      } 

      let params = Helper.getUrlParams();
      //_this.state.driveId = params.id || '1722';

      if (params.id) {
         Http.get('driveInfo', {driveId: params.id}, function(res) {
            let data = res && res.data ? res.data : null;
            if (data) {  
                _this.setState({
                    id: data.driveId || 0,
                    driveType: data.carName,
                    driveTypeName: driveType,
                    contact: data.userName,
                    mobile: data.userPhone,
                    address: data.address,
                    carType: data.carType,
                    carCode: data.carCode,
                    address: data.address
                });
            }
        });
      }
  }

  reserve() {
      document.querySelector('input[name="contact"]').value = this.state.params.contact;
      document.querySelector('input[name="mobile"]').value = this.state.params.mobile;
      
      if (! _this.state.params.carType) {
        Mui.toast('请选择试驾车型');
        return false;
     }

     if (! _this.state.params.contact) {
        Mui.toast('请填写联系人');
        return false;
     }

     if (! Helper.isMobile(_this.state.params.mobile)) {
        Ui.toast('请输入有效的手机号');
        return false;
     }

     if (! _this.state.params.address) {
         Ui.toast('请输入试驾地址');
         return false;
     }

     if (! _this.state.params.isTermed) {
        Ui.toast('请确认已阅读并同意个人隐私条款');
        return false;
     }
  }
  
  render() {
    const title = '试驾登记';
    return (
      <div className={'wrap cdrive-register-page cdrive-add-page'}>
        <Helmet>
            <title>{title}</title>
            <meta name="description" content="{title}" />
        </Helmet>
        <div className={'logo'}>
          <a href="#" title=""></a>
        </div>
        <ul className={'cdrive-table-view'}>
            <li className={'cdrive-table-view-cell'}>
              <a href="javascript:void(0)" className={'cdrive-navigate-right'} onClick={this.selectDriveType}>试驾类型
                <span className={'cdrive-cell-nav'}><span>{this.state.params.driveTypeName}</span><i className={'nav-arrow'}></i></span>
              </a>
            </li>
            <li className={'cdrive-table-view-cell'}>
              <a href="javascript:void(0)" className={'cdrive-navigate-right'} onClick={this.selectDriveCarType}>试驾车型
                <span className={'cdrive-cell-nav'}><span>{this.state.params.carTypeName}</span><i className={'nav-arrow'}></i></span>
              </a>
            </li>
        </ul>
        <div className={'cdrive-input-group'}>
          <div className={'cdrive-input-row'}>
            <label>联系人</label>
            <input type="text" name="contact" placeholder=""/>
          </div>
          <div className={'cdrive-input-row'}>
            <label>手机号码</label>
            <input type="text" name="mobile" placeholder="输入手机号" maxLength="11"/>
          </div>
        </div>
        <ul className={'cdrive-table-view cdrive-selected-type'}>
            <li className={'cdrive-table-view-cell'}>
              <a href="javascript:void(0)" className={'cdrive-navigate-right'} onClick={this.selectLocation}>试驾地址
                <span className={'cdrive-cell-nav'}><span>{this.state.params.address}</span><i className={'nav-arrow'}></i></span>
              </a>
            </li>
        </ul> 
        <FileUploader id={this.state.params.driveId}/>
        <div className={'cdrive-bottom-text'}>
            <div className={'cdrive-bottom-input'}>
                <input type="checkbox" name="term" />我已阅读并同意相关的个人隐私条款
            </div>
            <button className={'mui-btn mui-btn-primary mui-btn-block'} onClick={this.reserve}>预约</button>
            <HomeLink />
          </div> 
      </div>
    );
  }
  
}

export default CDriveRegister;
