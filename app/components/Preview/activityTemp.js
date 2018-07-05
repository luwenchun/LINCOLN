import React, { Component } from 'react';
import browser from './common';
import './common.scss'
import './activityTemp.scss'
import { Helmet } from 'react-helmet';
import moment from 'moment';
// import { Form, Button, Row, Col, Modal, Select } from 'antd';
import Http from '../../utils/http';
import Utils from '../../utils/DMCUtil';
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../global.config';

const title = '活动详情';
const apis = [
    // { "id": "queryDetailNews", "url": "community/news/queryDetailNews", "format": false },
    { "id": "saicActivity", "url": "community/saicActivity" },

];
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

window.attention = () => { };    // APP关注交互
window.getToken = (token) => { };

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data || {},
            style: {
                width: '100%',
                height: 'auto'
            },
            isFollow: false,
            isWatch: false,
            token: '',
            isApp: !(Http.getQueryValue('flage') == 1),
        }
    }
    componentWillMount() {
        if (!this.props.id) {
            Http.get('saicActivity', { saicActivityId: Http.getQueryValue('id') }, data => {
                if (data) {
                    this.setState({ 
                        data,
                        isFollow: data.watchStatus == 10071001 || data.watchStatus == 10071003,
                        isWatch: data.instreStatus,
                    })
                }
            })
        }

        // this.setState({ data: { "id": 2, "activityTitle": "活动标题", "signStartTime": 1526486400000, "signEndTime": 1526655600000, "activityStartTime": 1526486400000, "activityEndTime": 1526742000000, "activityAddress": "string", "outPic": "https://carapptest.gtmc.com.cn/fs01/20180524/2d3a252d2869d39a736ff232cb2f74ba.jpg", "detailsActivity": "string", "saicUseriId": 1, "name": "我是一楼", "photoUrl": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "instre": [{ "activityId": 2, "saicUserId": 2, "photoUrl": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "total": null }, { "activityId": 2, "saicUserId": 6, "photoUrl": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "total": null }, { "activityId": 2, "saicUserId": 3, "photoUrl": "https://oss-qa-bm.saicmotort.com/oss/download/entmu/2cedb7b4f42c40b8a1326ab9bc9ae50c.jpg", "total": null }, { "activityId": 2, "saicUserId": null, "photoUrl": null, "total": null }], "instreStatus": 0, "watchStatus": 0, "createTime": 1526542041000, "total": 4, "signStatus": 0, "currentTime": 1527073551313 } })

        window.attention = (bl) => {
            const isFollow = bl == '10071001' || bl == '10071003';
            if (isFollow == this.setState.isFollow) return !1;
            this.follw.bind(this, isFollow)
        }

        window.getToken = (token) => {
            this.setState({ token });
            Http.setRequestHeader({ token });
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.style) {
            this.setState({
                style: nextProps.style
            })
        }
    }


    follw(isFollow) {
        const { data, token } = { ...this.state };
        if (token && token.length) {  // 是否在APP环境内
            const query = {
                businessId: data.id,
                businessType: isFollow ? 10071002 : 10071001,  // 10071001:关注, 10071002:取关
            }
            Http.setRequestHeader({ token })
            Http.get('addOrCancel', query, res => {
                if (res) {
                    this.setState({ isFollow: !isFollow });
                    // IOS
                    try {
                        window.webkit.messageHandlers.attention.postMessage(isFollow ? 10071002 : 10071001);
                    } catch (error) { }

                    // Andorid
                    try {
                        window.NativeJavaScriptInterface.attention(isFollow ? 10071002 : 10071001);
                    } catch (err) { }
                }
            });
        } else {
            // this.setState({ isFollow: !isFollow })
        }
    }

    activeState() {
        const { data } = { ...this.state };
        const curDate = (new Date()).getTime();
        let msg = '';
        if(data.activityStartTime > curDate){
            msg = '未开始'
        }else if(data.activityStartTime < curDate && data.activityEndTime > curDate){
            msg = '进行中'
        }else{
            msg = '已结束'   
        }
        return msg;
    }

    watchChange(s){
        this.setState({isWatch: !s})
    }

    render() {
        const { data, style, isFollow,isWatch } = { ...this.state };
        const flage = Http.getQueryValue('flage') && Http.getQueryValue('flage') == 1;
        return (
            <div className="AFeto" style={style}>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Helmet>
                <div className="tit">
                    {data.detailsPic
                        ? <div style={{ position: 'relative' }}>
                            <img src={data.detailsPic} />
                            <div style={{ padding: '.2rem .5rem', color: 'white', background: ` url(${require('./images/Rectangle.png')}) no-repeat center/100%`, display: 'inline-block', position: 'absolute', top: '2rem', right: '.5rem' }}>
                                {this.activeState()}
                            </div>
                        </div>
                        : ""}
                </div>
                <ul>
                    <li>
                        <h2>{data.activityTitle}</h2>
                    </li>
                    <li>
                        <div>
                            <img src={data.photoUrl} />
                        </div>
                        <div>
                            <span className="mas">{data.name}</span>
                            <span>{Utils.dateName(data.createTime)}</span>
                        </div>
                        {isFollow
                            ? <div onClick={this.follw.bind(this, isFollow)}><span>已关注</span></div>
                            : <div onClick={this.follw.bind(this, isFollow)}>
                                <img src={require('./api/template/img/add.png')} />
                                <span>关注</span>
                            </div>}
                    </li>

                    <div className='address'>
                        <p>
                            <img src={require('./images/location.png')} />
                            <span>{data.activityAddress}</span>
                        </p>
                        <p>
                            <img src={require('./images/time.png')} />
                            <span>{moment(data.activityStartTime).format('YYYY年MM月DD号')} — {moment(data.activityEndTime).format('MM月DD号')}</span>
                        </p>
                    </div>

                    <div className='interest'>
                        <span>
                            {data.instre && data.instre.map((e, i) => {
                                return (
                                    <span key={i} style={{ overflow: 'hidden', borderRadius: '.8rem', display: 'inline-block', width: '1.5rem', height: '1.5rem' }}>
                                        <img style={{ width: '100%' }} src={e.photoUrl} />
                                    </span>
                                )
                            })}
                        </span>
                        <span style={{ color: 'blue' }}>{Utils.browseCunt(data.total)}</span>
                        <span>人感兴趣</span>
                        <img onClick={this.watchChange.bind(this, isWatch)} src={require(isWatch?'./images/Fabulous5.png':'./images/Fabulous4.png')} />
                    </div>

                    <li className="dRcontent">
                        <div>
                            <h4>
                                <i></i>
                                活动详情
                                <i></i>
                            </h4>
                            <div className='aContentHTML' dangerouslySetInnerHTML={{ __html: data.detailsActivity }}></div>
                        </div>
                    </li>
                </ul>
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