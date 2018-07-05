import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import 'antd-mobile/dist/antd-mobile.min.css';
import browser from './common';
import './common.scss'
import './forumTemp.scss'
import Http from '../../utils/http';
import Utils from '../../utils/DMCUtil';
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../global.config';
import Commit from './commitTemp';
import { Slider, Toast } from 'antd-mobile';

const title = '帖子详情'

// 唤醒评论页码浮层
window.rouse = () => { };
window.getToken = (token) => { };
window.OnlyPostStarter = (Bl) => { }

const apis = [
    { "id": "queryDetailArticle", "url": "community/article/queryDetailArticle" },
    { "id": "insertUserWatchInfo", "url": "community/watch/insertUserWatchInfo", "format": false },
    { "id": "addOrCancel", "url": "community/praise/addOrCancel", "format": false },
    { "id": "CancelUserWatchInfo", "url": "community/watch/CancelUserWatchInfo", "format": false },

];
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data || {},
            style: {
                width: '100%',
                height: 'auto',
                overflowY: 'scroll',
            },
            isFollow: Http.getQueryValue('isWatched') == 10071001 || Http.getQueryValue('isWatched') == 10071003,
            isPraise: false,
            duration: 0,
            disabled: false,
            isShade: false,
            token: null,
            isApp: !(Http.getQueryValue('flage') == 1),
            query: {
                businessType: 1007,
                businessId: Http.getQueryValue('id') || '',
                limit: 20,
                page: 1,
            },
            OnlyStarter: false,
            upLoading: this.props.data ? 0 : 1,

        }
    }

    componentWillMount() {
        this.getQueryDetail()

        // 获取token
        window.getToken = (token) => {
            token = (token + '').replace(/\(|null|\)/ig, '');
            if (token.length) {
                this.setState({ token })
                Http.setRequestHeader({ token });
                this.getQueryDetail(this.getWebviewHeight.bind(this));
            }
        }

        // 是否只看楼主
        window.OnlyPostStarter = (Bl) => {
            const or = Bl == 'true' || Bl == '1' ? true : false;
            let { query, data } = { ...this.state };
            if (or) {
                query['page'] = 1
                query['userId'] = data['userId']
            } else {
                query['page'] = 1
                delete query['userId']
            }
            this.setState({
                OnlyStarter: or,
                query,
            })
        }


        try {
            // 页面埋点
            window.tracker.sendActivityStart({
                activity: '帖子详情',
                user_type: this.setState.toke
            });
            window.onbeforeunload = () => {
                window.tracker.sendActivityEnd({
                    activity: '帖子详情',
                    user_type: this.setState.toke
                });

            }
        } catch (error) {

        }




    }



    getQueryDetail(callback) {
        const id = Http.getQueryValue('id') ? Http.getQueryValue('id') : this.props.id;
        if (id) {
            Http.get('queryDetailArticle', { id }, data => {
                if (data) {
                    this.setState({ data, isPraise: data.isPraised }, () => {
                        if (data) {
                            this.setState({ upLoading: false }, () => {
                                callback && callback()
                            })
                            if (data.publishOrigin == 0) {
                                this.getPage({ page: '1', tools: Math.ceil(data.commentNumber / 20) + '' });
                                this.getDuration();
                            }
                        }
                    });
                } else {
                    Toast.fail('后台接口异常！')
                }

            })
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {
        const _this = this;
        window.rouse = () => {
            _this.setState({ isShade: true })
        }
    }

    getDuration() {
        const audio = document.getElementById('player');
        if (audio) {
            this.setState({
                duration: audio.duration || 0
            })
        }

    }


    audioPlay() {
        const audio = document.getElementById('player');
        audio.play();
    }

    sliderChange(n) {
        document.querySelector('.am-slider-handle').innerHTML = n;
        this.setState({ query: { ...this.state.query, limit: n * 20, page: 1 } });
    }

    hideShade(e) {
        if (e.className == 'shade') {
            this.setState({ isShade: false })
        }
    }

    showPop(type) {   // 唤醒分享朋友圈
        // IOS
        try {
            window.webkit.messageHandlers.showPop.postMessage(type);
        } catch (error) { }

        // Andorid
        try {
            window.NativeJavaScriptInterface.showPop(type);
        } catch (err) { }
    }

    getPage(cur, tools) {   // APP更新评论页数
        // IOS
        try {
            window.webkit.messageHandlers.getpage.postMessage({ cur, tools }); // "{ "cur":"1", "tools":"20" }"
        } catch (error) { }

        // Andorid
        try {
            const string = JSON.stringify({ cur, tools })
            window.NativeJavaScriptInterface.getpage(string);
        } catch (err) { }
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

    getWebviewHeight() {
        setTimeout((_this) => {
            const zxHeight = document.getElementById('app').clientHeight;
            try {
                _this.connectWebViewJavascriptBridge(bridge => {
                    //H5调Android
                    bridge.callHandler('getWebviewHeight', { height: zxHeight }, res => { });
                })
            } catch (error) {

            }

            try {
                window.webkit.messageHandlers.getWebviewHeight.postMessage({ body: zxHeight });
            } catch (error) {

            }

        }, 500, this)
    }

    follw(isFollow) {
        const { data, token } = { ...this.state };
        if (token && token.length) {  // 是否在APP环境内
            if (isFollow) {
                Http.post('CancelUserWatchInfo', { watchedUid: Number(data.userId) }, res => {
                    if (res && res.resultCode == 200) {
                        this.setState({ isFollow: !isFollow });
                    } else {
                        Toast.fail(res ? res.errMsg : '后台接口异常')
                    }

                })
            } else {
                Http.post('insertUserWatchInfo', { watchedUid: Number(data.userId) }, res => {
                    if (res && res.resultCode == 200) {
                        this.setState({ isFollow: !isFollow });
                    } else {
                        Toast.fail(res ? res.errMsg : '后台接口异常')
                    }
                })
            }
        } else {  // 去登录
            this.goLogin('watch');
        }
    }

    goLogin(type) {
        // IOS
        try {
            window.webkit.messageHandlers.goLogin.postMessage({ body: type });
        } catch (error) { }

        // Andorid
        try {
            window.NativeJavaScriptInterface.goLogin(type);
        } catch (err) { }
    }


    praise(isPraise) {
        const { data, token } = { ...this.state };
        if (token && token.length) {  // 是否在APP环境内
            const query = {
                businessId: data['id'],
                businessType: 1007,
            }
            Http.post('addOrCancel', query, res => {
                if (res && res.resultCode == 200) {
                    isPraise
                        ? this.setState({ isPraise: false, data: { ...data, praiseNumber: data.praiseNumber - 1 } })
                        : this.setState({ isPraise: true, data: { ...data, praiseNumber: data.praiseNumber + 1 } })

                } else {
                    Toast.fail(res ? res.errMsg : '后台接口异常')
                }
            });
        } else {
            this.goLogin('praise');
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
            window.NativeJavaScriptInterface.goPersonalSpace(data.userId.toString());
        } catch (err) { }
    }

    previewImg(e) {
        const { data } = { ...this.state };
        if (e && e.localName == 'img') {
            // IOS
            try {
                window.webkit.messageHandlers.browseImage.postMessage({ body: e.currentSrc, images: data.communityContentQueryImagedto[0].content });
            } catch (error) { }

            // Andorid
            try {
                const string = data.communityContentQueryImagedto ? JSON.stringify(data.communityContentQueryImagedto[0].content) : ''
                window.NativeJavaScriptInterface.browseImage(e.currentSrc, string);
            } catch (err) { }

        }
    }


    render() {
        const { data, style, isFollow, isPraise, duration, disabled, query, isShade, token, OnlyStarter, upLoading } = { ...this.state }
        const flage = Http.getQueryValue('flage') && Http.getQueryValue('flage') == 1;
        const fontFamily = 'PingFangSC-Regular';
        return (
            <div className="feto" style={style}>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={title} />
                </Helmet>
                <div style={{ display: upLoading ? 'block' : 'none', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,.4)", zIndex: 999 }}>
                    <div style={{ textAlign: 'center', position: "absolute", left: 0, right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                        <div className="lds-spinner white"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        <span style={{ color: "white" }}>正在拼命加载……</span>
                    </div>
                </div>


                {/* 刷新评论列表滑竿 */}
                <div className='shade' onClick={e => { this.hideShade(e.target) }} style={{ display: isShade ? 'block' : 'none' }}>
                    <div style={{ background: 'white' }}>
                        <div style={{ overflow: 'visible', width: '80%', margin: '0 10%' }}>
                            <Slider
                                style={{ padding: '30px' }}
                                defaultValue={1}
                                min={1}
                                max={Math.ceil(data.commentNumber / 20)}
                                step={1}
                                disabled={disabled}
                                onChange={this.sliderChange.bind(this)}
                                onAfterChange={e => { console.log(e) }}
                            />
                        </div>
                    </div>
                </div>
                <div className="Fcent">
                    {/* 阅读量 */}
                    <div className='ftit'>
                        <h6 style={{ color: '#353535', fontSize: 18, lineHieght: 27, fontFamily: 'PingFangSC-Regular', wordWrap: "break-word" }}>{data.title}</h6>
                    </div>
                    <div className='ftitT'>

                        <span className='mass'>
                            <img src={require('./images/chat.png')} />
                        </span>
                        <span style={{ fontSize: 12 }}>{Utils.browseCunt(data.commentNumber)}</span>
                        <span style={{ float: 'right' }}>
                            {data.updateDate
                                ? Utils.dateName(data.updateDate)
                                : Utils.dateName(data.createDate)}
                        </span>
                    </div>
                    {/* 头像 */}
                    <div className='user'>
                        <div
                            onClick={this.goPersonalSpace.bind(this)}
                            style={{ verticalAlign: 'middle', marginRight: '10px', borderRadius: '1rem', width: '35px', height: '35px', background: 'black' }}>
                            <img
                                src={data.photo ? data.photo : require('./api/template/img/user2@3x.png')} />
                        </div>
                        <span onClick={this.goPersonalSpace.bind(this)} style={{ verticalAlign: 'middle' }} className="mas">{data.name}</span>

                        {Http.getQueryValue('isWatched') != 521
                            ? (isFollow
                                ? <div className='add' onClick={this.follw.bind(this, isFollow)}><span style={{ color: '#353535', fontFamily: fontFamily }}>已关注</span></div>
                                : <div className='add' onClick={this.follw.bind(this, isFollow)}>
                                    <img src={require('./images/+@3x.png')} style={{ width: 8, marginRight: 4 }} />
                                    <span style={{ color: '#353535', fontFamily: fontFamily }}>关注</span>
                                </div>)
                            : ''}
                    </div>
                    {/* 帖子内容 */}
                    {!data.publishOrigin    // 0:App  1:PC
                        ? <div
                            className="fContent"
                            onClick={e => { this.previewImg(e.target) }}>
                            {(data.communityContentQuerydto && data.communityContentQuerydto.map((e, i) => {
                                if (e.type == '1' || e.type == '4') {      // 文字
                                    return (<p key={i} dangerouslySetInnerHTML={{ __html: e.content.replace(/\n/g, '<br/>') }}></p>)
                                } else if (e.type == '2') {    // 图片
                                    return (<img key={i} src={e.content} />)
                                } else if (e.type == '3') {   // 语音
                                    return (<div key={i} style={{ padding: '10px' }}>
                                        <div className='audioBgc'>
                                            <img onClick={this.audioPlay.bind(this)} src={require('./images/listen.png')} />
                                            <span>{duration} s</span>
                                        </div>
                                        <audio id="player">
                                            <source src={e.content} type="audio/mp3" />
                                        </audio>
                                    </div>)
                                }
                            }))}
                        </div>
                        : <div className="fContent" dangerouslySetInnerHTML={{ __html: data.content }}></div>
                    }

                    {data.position && data.position.length
                        ? <div className='address'>
                            <p>
                                <img src={require('./images/location.png')} />
                                <span>{data.position}</span>
                            </p>
                        </div>
                        : ''
                    }
                    <div className='fLine'></div>

                    {/* 点赞分享 */}
                    <div style={{ padding: '0 15px' }}>
                        <div style={{ width: '100%', float: 'left', marginBottom: 30, marginTop: 15 }}>
                            <span onClick={this.praise.bind(this, isPraise)} style={{ marginTop: '10px', float: 'left', padding: '5px 8px', border: '.5px solid #ccc', borderRadius: '100px' }}>
                                <img style={{ width: 14, marginRight: '5px' }} src={require(isPraise ? './images/FabulousSelected.png' : './images/Fabulous.png')} />
                                <span style={{ verticalAlign: 'middle', margin: '0 3px' }}>赞</span>
                                <span style={{ verticalAlign: 'middle' }}>{data.praiseNumber}</span>
                            </span>
                            <img onClick={this.showPop.bind(this, '2')} style={{ display: !Http.getQueryValue('flage') ? 'inline-block' : 'none', float: 'right', width: '40px' }} src={require('./images/pengyouquan.png')} />
                            <img onClick={this.showPop.bind(this, '1')} style={{ display: !Http.getQueryValue('flage') ? 'inline-block' : 'none', float: 'right', width: '40px', marginRight: '16px' }} src={require('./images/weixin.png')} />
                        </div>
                    </div>

                </div>
                {/* 加载评论列表 */}
                {token
                    ? <Commit
                        userId={data.userId}
                        query={query}
                        token={token}
                        data={this.props.data ? this.props.data.commentDto : null}
                        OnlyPostStarter={OnlyStarter}    // 只看楼主
                        commentNumber={data.commentNumber} />
                    : <Commit
                        userId={data.userId}
                        query={query}
                        token={token}
                        data={this.props.data ? this.props.data.commentDto : null}
                        OnlyPostStarter={OnlyStarter}    // 只看楼主
                        commentNumber={data.commentNumber} />}


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