import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  // DatePicker,
  // Select,
  Button,
  Card,
  // InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

@connect(({ visapage, loading }) => ({
  visapage,
  submitting: loading.effects['visa/page/fetch'],
}))
@Form.create()
class Page extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'visapage/fetch',
      payload: {
        pageId: 0,
      },
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'visa/submit',
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
          type: 'visa/save',
          payload: values,
        });
      }
    });
  };

  render() {
    const {
      submitting,
      visapage: { title, content, elems },
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

    const formItems = elems.map(elem => {
      const { id, type, label, initialValue, displayWhen, options, tip, rules, placeholder } = elem;
      let display = 'block';
      if (displayWhen !== null && displayWhen !== undefined) {
        display = getFieldValue(displayWhen.id) === displayWhen.value ? 'block' : 'none';
      }
      if (display === 'none') {
        return null;
      }

      let elemItem = null;
      if (type === 1) {
        elemItem = getFieldDecorator(id, {
          initialValue,
          rules,
        })(<Input placeholder={placeholder} style={{ display }} />);
      } else if (type === 2) {
        elemItem = getFieldDecorator(id, {
          initialValue,
          rules,
        })(
          <Radio.Group
            options={options}
            style={{
              display,
            }}
          />
        );
      }
      return (
        <FormItem
          {...formItemLayout}
          label={
            <span>
              {label}&nbsp;&nbsp;
              {tip !== null && tip !== undefined && tip !== '' && (
                <em className={styles.optional}>
                  <Tooltip title={tip}>
                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
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
      <PageHeaderWrapper title={title} content={content}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
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
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Page;
