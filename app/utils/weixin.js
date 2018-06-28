import '../components/mui/css/weui.min.scss';
import '../components/mui/js/weui.min.js';
import $ from 'jquery';
import { call } from 'redux-saga/effects';
import {SERVER_BASE_PATH} from '../global.config';
import Helper from './helper';

/**
 * 微信相关接口方法调用
 */
class WxJSHandler {
    constructor() {
        this.init();
        this.earth_radius = 6378.137;
    }

    init() {
        // Add weixin plugin
        if (document.getElementById('scr_weixin') == null) {
            let script = document.createElement('script');
            script.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
            script.id  = "scr_weixin";
            document.getElementsByTagName('head')[0].appendChild(script);
        }
        
        // $(window).bind('wx_loaded', this.wxReady);

        // $(function() {
        //     $(window).trigger('wx_loaded');
        // });
    }

    wxReady(callback) {
        let url = SERVER_BASE_PATH.split('wx'),
            nonceStr,
            timestamp;
            url = url[0] ? url[0] + 'wx/sharepage/getTicket' : '';
            nonceStr = Helper.createNonceStr();
            timestamp = Math.floor(new Date().getTime() / 1000);

            $.get(url, {}, function(ticket) {
                let params = {
                    jsapi_ticket: ticket,
                    noncestr: nonceStr,
                    timestamp: timestamp,
                    url: location.href.split('#')[0]
                }, str = '',
                signature = '';

                for (let v in params) {
                    str += v + '=' + params[v] + '&';
                }
                str = str.substring(0, str.length - 1);
                signature = Helper.hexCode(str);

                wx.config({
                    debug: false, 
                    appId: 'wxb85ed633e428bafc', // Required, the only identification of Official account.
                    timestamp: timestamp, // Required, generate a signed timestamp
                    nonceStr: nonceStr, // Required, generate a signed nonceStr
                    signature: signature,// Required, signature. See Appendix 1
                    jsApiList: ['checkJsApi', 'getLocation', 'chooseImage', 'uploadImage', 'openLocation'] // Required, required JA interface list, all JS interface list, see Appendix 2
                });

                wx.ready(function() {
                    if (typeof callback === 'function') {
                        callback();
                    }
                })
                
                wx.error(function(res) {
                    console.log(res);
                });
            });
    }

    /**
     * 获取地理位置
     */
    getLocation() {
        return new Promise(function(resolve, reject) {
            wx.getLocation({
                type: 'wgs84', // wgs84 is the default gps coordinates. If wish to return, import 'gcj02' directly as the Mars coordinates used for openLocation.
                success: function (res) {
                    var latitude = res.latitude; // latitude, floating point, range is 90 ~ -90
                    var longitude = res.longitude; // longitude, floating point, range is 180 ~ -180.
                    var speed = res.speed; // speed, calculated in meter per second
                    var accuracy = res.accuracy; // location accuracy
                    resolve(res);
                }
            });
        });
    }
    /**
     * 选择上传图片
     * @return
     */
    selectImage() {
        return new Promise((resolve, reject) => {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    resolve(res.localIds);
                }
            });
        });
    }
    /**
     * 上传图片
     * @param {String} id
     * @return
     */
    uploadImage(id) {
        return new Promise((resolve, reject) => {
            wx.uploadImage({
                localId: id, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    // 返回图片的服务器端ID
                    resolve(res.serverId);
                }
            });
        });
    }

    /**
     * 根据两点间经纬度坐标（double值），计算两点间距离，单位为米 
     * @param {double} lat1 
     * @param {double} lng1 
     * @param {double} lat2 
     * @param {double} lng2 
     * @return double
     */
    getDistance(lat1, lng1, lat2, lng2) {
        let latRad1 = radian(lat1),
            latRad2 = radian(lat2),
            a = latRad1 - radLat2;
            b = radian(lng1) - radian(lng2);
            res = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
                Math.cos(latRad1) * Math.cos(latRad2) * Math.pow(Math.sin(b / 2), 2)));
            res *= this.earth_radius;
            res = Math.round(res * 10000) / 10000;

        function radian(val) {
            return val * Math.PI / 180;
        }

        return res;
    }
    /**
     * 获取最小距离
     * @param {object} user 
     * @param {Array} sLocs 
     */
    getMinDis(user, sLocs) {
        if (! Array.isArray(sLocs)) {
            return 0;
        }

        let len = sLocs.length,
            i   = 0,
            res = [];

        for (i = 0; i < len; i++) {
            res.push(this.getDistance(user.latitude, user.longitude, sLocs[i].LATITUDE, sLocs[i].LONGITUDE));
        }

        return Math.min.apply(Math, res);
    }

    loadPicker(data, callback, args) { 
        data = Array.isArray(data) ? data : [];
        let params = {
            onChange: function (result) {
            },
            onConfirm: function (result) {
                if (typeof callback === 'function') {
                    callback(result);
                }
            }
        }; 

        if ($.isPlainObject(args)) {
            for (let v in args) {
                params[v] = args[v];
            }
        }

        weui.picker(data, params);
    }

    loadDatePicker(o, callback, defaultParams) {
        defaultParams = defaultParams || {date: {}, min: {}};
        let _this = o,
            cdate = new Date(),
            initParams = {
                start: 2001,
                end: cdate.getFullYear() + 10,
                defaultValue: [cdate.getFullYear(), cdate.getMonth() + 3, cdate.getDate()],
                onConfirm: function (result) {
                    $('.pikcer-expect-date .weui-picker').on('animationend webkitAnimationEnd', function() {
                        showTimePicker(_this, result);
                    });
                },
                id: 'pikcer-expect-date',
                className: 'pikcer-expect-date'
            };

        for (let v in defaultParams.date) {
            initParams[v] = defaultParams[v];
        }    
  
        weui.datePicker(initParams);

        let hours = [],
            minutes = [],
            symbol = [{ label: ':', value: 0 }];
        function showTimePicker(o, date, defaultVal) { 
            date = date[0] + "-" + (date[1] < 10 ? "0" + date[1] : date[1]) + "-" + (date[2] < 10 ? "0" + date[2] : date[2]);
            if (hours.length <= 0) {
                for (var i = 0; i < 24; i++) {
                    var hoursItem = {};
                    hoursItem.label = ('' + i).length === 1 ? '0' + i : '' + i;
                    hoursItem.value = i;
                    hours.push(hoursItem);
                }
            }

            if (minutes.length <= 0) {
                for (var j= 0; j < 60; j++) {
                    var minutesItem = {};
                    minutesItem.label = ('' + j).length === 1 ? '0' + j : '' + j;
                    minutesItem.value = j;
                    minutes.push(minutesItem);
                }
            }
            
            let iParams = {
                defaultValue: [cdate.getHours(), 0, cdate.getMinutes()],
                onConfirm: function(result) {
                    let time = result[0] + ':' + (result[2] < 10 ? "0" + result[2] : result[2]);
                    let expectDate = date + ' ' + time;
                    if (typeof callback === 'function') {
                        callback(expectDate);
                    }
                },
                id: 'picker-expect-time'
            };

            for (let v in defaultParams.min) {
                iParams[v] = defaultParams[v];
            } 

            weui.picker(hours, symbol, minutes, iParams);
        }
    }
    /**
     * 弹出框
     * @param {String} msg 
     * @param {Function} callback 
     */
    dialog(msg, callback) {
        let dialog  = document.querySelector('#iosDialog'),
            content = msg || '';

        if (dialog == null) {
            let dv = document.createElement('div'), html;
                dv.className = "js_dialog";
                dv.id = "iosDialog";
                dv.style.display = "none";
                html = `<div class="weui-mask"></div>
                        <div class="weui-dialog">
                            <div class="weui-dialog__bd">${content}</div>
                            <div class="weui-dialog__ft">
                                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a>
                            </div>
                        </div>`;
            dv.innerHTML = html;            
            document.body.appendChild(dv);  
            dialog = dv;      
            
            dv.querySelector('.weui-dialog__btn').addEventListener('click', function(e) {
                if (typeof callback === 'function') {
                    callback();
                }
                $(this).parents('.js_dialog').fadeOut(200);
            });
        }

        dialog.querySelector('.weui-dialog__bd').innerHTML = content;
        $(dialog).fadeIn(200);
    }

    toast(msg) {
        let toast   = document.querySelector('#toast'),
            content = msg || "";

        if (toast == null) {
            let dv = document.createElement('div'), html;
            dv.id = "toast";
            dv.style.display = "none";
            html = `<div class="weui-mask_transparent"></div>
                    <div class="weui-toast">
                        <i class="weui-icon-success-no-circle weui-icon_toast"></i>
                        <p class="weui-toast__content">${content}</p>
                    </div>`;
            dv.innerHTML = html;            
            document.body.appendChild(dv);  
            toast = dv;      
        }    

        if ($(toast).css('display') != 'none') return;

        $(toast).find('.weui-toast__content').html(content);
        $(toast).fadeIn(100);
        setTimeout(function () {
            $(toast).fadeOut(100);
        }, 2000);
    }

    loading(isClose, msg) {
        let loading = document.querySelector('#loadingToast');
        isClose = typeof isClose === 'boolean' ? isClose : false;
        msg = msg || "数据加载中";

        if (loading == null) {
            let dv = document.createElement('div'), html;
            dv.id = "loadingToast";
            dv.style.display = "none";
            html = `<div class="weui-mask_transparent"></div>
                    <div class="weui-toast">
                        <i class="weui-loading weui-icon_toast"></i>
                        <p class="weui-toast__content">${msg}</p>
                    </div>`;
            dv.innerHTML = html;            
            document.body.appendChild(dv);  
            loading = dv;      
        }    

        if (isClose) {
            $(loading).fadeOut(100);
            
        } else {
            if ($(loading).css('display') != 'none') return;
            $(loading).find('.weui-toast__content').html(msg);
            $(loading).fadeIn(100);
        }
    }
}

export default new WxJSHandler