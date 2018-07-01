import React, { Component } from 'react';
import './style/index.scss';
import Header from './components/Header';
import Sidebar from './components/sidebar';
import Messages from './components/messages';
import Http from './../../utils/http';
import { SERVER_BASE_PATH } from '../../global.config';

const title = "在线聊天";

const apis = [
  // 获取客服信息
  { "id": "wx_getChatInfo", "url": "chat/wx/wx_getChatInfo", "format": false },
  // 查询聊天列表
  { "id": "wx_getChatUserList", "url": "chat/wx/wx_getChatUserList", "format": false },
  // 获取常见对白
  { "id": "getWxChatContent", "url": "chat/wx/getWxChatContent", "format": false },
  // 获取常见内容
  { "id": "getWxChatDialogue", "url": "chat/wx/getWxChatDialogue", "format": false },
];


// Http.setDomainUrl("http://localhost:9019/showroom/api/v1/");
// Http.setDomainUrl("http://lincoln-mp.yonyouauto.com/qy/chat/wx/");
Http.setDomainUrl(SERVER_BASE_PATH);
// Http.setDomainUrl("/wx/pc/api/");

// Http.setDebugger(true);
Http.setMutiApi(apis);

let user = {
  userId: "",
  getChatUserList: [],
  Info: [],
  getWxChatContent: [],
  getWxChatDialogue: [],
}

class chatIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterVal: "",
      getChatInfo: {},
      target: {},
      newInformation: {},
      spin: true,
      deleteOwner: '',
    }
  }

  componentWillMount() {
    const userId = Http.getQueryValue('id');
    user['userId'] = userId

    Http.get('wx_getChatUserList', { userId }, (result) => {
      if (result) {
        user.getChatUserList = result;
      }
    });

    Http.post('wx_getChatInfo', { userId }, (result) => {
      if (result && result.length) {
        user.getChatInfo = result;
        result.map((item, index) => {
          if (item['userId'] === userId) {
            user.Info = item;
          }
        })
      }

      const dealerCode = user.Info.dealerCode;
      Http.get('getWxChatContent', { dealerCode }, (result) => {
        console.log('getWxChatContent===', result);
        if (result) {
          user.getWxChatContent = result.data;
        }
      });
      Http.get('getWxChatDialogue', { dealerCode }, (result) => {
        if (result) {
          user.getWxChatDialogue = result.data;
        }
      });
    })

    sessionStorage.setItem('userId', userId);
  }

  componentDidMount() {
    this.created();


  }

  filterSearch(value) {
    this.setState({ filterVal: value });
  }
  selectChatObj(obj) {
    this.setState({ target: obj });
  }
  msg(item) {
    this.setState({ newInformation: Object.assign({}, item) });
  }
  isLogin(bol) {
    this.setState({ spin: bol })
  }

  // 判断是否会话过期--刷聊天列表
  Timing() {
  }

  removeUser(deleteOwner) {
    this.setState({ deleteOwner, target: {} });
  }

  overUser() {
    this.setState({ deleteOwner: '' });
  }


  render() {
    const {  filterVal, newInformation, deleteOwner, spin, target } = { ...this.state }
    return (
      <div className='index'>
        <Header search={this.filterSearch.bind(this)} />
        <Sidebar
          user={user}
          filter={filterVal}
          change={this.selectChatObj.bind(this)}
          information={newInformation}
          confirmMsg={() => { this.setState({ newInformation: {} }) }}
          isSpin={spin}
          over={deleteOwner}
          backOver={this.overUser.bind(this)}
          OkMsg={(v) => { this.setState({ newInformation: {} }) }} />
        <Messages
          user={user}
          target={target}
          newMsg={this.msg.bind(this)}
          login={this.isLogin.bind(this)}
          over={this.removeUser.bind(this)} />
      </div>
    )
  }

  created() {
    // this.createdTag('link', 'https://unpkg.com/antd@3.0.1/dist/antd.min.css');
    // this.createdTag('script', 'https://unpkg.com/antd@3.0.1/dist/antd.min.js');
    this.createdTag('script', 'http://lincoln-mp.yonyouauto.com/pc/assets/jmessage-sdk-web.2.5.0.min.js');
  }
  createdTag(tagName, href) {
    let tag;
    if (tagName === 'link') {
      tag = document.createElement('link');
      tag.setAttribute('rel', 'stylesheet');
      tag.setAttribute('type', 'text/css');
      tag.setAttribute('href', href);
    } else if (tagName === 'script') {
      tag = document.createElement('script');
      tag.setAttribute('src', href);
    }
    document.head.appendChild(tag);
  }
}


export default chatIndex;