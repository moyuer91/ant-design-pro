import { message } from 'antd/lib/index';
import { getVisaPage, saveVisaPage } from '../../../services/visa/VisaFormService';
import { getCheckedData, isSuccessful } from '@/utils/VisaUtils';

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
        try {
          elem.rules = elem.rules ? JSON.parse(elem.rules) : '';
          elem.options = elem.options ? JSON.parse(elem.options) : '';
          elem.displayWhen = elem.displayWhen ? JSON.parse(elem.displayWhen) : '';
        } catch (e) {
          message.error(e.toString());
        }
      }
      yield put({
        type: 'getPage',
        payload: { ...pageInfo },
      });
    },
    *save({ payload }, { call }) {
      const { pageId, prjId, values, elementsMap } = payload;
      const data = [];
      Object.keys(values).forEach(key => {
        let finalValue = values[key];
        if (elementsMap[key]) {
          const { type } = elementsMap[key];
          if (type === 20) {
            // 表格类元素需要特殊处理
            finalValue = JSON.stringify(values[key].tableData);
          } else if (type === 4) {
            // 日期控件 需要将moment转为 YYYYMMDD
            finalValue = values[key].format('YYYYMMDD');
          } else if (type === 5) {
            // 时间控件 将moment转为 HHmmss
            finalValue = values[key].format('HHmmss');
          } else if (type === 11) {
            finalValue = JSON.stringify(values[key]);
          } else if (type === 9) {
            // checkbox的数据需要序列化
            finalValue = JSON.stringify(values[key]);
          } else if (type === 12) {
            // uploader的数据需要序列化
            const fileList = values[key];
            const saveFileList = fileList.map(item => ({
              uid: item.uid,
              name: item.name,
              status: item.status,
              url: item.url,
            }));
            finalValue = JSON.stringify(saveFileList);
          } else if (type === 13) {
            finalValue = JSON.stringify(values[key]);
          }
        }
        data.push({
          pageElemId: key,
          value: finalValue,
          storageId: elementsMap[key].storageId,
        });
      });

      const response = yield call(saveVisaPage, { id: pageId, prjId, data });
      if (isSuccessful(response)) {
        message.success('保存成功');
        // yield put({
        //   type: 'fetch',
        //   payload: {
        //     projectId:prjId,
        //     pageId,
        //   },
        // });
      } else {
        message.error(`保存失败:${response.msg}`);
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
