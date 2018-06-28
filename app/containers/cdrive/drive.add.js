/**
 *新建试驾登记
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http';
import './style/drive.add.scss';
import $ from 'jquery';
import Ui from '../../utils/weixin';
import Helper from '../../utils/helper';
import HomeLink from './components/home.link';
import {SERVER_BASE_PATH} from '../../global.config';

const skey = 'cdrive_add';
const apis = [
  {"id":"driverType","url":"/dealer/api/v1/driveType", format:false},
  {"id":"driveCarType","url":"/dealer/api/v1/carType", format:false},
  {"id":"driveSaleShop","url":"/dealer/api/v1/nearDealer", format:false},
  {"id":"driveBooking","url":"/dealer/api/v1/commitDrive", format:false},
];

Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);
let _this;

class CDriveAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      params: {
        driveType: 0,
        driveTypeName: '预约到店',
        carType: '',
        carCode: '',
        carName: '',
        contact: '',
        mobile: '',
        address: '选择销售店',
        spTime: '',
        onShopTime: 5,
        onShopTimeName: '指定日期时间',
        memo: '',
        isTermed: false,
        dealer: '',
        dealerName: ''
      },
    };
    this.show = false;
    this.driveTypeList = [];
    this.driveCarTypeList = [];
    this.defaultVal = {
        driveType: '',
        driveTypeName: ''
    };
   
    $(window).bind('drive_type_changed', this.driveTypehanged);
    let data = Helper.getData(skey, true);

    if (data && data.driveType) {
        for (let item in data) {
            this.state.params[item] = data[item];
        } 
        this.show = true;
        Helper.clear(skey);
    }  
    _this = this;
    this.init();
  }

  init() {
     Http.get('driverType', {}, function(res) {
        if (res && Array.isArray(res.data)) { 
            _this.driveTypeList = res.data;
            _this.defaultVal.driveType = res.data[0].CODE;
            _this.defaultVal.driveTypeName = res.data[0].CODE_NAME;
            if (! _this.state.params.driveType) {
                _this.state.params.driveType = res.data[0].CODE;
                _this.state.params.driveTypeName = res.data[0].CODE_NAME;
            }
        }
     });

     Http.get('driveCarType', {}, function(res) {
      if (res && Array.isArray(res.data)) { 
          _this.driveCarTypeList = res.data;
      }
   });
  }

  componentDidMount() {
      if (this.show) {
          document.querySelector('input[name="contact"]').value = this.state.params.contact;
          document.querySelector('input[name="mobile"]').value = this.state.params.mobile;

          let items = document.querySelectorAll('.cdrive-selected-type');
          items = Array.prototype.slice.call(items);

          if (this.state.params.driveTypeName === '送车上门') {
              items.forEach(function(v) {
                  v.classList.add('hide');
                  if (v.getAttribute('data-id') == 2) {
                      v.classList.remove('hide');
                  }
              });
          } else {
            items.forEach(function(v) {
                v.classList.add('hide');
                if (v.getAttribute('data-id') == 1) {
                    v.classList.remove('hide');
                }
            });
          }

          document.querySelector('textarea[name="desc"]').value = this.state.params.memo;
          this.show = false;
          Helper.clear(skey);
      } else {
          this.state.params.driveType = _this.defaultVal.driveType;
          this.state.params.driveTypeName = _this.defaultVal.driveTypeName;
      }  
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

        $(window).trigger('drive_type_changed', [selectedItem.CODE_NAME]);
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
        _this.state.params.carName = selectedItem.carName;
        _this.state.params.carType = selectedItem.carType;
        _this.state.params.carCode = selectedItem.carCode;
    }, p);
  }

  selectSaleShop(e) {
     let //lat = 116.405467, lng = 39.907761,
         target;
     target = $(e.target).parents('li');
     target = target.find('.cdrive-cell-nav span');

     Ui.wxReady(() => {
         Ui.loading();
         Ui.getLocation().then((v) => {
            Http.get('driveSaleShop', {longitude: v.longitude, latitude: v.latitude}, (res) => {
                if (res && Array.isArray(res.data)) { 
                    let data = [],
                        picker, p = {},
                        result = res.data;
        
                    result.forEach((v) => {
                        data.push({value: v.DMS_DEALER_CODE, label: v.DEALER_NAME});
                    });

                    let minDis = _this.getMinDistance(result);
        
                    if (_this.state.params.dealer) {
                        p.defaultValue = [_this.state.params.dealer];
                    } else {
                        p.defaultValue = [minDis.DMS_DEALER_CODE];
                    }
                
                    Ui.loadPicker(data, (res) => {
                        let selectedItem = Helper.getSelectedValue(result, 'DMS_DEALER_CODE', res[0]);
                        target.get(0).innerText = selectedItem.DEALER_NAME;
                        _this.state.params.dealerName = selectedItem.DEALER_NAME;
                        _this.state.params.dealer = selectedItem.DMS_DEALER_CODE;
                    }, p);
                    Ui.loading(true);
                }
             });
         });
     });
  }

  getMinDistance(data) {
     if (! Array.isArray(data)) {
        return {};
     }

     let salerShop = {},
         min = 10000;

     data.forEach((v) => {
         min = Math.min(v.DISTANCE, min);

         if (min == v.DISTANCE) {
             salerShop['DMS_DEALER_CODE'] = v.DMS_DEALER_CODE;
             salerShop['DEALER_NAME'] = v.DEALER_NAME;
         }
     });

     return salerShop;
  }

  selectToShopTime(e) {
      let data = [],
          picker,
          li,
          target,
          p = {};

      data = [
         {value: 0, label: '不限'},
         {value: 1, label: '节假日上午'},
         {value: 2, label: '节假日下午'},
         {value: 3, label: '工作日上午'},
         {value: 4, label: '工作日下午'},
         {value: 5, label: '指定日期时间'}
      ];   
      li = $(e.target).parents('li');
      target = li.find('.cdrive-cell-nav span');
      if (_this.state.params.onShopTime) {
           p.defaultValue = [_this.state.params.onShopTime];
      }

      Ui.loadPicker(data, (res) => {
          let selectedItem = Helper.getSelectedValue(data, 'value', res[0]);
          target.get(0).innerText = selectedItem.label;
          _this.state.params.onShopTime = selectedItem.value;
          _this.state.params.onShopTimeName = selectedItem.label;
     }, p);
  }

  selectTime(e) {
    if (_this.state.params.onShopTime !== 5) {
       return;
    }

     let target = $(e.target).parents('li'), picker;
     target = target.find('.cdrive-cell-nav span');
     Ui.loadDatePicker(e.target, (date) => {
        target.get(0).innerText = date;
        _this.state.params.spTime = date;
     });
  }

  driveTypehanged(e, name) {
     let items = document.querySelectorAll('.cdrive-selected-type');
     items = Array.from(items);

     items.forEach((v, i) => {
         v.classList.add('hide');
         if (name === '送车上门' && v.getAttribute('data-id') == 2) {
             v.classList.remove('hide');
             _this.state.params.address = '';
             v.querySelector('.cdrive-cell-nav span').innerHTML = '';
         } else if (name === '预约到店' && v.getAttribute('data-id') == 1) {
             v.classList.remove('hide');
             _this.state.params.address = '选择销售店';
             v.querySelector('.cdrive-cell-nav span').innerHTML = '选择销售店';
         }
     });
  }
  
  selectLocation() {
      _this.state.params.contact = document.querySelector('input[name="contact"]').value;
      _this.state.params.mobile = document.querySelector('input[name="mobile"]').value;    
      _this.state.params.memo = document.querySelector('textarea[name="desc"]').value; 

      Helper.clear(skey);
      Helper.setData(skey, JSON.stringify(_this.state.params));
      document.location.href = '/wchat/cdriveMap/?act=/wchat/cdriveAdd&key=cdrive_add';
  }

  reserve() {
     _this.state.params.contact = document.querySelector('input[name="contact"]').value;
     _this.state.params.mobile  = document.querySelector('input[name="mobile"]').value;
     _this.state.params.memo = document.querySelector('textarea[name="desc"]').value;
     _this.state.params.isTermed = document.querySelector('input[name="term"]').checked;

     if (! _this.state.params.carType) {
        Ui.toast('请选择试驾车型');
        return false;
     }

     if (! _this.state.params.contact) {
        Ui.toast('请填写联系人');
        return false;
     }

     if (! Helper.isMobile(_this.state.params.mobile)) {
        Ui.toast('请输入有效的手机号');
        return false;
     }

     if (_this.state.params.onShopTime === 5) {
         if (! _this.state.params.spTime) {
            Ui.toast('请输入指定时间');
            return false;
         }
     }

     if (_this.state.params.driveTypeName === '预约到店') {
         if (! _this.state.params.dealer) {
            Ui.toast('请选择销售店');
            return false;
         }
     }

     /* if (! _this.state.params.memo) {
        Ui.toast('请填写备注信息');
        return false;
     } */

     if (! _this.state.params.isTermed) {
        Ui.toast('请确认已阅读并同意个人隐私条款');
        return false;
     }

     // TODO Commit the data
     let params = {
        driveType: _this.state.params.driveType,
        carType: _this.state.params.carType,
        dealerCode: _this.state.params.dealer,
        userName: _this.state.params.contact,
        userPhone: _this.state.params.mobile,
        remark: _this.state.params.memo,
        applyTimeType: _this.state.params.onShopTime,
        applyTime: _this.state.params.spTime,
        carCode: _this.state.params.carCode
     };
     Http.post('driveBooking', params, (res) => {
         if (res && res.data) {
             if (res.data.errorCode != 1) {
                Ui.toast(res.data.errorMsg);
             } else {
                let content = `<h3>尊敬的车主<strong style="color:#da7b38">${params.userName}</strong>，您好！</h3>
                               <p>已经成功接收到您的试驾预约要求，我们正为您安排，稍后会收到我们的消息提醒，感谢您的关注与厚爱！</p>`;
                Ui.dialog(content, function() {
                    document.location.href = '/wchat/cdriveList';
                });
             }
         } else {
            Ui.toast('预约提交失败');
         }
     });
  }
 
  render() {
    const that = this;
    const title = '试驾预约';
   
    return (
      <div className={'wrap cdrive-add-page'}>
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
                        <span className={'cdrive-cell-nav'}><span>{this.state.params.carName}</span><i className={'nav-arrow'}></i></span>
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
          <ul className={'cdrive-table-view cdrive-selected-type'} data-id="1">
							<li className={'cdrive-table-view-cell'}>
								<a href="javascript:void(0)" className={'cdrive-navigate-right'} onClick={this.selectSaleShop}>
                   <span className={'cdrive-cell-nav'}><span>{this.state.params.address}</span><i className={'nav-arrow'}></i></span>
                </a>
							</li>
           </ul> 
           <ul className={'cdrive-table-view cdrive-selected-type hide'} data-id="2">
							<li className={'cdrive-table-view-cell'}>
								<a href="javascript:void(0)" className={'cdrive-navigate-right'} onClick={this.selectLocation}>试驾地址
                   <span className={'cdrive-cell-nav'}><span>{this.state.params.address}</span><i className={'nav-arrow'}></i></span>
                </a>
							</li>
           </ul> 
           <ul className={'cdrive-table-view top-10'}>
							<li className={'cdrive-table-view-cell'}>
								<a href="javascript:void(0)" className={'cdrive-navigate-right'} onClick={this.selectToShopTime}>到店时间
                   <span className={'cdrive-cell-nav'}><span>{this.state.params.onShopTimeName}</span><i className={'nav-arrow'}></i></span>
                </a>
							</li>
              <li className={'cdrive-table-view-cell'}>
								<a href="javascript:void(0)" className={'cdrive-navigate-right'} onClick={this.selectTime}>
                   <span className={'cdrive-cell-nav'}><span>{this.state.params.spTime}</span><i className={'nav-arrow'}></i></span>
                </a>
							</li>
            </ul>   
            <div className={'cdrive-bottom-text'}>
               <textarea name="desc" placeholder="请输入您的备注内容"></textarea>
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


export default CDriveAdd;
