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
  Upload,
  Cascader,
  Radio,
  Icon,
  Tooltip,
  message,
} from 'antd';
import styles from './style.less';
import TableFormItem from './TableFormItem';

const { TextArea } = Input;
const { Paragraph } = Typography;
const FormItem = Form.Item;

const cascaDerOpitons = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          {
            value: 'xihuqu',
            label: '西湖区',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          {
            value: 'gulouqu',
            label: '鼓楼区',
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
    const { dispatch, id, onRef } = this.props;
    onRef(this);
    if (id !== -1) {
      dispatch({
        type: 'visapage/fetch',
        payload: {
          pageId: id,
        },
      });
    }
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'visapage/submit',
          payload: values,
        });
      }
    });
  };

  handleSave = e => {
    const {
      dispatch,
      form,
      projectId,
      visapage: { elements },
    } = this.props;
    if (elements && elements.length > 0) {
      const elementsMap = {};
      elements.forEach(item => {
        elementsMap[item.id] = item;
      });
      if (e) {
        e.preventDefault();
      }

      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          dispatch({
            type: 'visapage/save',
            payload: {
              prjId: projectId,
              values,
              elementsMap,
            },
          });
        }
      });
    }
  };

  render() {
    const {
      handleNext,
      handlePrevious,
      hasNext,
      hasPrevious,
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
      } else if (type === 2) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
        })(
          <TextArea
            placeholder={placeholder}
            style={{ display }}
            autosize={{ minRows: 2, maxRows: 6 }}
          />
        );
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
          initialValue: value ? moment(value, 'YYYYMMDD') : null,
          rules,
        })(<DatePicker />);
      } else if (type === 5) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value ? moment(value, 'HHmmss') : null,
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
        const cascaDerValue = JSON.parse(value);
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: cascaDerValue,
          rules,
        })(<Cascader options={cascaDerOpitons} />);
      } else if (type === 12) {
        // 上传文件
        const props = {
          name: 'file',
          action: '/visaservice/attachments',
          headers: {
            authorization: 'authorization-text',
          },
          onChange(info) {
            if (info.file.status !== 'uploading') {
              console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} file upload failed.`);
            }
          },
        };
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: [],
          rules,
        })(
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> {label}
            </Button>
          </Upload>
        );
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
        return <FormItem key={id}>{elemItem}</FormItem>;
      }
      if (type === 3) {
        return (
          <Card key={`card_${id}`} title={label} bordered={false}>
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
              {hasPrevious && (
                <Button
                  type="primary"
                  loading={submitting}
                  style={{ marginLeft: 8 }}
                  onClick={handlePrevious}
                >
                  上一页
                </Button>
              )}
              {hasNext && (
                <Button
                  type="primary"
                  loading={submitting}
                  style={{ marginLeft: 8 }}
                  onClick={handleNext}
                >
                  保存并下一页
                </Button>
              )}
              {!hasNext && (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  style={{ marginLeft: 8 }}
                >
                  提交
                </Button>
              )}
            </FormItem>
          </Form>
        </PageHeader>
      </div>
    );
  }
}

export default Page;
