import request from '@/utils/request';
// import { stringify } from 'qs';

// const urlPrefix = 'https://service.dameiweb.com/XPAGE';
const urlPrefix = '';

export async function getVisaProject(params) {
  const { projectId } = params;
  return request(`${urlPrefix}/visaservice/projects/${projectId}`);
}

export async function getVisaProjectPreview(params) {
  const { projectId } = params;
  console.log(`projectId:${projectId}`);
  return request(`${urlPrefix}/visaservice/projects/${projectId}/preview`);
}

export async function getVisaPage(params) {
  const { pageId, projectId } = params;
  return request(`${urlPrefix}/visaservice/projects/${projectId}/pages/${pageId}`);
}

export async function saveVisaPage(params) {
  return request(`${urlPrefix}/visaservice/pages/data`, {
    method: 'POST',
    body: params,
  });
}

export async function submitVisaProject(params) {
  const { projectId } = params;
  return request(`${urlPrefix}/visaservice/projects/${projectId}/application`, {
    method: 'POST',
    body: params,
  });
}

export async function translate(params) {
  const { projectId } = params;
  return request(
    `https://service.dameiweb.com/XPAGE/visaservice/projects/${projectId}/translation`,
    {
      method: 'POST',
      body: params,
    }
  );
}
