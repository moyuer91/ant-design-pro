import React, { PureComponent } from 'react';
import { Upload, Icon, Button, message } from 'antd';
import moment from 'moment';
import { getCheckedData, isSuccessful } from '@/utils/VisaUtils';
import { getToken } from '@/utils/authority';

class PassportUpload extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value,
    };
  }

  handleChange = fileInfo => {
    const { fileList, file } = fileInfo;
    const { onChange, mapResultToForm } = this.props;

    if (file.response) {
      try {
        const checkData = JSON.parse(getCheckedData(file.response));
        if (checkData && isSuccessful(checkData)) {
          checkData.birth_date = checkData.birth_date
            ? moment(checkData.birth_date, 'YYYYMMDD')
            : null;
          checkData.issue_date = checkData.issue_date
            ? moment(checkData.issue_date, 'YYYYMMDD')
            : null;
          checkData.expiry_date = checkData.expiry_date
            ? moment(checkData.expiry_date, 'YYYYMMDD')
            : null;
          mapResultToForm(checkData);
        } else {
          message.error('无法识别护照，请手动录入信息');
        }
      } catch (e) {
        message.error('无法识别护照，请手动录入信息');
      }
    }

    // const newValue=fileList.map(item=>({
    //   // uid:item.uid,
    //   // name:item.name,
    //   // status:item.status,
    //   // response:item.response,
    //   // linkProps:item.linkProps,
    //   ...item,
    // }));

    const newValue = [...fileList];
    if (onChange) {
      onChange(newValue);
    }
    this.setState({ value: newValue });
  };

  render() {
    const { max, action } = this.props;
    const { value } = this.state;
    const uploadButton = (
      <Button>
        <Icon type="upload" /> 点击上传护照
      </Button>
    );
    return (
      <div className="clearfix">
        <Upload
          action={action}
          listType="text"
          fileList={value}
          headers={{
            DM_AUTH: getToken(),
          }}
          onChange={this.handleChange}
        >
          {value.length >= max ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}

export default PassportUpload;
