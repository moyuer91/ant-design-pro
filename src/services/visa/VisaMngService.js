import request from '@/utils/request';
import { stringify } from 'qs';

export async function createVisaApplication(params) {
  return request('/visa/application', {
    method: 'POST',
    body: params,
  });
}

export async function getProjectList(params) {
  return request(`/visaservice/project-list?${stringify(params)}`);
}

export async function getMngInitInfo(params) {
  return request(`/visaservice/mng-init-info?${stringify(params)}`);
}
