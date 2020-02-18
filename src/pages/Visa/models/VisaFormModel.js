import { routerRedux } from 'dva/router';
import {
  getVisaProject,
  submitVisaProject,
  translate,
} from '../../../services/visa/VisaFormService';
import { getCheckedData, isSuccessful } from '@/utils/VisaUtils';

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
        payload: {
          ...project,
          activePageId,
          lastPageId,
          firstPageId,
          hasNext: !(activePageId === lastPageId),
          hasPrevious: !(activePageId === firstPageId),
        },
      });
    },

    *translate({ payload, callback }, { call, put }) {
      const response = yield call(translate, payload);
      yield put({
        type: 'doNothing',
        payload: {},
      });
      if (callback) {
        callback(isSuccessful(response));
      }
    },

    *submit({ payload }, { call, put, select }) {
      const response = yield call(submitVisaProject, payload);
      const { appOrderNo, applicant, id } = yield select(state => state.visaform);
      const { backurl } = payload;
      yield put(
        routerRedux.push(
          isSuccessful(response)
            ? {
                pathname: '/visa/result/success',
                query: { appOrderNo, applicant, id, backurl },
              }
            : '/visa/result/error'
        )
      );
    },
  },

  reducers: {
    doNothing(state) {
      return {
        ...state,
      };
    },
    getForm(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    updateFinSts(state, action) {
      const { pageId, finished } = action.payload;
      const newPages = [...state.pages];
      for (let i = 0; i < newPages.length; i += 1) {
        // 将当前页面的finished状态修改为true
        if (newPages[i].id === pageId) {
          newPages[i].finished = finished;
          break;
        }
      }

      return {
        ...state,
        pages: newPages,
      };
    },
    switchTab(state, action) {
      const { activePageId: nextActivePageId } = action.payload;
      window.scroll(0, 0);
      return {
        ...state,
        // pages: newPages,
        activePageId: nextActivePageId,
        hasNext: !(action.payload.activePageId === state.lastPageId),
        hasPrevious: !(action.payload.activePageId === state.firstPageId),
      };
    },
  },
};
