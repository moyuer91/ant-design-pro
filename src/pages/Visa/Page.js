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
  InputNumber,
  Upload,
  // Cascader,
  Radio,
  Icon,
  Tooltip,
  message,
} from 'antd';
import { getToken } from '@/utils/authority';
import styles from './style.less';
import PassportUpload from './components/PassportUpload';
import CitySelect from './components/CitySelect';
import TableFormItemWithModal from './TableFormItemWithModal';

const { TextArea } = Input;
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;

// 计算表达式的值
function evil(fn) {
  const Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错
  const result = new Fn(`return ${fn}`)();
  return result;
}

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
    e.preventDefault();
    const { handleSubmit } = this.props;
    this.handleSave().then(() => {
      handleSubmit();
    });
  };

  handleSave = e => {
    const {
      dispatch,
      form,
      id,
      projectId,
      visapage: { elements },
    } = this.props;

    const promise = new Promise((resolve, reject) => {
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
              callback: success => {
                if (success) {
                  resolve(values);
                } else {
                  reject(err);
                }
              },
            });
          } else {
            reject(err);
          }
        });
      } else {
        reject(new Error('页面没有元素'));
      }
    });
    return promise;
  };

  decideDisplayType = displayWhen => {
    let display = 'block';
    const {
      form: { getFieldValue },
    } = this.props;
    const { ruleType, script } = displayWhen;
    if (displayWhen) {
      if (ruleType === 'script') {
        // 脚本形式进行判定
        /* 脚本方式案例  判断年龄来控制显示
        {"id":106,"ruleType":"script","script":"function(displayWhen, context) {const {getFieldValue, moment} = context;const targetVal = getFieldValue(displayWhen.id);if (targetVal) {if (moment().subtract(18, 'y').isAfter(targetVal)) {return false;} else {return true;}} else {return false;}}"}
        */
        const result = evil(script)(displayWhen, { moment, getFieldValue });
        display = result ? 'block' : 'none';
      } else if (ruleType === 'notEqual') {
        // 不相等
        display = getFieldValue(displayWhen.id) !== displayWhen.value ? 'block' : 'none';
      } else if (ruleType === 'oneOf') {
        // 多个值里面的一个
        display =
          displayWhen.value.indexOf(getFieldValue(displayWhen.id)) !== -1 ? 'block' : 'none';
      } else if (ruleType === 'multiCondAnd') {
        // 多条件联动
        display = 'block';
        const { conditions } = displayWhen;
        for (let i = 0; i < conditions.length; i += 1) {
          if (getFieldValue(conditions[i].id) !== conditions[i].value) {
            display = 'none';
            break;
          }
        }
      } else if (ruleType === 'multiCondOr') {
        // 多条件联动
        display = 'none';
        const { conditions } = displayWhen;
        for (let i = 0; i < conditions.length; i += 1) {
          if (getFieldValue(conditions[i].id) === conditions[i].value) {
            display = 'block';
            break;
          }
        }
      } else if (ruleType === 'anyChecked') {
        // 关联的字段value为数组，切数组长度大于0(checkbox至少选中一个)
        const arr = getFieldValue(displayWhen.id);
        if (arr && arr instanceof Array && arr.length > 0) {
          display = 'block';
        } else {
          display = 'none';
        }
      } else {
        // 默认使用值相等的形式进行判定
        display = getFieldValue(displayWhen.id) === displayWhen.value ? 'block' : 'none';
      }
    }
    return display;
  };

  getOptionData = options => {
    const { data, relId, cascadeData } = options;
    const {
      form: { getFieldValue },
    } = this.props;
    let optionData = [];
    if (options.type === 'cascade') {
      const relValue = getFieldValue(relId);
      optionData = relValue ? cascadeData[relValue] : [];
    } else {
      optionData = data;
    }
    return optionData;
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
      hasPrevious,
      submitting,
      visapage: { pageName, descr, elements },
    } = this.props;
    const token = getToken();
    // console.log("Page render projectId:"+projectId+"   pageId:"+id);
    const {
      form: { getFieldDecorator, setFieldsValue },
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
      } else if (type === 4) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value ? moment(value, 'YYYY-MM-DD') : null,
          rules,
        })(<DatePicker style={{ display }} />);
      } else if (type === 5) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value ? moment(value, 'HHmmss') : null,
          rules,
        })(<TimePicker />);
      } else if (type === 6) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
        })(
          <Radio.Group
            options={options.data}
            style={{
              display,
            }}
          />
        );
      } else if (type === 8) {
        const rangeInitVal =
          value && JSON.parse(value)
            ? JSON.parse(value).map(item => (item ? moment(item, 'YYYY-MM-DD') : null))
            : [];
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: rangeInitVal,
          rules,
        })(<RangePicker />);
      } else if (type === 9) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: JSON.parse(value) || [],
          rules,
        })(<Checkbox.Group options={options.data} />);
      } else if (type === 10) {
        const optionData = this.getOptionData(options);
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
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
        // } else if (type === 11) {
        //   const cascaDerValue = JSON.parse(value);
        //   elemItem = getFieldDecorator(id.toString(), {
        //     initialValue: cascaDerValue,
        //     rules,
        //   })(<Cascader options={cascaDerOpitons} />);
      } else if (type === 12) {
        // 上传文件
        const initFileList = JSON.parse(value);
        const props = {
          name: 'file',
          action: '/VISACENTER-PROGRAM/ossUpload/save',
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
              const { fileList, file } = info;
              const { response } = file;
              fileList.map(item => {
                if (item.uid === file.uid) {
                  // eslint-disable-next-line
                  item.url = response.data;
                }
                return item;
              });
              // eslint-disable-next-line
              info.file.url = response.data;
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 文件上传失败.`);
            }
          },
          beforeUpload(file) {
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
              message.error('文件大小不能超过1M!');
            }
            return isLt1M;
          },
        };
        elemItem = getFieldDecorator(id.toString(), {
          valuePropName: 'defaultFileList',
          initialValue: initFileList || [],
          getValueFromEvent: ({ fileList }) => {
            return [...fileList] || [];
          },
          rules,
        })(
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> {label}
            </Button>
          </Upload>
        );
      } else if (type === 13) {
        // 上传护照控件
        const mapRule = script ? JSON.parse(script) : {};
        const initFileList = JSON.parse(value);
        const newValues = {};
        const props = {
          listType: 'picture-card',
          action: '/ERP/visitor/loadPassportInfo',
          headers: {
            DM_AUTH: token,
          },
          mapResultToForm: data => {
            if (data) {
              Object.keys(data).forEach(key => {
                newValues[mapRule[key]] = data[key];
              });
              setFieldsValue(newValues);
            }
          },
          data: { basePath: projectId },
          max: 1,
        };
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: initFileList || [],
          rules,
        })(<PassportUpload {...props} />);
      } else if (type === 14) {
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules,
        })(<CitySelect />);
      } else if (type === 15) {
        // 数字
        const actRules = [...rules];
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules: actRules,
        })(<InputNumber placeholder={placeholder} style={{ display }} />);
      } else if (type === 16) {
        // 邮箱
        const actRules = [...rules, { type: 'email', message: '邮箱格式不正确' }];
        elemItem = getFieldDecorator(id.toString(), {
          initialValue: value,
          rules: actRules,
        })(<Input placeholder={placeholder} style={{ display }} />);
      } else if (type === 20) {
        try {
          const columnsCfg = JSON.parse(script) || [];
          const tableData = JSON.parse(value) || [];
          elemItem = getFieldDecorator(id.toString(), {
            initialValue: {
              tableData,
            },
            rules,
          })(<TableFormItemWithModal columnsCfg={columnsCfg} />);
        } catch (e) {
          console.log(e.toString());
          // throw new Error('invalid elem prop', e);
        }
      }

      if (type === 20) {
        return (
          <Card key={`card_${id}`} title={label} bordered={false}>
            {tip && <Card.Meta description={tip} />}
            <FormItem key={id}>{elemItem}</FormItem>
          </Card>
        );
      }
      if (type === 3) {
        // blockdivider
        return (
          <Card key={`card_${id}`} title={label} bordered={false}>
            {tip && <Card.Meta description={tip} />}
          </Card>
        );
      }

      if (type === 17) {
        // divider
        return <Divider style={{ margin: '10 0 30' }} />;
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
          <div className={styles.pageForm}>
            <Form style={{ marginTop: 8 }}>
              {formItems}
              <FormItem className={styles.optional} {...submitFormLayout} style={{ marginTop: 32 }}>
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
                    onClick={this.handleSubmit}
                  >
                    提交
                  </Button>
                )}
              </FormItem>
            </Form>
          </div>
        </PageHeader>
      </div>
    );
  }
}

export default Page;
