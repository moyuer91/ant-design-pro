import request from '@/utils/request';

export async function getVisaForm() {
  return request('/visa/form');
}

export async function getVisaPage() {
  return request('/visa/page');
}

export async function saveVisaPage(params) {
  return request('/visa/page', {
    method: 'POST',
    body: params,
  });
}

export async function submitVisaPage(params) {
  return request('/visa/submission', {
    method: 'POST',
    body: params,
  });
}
