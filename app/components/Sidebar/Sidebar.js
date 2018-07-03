/**
 * @description 侧边菜单栏
 *  @type {Component}
 */

import React from 'react';
import { Menu, Icon } from 'antd'
import './Sidebar.scss';

const SubMenu = Menu.SubMenu;

class Sidebar extends React.Component {
  state = {
    collapsed: false,
    SelectedKey: []
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  goRouter(path) {
    this.props.history.push('/saicui/' + path)
  }

  render() {
    const { goRouter } = this;
    return (
      <div className='pageContent' role="sidebar">
        <div className='page-sidebar'>
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
          >
            <SubMenu key="sub" title={<span><Icon type="appstore" /><span>管理版块</span></span>}>
              <Menu.Item key="1">
                <a onClick={goRouter.bind(this, 'chat')}>在线客服</a>
              </Menu.Item>
              <Menu.Item key="2">
                <a onClick={goRouter.bind(this, 'materialList')}>图文素材管理</a>
              </Menu.Item>
              <Menu.Item key="3">
                <a onClick={goRouter.bind(this, 'news')}>Demo资讯</a>
              </Menu.Item>

            </SubMenu>
          </Menu>
        </div>
        <div className='page-cont'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Sidebar;
