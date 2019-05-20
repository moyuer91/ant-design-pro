import { getProjectList, getMngInitInfo } from '@/services/visa/VisaMngService';

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
      const visaList = yield call(getProjectList, payload);
      for (let i = 0; i < visaList.length; i += 1) {
        const visa = visaList[i];
        const { prjCfg } = visa;
        visa.key = visa.id;
        visa.country = prjCfg.country;
        visa.type = prjCfg.type;
      }
      const initInfo = yield call(getMngInitInfo, payload);
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
