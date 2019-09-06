import request from '@/utils/request';
import { stringify } from 'qs';

const urlPrefix = 'https://service.dameiweb.com/XPAGE';

// const urlPrefix="";
export async function createVisaApplication(params) {
  return request('/visa/application', {
    method: 'POST',
    body: params,
  });
}

export async function getProjectList(params) {
  return request(`${urlPrefix}/visaservice/projects?${stringify(params)}`);
}

export async function getMngInitInfo(params) {
  return request(`${urlPrefix}/visaservice/mng_page/init_info?${stringify(params)}`);
}

export async function addProject(params) {
  return request(`${urlPrefix}/visaservice/projects`, {
    method: 'POST',
    body: params,
  });
}
