import request from '@/utils/request';
import { stringify } from 'qs';

export async function createVisaApplication(params) {
  return request('/visa/application', {
    method: 'POST',
    body: params,
  });
}

export async function getProjectList(params) {
  return request(`/visaservice/projects?${stringify(params)}`);
}

export async function getMngInitInfo(params) {
  return request(`/visaservice/mng_page/init_info?${stringify(params)}`);
}
