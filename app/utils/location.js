/**
 * 高德地图集成
 */
import $ from 'jquery';
import { call } from 'redux-saga/effects';
import Weixin from './weixin';

let _this; 

export default class MapPlugin {
    constructor(options) {
        options = options || {};
        this.apiKey  = options.key || '784970e15b18101cfe522057b6d97d9d';
        this.version = '1.4.6';
        this.aMap = null;
        this.map = {'container': null, 'container2': null};
        this.latitude = options.lat || 0;
        this.longitude = options.lng || 0;
        this.options = options || { resizeEnable: true, zoom: 11};
        this.cityCode = '';
        _this = this;
        this.init();
    }

    init() {
        let script = document.createElement('script'),
            glb = document.createElement('script');
        script.charset = 'utf-8';
        script.src = 'http://webapi.amap.com/maps?v=' + this.version + '&key=' + this.apiKey + "&plugin=AMap.Geocoder";
        document.head.appendChild(script);
        $(window).bind('map_loaded', _this.addMap);

        window.addEventListener('load', function(e) {
            window.AMap = AMap;
            $(window).trigger('map_loaded');
        }, false);
    }

    addMap(container) {
        _this.aMap = window.AMap; 

        Weixin.wxReady(() => { 
            Weixin.getLocation().then((v) => {   
                for (let c in _this.map) {
                    _this.map[c] = new AMap.Map(c, {
                        resizeEnable: true,
                        center: [v.longitude, v.latitude],
                        zoom: 13
                    });
                }
 
                var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                });   
                geocoder.getAddress([v.longitude, v.latitude], function(status, addrRes) {
                    _this.map['container'].getCity((result) => {
                        _this.cityCode = result.citycode;

                        if (_this.options.list) {
                            let el = document.querySelector('.' + _this.options.list + ' ul'),current = el.firstElementChild;
                            let name = '',
                                address = '';

                            if (status === 'complete' && addrRes.info === 'OK') {
                                name = addrRes.regeocode.addressComponent.township;
                                address = addrRes.regeocode.formattedAddress;
                            }    

                            name = address.substring( address.indexOf(name) + name.length, address.length);
                            current.querySelector('label').innerHTML = '[当前位置]<i>' + name + '</i>';
                            current.querySelector('p').innerHTML = address;
                        }
                    });   
                });

                let marker = new AMap.Marker({
                    position: new AMap.LngLat(v.longitude, v.latitude)
                });
                _this.map['container'].add(marker);
            });
            
        });
        

       /* _this.search([_this.latitude, _this.longitude], (res) => {
            if (_this.options.list) {
                let el = document.querySelector('.' + _this.options.list + ' ul'),
                    list = res.pois || [],
                    html = '';

                if (el.firstElementChild) {
                    html += '<li>' + el.firstElementChild.innerHTML + '</li>';
                }    

                list.forEach(item => {
                    html += "<li>\
                                <div class='title'>\
                                    <label>" + item.name + "</label>\
                                </div>\
                                <p>" + item.address + "</p>\
                            </li>";
                });    
                el.innerHTML = html;
            }
        });  */
    }

    search(cpoint, callback, container) {
        if (! Array.isArray(cpoint) || cpoint.length <= 0) {
            return false;
        }
console.log(_this.cityCode);
        container = container || 'container';
        this.aMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 5,
                type: '风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
                pageIndex: 1,
                city: _this.cityCode || "021", //城市
                map: _this.map[container],
                autoFitView: false
            });
            
            placeSearch.searchNearBy('', cpoint, 1000, function(status, result) {
                if (typeof callback !== 'undefined') {
                    let list = result.poiList || {};
                    callback(list);
                }
            });
        });
    }

    searchLoc(keyword, callback, page, city, container) {
        if (! keyword) return;

        container = container || "container2";
        page = page || 1;
        city = city || "上海";
        this.aMap.service(["AMap.PlaceSearch"], function() {
            var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                pageSize: 15,
                pageIndex: page,
                city: city, //城市
                map: _this.map[container]
            });
            //关键字查询
            placeSearch.search(keyword, function(status, result) {
                if (typeof callback !== 'undefined') {
                    let res = result.poiList || [];
                    callback(res);
                }
                console.log(result);
            });
        });
    }
} 