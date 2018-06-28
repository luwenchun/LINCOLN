/**
 * 预约试驾地址
 */

import React from 'react';
import Http from '../../utils/http';
import './style/drive.map.scss';
import Map from '../../utils/location';
import $ from 'jquery';
import { call } from 'redux-saga/effects';
import DriveSearch from './components/drive.search';
import {SERVER_BASE_PATH} from '../../global.config';
import Helper from '../../utils/helper';
import { Helmet } from 'react-helmet';
import Ui from '../../utils/weixin';

const apis = [
    {"id":"driveSaleShop","url":"/dealer/api/v1/nearDealer", format:false}
  ];
  
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);
let _this, map;

class CDriveMap extends React.Component {
    constructor(props) {
        super(props);
        this.map = window.map = new Map({lat: 116.405467, lng: 39.907761, list: 'cdrive-near-list', search: 'default'});
        this.state = {
            list: []
        };
        _this = this;
        
    }

    componentDidMount() {
        Ui.wxReady(function() {
            Ui.getLocation().then((v) => { 
                Ui.loading();
                Http.get('driveSaleShop', {longitude: v.longitude, latitude: v.latitude}, (res) => {
                    if (res && Array.isArray(res.data)) { 
                        _this.state.list = res.data;
                        _this.setState({list: res.data});
                        Ui.loading(true);
                    }
                });
            });
        });
        

        $('.cdrive-map-block').on('click', 'li', function(e) { 
            e.preventDefault(); 
            _this.backToPrev(this);
        });
        
    }

    search() { 
        $('.cdrive-search-page').removeClass('hide').removeClass('fadeOutLeft').addClass('fadeInLeft');
    }
    /**
     * 获取经销商列表
     */
    getDealerList(callback) {
        let params = {};
        Http.get('driverInfo', params, (data)=> {
            if (typeof callback !== 'undefined') {
                callback(data);
            }
        });
    }

    backToPrev(o) {
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

    render() {
        const list = this.state.list;
        const title = '试驾预约';

        return (
            <div className={'wrap'}>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content="{title}" />
                </Helmet>    
                <div className={'cdrive-search-top'}>
                    <div className={'cdrive-search-bar'}>
                        <span className={'cdrive-loc-icon mui-icon mui-icon-location'}></span>
                        <input type="text" name="drive_loc" placeholder="请输入您的试驾地址" onClick={this.search}/>
                    </div>  
                </div>
                <div id="container"></div>
                <div className={'cdrive-near-list cdrive-map-block'}>
                    <ul>
                        <li>
                            <div className={'title'}>
                                <label>[当前位置]<i>辽油大厦</i></label>
                                <p></p>
                            </div>
                        </li>
                        {
                            list.map((item, i) => {
                                return (
                                    <li key={i}>
                                        <div className={'title'} data-id={item.DEALER_CODE}>
                                            <label dangerouslySetInnerHTML={{__html:item.DEALER_NAME}} />
                                        </div>
                                        <p dangerouslySetInnerHTML={{__html:item.DETAIL_ADDRESS}} />
                                    </li>
                                );    
                            })
                        }
                    </ul>
                </div>
                <DriveSearch />
            </div>
        );
    }
}

export default CDriveMap;