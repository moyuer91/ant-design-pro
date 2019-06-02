import React, { PureComponent } from 'react';
import { connect } from 'dva';
import * as moment from 'moment';
import {
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Typography,
  Button,
  Card,
  PageHeader,
  Divider,
  // InputNumber,
  Cascader,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import styles from './style.less';
import TableFormItem from './TableFormItem';

const { Paragraph } = Typography;
const FormItem = Form.Item;

const cascaDerOpitons = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
];

@connect(({ visapage, loading }) => ({
  visapage,
  submitting: loading.effects['visapage/fetch'],
}))
@Form.create()
class Page extends PureComponent {
  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'visapage/fetch',
      payload: {
        pageId: id,
      },
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'visapage/submitPage',
          payload: values,
        });
      }
    });
  };

  handleSave = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'visapage/savePage',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      submitting,
      visapage: { pageName, descr, elements },
    } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const formItems = elements.map(elem => {
      const {
        id,
        type,
        label,
        value,
        displayWhen,
        options,
        tip,
        rules,
        script,
        placeholder,
      } = elem;
      let display = 'block';
      if (displayWhen !== null && displayWhen !== undefined) {
        display = getFieldValue(displayWhen.id) === displayWhen.value ? 'block' : 'none';
      }
      if (display === 'none') {
        return null;
      }

      let elemItem = null;
      if (type === 1) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
        })(<Input placeholder={placeholder} style={{ display }} />);
      } else if (type === 6) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
        })(
          <Radio.Group
            options={options}
            style={{
              display,
            }}
          />
        );
      } else if (type === 4) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: moment(value, 'YYYYMMDD'),
          rules,
        })(<DatePicker />);
      } else if (type === 5) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: moment(value, 'HHmmss'),
          rules,
        })(<TimePicker />);
      } else if (type === 10) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
        })(
          <Select>
            {options.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        );
      } else if (type === 11) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
        })(<Cascader options={cascaDerOpitons} />);
      } else if (type === 20) {
        try {
          const columnsCfg = JSON.parse(script);
          const tableData = JSON.parse(value);
          elemItem = getFieldDecorator(id.toString(), {
            initialValue: {
              tableData,
              columnsCfg,
            },
            rules,
          })(<TableFormItem />);
        } catch (e) {
          console.log(e.toString());
          // throw new Error('invalid elem prop', e);
        }
      }

      if (type === 20) {
        return <FormItem key={elem.id}>{elemItem}</FormItem>;
      }
      if (type === 3) {
        return (
          <Card title={label} bordered={false}>
            {tip && <Card.Meta description={tip} />}
          </Card>
        );
      }

      return (
        <FormItem
          key={elem.id}
          {...formItemLayout}
          label={
            <span>
              {label}&nbsp;&nbsp;
              {tip && (
                <em className={styles.optional}>
                  <Tooltip title={tip}>
                    <Icon
                      type="question-circle"
                      theme="filled"
                      style={{ marginRight: 4, color: '#08c' }}
                    />
                  </Tooltip>
                </em>
              )}
            </span>
          }
        >
          {elemItem}
        </FormItem>
      );
    });

    return (
      <div>
        <PageHeader title={pageName}>
          <Paragraph>{descr}</Paragraph>
          <Divider style={{ margin: '0 0 0' }} />
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            {formItems}
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button style={{ marginLeft: 8 }} onClick={this.handleSave}>
                保存
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                style={{ marginLeft: 8 }}
              >
                提交
              </Button>
            </FormItem>
          </Form>
        </PageHeader>
      </div>
    );
  }
}

export default Page;
