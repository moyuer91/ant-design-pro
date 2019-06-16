import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  // DatePicker,
  // Select,
  // Button,
  // Card,
  // InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
// import styles from './style.less';

const FormItem = Form.Item;
// const { Option } = Select;
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;

class PageElement extends PureComponent {
  render() {
    const {
      getFieldDecorator,
      getFieldValue,
      id,
      type,
      label,
      initialValue,
      displayWhen,
      options,
      tip,
      rules,
      placeholder,
    } = this.props;

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
    let display = 'block';
    if (displayWhen !== null && displayWhen !== undefined) {
      display = getFieldValue(displayWhen.id) === displayWhen.value ? 'block' : 'none';
    }
    if (display === 'none') {
      return null;
    }
    let content = null;
    if (type === 1) {
      content = getFieldDecorator(id, {
        initialValue,
        rules,
      })(<Input placeholder={placeholder} style={{ display }} />);
    } else if (type === 2) {
      content = getFieldDecorator(id, {
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
    const formItem = (
      <FormItem
        {...formItemLayout}
        label={
          <span>
            {label}&nbsp;&nbsp;
            {tip !== null && tip !== undefined && tip !== '' && (
              <Tooltip title={tip}>
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            )}
          </span>
        }
      >
        {content}
      </FormItem>
    );
    return formItem;
  }
}

export default PageElement;
