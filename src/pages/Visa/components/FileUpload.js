import React, { PureComponent } from 'react';
import { Upload, Icon, Modal } from 'antd';
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
    defaultValue: [],
    listType: 'picture-card',
    action: '/VISACENTER-PROGRAM/ossUpload/save',
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

  handleChange = fileInfo => {
    const { fileList } = fileInfo;
    const { onChange } = this.props;

    // if (file.status==="error") {
    //   message.error("文件上传失败！");
    // }

    const newValue = fileList.map(item => {
      if (item.status === 'done') {
        return {
          ...item,
          thumbUrl: item.response.data,
          url: item.response.data,
        };
      }
      return item;
    });
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

  render() {
    const { max, action } = this.props;
    const { value, previewVisible, previewImage } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          {...this.props}
          action={action}
          fileList={value}
          headers={{
            DM_AUTH: getToken(),
          }}
          onChange={this.handleChange}
          onPreview={this.handlePreview}
        >
          {value.length >= max ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default FileUpload;
