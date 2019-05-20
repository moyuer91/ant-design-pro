function getForm(req, res, u) {
  const pages = [
    {
      pageNo: 1,
      id: '1',
      pageName: '基本信息',
      descr: '基本信息详细描述',
    },
    {
      pageNo: 2,
      id: '2',
      pageName: '入境信息',
      descr: '入境信息详细描述',
    },
    {
      pageNo: 3,
      id: '3',
      pageName: '家庭信息',
      descr: '入境信息详细描述',
    },
    {
      pageNo: 4,
      id: '4',
      pageName: '工作信息',
      descr: '入境信息详细描述',
    },
    {
      pageNo: 5,
      id: '5',
      pageName: '健康信息',
      descr: '健康信息详细描述',
    },
    {
      pageNo: 6,
      id: '6',
      pageName: '政治信息',
      descr: '政治信息详细描述',
    },
  ];

  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const result = {
    title: '美国签证申请单',
    description: '美国签证申请单填写注意balabla',
    pages,
  };
  return res.json(result);
}

export default {
  'GET /visaservice/project': getForm,
  'POST /visaserivce/project': {
    errorNo: 0,
    errorMsg: '',
  },
};
