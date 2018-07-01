import React from 'react';
import Http from './../../../utils/http';
import '../style/messages.scss';
import { Spin } from 'antd';
import Often from './oftenText';
import Emoji from './Emoji';
import { expression, Toast } from '../../../components/common/comn';
import { SERVER_BASE_PATH } from '../../../global.config';
import $ from 'jquery';

const apis = [
    { "id": "wx_chat_talk", "url": "chat/wx/wx_chat_talk", "format": false },
    { "id": "wx_getChatInfo", "url": "chat/wx/wx_getChatInfo", "format": false },
    { "id": "wx_sendimage", "url": "chat/wx/wx_sendimage", "format": false },
    { "id": "wx_sendMessage", "url": "chat/wx/wx_sendMessage", "format": false },
    { "id": "wx_im_sdk", "url": "chat/wx/wx_im_sdk", "format": false },
    { "id": "wx_sendMediaMessage", "url": "chat/wx/wx_sendMediaMessage", "format": false },
    { "id": "wx_getAllInlineChats", "url": "chat/wx/wx_getAllInlineChats", "format": false },
    { "id": "wx_chatLogin", "url": "chat/wx/wx_chatLogin", "format": false },
    { "id": "wx_changeChatForUser", "url": "chat/wx/wx_changeChatForUser", "format": false },

];

let curentText = {
    type: 'text',
    content: '',
    title: '',
    url: ''
}, formData, lastTime, isSend = false;

var CountdownTimeout = null, Control = false;

Http.setDomainUrl(SERVER_BASE_PATH);
// Http.setDomainUrl("http://lincoln-mp.yonyouauto.com/qy/chat/wx/");
// Http.setDomainUrl("/wx/pc/api/");

// Http.setDebugger(true);
Http.setMutiApi(apis);

export default class messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                img: require("../images/Bin.jpg"),
            },
            list: [],
            content: '',
            params: [{
                pageCurrent: 1,
                pageSize: 20,
                ownerCode: this.props.target.userId,
                userId: this.props.user.userId,
            }],
            showEmoji: false,
            textarea: '',
            ownerCode: this.props.user.userId,
            currentCode: '',
            textareaCursor: 0,
            showOften: false,
            showMany: false,
            infoCode: "",
            spin: false,
            lastTime: 0,
            comText: {
                many: Object.assign([], this.props.user.getWxChatContent),
                often: Object.assign([], this.props.user.getWxChatDialogue)
            },
            ofentObj: {},
            getAllInlineChats: [],
            isCLine: false,
            transferRemarkShow: false,
            transferRemark: '',
            tarChatId: '',
            tarName: '',
            imgPath: '',
            confirmImgShow: false,
            name: '',
            onHistory: false,
            Countdown: 10800000,
            // autoplay: 'autoplay',
            autoplay: '',
            // Countdown: 10000,
        }
    }

    async componentDidMount() {
        const _this = this;
        window.obj = {};
        await Http.get('wx_im_sdk', (result) => {
            obj = result.data;
        })
        var time = setInterval(() => {
            // console.log(window.JMessage);
            window.JIM = new JMessage({ debug: true });
            window.JIM.init(obj).onSuccess(function (data) {
                console.log(data, 'wx_im_sdk成功')
                window.JIM.login({
                    'username': _this.props.user.Info.jmessageCode,
                    'password': '123456',
                }).onSuccess(function (data) {
                    window.clearInterval(time);
                    console.log(data, '登录成功');
                    _this.props.login(false);
                    Http.get('wx_chatLogin', { chatId: _this.props.user.Info.userId }, res => { })
                    JIM.onMsgReceive((data) => {
                        let list = Object.assign([], _this.state.list);
                        const obj = JSON.parse(data.messages[0].content.msg_body.text);
                        obj.content = expression(obj.content);
                        if (data) {
                            let item = {
                                contentType: obj['type'],
                                content: {
                                    content: obj['type'] === 'text' ? obj.content : '',
                                    title: obj['title'] ? obj['title'] : '',
                                    url: obj['type'] != 'text' ? obj.url : obj.content,
                                },
                                ownerCode: obj.fromUser.potentialUserId,
                                dateShow: "",
                                lastTime: (new Date()).getTime(),
                                direction: obj.messageSource === 'h5' ? 0 : 1,  // 客户
                            }
                            list.push(item);
                            if (obj.fromUser.potentialUserId == _this.props.target.userId) {
                                _this.setState({ list }, () => {
                                    setTimeout(() => {
                                        var nodeMsg = document.getElementById('message');
                                        nodeMsg.scrollTop = 9999999999;
                                    }, 500);
                                });

                            }
                            _this.props.newMsg(obj);
                            let myVideo = document.getElementById('video');
                            myVideo.play();
                        }
                    });

                    JIM.onDisconnect(() => { 
                        alert('异常断线，请重新登录！');
                        history.go(0);
                    });


                }).onFail(function (data) {
                    console.log(data, '登录失败')
                });
            }).onFail(function (data) {
                console.log(data, 'wx_im_sdk失败')
            });

        }, 1000, obj);
        this.timing();
    }

    timing() {
        clearTimeout(CountdownTimeout);
        CountdownTimeout = setTimeout(() => {
            alert('请重新接入在线客服！');
            history.go(0);
        }, this.state.Countdown)
    }

    componentWillReceiveProps(nextProps) {
        this.state.currentCode != nextProps.target.userId
            ? this.setState({ textarea: '' })
            : "";
        if (!nextProps.target.userId) {
            this.setState({
                list: [],
                name: nextProps.target.name,
                comText: {
                    many: Object.assign([], nextProps.user.getWxChatContent),
                    often: Object.assign([], nextProps.user.getWxChatDialogue)
                },
            });
            return
        } else {
            this.setState({ currentCode: nextProps.target.userId })
        }


        this.chatTalk('listTarget');
    }
    transfer() {
        const _this = this;
        try {
            Http.get('wx_getAllInlineChats', { dealerCode: this.props.user.Info.dealerCode }, (result) => {
                if (result && result.returnFlag) {
                    const getAllInlineChats = Object.assign([], result.data);
                    getAllInlineChats.find((item) => { item['isShow'] = false });
                    _this.setState({
                        getAllInlineChats,
                        isCLine: !_this.state.isCLine
                    });
                }

            })
        } catch (error) {
            Toast('获取在线客服列表失败！');
        }

    }
    chatTalk(type) { // 获取聊天记录列表
        let params = Object.assign([], this.state.params);      // 历史请求 params
        let currentParams = {};     // 当前请求 params

        this.setState({
            ownerCode: this.props.target.userId,  // 更新当前聊天对象
        }, () => {
            if (params.length > 1) {
                params.forEach((item, index) => {
                    if (item.ownerCode === this.props.target.userId) {
                        ++item.pageCurrent;
                        currentparams = Object.assign({}, item);
                    }
                })
            } else {
                if (params[0] && (params[0]['ownerCode'] == this.props.target.userId)) {
                    ++params[0]['pageCurrent'];
                } else {
                    params = [];
                    params.push({
                        ownerCode: this.props.target.userId + '',
                        pageCurrent: 1,
                        pageSize: 20,
                        userId: this.props.user.userId,
                    })
                }
                currentParams = Object.assign({}, params[0]);
            }
            if (type === 'listTarget' && (currentParams.pageCurrent > 1 && this.state.list.length)) {    // 列表点击不用请求记录
                return !1;
            }
            params = Object.assign([], params);
            this.setState({ params });
            Http.post('wx_chat_talk', currentParams, (result) => {
                if (result && result.data.length) {
                    const lastTime = result.data[result.data.length - 1]['lastTime'];
                    let list = result.data;
                    if (currentParams.pageCurrent > 1) {
                        const currentList = this.state.list;
                        currentList.map((item, index) => {
                            list.push(item);
                        })
                    }
                    list.forEach((item, i) => {
                        if (item.contentType === 'text') {
                            item.content.content = expression(item.content.content);
                        }
                    })

                    this.setState({ list, lastTime, onHistory: false }, () => {
                        setTimeout(() => {
                            var nodeMsg = document.getElementById('message');
                            nodeMsg.scrollTop = 9999999999;
                        }, 500);
                    });
                } else {
                    this.setState({ onHistory: true });
                }
            })

        })
    }
    oneDepartment(i) {
        const getAllInlineChats = Object.assign([], this.state.getAllInlineChats);
        const cur = !getAllInlineChats[i]['isShow'];
        getAllInlineChats.find(item => item['isShow'] = false);
        getAllInlineChats[i]['isShow'] = cur;
        this.setState({ getAllInlineChats });
    }
    render() {
        console.log(this.state, 'rereskf===========')
        const name = this.props.target.name;
        const checkLine = <ul>{this.state.getAllInlineChats.map((item, index) => {
            return (
                <li key={index}>
                    {item.isShow
                        ? <i onClick={this.oneDepartment.bind(this, index)} className={'iconfont'} alt='左箭头打开'>&#xe605;</i>
                        : <i onClick={this.oneDepartment.bind(this, index)} className={'iconfont'} alt='右箭头收起'>&#xe606;</i>}
                    <span onClick={this.oneDepartment.bind(this, index)}>{item.department}</span>
                    <ul className={item.isShow ? 'show' : 'hide'}>
                        {item.list.map((v, i) => {
                            return (
                                <li key={i}>
                                    <span onClick={() => { this.setState({ transferRemarkShow: true, tarChatId: v.userId, tarName: v.weixinName }) }}>{v.weixinName}</span>
                                </li>
                            )
                        })}
                    </ul>
                </li>
            )
        })}</ul>;
        return (
            <div className={'chatMain'}>
                {/* 消息列表 */}
                <section className={'messageW'}>
                    <header className={'groupName'}>
                        <h3>{name ? name : ''}
                            {name ? <span className={'iconfont'} onClick={this.transfer.bind(this)}>&#xe673; <span>转接</span></span> : ''}
                        </h3>
                    </header>
                    {/* 客服转接 */}
                    <div className={`${'transfer'} ${this.state.isCLine ? 'show' : 'hide'}`}>
                        <i className={'iconfont'} alt='关闭窗口' onClick={() => { this.setState({ isCLine: !this.state.isCLine }) }}>&#xe633;</i>
                        {checkLine}
                    </div>
                    {/* 聊天记录 */}
                    <div className={'message'} id='message'>
                        <ul id='messageU'>
                            <li className={'first'} >
                                <span className={`${'history'} ${!this.state.onHistory && this.props.target.userId && this.state.list.length ? 'lShow' : 'hide'}`} onClick={this.history.bind(this)}>查看更多历史消息</span>
                            </li>
                            {this.state.list.map((item, i) => {
                                return (
                                    <li key={i}>
                                        <p className='time' style={{ fontFamily: 'Helvetica Neue' }}><span>{item['crtTime']}</span></p>
                                        <div className={item.direction === 1 ? "" : 'main'}>
                                            {item.direction === 1
                                                ? <img className={'avatar'} src={this.props.target.picUrl ? this.props.target.picUrl : this.state.user.img} />
                                                : <img className={'avatar'} src={this.props.user.Info.iconsPhoto ? this.props.user.Info.iconsPhoto : this.state.user.img} />}
                                            {/* <div className={'text'} dangerouslySetInnerHTML={{ __html: this.link(item.content) }}></div> */}

                                            {item.contentType === 'text' && item.content.content.length
                                                ? <div className={'text'} dangerouslySetInnerHTML={{ __html: item['content']['content'] }}></div>
                                                : ""}

                                            {item.contentType === 'image'
                                                ? <div><img src={item['content']['url']} /><div>{item['content']['title']}</div></div>
                                                : ""}

                                            {item.contentType === 'video'
                                                ? <div><video src={item['content']['url']} controls width="300px" height="220px"></video><p>{item['content']['title']}</p></div>
                                                : ""}

                                            {item.contentType === 'mpnews'
                                                ? (item.description
                                                    ? <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
                                                    : <div className={'text'}><a href={item['content']['url']} target="_blank">{item['content']['title']}</a></div>)
                                                : ""}

                                            {item.contentType === 'news'
                                                ? (item.localUrl
                                                    ? <div className={'text'}><a href={item['content']['url']} target="_blank">{item['content']['title']}</a></div>
                                                    : <div dangerouslySetInnerHTML={{ __html: item.description }}></div>)
                                                : ""}

                                            {item.contentType === 'voice'
                                                ? <div style={{ overflow: 'hidden' }}>
                                                    <audio controls width="200px" height="50px" >
                                                        <source src={item['content']['url']} type="audio/mp3" />
                                                    </audio>
                                                    <p>{item['content']['title']}</p>
                                                </div>
                                                : ""}

                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={'dialog'}>
                        <p className={'mask'}></p>
                        <div className={'diaCont'}>
                            <div className={'clearfix'}>
                                <p className={'avatar'}><img src="https://ps.ssl.qhimg.com/t01531c2d8bd3dbe644.jpg" alt="" /></p>
                                <p className={'nickname'}>测试的</p>
                            </div>
                            <p className={'remark'}>
                                <label htmlFor=""> 备注  </label>
                                <input className={'input'} maxLength="10" placeholder="点击添加备注" type="text" />
                            </p>
                        </div>
                    </div>
                </section>
                {/* 聊天框 */}
                <Spin tip="正在发送..." spinning={this.state.spin}>
                    <div className={'send'}>
                        <div className={'sendTit'}>
                            {/* <span onClick={this.oftenClick.bind(this)}>常见对白</span>
                        <span onClick={this.manyClick.bind(this)}>常见内容</span> */}
                            <span className={'iconfont'} alt='表情包' onClick={this.openEmoji.bind(this)}>&#xe6a1;</span>
                            <span className={'iconfont'} alt='图片上传'>&#xe610;</span>
                            <span alt='常见对白/内容' onClick={this.oftenClick.bind(this, 'often')}>常用话术</span>
                            <span alt='常见对白/内容' onClick={this.oftenClick.bind(this, 'many')}>常用内容</span>
                            {!this.state.confirmImgShow
                                ? <input id='media' type="file" accept="image/jpeg, image/png" onChange={this.fileChange.bind(this)} />
                                : ''}

                            {this.state.showOften || this.state.showMany
                                ? <Often
                                    oftenShow={this.state.showOften}
                                    manyShow={this.state.showMany}
                                    dealerCode={this.props.user.Info.dealerCode}
                                    data={this.state.comText}
                                    check={this.checkOften.bind(this)}
                                    cancel={this.oftenCancel.bind(this)} />
                                : ''}

                            <Emoji show={this.state.showEmoji} check={this.checkEmoji.bind(this)} />
                        </div>
                        <textarea placeholder="按 【Enter】键 —>发送" name="content"
                            // onKeyUp={(e) => this.enter(e)}
                            onKeyDown={(e) => this.enter(e)}
                            onChange={this.textareaChange.bind(this)}
                            onClick={this.textareaClick.bind(this)}
                            value={this.state.textarea}></textarea>
                        <p className={`${'hadler'} ${'clearfix'}`}>
                            <button className={'fr'} onClick={(e) => this.sends(e, "enter")}>发送</button>
                        </p>
                    </div>
                </Spin>
                {/* 输入弹窗 */}
                <div className={`${'alertInput'} ${this.state.transferRemarkShow ? 'show' : 'hide'}`}>
                    <div>
                        <p style={{ fontWeight: 800 }}>提示</p>
                        <p style={{ margin: '10px 10px 20px 10px' }}>是否确定将 {name}(客户) 转接到 {this.state.tarName}(客服)？</p>
                        {/* <p>转接备注</p>
                        <textarea type="text" value={this.state.transferRemark} onChange={(e) => { this.setState({ transferRemark: e.target.value, }) }}>
                        </textarea> */}
                        <p>
                            <span onClick={() => { this.setState({ transferRemarkShow: false }) }}>取消</span>
                            <span onClick={this.throwOver.bind(this)}>转接</span>
                        </p>
                    </div>
                </div>
                {/* 选取图片发送确认 */}
                <div className={`${'confirmSend'} ${this.state.confirmImgShow ? 'show' : 'hide'}`}>
                    <div>
                        <p>确认发送当前图片？</p>
                        <img src={this.state.imgPath} />
                        <p>
                            <span onClick={() => { this.setState({ confirmImgShow: false }) }}>取消</span>
                            <span onClick={() => { this.setState({ confirmImgShow: false }); this.sendImg() }}>确定</span>
                        </p>
                    </div>
                </div>

                <div>{/*声音提示*/}
                    <video id='video' style={{ width: 0, height: 0 }}>
                        <source src={'http://lincoln-mp.yonyouauto.com/pc/assets/didi.mp3'} type="video/ogg" />
                    </video>
                </div>
            </div >
        );
    }
    search(e) { }
    // componentWillReceiveProps() { }
    link(str) {
        var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/ig
        return str = str.replace(reg, '<a className="link" target="_bank" href="$1$2">$1$2</a>')
    }
    time(date, prevDate) {
        // console.log(date,prevDate)
        let Interval = 2 * 60 * 1000;//区间
        let _date = new Date(date);
        let _prevDate = new Date(prevDate);
        let ret = _date.getTime() - _prevDate.getTime();
        if (ret >= Interval) {
            return _date.getFullYear() + "-" + (_date.getMonth() + 1) + "-" + _date.getDate();
        };
        return "";
    }
    validate() {
        const str = this.state.textarea;
        if (str.trim().length <= 0) {
            return false;
        } else {
            return true;
        }
    }
    throwOver() {    // 客服转接
        const _this = this;
        const params = {
            srcChatId: this.props.user.userId,
            tarChatId: this.state.tarChatId,
            ownerCode: this.props.target.userId,
            message: this.state.transferRemark,
            messageType: 'text',
        }
        const userId = String(_this.props.target.userId);
        Http.post('wx_changeChatForUser', params, (res) => {
            if (res && res.returnFlag == 200) {
                _this.props.over(userId);
                _this.timing();
                _this.setState({ transferRemarkShow: false, isCLine: false, transferRemark: '', list: [], name: "" }, () => {
                    Toast('转接成功！');
                    // window.location.reload();
                });

            } else {
                _this.setState({ transferRemarkShow: false, isCLine: false }, () => {
                    Toast(res.errorMsg);
                }); F

            }
        })


    }
    save() {
        if (isSend) {
            return Toast('正在发送中……');
        }
        isSend = true;
        if (!this.props.target.userId) {
            return Toast('请选择聊天对象！');
        } else if (!this.state.textarea.length) {
            return Toast('请选输入聊天内容！');
        }
        const _this = this;
        const query = {
            jmessageCode: this.props.user.Info.jmessageCode,
            toUserName: this.props.target.userId,
            fromUserName: String(this.props.user.userId),
            dateShow: "0",
            content: this.state.textarea,
        }
        const appMsg = Object.assign({}, {
            contentType: curentText['type'],
            content: {
                content: this.state.textarea,
                title: this.state.ofentObj.content || '',
                mediaId: this.state.ofentObj.media_id || '',
                url: this.state.ofentObj.url || '',
            },
            lastTime: Date.now(),
            crtTime: "",
            dateShow: "",
            direction: 0,  // 自己
        })
        let list = Object.assign([], this.state.list) || [];
        lastTime = (new Date()).getTime();
        if ((lastTime - this.state.lastTime) > 300000) {
            const time = this.getNowFormatDate();
            // list.push({ lastTime: time })
        }
        console.log(query)

        const parmas = {
            jmessageCode: this.props.user.Info.jmessageCode,
            title: this.state.ofentObj.title,
            mediaId: this.state.ofentObj.mediaId,
            fromUserName: Number(this.props.user.userId),
            toUserName: this.props.target.userId,
            msgType: this.state.ofentObj.contentType,
            url: this.state.ofentObj.url,
        }
        this.state.ofentObj.contentType === 'text' ? parmas['content'] = this.state.textarea : !1;
        const obj = {
            content: this.state.textarea,
            type: curentText['type'],
            fromUser: {
                potentialUserId: this.props.target.userId,
            },
            messageSource: 'h5',
        }

        try {
            Http.post('wx_sendMessage', _this.state.ofentObj.media ? parmas : query, (result) => {
                console.log(result);
                if (result.returnFlag === 200) {
                    // 消息添加到聊天记录列表
                    appMsg['crtTime'] = result.data;
                    list.push(appMsg);
                    _this.timing();
                    _this.setState({ list, lastTime, showOften: false, showMany: false, showEmoji: false, textarea: "", ofentObj: { media: false } }, () => {
                        setTimeout(() => {
                            var nodeMsg = document.getElementById('message');
                            nodeMsg.scrollTop = 9999999999;
                        }, 500)
                    });
                    // 消息推到聊天客户列表
                    appMsg['fromUser'] = {
                        potentialUserId: _this.props.target.userId,
                    }
                    _this.props.newMsg(obj);

                } else if (result.returnFlag === 0) {
                    Toast(result.errorMsg);
                    _this.props.over(_this.props.target.userId);
                } else if (result.returnFlag === 302) {
                    Toast(result.errorMsg);
                }
                isSend = false;
            })
        } catch (error) {
            Toast('网络异常！');
            isSend = false;
        }
        // Http.post('wx_sendMessage', this.state.ofentObj.media ? parmas : query, (result) => {
        //     console.log(result);
        //     if (result.returnFlag === 200) {
        //         // 消息添加到聊天记录列表
        //         list.push(appMsg);
        //         this.timing();
        //         this.setState({ list, lastTime, showOften: false, showMany: false, showEmoji: false, textarea: "", ofentObj: { media: false } }, () => {
        //             setTimeout(() => {
        //                 var nodeMsg = document.getElementById('message');
        //                 nodeMsg.scrollTop = 9999999999;
        //             }, 500)
        //         });
        //         // 消息推到聊天客户列表
        //         appMsg['fromUser'] = {
        //             potentialUserId: this.props.target.userId,
        //         }
        //         this.props.newMsg(obj);

        //     } else if (result.returnFlag === 0) {
        //         Toast(result.errorMsg);
        //         _this.props.over(_this.props.target.userId);
        //     } else if (result.returnFlag === 302) {
        //         Toast(result.errorMsg);
        //     }
        //     isSend = false;
        // })

    }

    getNowFormatDate() {
        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();
        let time = hours + ':' + (minutes >= 9 ? minutes : '0' + minutes)
        return time;
    }
    enter(e) {
        let { name, value } = e.target;
        let content = this.state.textarea;
        // return !1;
        if (e.keyCode === 17) {
            Control = true;
            return !1;
        } else {
            e.target.value = value;
            const isEnter = e.keyCode === 13;
            // value = value + "\n";
            let target = e.target;
            this.setState({
                [`${name}`]: value
            }, () => {
                if (isEnter) {
                    if (Control) {
                        Control = false;
                        target.value = value;
                        // this.setState({
                        //     [`${name}`]: target.value
                        // });
                        // debugger;
                        return false;
                    } else if (!!this.validate()) {
                        // value = value.replace(/[\r\n]/g, "");
                        // value = value.trim();
                        target.value = value;
                        this.setState({
                            [`${name}`]: value
                        });
                        // isSend = false;
                        this.save();
                        return false;
                    }

                }
            });
        }


    }
    sends(e) {
        this.save();
    }
    // 打开表情包 组件触发
    openEmoji() {
        this.setState({ showOften: false, showEmoji: !this.state.showEmoji, showMany: false })
        // this.state.showEmoji = !this.state.showEmoji;
    }
    // 选中表情 组件cllabakc
    checkEmoji(v) {
        let currentTextarea = this.state.textarea;
        let len = currentTextarea.length;
        currentTextarea = currentTextarea.slice(0, this.state.textareaCursor) + v + currentTextarea.slice(this.state.textareaCursor, len);
        this.setState({ showEmoji: false });
        this.setState({ textarea: currentTextarea })
    }
    // 选中常见对白/内容 组件cllabakc
    checkOften(val) {
        curentText['content'] = val['content'] || '';
        curentText['type'] = val['contentType'];
        this.setState({ textarea: val.content || '', ofentObj: val });
        console.log(val)
    }
    // 输入框值发生变化
    textareaChange(event) {

        // console.log(event.target.value);
        this.setState({ textarea: event.target.value })
        this.getPosition(event);
        curentText['type'] = 'text';
        this.timing();
    }
    // 输入框 click
    textareaClick(event) {
        this.setState({ showOften: false, showMany: false, showEmoji: false });
        this.getPosition(event);
    }
    // 获取光标位置
    getPosition(e) {
        this.state.textareaCursor = e.target.selectionStart;
        console.log(this.state.textareaCursor)
    }
    oftenClick(type) {
        type === 'often'
            ? this.setState({ showEmoji: false, showOften: !this.state.showOften, showMany: false })
            : this.setState({ showEmoji: false, showMany: !this.state.showMany, showOften: false })
    }
    oftenCancel() {
        this.setState({ showMany: false, showOften: false })
    }
    manyClick() { }
    destroy() {

    }
    // 选择图片上传
    fileChange(e) {
        if (!this.props.target.userId) {
            return Toast('请选择聊天对象！');
        } else if (!e.target.files[0]) {
            return !1;
        }
        const imgPath = this.getObjectURL(e.target.files[0]);
        formData = new FormData();
        this.setState({ showOften: false, showEmoji: false, showMany: false, confirmImgShow: true, imgPath });
        formData.append('jmessageCode', this.props.user.Info.jmessageCode, );
        formData.append('ownerCode', this.props.target.userId);
        formData.append('userId', this.props.user.userId);
        formData.append('file', e.target.files[0]);

    }
    // 图片发送
    sendImg() {
        if (isSend) {
            return Toast('图片发送中……');
        }
        isSend = true;
        const _this = this;
        const senImgUrl = Http.getApi('wx_sendimage');
        const appMsg = Object.assign({}, {
            contentType: 'image',
            content: {
                content: '',
                title: '',
                url: this.state.imgPath,
            },
            crtTime: "",
            dateShow: "",
            lastTime: (new Date()).getTime(),
            direction: 0,  // 自己
        })
        let list = Object.assign([], this.state.list) || [];
        try {
            $.ajax({
                url: senImgUrl,
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.returnFlag == 200) {
                        // 消息添加到聊天记录列表
                        appMsg['crtTime'] = res.data;
                        list.push(appMsg);
                        _this.setState({ list, lastTime: (new Date()).getTime() });
                        _this.timing();
                        // 消息推到聊天客户列表
                        appMsg['fromUser'] = {
                            potentialUserId: _this.props.target.userId,
                        }

                        setTimeout(() => {
                            var nodeMsg = document.getElementById('message');
                            nodeMsg.scrollTop = 9999999999;
                        }, 500);
                        const obj = {
                            content: "",
                            type: 'image',
                            fromUser: {
                                potentialUserId: _this.props.target.userId,
                            },
                            messageSource: 'h5',
                        }
                        _this.props.newMsg(obj);

                    } else if (res.returnFlag == 302) {
                        Toast(result.errorMsg);
                    } else {
                        Toast(result.errorMsg);
                        return _this.props.over(_this.props.target.userId);
                    }
                    isSend = false;
                },
                error: function () {
                    isSend = false;
                }

            })
        } catch (e) {
            Toast('网络异常！')
            isSend = false;
        }


    }
    getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    history() {
        this.chatTalk()
    }
}

