import request from '@/utils/request';
import { stringify } from 'qs';

export async function getVisaForm() {
  return request('/visa/form');
}

export async function getVisaPage(params) {
  return request(`/visa/page?${stringify(params)}`);
}

export async function saveVisaPage(params) {
  return request('/visa/page', {
    method: 'POST',
    body: params,
  });
}

export async function submitVisaForm(params) {
  return request('/visa/form', {
    method: 'POST',
    body: params,
  });
}
