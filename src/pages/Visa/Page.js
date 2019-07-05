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
  Checkbox,
  // InputNumber,
  Upload,
  Cascader,
  Radio,
  Icon,
  Tooltip,
  message,
} from 'antd';
import env from '@/env';
import styles from './style.less';
import TableFormItem from './TableFormItem';

const { TextArea } = Input;
const { Paragraph } = Typography;
const FormItem = Form.Item;

// 计算表达式的值
function evil(fn) {
  const Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
  const result = new Fn(`return ${fn}`)();
  return result;
}

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
    const { dispatch, id, projectId, onRef } = this.props;
    // console.log("Page componentDidMount prjId:"+projectId+"   pageId:"+id);
    onRef(this);
    if (id !== -1) {
      dispatch({
        type: 'visapage/fetch',
        payload: {
          projectId,
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
    let result = false;
    const {
      dispatch,
      form,
      id,
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
              pageId: id,
              values,
              elementsMap,
            },
          });
          result = true;
        }
      });
    }
    return result;
  };

  decideDisplayType = displayWhen => {
    let display = 'block';
    const {
      form: { getFieldValue },
    } = this.props;
    const { ruleType, script } = displayWhen;
    if (displayWhen) {
      if (ruleType === 1) {
        // 脚本形式进行判定
        const result = evil(script)(displayWhen, { moment, getFieldValue });
        display = result ? 'block' : 'none';
      } else {
        // 默认使用值相等的形式进行判定
        display = getFieldValue(displayWhen.id) === displayWhen.value ? 'block' : 'none';
      }
    }
    return display;
  };

  getOptionData = options => {
    const { data, relId } = options;
    const { getFieldValue } = this.props;
    let optionData = [];
    if (options.type === 'cascade') {
      const relValue = getFieldValue(relId);
      optionData = relValue ? data[relValue] : [];
    } else {
      optionData = data;
    }
    return optionData;
  };

  getRules = (rules, type, label) => {
    if (rules.required === true && (rules.message === null || rules.message === undefined)) {
      let msg;
      if (type === 1) {
        msg = `请输入${label}`;
      }
      if (type === 10) {
        msg = `请选择${label}`;
      }
      return { ...rules, message: msg };
    }

    return rules;
  };

  renderLabel = (label, tip) => {
    return (
      <span style={{ whiteSpace: 'normal' }}>
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
    );
  };

  render() {
    const {
      handleNext,
      handlePrevious,
      hasNext,
      handleSubmit,
      hasPrevious,
      submitting,
      visapage: { pageName, descr, elements },
    } = this.props;
    const token = ''; // todo 获取前端token
    // console.log("Page render projectId:"+projectId+"   pageId:"+id);
    const {
      form: { getFieldDecorator },
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
        sm: { span: 12, offset: 1 },
        md: { span: 10, offset: 1 },
      },
    };

    const formItems = elements.map(elem => {
      const {
        id,
        projectId,
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
      const display = this.decideDisplayType(displayWhen);
      if (display === 'none') {
        // 不显示则不渲染
        return null;
      }
      let elemItem = null;
      if (type === 1) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules: this.getRules(rules, type, label),
        })(<Input placeholder={placeholder} style={{ display }} />);
      } else if (type === 2) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules: this.getRules(rules, type, label),
        })(
          <TextArea
            placeholder={placeholder}
            style={{ display }}
            autosize={{ minRows: 2, maxRows: 6 }}
          />
        );
      } else if (type === 4) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value ? moment(value, 'YYYYMMDD') : null,
          rules: this.getRules(rules, type, label),
        })(<DatePicker style={{ display }} />);
      } else if (type === 5) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value ? moment(value, 'HHmmss') : null,
          rules: this.getRules(rules, type, label),
        })(<TimePicker />);
      } else if (type === 6) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules: this.getRules(rules, type, label),
        })(
          <Radio.Group
            options={options.data}
            style={{
              display,
            }}
          />
        );
      } else if (type === 9) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: JSON.parse(value) || [],
          rules: this.getRules(rules, type, label),
        })(<Checkbox.Group options={options.data} />);
      } else if (type === 10) {
        const optionData = this.getOptionData(options);
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules: this.getRules(rules, type, label),
        })(
          <Select>
            {optionData &&
              optionData.map(option => (
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
          rules: this.getRules(rules, type, label),
        })(<Cascader options={cascaDerOpitons} />);
      } else if (type === 12) {
        // 上传文件
        const props = {
          name: 'file',
          action: env.UPLOAD_URL,
          headers: {
            DM_AUTH: token,
          },
          data: { basePath: projectId },
          onChange(info) {
            if (info.file.status !== 'uploading') {
              // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} 文件上传成功`);
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 文件上传失败.`);
            }
          },
        };
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: [],
          rules: this.getRules(rules, type, label),
        })(
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> {label}
            </Button>
          </Upload>
        );
      } else if (type === 13) {
        try {
          elemItem = getFieldDecorator('file picker', {
            initialValue: '',
          })(<Input type="file" />);
        } catch (e) {
          console.log(e.toString());
          // throw new Error('invalid elem prop', e);
        }
      } else if (type === 20) {
        try {
          const columnsCfg = JSON.parse(script);
          const tableData = JSON.parse(value);
          elemItem = getFieldDecorator(id.toString(), {
            initialValue: {
              tableData,
              columnsCfg,
            },
            rules: this.getRules(rules, type, label),
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

      // const shortLabelLayout={span:}

      return (
        <FormItem key={elem.id} {...formItemLayout} label={this.renderLabel(label, tip)}>
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
                  onClick={handleSubmit}
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
