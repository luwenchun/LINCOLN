import React, { Component } from 'react';
// import './newsImgTemp.scss'
import { Modal, Carousel } from 'antd';
import { Toast } from 'antd-mobile';
import { Helmet } from 'react-helmet';
import Http from '../../utils/http';
import { SERVER_BASE_PATH, UPLOAD_IMAGE_PATH } from '../../global.config';
import browser from './common';
import './common.scss'

const title = '资讯详情'

const apis = [
    // { "id": "queryDetailNews", "url": "community/news/queryDetailNews", "format": false },
    { "id": "queryDetailNews", "url": "community/news/queryDetailNews" },
];
Http.setDomainUrl(SERVER_BASE_PATH);
Http.setMutiApi(apis);

window.getToken = () => { };

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            height: document.body.clientHeight,
            style: {
                width: '100%',
                height: '100%'
            },
            isFollow: false,
            isCollection: false,
            token: null,
            isApp: !(Http.getQueryValue('flage') == 1),
            upLoading: this.props.data ? 0 : 1,
            isShow: false,
            bottom: 0,
            top: 0,
            curData: {},
            images: [],
        }


    }
    componentWillMount() {
        const _this = this;
        if (!this.props.data) {
            Http.get('queryDetailNews', { id: Http.getQueryValue('id') }, data => {
                if (data) {
                    data.content = eval(data.content);
                    let images = []
                    data.content.map(e => {
                        images.push(e.url);
                    })
                    this.setState({ upLoading: false, images, data, height: document.body.clientHeight, }, () => {
                        setTimeout((_this) => {
                            _this.imgChange(null, 0)
                        }, 1000, this)
                    });

                }
            })
        } else {
            let { data } = { ...this.props };
            data['content'] = eval(data.content);
            this.setState({
                height: Number(this.props.style.height.replace(/px/, '')),
                data: data
            })
        }

        window.getToken = (token) => {
            _this.setState({ token })
        }

    }

    componentDidMount() {
        if (this.props.data) {
            setTimeout((_this) => {
                _this.imgChange(null, 0)
            }, 1000, this)
        }

    }

    imgChange(f, to) {
        const { data } = { ...this.state };
        const images = [...this.state.images];
        const height = this.props.style && this.props.style.height ? Number(this.props.style.height.replace(/px/, '')) : document.body.clientHeight;
        const pH = document.querySelector('.imgP' + to).clientHeight;
        const iH = document.querySelector('.img' + to).clientHeight;
        const curTit = document.querySelector('.curTit').clientHeight;
        const titleH = document.getElementById('titleH' + to).clientHeight;
        const bottomH = document.getElementById('bottomH' + to).clientHeight;
        const distance = (height - pH) / 2 + iH;
        console.log((height - pH) / 2)
        console.log(distance)
        console.log(distance + bottomH)

        if (pH < height) {
            this.setState({
                top: distance + titleH,
                bottom: distance + bottomH,
                curData: { ...data.content[to], cur: to }
            })
        } else {
            this.setState({
                top: height - bottomH,
                bottom: height - curTit,
                curData: { ...data.content[to], cur: to }
            })
        }

        // IOS
        try {
            window.webkit.messageHandlers.browseImage.postMessage({ body: to + '', images });
        } catch (error) { }

    }

    previewImg(i) {
        const images = [...this.state.images];
        // IOS
        // try {
        //     window.webkit.messageHandlers.browseImage.postMessage({ body: i, images });
        //     // Toast.fail('3')
        // } catch (error) { }

        // Andorid
        this.connectWebViewJavascriptBridge(bridge => {
            //H5调Android
            bridge.callHandler('browseImage', { curImg: i, images }, res => { })
        })
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



    render() {
        const { data, style, isFollow, isCollection, height, isApp, upLoading, top, bottom, curData } = { ...this.state }
        const flage = Http.getQueryValue('flage') && Http.getQueryValue('flage') == 1;
        return (
            <div style={{ background: 'RGBA(32,32,32,1)', height: height + 'px', fontSize: '16px', position: 'relative' }}>
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

                <div style={{ display: 'none', zIndex: 999999, padding: '10px 10px 0 10px', position: 'absolute', top: 0, left: 0, right: 0, height: '50px', color: 'white', background: 'RGBA(23,23,23,1)' }}>
                    <img style={{ opacity: 0, width: '16px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/backWhite.png')} />
                    <span style={{ margin: '0 10px', width: '30px', height: "30px", borderRadius: '15px', display: 'inline-block' }}>
                        <img style={{ width: '100%' }} src={require('./images/user.png')} />
                    </span>
                    <span style={{ verticalAlign: 'middle' }}>{data.name}</span>
                    <span style={{ float: 'right', verticalAlign: 'middle' }}>
                        {isFollow
                            ? <span style={{ marginRight: '20px' }}>已关注</span>
                            : <span>
                                <img style={{ marginRight: '5px', width: '20px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/addWhite.png')} />
                                <span style={{ marginRight: '20px', verticalAlign: 'middle' }}>关注</span>
                            </span>}
                        <img style={{ width: '30px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/shareWhite.png')} />
                    </span>
                </div>
                <div className="view" style={{ height: height + 'px', position: 'relative', overflow: 'hidden' }}>

                    <div style={{ zIndex: 99999, position: 'absolute', left: 0, right: 0, background: 'RGBA(32,32,32,.8)', bottom: bottom + 'px' }}>
                        <h2 className='curTit' style={{ fontFamily: 'PingFangSC-Bold', margin: 0, fontSize: '.85rem', color: 'white', padding: '0 4%', wordWrap: "break-word" }}>{data.title}</h2>
                    </div>

                    {data.content && data.content.length ?
                        <Carousel infinite={false} dots={false} beforeChange={this.imgChange.bind(this)}>
                            {data.content.map((e, i) => {
                                return (
                                    <div key={i}>
                                        <div style={{ height: height + 'px', position: 'relative' }} >
                                            <p className={'imgP' + i} style={{ fontFamily: 'arial', position: 'absolute', top: '50%', left: 0, right: 0, margin: 0, transform: 'translateY(-50%)' }}>
                                                <h2 id={'titleH' + i} style={{ opacity: 0, color: 'white', padding: '.8rm .4rem 0', wordWrap: "break-word", margin: 0, fontSize: '.85rem', fontFamily: 'PingFangSC-Bold' }}>{data.title}</h2>

                                                <img className={'img' + i}
                                                    style={{ width: '100%', display: 'block' }}
                                                    // onTouchStart={(e)=>{e.target;debugger}}
                                                    onClick={this.previewImg.bind(this, i + '')}
                                                    src={e.url} />

                                                <p id={'bottomH' + i} style={{ opacity: 0, fontWeight: 100, fontFamily: 'arial', fontSize: '16px', padding: '10px', margin: 0, wordWrap: "break-word", background: 'RGBA(32,32,32,.8)', color: 'white' }}>
                                                    <p style={{ marginBottom: '5px' }}>
                                                        <img style={{ width: '25px', display: 'inline-block' }} src={require('./images/picWhite.png')} />
                                                        <span style={{ marginLeft: '10px', fontFamily: 'arial', color: 'blue', fontWeight: '800' }}>{i + 1}</span>
                                                        <span style={{ fontFamily: 'arial' }}>/{data.content.length}</span>
                                                    </p>
                                                    {e.summary}
                                                </p>
                                            </p>


                                        </div>
                                    </div>
                                )
                            })}
                        </Carousel>
                        : ''}


                    <p style={{ zIndex: 99999, fontWeight: 100, fontFamily: 'PingFangSC-Bold', fontSize: '.7rem', lineHeight: '1rem', color: 'white', padding: '10px 4%', wordWrap: "break-word", background: 'RGBA(32,32,32,.8)', color: 'white', position: 'absolute', left: 0, right: 0, bottom: 0, top: top + 'px', margin: 0 }}>
                        <p style={{ marginBottom: '5px' }}>
                            <img style={{ width: '25px', display: 'inline-block' }} src={require('./images/picWhite.png')} />
                            <span style={{ marginLeft: '10px', fontFamily: 'arial', color: 'blue', fontWeight: '800' }}>{curData.cur ? curData.cur + 1 : 1}</span>
                            <span style={{ fontFamily: 'arial' }}>/{data.content ? data.content.length : 1}</span>
                        </p>
                        {curData.summary}
                    </p>


                </div>
                <div style={{ display: 'none', zIndex: 999999, padding: '10px 10px 0 10px', position: 'absolute', bottom: 0, left: 0, right: 0, height: '50px', color: 'white', background: 'RGBA(23,23,23,1)' }}>
                    <img style={{ width: '20px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/editWhite.png')} />
                    <input style={{ fontSize: '16px', outline: 'none', width: '50%', padding: '0 0 4px 22px', marginLeft: '-20px', color: 'white', borderBottom: '.5px solid gray' }} placeholder='写评论' />
                    <img style={{ marginRight: '16px', float: 'right', width: '26px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/forwardWhite.png')} />
                    {data.shareNumber
                        ? <span style={{ fontSize: '14px', position: 'absolute', top: 0, right: '120px', height: '20px', background: 'red', padding: '0 5px', borderRadius: '10px' }}>{data.shareNumber}</span>
                        : ''}

                    {isCollection
                        ? <img onClick={() => { this.setState({ isCollection: !isCollection }) }} style={{ marginRight: '26px', float: 'right', width: '26px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/collectionSelected.png')} />
                        : <img onClick={() => { this.setState({ isCollection: !isCollection }) }} style={{ marginRight: '26px', float: 'right', width: '26px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/collectionWhite.png')} />}
                    {data.praiseNumber
                        ? <span style={{ fontSize: '14px', position: 'absolute', top: 0, right: '70px', height: '20px', background: 'red', padding: '0 5px', borderRadius: '10px' }}>{data.praiseNumber}</span>
                        : ''}
                    <img style={{ marginRight: '26px', float: 'right', width: '26px', verticalAlign: 'middle', display: 'inline-block' }} src={require('./images/commentWhite.png')} />
                    {data.commentNumber
                        ? <span style={{ fontSize: '14px', position: 'absolute', top: 0, right: '10px', height: '20px', background: 'red', padding: '0 5px', borderRadius: '10px' }}>{data.commentNumber}</span>
                        : ''}
                </div>

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