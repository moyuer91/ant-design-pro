import { getVisaProjectPreview } from '../../../services/visa/VisaFormService';
import { getCheckedData } from '@/utils/VisaUtils';

export default {
  namespace: 'projPreview',

  state: {
    id: -1,
    appOrderNo: '',
    applicant: '',
    docNo: '',
    city: '',
    phone: '',
    descr: '',
    pagesData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getVisaProjectPreview, payload);
      const project = getCheckedData(response);
      yield put({
        type: 'preview',
        payload: { ...project },
      });
    },
  },

  reducers: {
    preview(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
