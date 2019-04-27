function getForm(req, res, u) {
  const pages = [
    {
      seqNo: 1,
      id: '1',
      title: '基本信息',
      description: '基本信息详细描述',
    },
    {
      seqNo: 2,
      id: '2',
      title: '入境信息',
      description: '入境信息详细描述',
    },
    {
      seqNo: 3,
      id: '3',
      title: '家庭信息',
      description: '入境信息详细描述',
    },
    {
      seqNo: 4,
      id: '4',
      title: '工作信息',
      description: '入境信息详细描述',
    },
    {
      seqNo: 5,
      id: '5',
      title: '健康信息',
      description: '健康信息详细描述',
    },
    {
      seqNo: 6,
      id: '6',
      title: '政治信息',
      description: '政治信息详细描述',
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
  'GET /visa/form': getForm,
  'POST /visa/form': {
    errorNo: 0,
    errorMsg: '',
  },
};
