import React, { PureComponent } from 'react';
import { message, Spin } from 'antd';
import moment from 'moment';
import { getCheckedData, isSuccessful } from '@/utils/VisaUtils';
import FileUpload from './FileUpload';
import request from '@/utils/request';

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

  handleChange = fileList => {
    const { onChange, mapResultToForm } = this.props;
    const file = fileList[0];
    if (file && file.status === 'done') {
      // 解析时间较长，需要增加进度提示
      this.setState({ loading: true });
      // 上传完成后进行解析
      const filedata = new FormData();
      filedata.append('file', file.originFileObj);
      request(analyzePassportAction, {
        method: 'POST',
        body: filedata,
      }).then(parseResp => {
        // message.success(`返回结果：${JSON.stringify(parseResp)}`,20);
        try {
          const checkData = JSON.parse(getCheckedData(parseResp));
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
          // 去除解析进度条
          this.setState({ loading: false });
        } catch (e) {
          message.error('无法识别护照，请手动录入信息');
          // 去除解析进度条
          this.setState({ loading: false });
        }
      });
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
    const { value: fileList, loading } = this.state;
    return (
      <div>
        <Spin spinning={loading} tip="图片较大，护照信息解析需要一会儿,请稍候..." delay={500}>
          <FileUpload
            {...this.props}
            accept="image/png, image/jpeg , image/jpg , image/bmp"
            fileList={fileList || []}
            onChange={this.handleChange}
            uploadBtnText="上传护照"
          />
        </Spin>
      </div>
    );
  }
}

export default PassportUpload;
