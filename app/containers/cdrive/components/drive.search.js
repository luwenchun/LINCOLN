/**
 * 搜索预约试驾地址
 */

import React from 'react';
import Http from '../../../utils/http';
import '../style/drive.map.scss';
import Map from '../../../utils/location';
import $ from 'jquery';
import _ from 'lodash';
import Helper from '../../../utils/helper';
import Ui from '../../../utils/weixin';

let _this,
    interval;

class DriveSearch extends React.Component {
    constructor(props) {
        super(props);
        this.map = window.map;
        this.el = null;
        this.page = 1;
        this.loaded = false;
        this.isRefresh = false;
        _this = this;
        document.addEventListener('keyup', _.throttle(_this.search, 1000), false);
        this.totalpage = 1;
        this.state = {
            dataSource: []
        };
    }

    componentDidMount() {
        _this.refersh();

        $('.cdrive-search-block').on('click', 'li', function(e) {
            _this.backTo(this);
        });

        $('.cdrive-search-block').on('click', '.cdrive-load-button', function(e) {
            $(this).parent().remove();
            _this.refersh();
        });
    }

    cancel() {
        document.querySelector('input[name="drive_loc_search"]').value = '';
        let sPage = $('.cdrive-search-page');
        sPage.addClass('fadeOutLeft');
        setTimeout(function() {
            sPage.addClass('hide');
        }, 900);
    }

    backTo(o) {
        if (o.firstElementChild.tagName === 'BUTTON') {
            return;
        }

        let val = o.querySelector('label').innerHTML.replace(/<[^>]+>/g, ''),
            addr = o.querySelector('p').innerHTML, 
            id  = o.querySelector('.title').getAttribute('data-id'), data;

        let p = Helper.getUrlParams(),
            key = p['key'] || "";
            
        if (key) {
            data = Helper.getData(key, true);
            data.address = addr;

            if (key === 'cdrive_add') {
                data.dealer  = id;
                data.dealerName = val;
            }
        }    

        Helper.setData(key, JSON.stringify(data));
        document.location.href = p['act'] || "";
    }

    search() {
        _this.map = window.map;

            if (_this.loaded === false) { 
                if (_this.el == null) {
                    _this.el = document.querySelector('input[name="drive_loc_search"]');
                }
                if (_this.el.value && _this.el.value.length > 1) {
                    _this.loaded = true;
                    _this.map.searchLoc(_this.el.value, function(res) {
                        let list  = res.pois || [],
                            items = [];
    
                        list.forEach(item => {
                            item.name = item.name.replace(_this.el.value, '<i class="selected">' + _this.el.value + '</i>'),
                            item.address = item.address.replace(_this.el.value, '<i class="selected">' + _this.el.value + '</i>');
                            items.push(item);
                        });    
    
                        _this.setState({dataSource: items}); 
                        _this.loaded = false;
    
                        if (list.length > 0) {
                           // document.querySelector('.mui-pull-bottom-tips').style.display = 'block';
                           $('.cdrive-load-button').removeClass('hidden');
                        }
                    });
                }
            }
    }

    refersh() {
        let jDom = $('.cdrive-search-block');

        if (_this.el == null) {
            _this.el = document.querySelector('input[name="drive_loc_search"]');
        }

        _this.map.searchLoc(_this.el.value, function(res) {
            let list = res.pois || []; 
            let ul  = jDom.get(0).querySelector('.cdrive-near-list ul'),
                len = list.length,
                fragment = document.createDocumentFragment(),
                li, i;
            _this.totalpage = Math.ceil(res.count/ res.pageSize);

            for (i = 0; i < len; i++) {
                let name = list[i].name.replace(_this.el.value, '<i class="selected">' + _this.el.value + '</i>'),
                    addr = list[i].address.replace(_this.el.value, '<i class="selected">' + _this.el.value + '</i>');
                li = document.createElement('li');
                li.innerHTML = '<div class="title">\
                                    <label>' + name + '</label>\
                                </div>\
                                <p>' + addr + '</p>';
                           
                fragment.appendChild(li);
            }
            let li2 = document.createElement('li');

            if (len > 0) {
                li2.innerHTML = '<button type="button" class="cdrive-load-button">点击加载</button>';   
                fragment.appendChild(li2);
                ul.appendChild(fragment, ul.firstChild);
            } else {
                li2.innerHTML = '<div>没有更多数据...</div>';
                fragment.appendChild(li2);
                ul.appendChild(fragment, ul.firstChild);
            }

            if (typeof callback !== 'undefined') {
                callback();
            }
            
            _this.isRefresh = false;
        }, ++_this.page);
    }

    render() {
        const list = this.state.dataSource;
        const show = 'none';

        return (
            <div className={'wrap cdrive-search-page animated hide'}>
                <div className={'cdrive-search-top'}>
                    <div className={'cdrive-search-bar'}>
                        <span className={'cdrive-loc-icon mui-icon mui-icon-location'}></span>
                        <input type="text" name="drive_loc_search" placeholder="请输入您的试驾地址" onClick={this.search}/>
                    </div>  
                    <a className={'cdrive-search-cancel'} href="javascript:void(0)" onClick={this.cancel}>取消</a>
                </div>
                <div id="container2" style={{display: show}}></div>
                <div className={'cdrive-near-list cdrive-search-block'}>
                    <ul>
                        {
                            list.map((item, i) => {
                                return (
                                    <li key={i}>
                                        <div className={'title'}>
                                            <label dangerouslySetInnerHTML={{__html:item.name}} />
                                        </div>
                                        <p dangerouslySetInnerHTML={{__html:item.address}} />
                                    </li>
                                );
                            })
                        }
                        <li><button type="button" className={'cdrive-load-button hidden'}>点击加载</button></li>
                    </ul>
                </div>
                
            </div>    
        );
    }
}

export default DriveSearch;