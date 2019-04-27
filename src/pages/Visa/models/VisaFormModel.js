import { getVisaPage,saveVisaPage,submitVisaPage } from '@/services/visa/visaFormService';
import {message} from "antd/lib/index";

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
      message.success('保存成功');
    },
    *submitPage({ payload }, { call }) {
      const response = yield call(submitVisaPage, payload);
      message.success('提交成功');
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
