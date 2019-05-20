import { parse } from 'url';

function getPage(req, res, u) {
  const elements1 = [
    {
      id: '1',
      seqNo: 1,
      type: 1,
      label: '姓',
      initialValue: '张',
      displayWhen: null,
      options: null,
      tip: '身份证上的名',
      rules: [
        {
          required: true,
          message: '请填写申请人的姓',
        },
      ],
      placeholder: '请输入',
    },
    {
      id: '2',
      seqNo: 2,
      type: 1,
      label: '名',
      initialValue: '三',
      displayWhen: null,
      options: null,
      tip: '身份证上的名',
      rules: [
        {
          required: true,
          message: '请填写申请人的名',
        },
      ],
      placeholder: '请输入',
    },
    {
      id: '3',
      seqNo: 3,
      type: 2,
      label: '性别',
      initialValue: 1,
      displayWhen: null,
      options: [
        {
          label: '男',
          value: 1,
        },
        {
          label: '女',
          value: 2,
        },
        {
          label: '其他',
          value: 3,
        },
      ],
      tip: '申请人性别',
      rules: [
        {
          required: true,
          message: '请选择申请人性别',
        },
      ],
      placeholder: null,
    },
    {
      id: '5',
      seqNo: 5,
      type: 2,
      label: '工作状态',
      value: null,
      displayWhen: null,
      options: [
        {
          label: '学生',
          value: 1,
        },
        {
          label: '企业员工',
          value: 2,
        },
        {
          label: '个体户',
          value: 3,
        },
      ],
      tip: '工作状态',
      rules: [
        {
          required: true,
          message: '请选择申请人工作状态',
        },
      ],
      placeholder: null,
    },
    {
      id: '6',
      seqNo: 6,
      type: 1,
      label: '工作单位',
      value: null,
      displayWhen: {
        id: 6,
        value: 2,
      },
      options: null,
      tip: '工作单位',
      rules: [
        {
          required: true,
          message: '请选择申请人工作单位',
        },
      ],
      placeholder: '请输入',
    },
    {
      id: '4',
      seqNo: 4,
      type: 2,
      label: '婚姻状态',
      value: null,
      displayWhen: null,
      options: [
        {
          label: '未婚',
          value: 1,
        },
        {
          label: '已婚',
          value: 2,
        },
      ],
      tip: '申请人性别',
      rules: [
        {
          required: true,
          message: '请选择申请人婚姻状态',
        },
      ],
      placeholder: null,
    },
  ];

  const elements2 = [
    {
      id: '7',
      seqNo: 7,
      type: 2,
      label: '是否求学',
      value: null,
      displayWhen: null,
      options: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      tip: '是否到当地上学',
      rules: [
        {
          required: true,
          message: '请选择至少一项',
        },
      ],
      placeholder: null,
    },
    {
      id: '8',
      seqNo: 8,
      type: 2,
      label: '是否访问亲友',
      value: null,
      displayWhen: null,
      options: [
        {
          label: '是',
          value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ],
      tip: '是否访问亲友',
      rules: [
        {
          required: true,
          message: '请选择至少一项',
        },
      ],
      placeholder: null,
    },
  ];

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  const pageList = [
    {
      title: '基本信息',
      content: '申请人基本信息，如姓名，性别等',
      elems: elements1,
    },
    {
      title: '入境信息',
      content: '入境信息,如访问目的,滞留时间等',
      elems: elements2,
    },
  ];
  const result = pageList[params.pageId - 1];
  return res.json(result);
}

export default {
  'GET /visaservice/page': getPage,
  'POST /visaservice/page': {
    errorNo: 0,
    errorMsg: '',
  },
};
