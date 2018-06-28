import React from 'react';
import Http from './../../../utils/http';
import '../style/sidebar.scss';
import { Spin } from 'antd';
import {expression,Toast} from '../../../components/common/comn';
import { SERVER_BASE_PATH } from '../../../global.config';


const apis = [
    // 查询聊天记录列表
    { "id": "wx_chat_talk", "url": "chat/wx/wx_chat_talk", "format": false },
    { "id": "wx_deleteChatOwner", "url": "chat/wx/wx_deleteChatOwner", "format": false },
];


// Http.setDomainUrl("http://lincoln-mp.yonyouauto.com/qy/chat/wx/");
Http.setDomainUrl(SERVER_BASE_PATH);
// Http.setDomainUrl("/wx/pc/api/");

// Http.setDebugger(true);
Http.setMutiApi(apis);

var uList, ownerCode = 0;

export default class sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            spin: true,
            ownerCode: 0,   // 当前聊天对象
            params: [],
            list: this.props.user['getChatUserList'],

        }
    }
    componentWillMount() {
        // this.setState({ spin: false });
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        // debugger;
        let arr = [];
        let isNewsUser = true;
        const _this = this;
        const reg = nextProps.filter;
        const newMsg = nextProps.information;
        const list = Object.assign([], uList || this.props.user['getChatUserList']);

        if (reg && reg.length) {    // 拿聊天列表
            list.map((item, index) => {
                if (item.name.toLowerCase().indexOf(reg.toLowerCase()) != -1) {
                    arr.push(item);
                }
            })
        } else if (newMsg && newMsg.fromUser && newMsg.fromUser.potentialUserId) {   // 新消息提醒
            const newsUser = {
                name: newMsg.fromUser.nickname,
                picUrl: newMsg.fromUser.headImgurl,
                phone: newMsg.fromUser.registerPhone,
                userId: newMsg.fromUser.potentialUserId,
                wxCode: newMsg.fromUser.headImgurl, 
                lastContent: {
                    content: newMsg.content,
                },
                lastContentType: newMsg.type,
                news: newMsg.messageSource != 'h5' ? true : false,
                lastTime: (new Date()).getTime(),

            }
            list.forEach((item, index) => {
                if (item.userId == newsUser['userId']) {
                    item.news = newMsg.messageSource != 'h5' ? true : false;
                    item.lastContent = newsUser['lastContent'];
                    item.lastContentType = newsUser['lastContentType'];
                    item.lastTime = (new Date()).getTime();
                    arr.unshift(Object.assign({}, item));
                    isNewsUser = false;
                } else {
                    arr.push(Object.assign({}, item));
                }
            })
            if (isNewsUser) {
                arr.unshift(newsUser);
                this.props.confirmMsg();
            }
            uList = Object.assign([], arr);
            this.props.OkMsg({});
        } else if (nextProps.over && nextProps.over.length) {
            let index;
            list.forEach((item, i) => {
                if (item.userId == nextProps.over) {
                    index = i;
                }
            })
            index != undefined ? list.splice(index, 1) : !1;
            arr = list;
            uList = Object.assign([], arr);
            setTimeout(()=>{
                _this.props.backOver('');
            }, 500);
            
        } else {
            arr = list;
            uList = Object.assign([], arr);
        }
        this.setState({ list: arr });
    }
    render() {
        const UserList = this.state.list.map((item, index) => {
            return (
                <li key={index} onClick={this.chatObj.bind(this, item, index)}>
                    <i className={'iconfont'} onClick={this.endChat.bind(this, item, index)} alt='叉叉'>&#xe633;</i>
                    <p className={'avatar'}>
                        <img src={item.picUrl ? item.picUrl : "https://ps.ssl.qhimg.com/t01531c2d8bd3dbe644.jpg"} />
                    </p>
                    <div className={'name'}>
                        <p>
                            <span>{item.name ? item.name : '小丑'}</span>
                            {/* <span>{`${item.phone && item.phone != 'null' ? ' - ' + item.phone : ''}`}</span> */}
                        </p>
                        <p>
                            <span>{item.lastContentType === 'text'
                                ? <span style={{ display: 'inline-block' }} dangerouslySetInnerHTML={{ __html: expression(item['lastContent']['content']) }}></span>
                                : (item.lastContentType === 'image'
                                    ? '[图片]'
                                    : (item.lastContentType === 'news' || item.lastContentType === 'mpnews'
                                        ? '[图文]'
                                        : (item.lastContentType === 'video'
                                            ? '[视频]'
                                            : '')))}</span>
                        </p>
                    </div>
                    <span className={item.news ? 'point' : ''}></span>
                </li>
            )
        })
        return (
            <section className={'sidebar'}>
                <div className={'card'}>
                    <header className={'user'}>
                        <img className={'avatar'} src={require("../images/Bin.jpg")} />
                        <p className={'name'}>{'haply'}</p>
                    </header>
                    <footer>
                        <input className={'search'} type="text" onChange={(e) => this.search(e)} placeholder="search user..." />
                    </footer>
                </div>

                <div className={'list'}>
                    <ul>
                        <Spin tip="正在获取列表..." spinning={this.props.isSpin}>
                            {UserList}
                        </Spin>
                    </ul>
                </div>
            </section>
        );
    }
    async chatObj(obj, index, event) {
        // debugger;
        event.stopPropagation();
        let list = Object.assign([], this.state.list);
        if (list[index]) {
            list[index].news = false;
            ownerCode = obj.userId;
            await this.setState({ ownerCode: ownerCode });
            this.props.change(obj);
        }
    }
    endChat(item, index, event) {
        const _this = this;
        let list = this.state.list;
        list.splice(index, 1);
        uList = list;
        this.props.change({});
        event.stopPropagation();
        const userId = this.props.user.userId;
        const ownerCode = item.userId;
        Http.get('wx_deleteChatOwner', { ownerCode, userId }, (res) => {
            if (res.returnFlag) {
                Toast('与' + item.name + '会话断开成功！')
            } else {
                // Toast('与'+item.name+'会话断开失败！')
            }
        })
    }
    search(e) { }

}

