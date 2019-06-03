import request from '@/utils/request';
// import { stringify } from 'qs';

export async function getVisaProject(params) {
  const { projectId } = params;
  console.log(`projectId:${projectId}`);
  return request(`/visaservice/projects/${projectId}`);
}

export async function getVisaPage(params) {
  const { pageId } = params;
  return request(`/visaservice/pages/${pageId}`);
}

export async function saveVisaPage(params) {
  return request('/visaservice/pages', {
    method: 'POST',
    body: params,
  });
}

export async function submitVisaProject(params) {
  return request('/visaservice/projects', {
    method: 'POST',
    body: params,
  });
}
