import { message } from 'antd/lib/index';
import { getVisaForm, submitVisaForm } from '../../../services/visa/VisaFormService';

export default {
  namespace: 'visaform',

  state: {
    title: '',
    description: '',
    activePageId: 1,
    pages: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getVisaForm, payload);
      yield put({
        type: 'getForm',
        payload: { ...response },
      });
    },
    *submitForm({ payload }, { call }) {
      const response = yield call(submitVisaForm, payload);
      if (response.errorNo === '0') {
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    },
  },

  reducers: {
    getForm(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
