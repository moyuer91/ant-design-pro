import React, { PureComponent } from 'react';
import { Upload, Icon, Button } from 'antd';
import moment from 'moment';
import { getCheckedData } from '@/utils/VisaUtils';

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
      const checkData = getCheckedData(file.response);
      checkData.birth_date = moment(checkData.birth_date, 'YYYYMMDD');
      checkData.issue_date = moment(checkData.issue_date, 'YYYYMMDD');
      checkData.expiry_date = moment(checkData.expiry_date, 'YYYYMMDD');
      mapResultToForm(checkData);
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
    const { max } = this.props;
    const { value } = this.state;
    const uploadButton = (
      <Button>
        <Icon type="upload" /> 点击上传护照
      </Button>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/visaservice/loadPassportInfo"
          listType="text"
          fileList={value}
          onChange={this.handleChange}
        >
          {value.length >= max ? null : uploadButton}
        </Upload>
      </div>
    );
  }
}

export default PassportUpload;
