import React, { PureComponent } from 'react';
import { Layout, Tabs, Card } from 'antd';
import { connect } from 'dva';
import Page from './Page';

const { Content } = Layout;
const { TabPane } = Tabs;

@connect(({ visaform, loading }) => ({
  visaform,
  submitting: loading.effects['visaform/fetch'],
}))
class ProjForm extends PureComponent {
  state = {
    activePageId: 1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'visaform/fetch',
      payload: {
        projectId: 1,
      },
    });
  }

  onSwitch = activePageId => {
    this.setState({
      activePageId,
    });
  };

  render() {
    const {
      visaform: { pages },
    } = this.props;

    const { activePageId } = this.state;
    const tabpanes = pages.map(page => <TabPane tab={page.pageName} key={page.id} />);
    // let curPage;
    // if(this.pageList[activePageId]){
    //   curPage = this.pageList[activePageId];
    // }else{
    //   curPage = <Page id={activePageId} key={activePageId} />;
    //   this.pageList[activePageId]=curPage;
    // }

    const curPage = <Page id={activePageId} key={activePageId} />;
    return (
      <Layout>
        <Card bordered={false}>
          <Tabs defaultActiveKey="1" onChange={this.onSwitch}>
            {tabpanes}
          </Tabs>
        </Card>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>{curPage}</div>
        </Content>
      </Layout>
    );
  }
}
export default ProjForm;
