import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import browser from './common';
import './common.scss'
import './newsVedioTemp.scss'
import { Modal, Select } from 'antd';
import Http from '../../utils/http';
import Utils from '../../utils/DMCUtil';
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../global.config';
import 'plyr/dist/plyr.css';
import Plyr from 'plyr/dist/plyr';
import Commit from './commitTemp';

const apis = [
    // { "id": "queryDetailNews", "url": "community/news/queryDetailNews", "format": false },
    { "id": "queryDetailNews", "url": "community/news/queryDetailNews" },
];
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

const title = '资讯详情';
const Option = Select.Option;

// const controls = ['play-large', 'play', 'progress', 'current-time', 'volume', 'airplay', 'fullscreen'];
const controls = ['play-large', 'play', 'progress', 'current-time', 'airplay', 'fullscreen'];
class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data || {},
            style: {
                width: this.props.style ? this.props.style.width : '100%',
                height: this.props.style ? this.props.style.height : 'auto'
            },
            isFollow: false,
            isPraise: false,
            query: {
                businessType: 1004,
                businessId: Http.getQueryValue('id') || '',
                limit: 10,
                page: 1,
            }
        }
    }

    componentWillMount() {
        if (!this.props.data) {
            Http.get('queryDetailNews', { id: Http.getQueryValue('id') }, data => {
                if (data) {
                    this.setState({ data }, () => {
                        setTimeout(() => {
                            document.addEventListener('DOMContentLoaded', () => {
                                const player = new Plyr('#player', { controls });
                            });
                        }, 0)
                    })
                }
            })
        }

    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const { data, style, controls, isFollow, isPraise, query } = { ...this.state }
        const flage = Http.getQueryValue('flage') && Http.getQueryValue('flage') == 1;
        return (
            <div className="Ifeto">
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Helmet>
                <div className="container">
                    {data.content
                        ? <video preload="load" webkit-playsinline="" playsinline="" x5-playsinline="" x-webkit-airplay="allow" style={{ width: '100%' }} controls crossorigin playsinline poster={require('./images/ViewFrom.png')} id="player">
                            <source src={data.content} type="video/mp4" />
                            <source src={data.content} type="video/webm" />
                            你的浏览器不支持H5播放器;
                        </video>
                        : ''}
                </div>
                <ul>
                    <li>
                        <h2>{data.title}</h2>
                    </li>
                    <li>
                        <div>
                            <img src={require('./api/template/img/user2@3x.png')} />
                        </div>
                        <div>
                            <span className="mas">{data.name}</span>
                            <span className="mass masd">
                                <img src={require('./images/playIcon.png')} />
                            </span>
                            <span className="times">{Utils.browseCunt(data.browseNumber)}</span>
                            <span>{Utils.dateName(data.releaseDate)}</span>
                        </div>
                        {isFollow
                            ? <div><span>已关注</span></div>
                            : <div>
                                <img src={require('./api/template/img/add.png')} />
                                <span>关注</span>
                            </div>}
                    </li>
                    {data['newsSummary'] && data['newsSummary'].length
                        ? <li className="newsSummary">
                            {/* <img alt="圈圈" src={require('./api/template/img/Oval 2@3x.png')} /> */}
                            <div dangerouslySetInnerHTML={{ __html: data.newsSummary }}></div>
                        </li>
                        : ''}
                    <li style={{ paddingBottom: '10px', borderBottom: '.5px solid #ccc' }}>
                        <div>
                            <span style={{ marginTop: '10px', float: 'left', padding: '5px 8px', border: '.5px solid #ccc', borderRadius: '100px' }}>
                                <img style={{ width: '.6rem', marginRight: '5px' }} src={require(isPraise ? './images/FabulousSelected.png' : './images/Fabulous.png')} />
                                <span style={{ marginRight: '5px' }}>赞</span>
                                <span>{Utils.browseCunt(data.praiseNumber)}</span>
                            </span>
                            {/* <img style={{ float: 'right', width: '50px' }} src={require('./images/pengyouquan.png')} />
                            <img style={{ float: 'right', width: '50px', marginRight: '16px' }} src={require('./images/weixin.png')} /> */}
                        </div>
                    </li>
                </ul>
                <Commit query={query} commentNumber={data.commentNumber} />
                <div className='goApp' style={{ display: flage ? 'block' : 'none' }}>
                    <img src={require('./images/AppLog.png')} />
                    <span>上汽荣威</span>
                    <span onClick={browser.goApp.bind(browser)}>打开App</span>
                </div>
            </div>


        )
    }
}

export default View;