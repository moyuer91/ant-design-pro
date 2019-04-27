import { getVisaList, getVisaInitInfo } from '@/services/visa/VisaMngService';

export default {
  namespace: 'visaList',

  state: {
    visaList: [],
    initInfo: {
      countryOptions: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const visaList = yield call(getVisaList, payload);
      const initInfo = yield call(getVisaInitInfo, payload);
      yield put({
        type: 'queryList',
        payload: {
          visaList,
          initInfo,
        },
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
