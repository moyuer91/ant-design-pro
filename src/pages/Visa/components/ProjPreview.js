import React, { PureComponent, Fragment } from 'react';
import { Descriptions, Table, Card, Switch } from 'antd';
import { connect } from 'dva';

import PageHeader from '@/components/PageHeader';

@connect(({ projPreview, loading }) => ({
  projPreview,
  submitting: loading.effects['projPreview/fetch'],
}))
class ProjPreview extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showOriginalData: false,
    };
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'projPreview/fetch',
      payload: {
        projectId: id,
      },
    });
  }

  renderLabel = label => {
    return <span style={{ whiteSpace: 'normal' }}>{label}</span>;
  };

  renderValue = (value, engValue, type) => {
    const { showOriginalData } = this.state;
    if (type === 8) {
      const dataRange = value ? JSON.parse(value) : [];
      return dataRange.length > 0 ? `${dataRange[0]} 至 ${dataRange[1]}` : '';
    }
    if (type === 9) {
      if (showOriginalData) {
        return value.replace(/"/g, '');
      }
      return engValue ? engValue.replace(/"/g, '') : value.replace(/"/g, '');
    }
    if (showOriginalData) {
      return value;
    }
    return `${value || ''}${engValue ? `(${engValue})` : ''}`;
  };

  renderPage = page => {
    const { showOriginalData } = this.state;
    const { data } = page;
    const descriptionLayout = { column: { xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 } };
    let elements = [];
    const descriptionsList = [];
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      const { type, label, value, engValue, script } = item;
      if (type === 20 || type === 2 || type === 12 || type === 3) {
        // table uploader textarea 类型时，重新起一个Descriptions
        if (elements.length > 0) {
          descriptionsList.push(
            <Descriptions key={`descrs_${i - 1}`} border {...descriptionLayout}>
              {elements.map(elem => {
                return (
                  <Descriptions.Item key={elem.pageElemId} label={this.renderLabel(elem.label)}>
                    {this.renderValue(elem.value, elem.engValue, elem.type)}
                  </Descriptions.Item>
                );
              })}
            </Descriptions>
          );
        }
        // 将elements列表置空
        elements = [];

        if (type === 20) {
          // 表格 不用Descriptions包裹
          const columnsCfg = JSON.parse(script);
          let tableData = [];
          if (showOriginalData) {
            tableData = JSON.parse(value);
          } else {
            tableData = engValue ? JSON.parse(engValue) : JSON.parse(value);
          }

          descriptionsList.push(
            <Table
              key={`descrs_${i}`}
              title={() => <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{`${label}：`}</span>}
              style={{ marginBottom: 16 }}
              pagination={false}
              dataSource={tableData}
              columns={columnsCfg}
            />
          );
        }
        if (type === 2) {
          // text area作为单行插入
          descriptionsList.push(
            <Descriptions key={`descrs_${i}`} border {...descriptionLayout}>
              <Descriptions.Item label={this.renderLabel(label)}>
                {this.renderValue(value, engValue, type)}
              </Descriptions.Item>
            </Descriptions>
          );
        }
        if (type === 3) {
          // 分隔符
          descriptionsList.push(
            <Descriptions key={`descrs_${i}`} title={label} border {...descriptionLayout} />
          );
        }
      } else if (type !== 13) {
        elements.push(item);
      }
    }
    // 循环结束后若仍有元素为添加到Descriptions当中
    if (elements.length > 0) {
      descriptionsList.push(
        <Descriptions
          key={`descrs_${data.length - 1}`}
          title={descriptionsList.length === 0 ? page.pageName : undefined}
          border
          {...descriptionLayout}
        >
          {elements.map(elem => (
            <Descriptions.Item key={elem.pageElemId} label={this.renderLabel(elem.label)}>
              {this.renderValue(elem.value, elem.engValue, elem.type)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      );
    }
    return (
      <Card key={page.id} title={page.name} bordered={false}>
        {descriptionsList}
      </Card>
    );
  };

  onSwitchChange = () => {
    const { showOriginalData } = this.state;
    this.setState({
      showOriginalData: !showOriginalData,
    });
  };

  render() {
    const {
      projPreview: { descr, city, appOrderNo, pagesData },
    } = this.props;
    const { showOriginalData } = this.state;

    const action = (
      <Fragment>
        只展示原始数据：
        <Switch checked={showOriginalData} onChange={this.onSwitchChange} />
      </Fragment>
    );
    return (
      <div>
        <PageHeader
          title={`单号：${appOrderNo}`}
          action={action}
          content={
            <div>
              <p>{`面签城市：${city}`}</p>
              <p>{descr}</p>
            </div>
          }
        />
        {pagesData.map(page => this.renderPage(page))}
      </div>
    );
  }
}
export default ProjPreview;
