import React, { PureComponent, Fragment } from 'react';
import { Layout, Button, Drawer, Modal, message } from 'antd';
import { connect } from 'dva';
import Page from './Page';
import ProjPreview from './components/ProjPreview';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { setToken } from '@/utils/authority';

const { Content } = Layout;

const ButtonGroup = Button.Group;
@connect(({ visaform, loading }) => ({
  visaform,
  submitting: loading.effects['visaform/fetch'],
}))
class ProjForm extends PureComponent {
  state = { drawerVisible: false };

  componentDidMount() {
    // console.log("projForm componentWillMount");
    const {
      dispatch,
      match: { params },
      location: { query },
    } = this.props;
    // 保存token
    setToken(query.token);
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

  render() {
    const {
      visaform: { pages, activePageId, id, hasNext, hasPrevious, prjcfgDescr, city, appOrderNo },
      location: { query },
    } = this.props;
    // console.log("projForm render id:"+id+"   activePageId:"+activePageId);
    const { drawerVisible } = this.state;
    // const tabpanes = pages.map(page => <TabPane tab={page.pageName} key={page.id} />);
    const tabpanes = pages.map(page => {
      return {
        key: page.id,
        tab: <span>{`${page.pageName}${page.finished ? '（已完成）' : ''}`}</span>,
      };
    });
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
        <PageHeaderWrapper
          title={`单号：${appOrderNo}`}
          action={action}
          hiddenBreadcrumb
          content={
            <div>
              <p>{`面签城市：${city}`}</p>
              <p>{prjcfgDescr}</p>
            </div>
          }
          tabList={tabpanes}
          tabActiveKey={activePageId ? activePageId.toString() : '-1'}
          onTabChange={this.onSwitch}
        />
        <Content style={{ margin: '10px 0 0' }}>
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
        <Drawer
          title="签证申请单预览"
          width={window.screen.width > 1000 ? 1000 : window.screen.width}
          placement="right"
          onClose={this.onDrawerClose}
          visible={drawerVisible}
          keyboard
          destroyOnClose
        >
          <ProjPreview id={id} />
        </Drawer>
      </Layout>
    );
  }
}
export default ProjForm;
