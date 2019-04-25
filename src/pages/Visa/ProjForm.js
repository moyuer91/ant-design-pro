import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import Page from './Page';

const { Content, Sider, Header } = Layout;

class ProjForm extends PureComponent {
  count = 0;

  state = {
    collapsed: true,
    curPageNam: '',
    curPageSeqNo: 1,
    pagesCfg: null,
  };

  constructor() {
    super();
    this.props = {
      pageNum: 2,
      projId: 123,
      projNam: '法国签证',
      descr: '法国签证',
      applicant: '张三',
    };
  }

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  onMenuClick = item => {
    this.setState({
      curPageNam: item.item.props.title,
      curPageSeqNo: item.key,
    });
  };

  getPagesCfg = () => {
    this.state.pagesCfg = [
      {
        seqNo: 1,
        pageId: 1,
        pageNam: '基本信息',
        descr: '基本信息详细描述',
      },
      {
        seqNo: 2,
        pageId: 2,
        pageNam: '入境信息',
        descr: '入境信息详细描述',
      },
    ];
    const { pagesCfg } = this.state;
    return pagesCfg;
  };

  getPage = seqNo => {
    let page = null;
    const {
      pagesCfg: { length },
    } = this.state;
    const { pagesCfg } = this.state;
    for (let i = 0; i < length; i += 1) {
      const cfg = pagesCfg[i];
      if (cfg.seqNo === seqNo) {
        page = <Page pageCfg={cfg} />;
        break;
      }
    }
    return page;
  };

  getMenuItems = pagesCfg => {
    const items = pagesCfg.map(cfg => {
      return (
        <Menu.Item key={cfg.seqNo} onClick={this.onMenuClick} title={cfg.pageNam}>
          <span className="nav-text">{cfg.pageNam}</span>
        </Menu.Item>
      );
    });
    return items;
  };

  render() {
    const pagesCfg = this.getPagesCfg();
    const menuItems = this.getMenuItems(pagesCfg);
    const { curPageSeqNo, collapsed, curPageNam } = this.state;
    const curPage = this.getPage(curPageSeqNo);
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed1, type) => {
            console.log(collapsed1, type);
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {menuItems}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              style={{ paddingLeft: 24 }}
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
            <span style={{ paddingLeft: 24 }}>{curPageNam}</span>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{curPage}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default ProjForm;
