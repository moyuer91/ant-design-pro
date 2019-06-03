import { getProjectList, getMngInitInfo } from '@/services/visa/VisaMngService';
import { getCheckedData } from '@/utils/VisaUtils';

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
      const visaInfo = yield call(getProjectList, payload);
      const visaList = getCheckedData(visaInfo);
      for (let i = 0; i < visaList.length; i += 1) {
        const visa = visaList[i];
        visa.key = visa.id;
      }

      const initData = yield call(getMngInitInfo, payload);
      const initInfo = getCheckedData(initData);
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
