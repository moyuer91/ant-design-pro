import React, { PureComponent, Fragment } from 'react';
import { Layout, Button, Drawer } from 'antd';
import { connect } from 'dva';
import Page from './Page';
import ProjFrom from './ProjPreview';

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
    const { dispatch, match } = this.props;
    const { params } = match;
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
    this.curPage.handleSave();
    dispatch({
      type: 'visaform/switchTab',
      payload: {
        activePageId: parseInt(tabId, 10),
      },
    });
  };

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

  render() {
    const {
      visaform: { pages, activePageId, id, hasNext, hasPrevious, descr, city, appOrderNo },
    } = this.props;

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
          <Button>翻译</Button>
        </ButtonGroup>
      </Fragment>
    );
    return (
      <Layout>
        <PageHeaderWrapper
          title={`单号：${appOrderNo}`}
          action={action}
          content={descr}
          extraContent={`面签城市：${city}`}
          tabList={tabpanes}
          tabActiveKey={activePageId ? activePageId.toString() : '-1'}
          onTabChange={this.onSwitch}
        />
        <Content style={{ margin: '10px 0 0' }}>
          <div style={{ padding: 0, minHeight: 360 }}>
            <Page
              id={activePageId}
              key={activePageId}
              projectId={id}
              hasNext={hasNext}
              hasPrevious={hasPrevious}
              onRef={this.onRef}
              handleNext={this.handleNext}
            />
          </div>
        </Content>
        <Drawer
          title="签证申请单预览"
          width={600}
          placement="right"
          onClose={this.onDrawerClose}
          visible={drawerVisible}
        >
          <ProjFrom id={id} />
        </Drawer>
      </Layout>
    );
  }
}
export default ProjForm;
