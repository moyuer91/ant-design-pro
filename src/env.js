const configs = {
  // 测试环境
  test: {
    UPLOAD_URL: 'https://service.dameiweb.com/VISACENTER-PROGRAM/ossUpload/save',
  },

  // 本地环境
  local: {
    UPLOAD_URL: 'https://service.dameiweb.com/VISACENTER-PROGRAM/ossUpload/save',
  },

  // 开发环境
  dev: {
    UPLOAD_URL: 'https://service.dameiweb.com/VISACENTER-PROGRAM/ossUpload/save',
  },

  // 生产
  prd: {
    UPLOAD_URL: 'https://service.dameiweb.com/VISACENTER-PROGRAM/ossUpload/save',
  },
};

console.log(process.env.API_ENV);
// 默认是本地环境
const API_ENV = process.env.API_ENV ? process.env.API_ENV : 'local';
const env = configs[API_ENV];
export default env;
