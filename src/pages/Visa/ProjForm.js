import React, { PureComponent, Fragment } from 'react';
import { Layout, Button, Drawer, Modal, message, Menu, Icon } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import Page from './Page';
import ProjPreview from './components/ProjPreview';

import PageHeader from '@/components/PageHeader';
import { setToken } from '@/utils/authority';
import styles from './style.less';

const { Content, Sider } = Layout;

const ButtonGroup = Button.Group;
@connect(({ visaform, loading }) => ({
  visaform,
  submitting: loading.effects['visaform/fetch'],
}))
class ProjForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      drawerVisible: false,
    };
  }

  componentDidMount() {
    // console.log("projForm componentWillMount");
    const {
      dispatch,
      match: { params },
      location: { query },
    } = this.props;
    // 保存token
    if (query.token) {
      setToken(query.token);
    }

    dispatch({
      type: 'visaform/fetch',
      payload: {
        projectId: params.id,
      },
    });
  }

  onRef = ref => {
    this.curPage = ref;
  };

  onDrawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  // 预览
  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  // 翻译
  handleTranslate = () => {
    const {
      dispatch,
      match: { params },
    } = this.props;

    dispatch({
      type: 'visaform/translate',
      payload: {
        projectId: params.id,
      },
      callback: result => {
        if (result) {
          message.success('申请单翻译成功！');
          this.setState({
            drawerVisible: true,
          });
        } else {
          message.error('申请单翻译失败，请联系管理员！');
        }
      },
    });
  };

  onSwitch = tabId => {
    const { dispatch } = this.props;
    let finished = false;
    this.curPage.handleSave().then(
      () => {
        // 保存成功
        finished = true;
        dispatch({
          type: 'visaform/switchTab',
          payload: {
            activePageId: parseInt(tabId, 10),
            finished,
          },
        });
      },
      () => {
        // 保存失败
        Modal.confirm({
          title: '填写错误或未完成',
          content: '当前表单页未完成或者存在错误，是否仍要切换？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            dispatch({
              type: 'visaform/switchTab',
              payload: {
                activePageId: parseInt(tabId, 10),
              },
            });
          },
        });
      }
    );
  };

  onMenuItemClick = ({ key }) => {
    const {
      dispatch,
      visaform: { activePageId },
    } = this.props;
    let finished = false;

    if (activePageId.toString() !== key) {
      this.curPage.handleSave().then(
        () => {
          // 保存成功
          finished = true;
          dispatch({
            type: 'visaform/switchTab',
            payload: {
              activePageId: parseInt(key, 10),
              finished,
            },
          });
          this.toggle();
        },
        () => {
          // 保存失败
          Modal.confirm({
            title: '填写错误或未完成',
            content: '当前表单页未完成或者存在错误，是否仍要切换？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              dispatch({
                type: 'visaform/switchTab',
                payload: {
                  activePageId: parseInt(key, 10),
                },
              });
              this.toggle();
            },
          });
        }
      );
    } else {
      this.toggle();
    }
  };

  // 下一页
  handleNext = e => {
    const {
      visaform: { pages, activePageId },
    } = this.props;
    e.preventDefault();
    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      if (page.id === activePageId && i < pages.length - 1) {
        const nextPageId = pages[i + 1].id;
        this.onSwitch(nextPageId);
        return;
      }
    }
  };

  // 上一页
  handlePrevious = e => {
    const {
      visaform: { pages, activePageId },
    } = this.props;
    e.preventDefault();
    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      if (page.id === activePageId && i >= 1) {
        const previousId = pages[i - 1].id;
        this.onSwitch(previousId);
        return;
      }
    }
  };

  // 提交
  handleSubmit = () => {
    const {
      dispatch,
      match,
      visaform: { pages },
    } = this.props;
    const { params } = match;

    // 校验所有页面是否填写完整
    for (let i = 0; i < pages.length; i += 1) {
      if (!pages[i].finished) {
        Modal.error({
          title: '申请表没有填写完成，请补充完整后再提交！',
          content: `「${pages[i].pageName}」页尚未填写完整`,
        });
        return;
      }
    }
    dispatch({
      type: 'visaform/submit',
      payload: {
        projectId: params.id,
      },
    });
  };

  toggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  SiderMenuWrapper = () => {
    const {
      visaform: { pages, activePageId },
      isMobile,
    } = this.props;
    const { collapsed } = this.state;
    const menuItems = pages.map(page => {
      return (
        <Menu.Item key={page.id}>
          <span>
            {page.pageName}
            {!page.finished ? <span style={{ color: 'red' }}>(未完成)</span> : ''}
          </span>
        </Menu.Item>
      );
    });
    return isMobile ? (
      <Drawer
        width={window.screen.width > 300 ? 300 : window.screen.width}
        visible={!collapsed}
        placement="left"
        onClose={() => this.toggle()}
        style={{
          padding: 0,
          height: '100vh',
        }}
      >
        <div className={styles.logo} />
        <Menu
          mode="inline"
          onClick={this.onMenuItemClick}
          style={{ width: '100%', paddingRight: '0px' }}
          selectedKeys={[activePageId.toString()]}
        >
          {menuItems}
        </Menu>
      </Drawer>
    ) : (
      <Sider trigger={null} width={256} theme="light">
        <Menu
          mode="inline"
          onClick={this.onMenuItemClick}
          style={{ width: '100%', paddingRight: '0px' }}
          selectedKeys={[activePageId.toString()]}
        >
          {menuItems}
        </Menu>
      </Sider>
    );
  };

  render() {
    const {
      visaform: { activePageId, id, hasNext, hasPrevious, prjcfgDescr, city },
      location: { query },
      isMobile,
    } = this.props;
    const { drawerVisible, collapsed } = this.state;

    const action = (
      <Fragment>
        <ButtonGroup>
          <Button type="primary" onClick={this.showDrawer}>
            预览
          </Button>
          {query.showTranslate === 'true' && <Button onClick={this.handleTranslate}>翻译</Button>}
        </ButtonGroup>
      </Fragment>
    );
    return (
      <Layout>
        {this.SiderMenuWrapper()}
        <Layout>
          <Layout>
            <PageHeader
              style={{ margin: '20px 10px 10px' }}
              title={
                <span>
                  {isMobile ? (
                    <Icon
                      className={styles.trigger}
                      type={collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.toggle}
                      style={{ paddingLeft: 0 }}
                    />
                  ) : null}
                  {`编号：${id}`}
                </span>
              }
              action={action}
              hiddenBreadcrumb
              content={
                <div>
                  <p>{`面签城市：${city}`}</p>
                  <p>{prjcfgDescr}</p>
                </div>
              }
            />
            <Content style={{ margin: '10px 10px 10px' }}>
              <div style={{ padding: 0, minHeight: 360 }}>
                <Page
                  id={activePageId}
                  key={`${id}_${activePageId}`}
                  projectId={id}
                  hasNext={hasNext}
                  hasPrevious={hasPrevious}
                  onRef={this.onRef}
                  handleNext={this.handleNext}
                  handlePrevious={this.handlePrevious}
                  handleSubmit={this.handleSubmit}
                />
              </div>
            </Content>
          </Layout>
        </Layout>
        <Drawer
          title="签证申请单预览"
          width={window.screen.width > 1000 ? 1000 : window.screen.width}
          placement="right"
          onClose={this.onDrawerClose}
          visible={drawerVisible}
          keyboard
          destroyOnClose
        >
          <ProjPreview id={id} showSwitch={query.showTranslate} showModify={false} />
        </Drawer>
      </Layout>
    );
  }
}
export default props => (
  <Media query="(max-width: 599px)">
    {isMobile => <ProjForm {...props} isMobile={isMobile} />}
  </Media>
);
