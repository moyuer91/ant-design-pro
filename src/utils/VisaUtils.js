import { notification } from 'antd/lib/index';

/**
 * 获取返回码
 */
export function getRetCod(response) {
  return response.errno;
}

/**
 * 判断是否成功
 */
export function isSuccessful(response) {
  const { success } = response;
  if (success === true) {
    return true;
  }
  return false;
}

/**
 * 获取返回数据
 */
export function getResponseData(response) {
  if (isSuccessful(response)) {
    return response.data;
  }
  return response.msg;
}

/**
 * 校验并返回数据,若失败则抛出错误
 */
export function getCheckedData(response) {
  if (isSuccessful(response)) {
    return response.data;
  }
  const errorText = `${response.msg}`;
  notification.error({
    message: `请求错误:${response.errno}`,
    description: errorText,
  });

  const error = new Error(errorText);
  error.name = response.msg;
  error.response = response;
  throw error;
}
