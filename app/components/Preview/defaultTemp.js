import React, { Component } from 'react';
import browser from './common';
import './common.scss'
import './defaultTemp.scss'
import { Helmet } from 'react-helmet';
// import { Form, Button, Row, Col, Modal, Select } from 'antd';
import Http from '../../utils/http';
import Utils from '../../utils/DMCUtil';
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../global.config';
import { Toast } from 'antd-mobile';
import { Row ,Col } from 'antd';

const title = '资讯详情';
const apis = [
    // { "id": "queryDetailNews", "url": "community/news/queryDetailNews", "format": false },
    { "id": "queryDetailNews", "url": "community/news/queryDetailNews" },
    { "id": "insertUserWatchInfo", "url": "community/watch/insertUserWatchInfo", "format": false },
    { "id": "CancelUserWatchInfo", "url": "community/watch/CancelUserWatchInfo", "format": false },
];
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

window.attention = () => { };    // APP关注交互
window.getToken = (token) => { };
var zxHeight = 0;


class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data || {},
            style: {
                width: '100%',
                height: 'auto'
            },
            isFollow: Http.getQueryValue('isWatched') == 10071001 || Http.getQueryValue('isWatched') == 10071003,
            token: '',
            isApp: !(Http.getQueryValue('flage') == 1),
            upLoading: this.props.data ? 0 : 1,
        }
    }
    componentWillMount() {

        if (!this.props.data) {
            Http.get('queryDetailNews', { id: Http.getQueryValue('id') }, data => {
                if (data) {
                    this.setState({ data, upLoading: false }, () => {
                        setTimeout((_this) => {
                            _this.connectWebViewJavascriptBridge(bridge => {
                                zxHeight = document.getElementById('app').clientHeight;
                                //H5调Android
                                bridge.callHandler('getWebviewHeight', { height: zxHeight }, res => { });
                            })
                        }, 500, this)

                    })
                }
            })
        }

        window.attention = (bl) => {
            const isFollow = bl == '10071001' || bl == '10071003';
            // if (isFollow == this.setState.isFollow) return !1;
            // this.follw.bind(this, isFollow)
            this.setState({ isFollow });
        }


        this.connectWebViewJavascriptBridge(bridge => {
            const _this = this;
            // Android 调 JS
            bridge.registerHandler('attention', (data, responseCallback) => {
                const isFollow = data == '10071001' || data == '10071003';
                _this.setState({ isFollow });
                // responseCallback(data)
            })

            bridge.registerHandler('getWebviewHeight', (data, responseCallback) => {
                responseCallback({ height: zxHeight })
            })



            //H5调Android
            bridge.callHandler('getToken', { 'key': 'value' }, token => {
                _this.setState({ token })
                Http.setRequestHeader({ token });
            })
        })



        window.getToken = (token) => {
            this.setState({ token });
            Http.setRequestHeader({ token });
            // Http.get('queryDetailNews', { id: Http.getQueryValue('id') }, data => {
            //     if (data) {
            //         this.setState({ data })
            //     }
            // })
        }

    }

    connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(window.WebViewJavascriptBridge)
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady',
                function () {
                    callback(window.WebViewJavascriptBridge)
                }, false);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.style) {
            this.setState({
                style: nextProps.style
            })
        }
    }

    previewImg(e) {
        const images = this.state.data.imgArr;
        if (e && e.localName == 'img') {
            // IOS
            try {
                window.webkit.messageHandlers.browseImage.postMessage({ body: e.currentSrc, images });
            } catch (error) { }

            // Andorid
            this.connectWebViewJavascriptBridge(bridge => {
                //H5调Android
                bridge.callHandler('browseImage', { curImg: e.currentSrc, images }, res => { })
            })
        }
    }


    follw(isFollow) {
        const { data, token } = { ...this.state };
        if (token && token.length) {  // 是否在APP环境内
            Http.setRequestHeader({ token })
            if (isFollow) {
                Http.post('CancelUserWatchInfo', { watchedUid: Number(data.userId) }, res => {
                    if (res && res.resultCode == 200) {
                        this.setState({ isFollow: !isFollow });
                        // IOS
                        try {
                            window.webkit.messageHandlers.attention.postMessage({ body: isFollow ? 10071002 : 10071001 });
                        } catch (error) { }

                        // Andorid
                        try {
                            window.WebViewJavascriptBridge.callHandler(
                                'attention'
                                , { 'Data': isFollow ? 10071002 : 10071001 }  //该类型是任意类型 传给Android
                                , function (responseData) {  //Android callBack

                                }
                            );
                        } catch (err) { }
                    } else {
                        if (res && res.resultCode == "40303") {
                            // IOS
                            try {
                                window.webkit.messageHandlers.attention.postMessage({ body: 40303 });
                            } catch (error) { }

                            // Andorid
                            try {
                                window.WebViewJavascriptBridge.callHandler(
                                    'attention'
                                    , { 'Data': 40303 }  //该类型是任意类型 传给Android
                                    , function (responseData) {  //Android callBack

                                    }
                                );
                            } catch (err) { }
                            Toast.fail('Token失效，请重新登录！');
                        } else {
                            Toast.fail(res ? res.errMsg : '后台接口异常！');
                        }
                    }

                })
            } else {
                Http.post('insertUserWatchInfo', { watchedUid: Number(data.userId) }, res => {
                    if (res && res.resultCode == 200) {
                        this.setState({ isFollow: !isFollow });
                        // IOS
                        try {
                            window.webkit.messageHandlers.attention.postMessage({ body: isFollow ? 10071002 : 10071001 });
                        } catch (error) { }

                        // Andorid
                        try {
                            window.WebViewJavascriptBridge.callHandler(
                                'attention'
                                , { 'Data': isFollow ? 10071002 : 10071001 }  //该类型是任意类型 传给Android
                                , function (responseData) {  //Android callBack

                                }
                            );
                        } catch (err) { }
                    } else {
                        if (res && res.resultCode == "40303") {
                            // IOS
                            try {
                                window.webkit.messageHandlers.attention.postMessage({ body: 40303 });
                            } catch (error) { }

                            // Andorid
                            try {
                                window.WebViewJavascriptBridge.callHandler(
                                    'attention'
                                    , { 'Data': 40303 }  //该类型是任意类型 传给Android
                                    , function (responseData) {  //Android callBack

                                    }
                                );
                            } catch (err) { }
                            Toast.fail('Token失效，请重新登录！');
                        } else {
                            Toast.fail(res ? res.errMsg : '后台接口异常！');
                        }
                    }

                })
            }

        } else {
            // this.setState({ isFollow: !isFollow })

            // IOS
            try {
                window.webkit.messageHandlers.attention.postMessage({ body: 0 });
            } catch (error) { }

            // Andorid
            try {
                window.WebViewJavascriptBridge.callHandler(
                    'attention'
                    , { 'Data': 0 }  //该类型是任意类型 传给Android
                    , function (responseData) {  //Android callBack

                    }
                );
            } catch (err) { }

        }
    }


    goPersonalSpace() {
        const { data } = { ...this.state };
        // IOS
        try {
            window.webkit.messageHandlers.goPersonalSpace.postMessage({ body: data.userId });
        } catch (error) { }

        // Andorid
        try {
            window.WebViewJavascriptBridge.callHandler(
                'goPersonalSpace'
                , { 'Data': "" }  //该类型是任意类型 传给Android
                , (res) => {  //Android callBack
                }
            );
        } catch (err) { }
    }


    render() {
        const { data, style, isFollow, token, upLoading } = { ...this.state };
        const flage = Http.getQueryValue('flage') && Http.getQueryValue('flage') == 1;
        return (
            <div className="dFeto" style={style}>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Helmet>

                {/* Loading…… */}
                <div style={{ display: upLoading ? 'block' : 'none', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.4)", zIndex: 999 }}>
                    <div style={{ textAlign: 'center', position: "absolute", left: 0, right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                        <div className="lds-spinner white"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        <span style={{ color: "white" }}>正在拼命加载……</span>
                    </div>
                </div>


                <div className="tit">
                    {data.titleImage
                        ? <img src={data.titleImage} />
                        : ""}
                </div>
                <ul>
                    <Row style={{padding:'0 12px',marginTop:15}}>
                        <Col>
                           <span className='zixuntitle' > {data.title}</span>
                        </Col>
                    </Row>
                    <Row style={{padding:' 10px 12px 20px 12px'}}>
                        <Col span={3}>
                            <div onClick={this.goPersonalSpace.bind(this)}>
                                <img src={data.photoUrl ? data.photoUrl : require('./api/template/img/user2@3x.png')} style={{width:'1.536rem',borderRadius:'100%'}} />
                            </div>
                        </Col>
                        <Col span={17}>
                            <p style={{fontFamily: 'PingFangSC-Regular',fontSize:13,lineHeight:'1.536rem',color:'#7E7E7E',letterSpacing: '0.3px'}} onClick={this.goPersonalSpace.bind(this)} >{data.name}</p>
                        </Col>
  
                        <Col span={4} style={{textAlign:'right'}}>
                   
                            { Http.getQueryValue('isWatched') != 521
                            ? (isFollow
                                ? <div onClick={this.follw.bind(this, isFollow)} style={{fontFamily: 'PingFangSC-Regular',fontSize:13,lineHeight:'1.536rem',color:'#353535',letterSpacing: '0.3px'}}><span>已关注</span></div>
                                : <div onClick={this.follw.bind(this, isFollow)}>
                                    <img src={require('./images/+@3x.png')} style={{width:8,marginRight:4}} />
                                    <span style={{fontFamily: 'PingFangSC-Regular',fontSize:13,lineHeight:'1.536rem',color:'#353535',letterSpacing: '0.3px'}}>关注</span>
                                </div>)
                            : ''}
                       
                        
                        </Col>

                    </Row>

                    <Row style={{margin:'0 12px',background:'#f1f1f1',padding:'5px 9px 4px 9px',color:'#B5B5B5'}}>
                        <Col span={12} >
                      
                            <span style={{color:'#B5B5B5',lineHeight:'15px'}}>{Utils.dateName(data.releaseDate)}</span>
                        </Col>
                        <Col span={12}  style={{textAlign:'right'}}>
                            <span>
                                <img src={require('./api/template/img/browse@2x.png')} style={{width:16}} />
                            </span>
                            <span > {Utils.browseCunt(data.browseNumber)}</span>   
                        </Col>
                       
                    </Row>
                    <li className="dRcontent">
                        <div onClick={e => { this.previewImg(e.target) }} dangerouslySetInnerHTML={{ __html: data.content ? data.content.replace(/<p><\/p>/g, '<br/>') : '' }}></div>
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