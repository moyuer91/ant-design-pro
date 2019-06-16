import { message } from 'antd/lib/index';
import { getVisaProject, submitVisaProject } from '../../../services/visa/VisaFormService';
import { getCheckedData } from '@/utils/VisaUtils';

export default {
  namespace: 'visaform',

  state: {
    id: -1,
    appOrderNo: '',
    title: '',
    description: '',
    activePageId: -1,
    lastPageId: -2,
    hasNext: true,
    hasPrevious: false,
    pages: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getVisaProject, payload);
      const project = getCheckedData(response);
      // 第一个页面的pageId作为默认打开的page
      const { pages } = project;
      let activePageId = -1;
      let lastPageId = -2;
      let firstPageId = -2;
      if (pages && pages.length > 0) {
        activePageId = project.pages[0].id;
        firstPageId = project.pages[0].id;
        lastPageId = project.pages[pages.length - 1].id;
      }

      yield put({
        type: 'getForm',
        payload: { ...project, activePageId, lastPageId, firstPageId },
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
    switchTab(state, action) {
      return {
        ...state,
        ...action.payload,
        hasNext: !(action.payload.activePageId === state.lastPageId),
        hasPrevious: !(action.payload.activePageId === state.firstPageId),
      };
    },
  },
};
