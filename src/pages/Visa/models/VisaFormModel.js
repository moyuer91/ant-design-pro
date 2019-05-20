import { message } from 'antd/lib/index';
import { getVisaProject, submitVisaProject } from '../../../services/visa/VisaFormService';

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
      const response = yield call(getVisaProject, payload);
      yield put({
        type: 'getForm',
        payload: { ...response },
      });
    },
    *submitForm({ payload }, { call }) {
      const response = yield call(submitVisaProject, payload);
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
