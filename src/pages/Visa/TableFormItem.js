import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import uuid from 'uuid';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

class TableFormItem extends PureComponent {
  cacheOriginData = {};

  constructor(props) {
    super(props);
    const { tableData, columnsCfg } = props.value;
    this.state = {
      tableData,
      columnsCfg,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: tableData,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value.tableData, preState.value)) {
      return null;
    }
    return {
      tableData: nextProps.value.tableData,
      columnsCfg: nextProps.value.columnsCfg,
      value: nextProps.value.tableData,
    };
  }

  getRowByKey(key, newData) {
    const { tableData } = this.state;
    return (newData || tableData).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { tableData } = this.state;
    const newData = tableData.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ tableData: newData });
    }
  };

  newMember = () => {
    const { tableData, columnsCfg } = this.state;
    const newItem = {
      key: uuid.v4(),
      editable: true,
      isNew: true,
    };
    columnsCfg.forEach(item => {
      newItem[item.dataIndex] = '';
    });

    const newData = tableData.map(item => ({ ...item }));

    newData.push(newItem);
    this.setState({ tableData: newData });
  };

  remove(key) {
    const { tableData, columnsCfg } = this.state;
    const { onChange } = this.props;
    const newData = tableData.filter(item => item.key !== key);
    this.setState({ tableData: newData });

    onChange({ tableData: newData, columnsCfg });
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { tableData } = this.state;
    const newData = tableData.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ tableData: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      const { columnsCfg } = this.state;
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      for (let i = 0; i < columnsCfg.length; i += 1) {
        const item = columnsCfg[i];
        if (!target[item.dataIndex]) {
          message.error('请填写完整成员信息。');
          e.target.focus();
          this.setState({
            loading: false,
          });
          return;
        }
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { tableData } = this.state;
      const { onChange } = this.props;
      onChange({
        tableData,
        columnsCfg,
      });
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { tableData } = this.state;
    const newData = tableData.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ tableData: newData });
    this.clickedCancel = false;
  }

  render() {
    const { columnsCfg } = this.state;
    const columns = columnsCfg.map(cfg => ({
      title: cfg.title,
      dataIndex: cfg.dataIndex,
      key: cfg.key,
      width: cfg.width,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, cfg.key, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder={cfg.placeholder}
            />
          );
        }
        return text;
      },
    }));

    const actionColumn = {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: true,
      render: (text, record) => {
        const { loading } = this.state;
        if (!!record.editable && loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.key)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.key)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    };
    columns.push(actionColumn);
    const { loading, tableData } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增
        </Button>
      </Fragment>
    );
  }
}

export default TableFormItem;
