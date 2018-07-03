/**
 * @description 侧边菜单栏
 *  @type {Component}
 */

import React from 'react';
import cx from 'classnames';
import { Menu, Icon } from 'antd'
import './Sidebar.scss';
// import Link from '../Link';

const SubMenu = Menu.SubMenu;

class Sidebar extends React.Component {
  state = {
    collapsed: false,
    path: {
      open: '/fed/admin/open',
      checkinWithDelear: '/checkinDealer',
      checkinWithManu: '/checkinManu',
      verify: '/verify',
      stick: '/stick',
      energyDealer: '/energyDealer',
      energyManu: '/energyManu',
      energyConf: '/energyConf',
      keyword: '/keyword',
      keywordxsd: '/keywordxsd',
      infoDealer: '/infoDealer',
      infoManu: '/infoManu',
      newsEditDealer: '/news/editDealer',
      newsEditManu: '/news/editManu',
      actEditDealer: '/act/editDealer',
      actEditManu: '/act/editManu',
      noteDealer: '/noteDealer',
      noteManu: '/noteManu',
      topicEditDealer: '/topic/editDealer',
      topicEditManu: '/topic/editManu',
      dynamicEditDealer: '/dynamic/editDealer',
      dynamicEditManu: '/dynamic/editManu',
      tag: '/tag',


    },
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  goRouter(path) {
    this.props.history.push(path);
  }

  render() {
    const path = { ...this.state.path };
    return (
      <div className={'page-sidebar'} role="sidebar">
        <div>
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub', 'sub1', 'sub2', 'sub3', 'sub4']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
          >

            <SubMenu key="sub" title={<span><Icon type="appstore" /><span>社区管理版块</span></span>}>

              <SubMenu key="sub1" title="业务设置">
                <Menu.Item key="12">
                  <a onClick={this.goRouter.bind(this, '/saicui/checkinDealer')}>签到管理(销售店)</a>
                </Menu.Item>
                <Menu.Item key="24">
                  <a onClick={this.goRouter.bind(this, '/saicui/checkinManu')}>签到管理(厂商)</a>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title="重点管理">
                <Menu.Item key="13">
                  <a onClick={this.goRouter.bind(this, '/saicui/verify')}>审核</a>
                </Menu.Item>
                <Menu.Item key="14">
                  <a onClick={this.goRouter.bind(this, '/saicui/stick')}>推荐置顶</a>
                </Menu.Item>
                <Menu.Item key="15">
                  <a onClick={this.goRouter.bind(this, '/saicui/keyword')}>维护敏感词汇(厂商)</a>
                </Menu.Item>
                <Menu.Item key="26">
                  <a onClick={this.goRouter.bind(this, '/saicui/keywordxsd')}>维护敏感词汇(销售店)</a>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title="资讯管理">
                <Menu.Item key="25">
                  <a onClick={this.goRouter.bind(this, '/saicui/tag')}>资讯标签</a>
                </Menu.Item>
                <Menu.Item key="16">
                  <a onClick={this.goRouter.bind(this, '/saicui/news/editDealer')}>发布新闻(销售店)</a>
                </Menu.Item>
                <Menu.Item key="31">
                  <a onClick={this.goRouter.bind(this, '/saicui/news/editManu')}>发布新闻(厂商)</a>
                </Menu.Item>
                <Menu.Item key="17">
                  <a onClick={this.goRouter.bind(this, '/saicui/act/editDealer')}>发布活动(销售店)</a>
                </Menu.Item>
                <Menu.Item key="32">
                  <a onClick={this.goRouter.bind(this, '/saicui/act/editManu')}>发布活动(厂商)</a>
                </Menu.Item>
                <Menu.Item key="18">
                  <a onClick={this.goRouter.bind(this, '/saicui/infoDealer')}>查看内容(销售店)</a>
                </Menu.Item>
                <Menu.Item key="27">
                  <a onClick={this.goRouter.bind(this, '/saicui/infoManu')}>查看内容(厂商)</a>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="sub4" title="车圈管理">
                <Menu.Item key="19">
                  <a onClick={this.goRouter.bind(this, '/saicui/dynamic/editDealer')}>发表动态(销售店)</a>
                </Menu.Item>
                <Menu.Item key="30">
                  <a onClick={this.goRouter.bind(this, '/saicui/dynamic/editManu')}>发表动态(厂商)</a>
                </Menu.Item>
                <Menu.Item key="20">
                  <a onClick={this.goRouter.bind(this, '/saicui/topic/editDealer')}>发表话题(销售店)</a>
                </Menu.Item>
                <Menu.Item key="29">
                  <a onClick={this.goRouter.bind(this, '/saicui/topic/editManu')}>发表话题(厂商)</a>
                </Menu.Item>
                <Menu.Item key="21">
                  <a onClick={this.goRouter.bind(this, '/saicui/noteDealer')}>查看 - 动态 | 话题(销售店)</a>
                </Menu.Item>
                <Menu.Item key="26">
                  <a onClick={this.goRouter.bind(this, '/saicui/noteManu')}>查看 - 动态 | 话题(厂商)</a>
                </Menu.Item>
                <Menu.Item key="22">
                  <a onClick={this.goRouter.bind(this, '/saicui/energyDealer')}>查看丰云能量(销售店)</a>
                </Menu.Item>
                <Menu.Item key="28">
                  <a onClick={this.goRouter.bind(this, '/saicui/energyManu')}>查看丰云能量(厂商)</a>
                </Menu.Item>
                <Menu.Item key="23">
                  <a onClick={this.goRouter.bind(this, '/saicui/energyConf')}>设置丰云能量规则</a>
                </Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
        </div>
      </div>
    );
  }
}

export default Sidebar;
