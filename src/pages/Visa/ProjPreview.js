import React, { PureComponent, Fragment } from 'react';
import { Layout, Button, Drawer, Descriptions, Table, Badge } from 'antd';
import { connect } from 'dva';
import Page from './Page';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import PageHeader from '@/components/PageHeader';

const { Content } = Layout;

const ButtonGroup = Button.Group;
const progressColumns = [
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '当前进度',
    dataIndex: 'rate',
    key: 'rate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'success' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="processing" text="进行中" />
      ),
  },
  {
    title: '操作员ID',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'cost',
    key: 'cost',
  },
];

const basicProgress = [];
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
          <PageHeader
            title={`单号：${appOrderNo}`}
            content={descr}
            extraContent={`面签城市：${city}`}
          />
          <Descriptions
            title="Responsive Descriptions"
            border
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
            <Descriptions.Item label="Official">$60.00</Descriptions.Item>
            <Descriptions.Item label="Config Info" span={3}>
              Data disk type: MongoDB
              <br />
              Database version: 3.4
              <br />
              Package: dds.mongo.mid
              <br />
              Storage space: 10 GB
              <br />
              Replication_factor:3
              <br />
              Region: East China 1
            </Descriptions.Item>
            <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
            <Descriptions.Item label="Official">$60.00</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            <Table
              style={{ marginBottom: 16 }}
              pagination={false}
              loading={false}
              dataSource={basicProgress}
              columns={progressColumns}
            />
          </Descriptions>

          <Descriptions
            title="Responsive Descriptions"
            border
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
            <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
            <Descriptions.Item label="Official">$60.00</Descriptions.Item>
            <Descriptions.Item label="Config Info" span={2}>
              Data disk type: MongoDB Database version: 3.4 Package: dds.mongo.mid Storage space: 10
              GB Replication_factor:3 Region: East China 1
            </Descriptions.Item>
            <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
            <Descriptions.Item label="Official">$60.00</Descriptions.Item>
            <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
            <Descriptions.Item label="time">18:00:00</Descriptions.Item>
            <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
          </Descriptions>
        </Drawer>
      </Layout>
    );
  }
}
export default ProjForm;
