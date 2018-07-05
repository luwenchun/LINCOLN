/**
 * @description 侧边菜单栏
 *  @type {Component}
 */

import React from 'react';
import { Layout, Menu, Icon } from 'antd'
import './Sidebar.scss';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Sidebar extends React.Component {
  rootSubmenuKeys = ['sub0', 'sub1', 'sub2', 'sub4'];
  state = {
    isLogin: false,
    collapsed: false,
    openKeys: ['sub1'],
    header: [{ icon: 'home', name: '首页' }],
    history: [{ icon: 'home', name: '首页', selected: true, router: '/', key: 'A-A' }],
    menuData: [
      {
        key: 'sub0',
        icon: 'user',
        modeName: '用户管理',
        children: []
      },
      {
        key: 'sub1',
        icon: 'appstore',
        modeName: '管理版块',
        children: [
          { icon: 'customer-service', router: '/saicui/chat', childrenName: '在线客服' },
          { icon: 'profile', router: '/saicui/materialList', childrenName: '图文素材管理' },
          { icon: 'car', router: '/saicui/drivepc', childrenName: '试驾预约' },
          { icon: 'table', router: '/saicui/news', childrenName: 'Demo资讯' },
        ]
      },
      {
        key: 'sub2',
        icon: 'setting',
        modeName: '系统设置',
        children: []
      },
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

  goRouter = (path, key) => {
    let index;
    let header = [...this.state.header];
    const { menuData } = { ...this.state };
    const history = [...this.state.history];
    const i = Number(key.split('-')[0]);
    const j = Number(key.split('-')[1]);


    history.forEach((e, i) => {
      if (e.key == key) index = i;
      e.selected = !1
    })
    if (key == 'A-A') {
      header = [{ icon: 'home', name: '首页' }];
      history[0]['selected'] = true;
    } else {
      header[1] = {
        icon: menuData[i]['icon'],
        name: menuData[i]['modeName']
      };
      header[2] = {
        icon: menuData[i]['children'][j]['icon'],
        name: menuData[i]['children'][j]['childrenName']
      };



      if (index) {
        history[index]['selected'] = true;
      } else {
        history.push({
          icon: menuData[i]['children'][j]['icon'],
          name: menuData[i]['children'][j]['childrenName'],
          router: menuData[i]['children'][j]['router'],
          selected: true,
          key,
        })
      }

    }

    this.props.history.push(path);
    this.setState({ header, history });
  }



  goLogUot() { }

  goLogIn() { }

  closeRouter(i) {
    if (!i) return !1;
    let len;
    const history = [...this.state.history];
    history.splice(i, 1);
    len = history.length - 1;
    history[len].selected = !0;
    this.setState({ history }, () => {
      this.goRouter(history[len]['router'], history[len]['key']);
    });
  }

  render() {
    const { goRouter, closeRouter, toggleCollapsed, onOpenChange, goLogUot, goLogIn } = this;
    const { collapsed, openKeys, menuData, header, history, isLogin } = { ...this.state };
    return (
      <div className='sadebarContent' role="sidebar">
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(collapsed) => { this.setState({ collapsed }) }}
          >

            <Menu
              mode="inline"
              theme="dark"
              defaultOpenKeys={openKeys}
              inlineCollapsed={collapsed}
              onOpenChange={onOpenChange}
            >
              {menuData.map((e, i) => (
                <SubMenu key={e.key} title={<span><Icon type={e.icon} /><span>{e.modeName}</span></span>}>
                  {e.children.map((v, j) => (
                    <Menu.Item key={i + '-' + j}>
                      <a onClick={() => { goRouter(v.router, i + '-' + j) }}>
                        {v.icon && v.icon.length ? <Icon type={v.icon} /> : ''}
                        {v.childrenName}
                      </a>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ))}
            </Menu>
          </Sider>

          <Layout onClick={() => { this.setState({ collapsed: true }) }}>
            <div className='routerHeader'>
              <div className='showHeader'>
                {header.map(e => (
                  <span>
                    {e.icon && e.icon.length ? <Icon type={e.icon} /> : ''}
                    {e.name}<Icon type="double-right" />
                  </span>
                ))}

                {isLogin
                  ? <div>
                    <span>
                      <img src="/defualtUser.jpg" />
                    </span>
                    <Icon type="logout" onClick={goLogUot.bind(this)} />
                  </div>
                  : <div>
                    <Icon type="login" onClick={goLogIn.bind(this)} />
                  </div>}
              </div>

              <div className='selectHeader'>
                {history.map((e, i) => (
                  <span className={e.selected ? 'routerSelect' : ''}>
                    <Icon type={e.icon} />
                    <span onClick={() => { goRouter(e.router, e.key) }}>{e.name}</span>
                    <Icon type="poweroff" onClick={closeRouter.bind(this, i)} />
                  </span>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              {this.props.children}
            </div>
          </Layout >
        </Layout >
      </div >
    );
  }
}

export default Sidebar;
