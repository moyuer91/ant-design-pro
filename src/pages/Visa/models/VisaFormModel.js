import { message } from 'antd/lib/index';
import { getVisaProject, submitVisaProject } from '../../../services/visa/VisaFormService';
import { getCheckedData } from '@/utils/VisaUtils';

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
      const project = getCheckedData(response);
      // 第一个页面的pageId作为默认打开的page
      const { pages } = project;
      let activePageId = 1;
      if (pages && pages.length > 0) {
        activePageId = project.pages[0].id;
      }
      yield put({
        type: 'getForm',
        payload: { ...project, activePageId },
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
