import React, { PureComponent } from 'react';
import { message, Spin } from 'antd';
import moment from 'moment';
import { getCheckedData } from '@/utils/VisaUtils';
import FileUpload from './FileUpload';

const analyzePassportAction =
  'https://service.dameiweb.com/VISACENTER-PROGRAM/user/loadPassportInfo';

class PassportUpload extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      loading: false,
      value,
    };
  }

  getUrl = item => {
    return item.response.data.url;
  };

  handleChange = fileList => {
    const { onChange, mapResultToForm } = this.props;
    const file = fileList[0];
    if (file && file.status === 'done') {
      // 解析时间较长，需要增加进度提示
      // this.setState({ loading: true });
      // 上传完成后进行解析
      try {
        const { passportInfo } = getCheckedData(file.response);
        const passportObj = JSON.parse(passportInfo);
        if (passportObj) {
          passportObj.birth_date = passportObj.birth_date
            ? moment(passportObj.birth_date, 'YYYYMMDD')
            : null;
          passportObj.issue_date = passportObj.issue_date
            ? moment(passportObj.issue_date, 'YYYYMMDD')
            : null;
          passportObj.expiry_date = passportObj.expiry_date
            ? moment(passportObj.expiry_date, 'YYYYMMDD')
            : null;
          mapResultToForm(passportObj);
        } else {
          message.error('无法识别护照，请手动录入信息');
        }
        // 去除解析进度条
        // this.setState({ loading: false });
      } catch (e) {
        message.error('无法识别护照，请手动录入信息');
        // 去除解析进度条
        // this.setState({ loading: false });
      }
    }

    const newValue = [...fileList];
    if (onChange) {
      onChange(newValue);
    }
    this.setState({ value: newValue });
  };

  render() {
    const { value: fileList, loading } = this.state;
    return (
      <div>
        <Spin spinning={loading} tip="图片较大，护照信息解析需要一会儿,请稍候..." delay={500}>
          <FileUpload
            {...this.props}
            action={analyzePassportAction}
            accept="image/png, image/jpeg , image/jpg , image/bmp"
            fileList={fileList || []}
            onChange={this.handleChange}
            uploadBtnText="上传护照"
            getUrl={this.getUrl}
            compressPic
          />
        </Spin>
      </div>
    );
  }
}

export default PassportUpload;
