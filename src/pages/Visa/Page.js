import React, { PureComponent } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import {
  Form,
  Input,
  // DatePicker,
  // Select,
  Typography,
  Button,
  Card,
  PageHeader,
  Divider,
  // InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import styles from './style.less';

const { Paragraph } = Typography;
const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

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
      const { id, type, label, value, displayWhen, options, tip, rules, placeholder } = elem;
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
      }
      return (
        <FormItem
          key={elem.id}
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
      <div style={{ margin: '0x 24px 0' }}>
        <PageHeader title={pageName}>
          <Paragraph>{descr}</Paragraph>
        </PageHeader>
        <Divider style={{ margin: '0 0 0' }} />
        <div>
          <GridContent>
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
          </GridContent>
        </div>
      </div>
    );
  }
}

export default Page;
