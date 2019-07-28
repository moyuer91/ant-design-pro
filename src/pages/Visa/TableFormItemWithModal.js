import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Popconfirm, Divider, Form, DatePicker, Select, Modal } from 'antd';
import * as moment from 'moment';
import uuid from 'uuid';
import isEqual from 'lodash/isEqual';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleSave, handleCancel, formItems = [], isNew, editRowKey } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const newFieldsValue = {};
      formItems.map(item => {
        const { type, dataIndex } = item;
        if (type === 2) {
          // 日期
          newFieldsValue[dataIndex] = fieldsValue[dataIndex].format('YYYY-MM-DD');
        } else {
          newFieldsValue[dataIndex] = fieldsValue[dataIndex];
        }

        return null;
      });
      form.resetFields();
      handleSave(editRowKey, newFieldsValue);
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
      md: { span: 14 },
    },
  };

  return (
    <Modal
      destroyOnClose
      title={isNew ? '新增' : '编辑'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleCancel()}
    >
      <Form>
        {formItems.map(item => {
          const { rules, type, options, value } = item;
          const optionsData = options ? JSON.parse(options) : [];
          let formItemContent;
          let initialValue = value;
          if (type === 1) {
            // 下拉框
            formItemContent = (
              <Select>
                {optionsData &&
                  optionsData.map(option => (
                    <Select.Option key={option.value} value={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
              </Select>
            );
          } else if (type === 2) {
            // 日期
            initialValue = value ? moment(value, 'YYYY-MM-DD') : null;
            formItemContent = <DatePicker />;
          } else if (type === 3) {
            // 文本域
            formItemContent = (
              <TextArea placeholder="请输入" autosize={{ minRows: 2, maxRows: 6 }} />
            );
          } else {
            // 默认为输入框
            formItemContent = <Input placeholder="请输入" />;
          }

          return (
            <FormItem {...formItemLayout} label={item.title}>
              {form.getFieldDecorator(item.dataIndex, {
                rules: rules ? JSON.parse(rules) : null,
                initialValue,
              })(formItemContent)}
            </FormItem>
          );
        })}
      </Form>
    </Modal>
  );
});

class TableFormItemWithModal extends PureComponent {
  constructor(props) {
    super(props);

    const {
      value: { tableData },
    } = props;
    this.state = {
      tableData,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: tableData,
      modalVisible: false,
      editRowKey: null,
      editRowData: [], // 编辑时，保存
      isNew: true,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value.tableData, preState.value)) {
      return null;
    }
    return {
      tableData: nextProps.value.tableData,
      value: nextProps.value.tableData,
    };
  }

  getRowByKey = (key, newData) => {
    const { tableData } = this.state;
    return (newData || tableData).filter(item => item.key === key)[0];
  };

  handleEdit = (e, key) => {
    e.preventDefault();
    const { columnsCfg } = this.props;
    const row = this.getRowByKey(key);
    const editRowData = columnsCfg.map(item => ({
      ...item,
      value: row ? row[item.dataIndex] : null,
    }));
    this.setState({
      modalVisible: true,
      isNew: false,
      editRowKey: key,
      editRowData,
    });
  };

  newMember = () => {
    const { columnsCfg } = this.props;
    const formItems = [...columnsCfg];
    this.setState({
      isNew: true,
      modalVisible: true,
      editRowData: formItems,
    });
  };

  remove = key => {
    const { tableData } = this.state;
    const { onChange, columnsCfg } = this.props;
    const newData = tableData.filter(item => item.key !== key);
    this.setState({ tableData: newData });

    onChange({ tableData: newData, columnsCfg });
  };

  handleSave = (key, fieldsValue) => {
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      let newData;
      const { tableData } = this.state;
      if (key) {
        // 编辑
        newData = tableData.map(item => {
          if (item.key === key) {
            return { ...item, ...fieldsValue };
          }
          return { ...item };
        });
      } else {
        // 新增
        const newItem = {
          key: uuid.v4(),
          ...fieldsValue,
        };
        newData = tableData.map(item => ({ ...item }));
        newData.push(newItem);
      }
      const { onChange } = this.props;
      onChange({
        tableData: newData,
      });
      this.setState({
        tableData: newData,
        modalVisible: false,
        loading: false,
      });
    }, 0);
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const { modalVisible, editRowData, editRowKey, isNew } = this.state;
    const { columnsCfg } = this.props;
    const columns = columnsCfg.map(cfg => {
      const { options } = cfg;
      return {
        title: cfg.title,
        dataIndex: cfg.dataIndex,
        key: cfg.key,
        width: cfg.width,
        render: text => {
          if (cfg.type === 1) {
            // select类型
            const optionsData = options ? JSON.parse(options) : [];
            for (let i = 0; i < optionsData.length; i += 1) {
              if (optionsData[i].value === text) {
                return optionsData[i].label;
              }
            }
          }
          return text;
        },
      };
    });

    const actionColumn = {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        const { loading } = this.state;
        if (loading) {
          return null;
        }
        return (
          <span>
            <a onClick={e => this.handleEdit(e, record.key)}>编辑</a>
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
        <div style={{ paddingTop: '5px' }} />
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
        <CreateForm
          handleSave={this.handleSave}
          handleCancel={() => this.handleModalVisible(false)}
          modalVisible={modalVisible}
          handleModalVisible={this.handleModalVisible}
          columnsCfg={columnsCfg}
          formItems={editRowData}
          editRowKey={editRowKey}
          isNew={isNew}
        />
      </Fragment>
    );
  }
}

export default TableFormItemWithModal;
