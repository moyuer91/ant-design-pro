import React, { PureComponent } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import { getToken } from '@/utils/authority';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class FileUpload extends PureComponent {
  static defaultProps = {
    max: 1,
    value: [],
    listType: 'picture-card',
    action: 'https://service.dameiweb.com/VISACENTER-PROGRAM/ossUpload/save',
    uploadBtnText: '上传照片',
  };

  constructor(props) {
    super(props);
    const { value } = props;
    this.state = {
      value,
      previewVisible: false,
      previewImage: '',
    };
  }

  handleChange = ({ fileList }) => {
    const { onChange } = this.props;

    // if (file.status==="error") {
    //   message.error("文件上传失败！");
    // }

    const newValue = fileList
      .map(item => {
        if (item.status === 'done') {
          return {
            ...item,
            thumbUrl: item.response.data,
            url: item.response.data,
          };
        }
        if (item.status === 'error') {
          message.error('附件上传失败,请联系管理员！');
          return null;
        }
        return item;
      })
      .filter(item => item != null);
    if (onChange) {
      onChange(newValue);
    }
    this.setState({ value: newValue });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  beforeUpload = file => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('格式必须是JPG或PNG!');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isLt2M;
  };

  render() {
    const { max, action, uploadBtnText } = this.props;
    const { value: fileList, previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{uploadBtnText}</div>
      </div>
    );
    return (
      <div>
        <Upload
          {...this.props}
          // beforeUpload={this.beforeUpload}
          action={action}
          fileList={fileList || []}
          className="file-uploader"
          headers={{
            DM_AUTH: getToken(),
          }}
          onChange={this.handleChange}
          onPreview={this.handlePreview}
        >
          {fileList && fileList.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default FileUpload;
