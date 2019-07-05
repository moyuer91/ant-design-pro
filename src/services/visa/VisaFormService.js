import request from '@/utils/request';
// import { stringify } from 'qs';

export async function getVisaProject(params) {
  const { projectId } = params;
  console.log(`projectId:${projectId}`);
  return request(`/visaservice/projects/${projectId}`);
}

export async function getVisaProjectPreview(params) {
  const { projectId } = params;
  console.log(`projectId:${projectId}`);
  return request(`/visaservice/projects/${projectId}/preview`);
}

export async function getVisaPage(params) {
  const { pageId, projectId } = params;
  return request(`/visaservice/projects/${projectId}/pages/${pageId}`);
}

export async function saveVisaPage(params) {
  return request('/visaservice/pages/data', {
    method: 'POST',
    body: params,
  });
}

export async function submitVisaProject(params) {
  const { projectId } = params;
  return request(`/visaservice/projects/${projectId}/application`, {
    method: 'POST',
    body: params,
  });
}
