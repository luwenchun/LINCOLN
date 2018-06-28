/**
 * 搜索预约试驾地址
 */

import React from 'react';
import Http from '../../utils/http';
import './style/drive.map.scss';
import Map from '../../utils/location';
import Mui from '../../utils/ui.plugin';
import $ from 'jquery';
import _ from 'lodash';
import Helper from '../../utils/helper';
import { Helmet } from 'react-helmet';

let _this,
    interval;
const title = "试驾预约";

class CDriveSearch extends React.Component {
    constructor(props) {
        super(props);
        this.map = new Map({lat: 116.405467, lng: 39.907761, list: 'cdrive-near-list'});
        this.el = null;
        this.page = 1;
        this.loaded = false;
        this.isRefresh = false;
        this.backAction = Helper.getUrlParams('act');
        _this = this;
        document.addEventListener('keyup', _.throttle(_this.search, 1500), false);
        
        this.state = {
            dataSource: []
        };
    }

    componentDidMount() {
        mui('.mui-scroll-wrapper').scroll({
            bounce: false,
			indicators: true, 
			deceleration: 0.0005
        });
        _this.refersh();

        $('.cdrive-search-block').on('click', 'li', function(e) {
            _this.backTo(this);
        });
    }

    cancel() {
        document.querySelector('input[name="drive_loc"]').value = '';
    }

    backTo(o) {
        let val = o.querySelector('label').innerHTML.replace(/<[^>]+>/g, '') + ' - ' 
                + o.querySelector('p').innerHTML;
        Helper.setData('drive_location', val);
        document.location.href = _this.backAction;
    }

    search() {
        if (_this.loaded === false) {
            if (_this.el == null) {
                _this.el = document.querySelector('input[name="drive_loc"]');
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
                        document.querySelector('.mui-pull-bottom-tips').style.display = 'block';
                    }
                });
            }
        }
        
    }

    refersh() {
        Mui.scrollerRefresh('.mui-scroll', (el, callback) => { 
            if (_this.el == null) {
                _this.el = document.querySelector('input[name="drive_loc"]');
            }

            if (_this.isRefresh === false) { 
                if (_this.el.value && _this.el.value.length > 1) {
                    _this.isRefresh = true; 
                    _this.map.searchLoc(_this.el.value, function(res) {
                        let list = res.pois || [];
                        let ul  = el.querySelector('.cdrive-near-list ul'),
                            len = list.length,
                            fragment = document.createDocumentFragment(),
                            li, i;
    
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
                        if (len > 0) {
                            ul.appendChild(fragment, ul.firstChild);
                        }

                        if (typeof callback !== 'undefined') {
                            callback();
                        }
                        
                        _this.isRefresh = false;
                    }, ++_this.page);
                }
            }
        });
    }

    render() {
        const list = this.state.dataSource;
        const show = 'none';

        return (
            <div className={'wrap cdrive-search-page'}>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content="{title}" />
                </Helmet>  
                <div className={'cdrive-search-top'}>
                    <div className={'cdrive-search-bar'}>
                        <span className={'cdrive-loc-icon mui-icon mui-icon-location'}></span>
                        <input type="text" name="drive_loc" placeholder="请输入您的试驾地址" onClick={this.search}/>
                    </div>  
                    <a className={'cdrive-search-cancel'} href="javascript:void(0)" onClick={this.cancel}>取消</a>
                </div>
                <div id="container2" style={{display: show}}></div>
                <div className={'mui-slider mui-fullscreen'}>
                    <div className={'mui-scroll-wrapper'}>
                        <div className={'mui-scroll'}>
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
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>    
        );
    }
}

export default CDriveSearch;