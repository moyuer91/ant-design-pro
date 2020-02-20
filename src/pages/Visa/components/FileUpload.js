import React, { PureComponent } from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import lrz from 'lrz';
import { getToken } from '@/utils/authority';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n > 0) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  // 转换成file对象
  return new File([u8arr], filename, { type: mime });
  // 转换成成blob对象
  // return new Blob([u8arr],{type:mime});
}

function backPromise(res) {
  return new Promise(function(resolve, reject) {
    if (res instanceof Object) {
      // 将压缩后的base64字符串转换为文件对象
      const file = dataURLtoFile(res.base64, res.origin.name);
      // console.log('base64tofile',file);

      // 需要给文件对象一个唯一的uid属性否则将会报错
      Object.assign(file, { uid: file.lastModified });
      resolve(file);
      // console.log("压缩成功");
    } else {
      reject(new Error('压缩失败'));
    }
  });
}

// 处理函数
function compress(file) {
  try {
    let ratio = 1;
    const { size } = file;

    // 图片大于1M就压缩，否则不压缩
    if (size && size > 256000) {
      // 将大于1M的图片，压缩后大致使图片大小保持在1M左右

      ratio = `${256000 / size}`;

      ratio = parseFloat(ratio).toFixed(2);

      // console.log('开始压缩',ratio);
      return lrz(file, { quality: ratio })
        .then(rst => {
          // 数字越小，压缩率越高
          // console.log(rst);
          return backPromise(rst);
        })
        .catch(() => {
          // console.log('压缩失败');
          return false;
        });
    }
  } catch (e) {
    // console.log('压缩异常');
    return false;
  }
  return true;
}

class FileUpload extends PureComponent {
  static defaultProps = {
    max: 1,
    value: [],
    listType: 'picture-card',
    action: 'https://service.dameiweb.com/VISACENTER-PROGRAM/ossUpload/save', // 可以自定义
    uploadBtnText: '上传照片',
    compressPic: false, // 是否压缩图片
    getUrl: null, // 调用方获取自定义接口返回值中的附件url，getUrl若为null，则用默认值
    getThumbUrl: null, // 调用方获取自定义接口返回值中附件缩略图的url,不传则优先用getUrl，getUrl若为null，则用默认值
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
    const { onChange, getUrl, getThumbUrl } = this.props;

    // if (file.status==="error") {
    //   message.error("文件上传失败！");
    // }

    const newValue = fileList
      .map(item => {
        if (item.status === 'done') {
          // 如果自定义了返回值解析接口，则使用自定义解析接口，否则按默认格式解析
          return {
            ...item,
            url: getUrl ? getUrl(item) : item.response.data,
            // eslint-disable-next-line
            thumbUrl: getThumbUrl ? getThumbUrl(item) : getUrl ? getUrl(item) : item.response.data,
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
    const { compressPic } = this.props;
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/bmp' ||
      file.type === 'image/jpg';
    if (isJpgOrPng && compressPic) {
      // console.log('file',file);
      const p = compress(file);

      // 官方文档 ：参数为上传的文件，函数若返回 false 则停止上传。
      // 支持返回一个 Promise 对象，
      // Promise 对象 reject 时则停止上传
      // resolve 时开始上传（ resolve 传入 File 或 Blob 对象则上传 resolve 传入对象）。

      // console.log(p);
      return p;
    }
    return file;
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
          beforeUpload={this.beforeUpload}
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
