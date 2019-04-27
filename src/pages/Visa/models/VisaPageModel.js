import { getVisaPage } from '@/services/visa/visaFormService';

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
