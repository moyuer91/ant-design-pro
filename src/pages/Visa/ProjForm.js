import React, { PureComponent, Fragment } from 'react';
import { Layout, Button, Drawer, Modal } from 'antd';
import { connect } from 'dva';
import Page from './Page';
import ProjPreview from './ProjPreview';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

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
    } = this.props;
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
  handleTranslate = () => {};

  onSwitch = tabId => {
    const { dispatch } = this.props;
    if (!this.curPage.handleSave()) {
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
      return;
    }
    dispatch({
      type: 'visaform/switchTab',
      payload: {
        activePageId: parseInt(tabId, 10),
      },
    });
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
  handleSubmit = e => {
    const { dispatch, match } = this.props;
    const { params } = match;
    // todo 校验所有页面是否填写完整

    e.preventDefault();
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
        tab: <span>{page.pageName}</span>,
      };
    });
    const action = (
      <Fragment>
        <ButtonGroup>
          <Button type="primary" onClick={this.showDrawer}>
            预览
          </Button>
          {query.isAdmin === 'true' && <Button>翻译</Button>}
        </ButtonGroup>
      </Fragment>
    );
    return (
      <Layout>
        <PageHeaderWrapper
          title={`单号：${appOrderNo}`}
          action={action}
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
          width={window.screen.width > 600 ? 600 : window.screen.width}
          placement="right"
          onClose={this.onDrawerClose}
          visible={drawerVisible}
        >
          <ProjPreview id={id} />
        </Drawer>
      </Layout>
    );
  }
}
export default ProjForm;
