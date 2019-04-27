import { message } from 'antd/lib/index';
import { getVisaPage, saveVisaPage } from '../../../services/visa/VisaFormService';

export default {
  namespace: 'visapage',

  state: {
    title: '',
    content: '',
    elems: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getVisaPage, payload);
      yield put({
        type: 'getPage',
        payload: { ...response },
      });
    },
    *savePage({ payload }, { call }) {
      const response = yield call(saveVisaPage, payload);
      if (response.errorNo === '0') {
        message.success('保存成功');
      } else {
        message.error('保存失败');
      }
    },
  },

  reducers: {
    getPage(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
