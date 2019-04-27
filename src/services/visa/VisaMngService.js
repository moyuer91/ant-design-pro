import request from '@/utils/request';
import { stringify } from 'qs';

export async function createVisaApplication(params) {
  return request('/visa/application', {
    method: 'POST',
    body: params,
  });
}

export async function getVisaList(params) {
  return request(`/visa/visa-list?${stringify(params)}`);
}

export async function getVisaInitInfo(params) {
  return request(`/visa/visa-init-info?${stringify(params)}`);
}
