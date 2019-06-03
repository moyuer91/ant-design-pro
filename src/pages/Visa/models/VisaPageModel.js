import { message } from 'antd/lib/index';
import { getVisaPage, saveVisaPage } from '../../../services/visa/VisaFormService';
import { getCheckedData } from '@/utils/VisaUtils';

export default {
  namespace: 'visapage',

  state: {
    pageName: '',
    descr: '',
    elements: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getVisaPage, payload);
      const pageInfo = getCheckedData(response);
      const { elements } = pageInfo;
      for (let i = 0; i < elements.length; i += 1) {
        const elem = elements[i];
        elem.rules = JSON.parse(elem.rules);
        elem.options = JSON.parse(elem.options);
      }
      yield put({
        type: 'getPage',
        payload: { ...pageInfo },
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
