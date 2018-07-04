/**
 * @description 侧边菜单栏
 *  @type {Component}
 */

import React from 'react';
import { Menu, Icon, Button } from 'antd'
import './Sidebar.scss';

const SubMenu = Menu.SubMenu;

class Sidebar extends React.Component {
  rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];
  state = {
    collapsed: false,
    openKeys: ['sub1'],
    header: [{ icon: 'home', name: '首页' }],
    menuData: [
      {
        key: 'sub1',
        icon: 'appstore',
        modeName: '管理版块',
        children: [
          { icon: '', router: 'chat', childrenName: '在线客服' },
          { icon: '', router: 'materialList', childrenName: '图文素材管理' },
          { icon: '', router: 'news', childrenName: 'Demo资讯' },
        ]
      }
    ],
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }

  goRouter = (path, i, j) => {
    const { menuData } = { ...this.state };
    const header = [...this.state.header];
    header[1] = {
      icon: menuData[i]['icon'],
      name: menuData[i]['modeName']
    };
    header[2] = {
      icon: menuData[i]['children'][j]['icon'],
      name: menuData[i]['children'][j]['childrenName']
    };
    this.props.history.push('/saicui/' + path);
    this.setState({ header });
  }

  render() {
    const { goRouter, toggleCollapsed, onOpenChange } = this;
    const { collapsed, openKeys, menuData, header } = { ...this.state };
    return (
      <div className='sadebarContent' role="sidebar">
        <div className={'sidebar ' + (collapsed ? ` barHiden` : ` barShow`)}>
          <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </Button>
          <Menu
            mode="inline"
            theme="dark"
            openKeys={openKeys}
            inlineCollapsed={collapsed}
            onOpenChange={onOpenChange}
          >
            {menuData.map((e, i) => (
              <SubMenu key={e.key} title={<span><Icon type={e.icon} /><span>{e.modeName}</span></span>}>
                {e.children.map((v, j) => (
                  <Menu.Item key={i + '-' + j}>
                    <a onClick={() => { goRouter(v.router, i, j) }}>{v.childrenName}</a>
                  </Menu.Item>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </div>
        <div
          className={'Content ' + (collapsed ? ` contHien` : ` contShow`)}
          onClick={() => { this.setState({ collapsed: true }) }}>
          <div className='routerHeader'>
            {header.map(e => (
              <span>
                {e.icon && e.icon.length ? <Icon type={e.icon} /> : ''}
                {e.name}<Icon type="double-right" />
              </span>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
