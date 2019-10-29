import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, Modal, Badge } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeader from '@/components/PageHeader';
import styles from './VisaList.less';
import { setToken } from '@/utils/authority';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['草稿', '处理中', '已完成', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, initInfo } = props;
  const { countryItems, presentCityItems, typeItems } = initInfo;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建签证申请"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="申请人">
        {form.getFieldDecorator('applicant', {
          rules: [{ required: true, message: '请输入申请人姓名！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="申请国家">
        {form.getFieldDecorator('country', {
          rules: [{ required: true, message: '请选择申请国家！' }],
        })(
          <Select placeholder="请输入" style={{ width: '100%' }}>
            {countryItems}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="签证类型">
        {form.getFieldDecorator('type', {
          rules: [{ required: true, message: '请选择签证类型！' }],
        })(
          <Select placeholder="请输入" style={{ width: '100%' }}>
            {typeItems}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="送签城市">
        {form.getFieldDecorator('city', {
          rules: [{ required: true, message: '请选择送签城市！' }],
        })(
          <Select placeholder="请输入" style={{ width: '100%' }}>
            {presentCityItems}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="证件号码">
        {form.getFieldDecorator('docNo', {
          rules: [{ required: true, message: '请输入证件号码！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联系电话">
        {form.getFieldDecorator('phone', {
          rules: [{ required: true, message: '请输入联系电话！' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});
/* eslint react/no-multi-comp:0 */
@connect(({ visaList, loading }) => ({
  visaList,
  loading: loading.models.visaList,
}))
@Form.create()
class VisaList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;

    // 保存token
    setToken(query.token);
    dispatch({
      type: 'visaList/init',
    });
    dispatch({
      type: 'visaList/fetch',
      payload: {
        pageNum: 1,
        pageSize: 10,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.orderBy = `${sorter.field} ${sorter.order === 'descend' ? 'desc' : 'asc'}`;
    }

    dispatch({
      type: 'visaList/fetch',
      payload: params,
    });
  };

  previewItem = id => {
    // router.push(`/visa/applform/${id}`);
    window.open(`/visa/applform/${id}`);
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'visaList/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        createdAt: fieldsValue.createdAt && fieldsValue.createdAt.format('YYYY-MM-DD'),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'visaList/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    // router.push(`/visa/applform/${record.id}`);
    window.open(`/visa/applform/${record.id}`);
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'visaList/add',
      payload: {
        ...fields,
      },
    });
    this.handleModalVisible();
  };

  renderSimpleForm(initInfo) {
    const { countryItems, typeItems } = initInfo;
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="申请国家">
              {getFieldDecorator('country')(
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  filterOption={(inputValue, option) =>
                    option.props.children.indexOf(inputValue) >= 0
                  }
                >
                  {countryItems}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {typeItems}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm(initInfo) {
    const { countryItems, presentCityItems, typeItems, statusItems } = initInfo;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="申请国家">
              {getFieldDecorator('country')(
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: '100%' }}
                  filterOption={(inputValue, option) =>
                    option.props.children.indexOf(inputValue) >= 0
                  }
                >
                  {countryItems}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {typeItems}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('Status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {statusItems}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="申请人">
              {getFieldDecorator('applicant')(
                <Input placeholder="请输入" style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="送签城市">
              {getFieldDecorator('city')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {presentCityItems}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('createdAt')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入创建日期" />
              )}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm(initInfo) {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm(initInfo) : this.renderSimpleForm(initInfo);
  }

  render() {
    const {
      visaList: { visaList, initInfo, pagination },
      loading,
    } = this.props;
    const tableData = {
      list: visaList,
      pagination,
    };
    const { countries, presentCities, types, statusOpts } = initInfo;
    const countriesMap = {};
    if (countries) {
      for (let i = 0; i < countries.length; i += 1) {
        const item = countries[i];
        countriesMap[item.value] = item.label;
      }
    }

    const typesMap = {};
    if (types) {
      for (let i = 0; i < types.length; i += 1) {
        const item = types[i];
        typesMap[item.value] = item.label;
      }
    }

    const presentCitiesMap = {};
    if (presentCities) {
      for (let i = 0; i < presentCities.length; i += 1) {
        const item = presentCities[i];
        presentCitiesMap[item.value] = item.label;
      }
    }
    let countryItems = [];
    if (countries) {
      countryItems = countries.map(item => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ));
    }

    let presentCityItems = [];
    if (presentCities) {
      presentCityItems = presentCities.map(item => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ));
    }

    let typeItems = [];
    if (types) {
      typeItems = types.map(item => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ));
    }

    let statusItems = [];
    if (statusOpts) {
      statusItems = statusOpts.map(item => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ));
    }

    const initFormParams = { countryItems, presentCityItems, typeItems, statusItems };

    const { selectedRows, modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        render: (text, record) => <a onClick={() => this.previewItem(record.id)}>{text}</a>,
      },
      {
        title: '申请人',
        dataIndex: 'applicant',
        render: val => val,
      },
      {
        title: '国家',
        dataIndex: 'country',
        sorter: true,
        render: val => (countriesMap[val] ? countriesMap[val] : val),
      },
      {
        title: '类型',
        dataIndex: 'type',
        sorter: true,
        render: val => (typesMap[val] ? typesMap[val] : val),
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '护照号',
        dataIndex: 'docNo',
      },
      {
        title: '送签城市',
        dataIndex: 'city',
        sorter: true,
        render: val => (presentCitiesMap[val] ? presentCitiesMap[val] : val),
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          </Fragment>
        ),
      },
    ];

    return (
      <div>
        <PageHeader title="签证信息管理" />
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm(initFormParams)}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              rowKey="id"
              selectedRows={selectedRows}
              loading={loading}
              data={tableData}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} initInfo={initFormParams} />
      </div>
    );
  }
}
export default VisaList;
