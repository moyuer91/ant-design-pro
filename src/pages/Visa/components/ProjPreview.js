import React, { PureComponent, Fragment } from 'react';
import { Descriptions, Table, Card, Switch, Button } from 'antd';
import { connect } from 'dva';
import PageHeader from '@/components/PageHeader';
import router from 'umi/router';
import styles from './ProjPreview.less';

// const INPUT=1;
const TEXT_AREA = 2;
const BLOCK_DIVIDER = 3;
// const DATE_PICKER=4;
// const TIME_PICKER=5;
// const RADIO_GROUP=6;
// const CHECK_BOX=7;
const DATE_RANGE = 8;
const CHECKBOX_GROUP = 9;
// const SELECT=10;
// const CASCADER=11;
const IMAGE_UPLOADER = 12;
const PASSPORT_UPLOADER = 13;
// const CITY_SELECTOR=14;
// const INPUT_NUMBER=15;
// const INPUT_EMAIL=16;
const DIVIDER = 17;
const TABLE = 20;
// const CARD=21;

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
    const { dispatch } = this.props;
    dispatch({
      type: 'projPreview/fetch',
      payload: {
        projectId: this.getId(),
      },
    });
  }

  getId = () => {
    const { id, match } = this.props;
    let projectId = id;
    if (!projectId) {
      const { params } = match;
      projectId = params.id;
    }
    return projectId;
  };

  renderLabel = label => {
    return <span style={{ whiteSpace: 'normal' }}>{label}</span>;
  };

  renderValue = (value, engValue, type) => {
    const { showOriginalData } = this.state;
    if (type === DATE_RANGE) {
      const dataRange = value ? JSON.parse(value) : [];
      return dataRange.length > 0 ? `${dataRange[0]} 至 ${dataRange[1]}` : '';
    }
    if (type === CHECKBOX_GROUP) {
      if (showOriginalData) {
        return value.replace(/"/g, '');
      }
      return engValue ? engValue.replace(/"/g, '') : value && value.replace(/"/g, '');
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
    let elements = []; // 缓存前面可以复用Descriptions的元素
    const descriptionsList = []; // Descriptions列表
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      const { type, label, value, engValue, script } = item;
      if (
        type === TABLE ||
        type === TEXT_AREA ||
        type === IMAGE_UPLOADER ||
        type === PASSPORT_UPLOADER ||
        type === BLOCK_DIVIDER
      ) {
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

        if (type === TABLE) {
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
        if (type === TEXT_AREA) {
          // text area作为单行插入
          descriptionsList.push(
            <Descriptions key={`descrs_${i}`} border {...descriptionLayout}>
              <Descriptions.Item label={this.renderLabel(label)}>
                {this.renderValue(value, engValue, type)}
              </Descriptions.Item>
            </Descriptions>
          );
        }
        if (type === BLOCK_DIVIDER) {
          // 分隔符
          descriptionsList.push(
            <Descriptions key={`descrs_${i}`} title={label} border {...descriptionLayout} />
          );
        }
        if (type === IMAGE_UPLOADER) {
          const image = value ? JSON.parse(value) : null;
          descriptionsList.push(
            <Descriptions key={`descrs_${i}`} border {...descriptionLayout}>
              <Descriptions.Item label={this.renderLabel(label)}>
                <img alt={label} src={value && image[0].url} style={{ width: '100%' }} />
              </Descriptions.Item>
            </Descriptions>
          );
        }
        if (type === PASSPORT_UPLOADER) {
          const image = value ? JSON.parse(value) : null;
          descriptionsList.push(
            <Descriptions key={`descrs_${i}`} border {...descriptionLayout}>
              <Descriptions.Item label={this.renderLabel(label)}>
                <img alt={label} src={value && image[0].url} style={{ width: '100%' }} />
              </Descriptions.Item>
            </Descriptions>
          );
        }
      } else if (type !== PASSPORT_UPLOADER && type !== DIVIDER) {
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

  print = id => {
    window.document.body.innerHTML = window.document.getElementById(id).innerHTML;
    window.print();
    window.location.reload();
  };

  // print=(id)=>{
  //   const el = document.getElementById(id);
  //   const iframe = document.createElement('IFRAME');
  //   let doc = null;
  //   iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:500px;top:500px;');
  //   document.body.appendChild(iframe);
  //   doc = iframe.contentWindow.document;
  //   // 引入打印的专有CSS样式，根据实际修改
  //   // doc.write('<LINK rel="stylesheet" type="text/css" href="css/print.css">');
  //   doc.write(el.innerHTML);
  //   doc.close();
  //   // 获取iframe的焦点，从iframe开始打印
  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();
  //   if (navigator.userAgent.indexOf("MSIE") > 0)
  //   {
  //     document.body.removeChild(iframe);
  //   }
  // };

  render() {
    const {
      projPreview: { descr, city, pagesData, id },
      showSwitch,
      showModify = true,
    } = this.props;
    const { showOriginalData } = this.state;

    const action = (
      <Fragment>
        {showSwitch ? (
          <span className={styles.noPrint}>
            只展示原始数据&nbsp;
            <Switch checked={showOriginalData} onChange={this.onSwitchChange} />
            &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        ) : null}
        {showModify ? (
          <Button
            className={styles.noPrint}
            onClick={() => router.push(`/visa/applform/${this.getId()}`)}
          >
            返回修改
          </Button>
        ) : null}
        <Button className={styles.noPrint} onClick={() => this.print('content')}>
          打印
        </Button>
      </Fragment>
    );
    return (
      <div id="content">
        <PageHeader
          title={`编号：${id}`}
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
