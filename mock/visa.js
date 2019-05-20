import { parse } from 'url';

function getVisaList(req, res, u) {
  const tableListDataSource = [
    {
      id: 1,
      prjCfg: {
        country: '美国',
        type: '商务',
      },
      applicant: '张三',
      city: '北京',
      createdAt: new Date(),
      status: 0,
    },
    {
      id: 2,
      prjCfg: {
        country: '法国',
        type: '旅游',
      },
      applicant: '李四',
      city: '杭州',
      createdAt: new Date(),
      status: 1,
    },
    {
      id: 3,
      prjCfg: {
        country: '意大利',
        type: '旅游',
      },
      applicant: '王五',
      city: '上海',
      createdAt: new Date(),
      status: 2,
    },
  ];
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.name) {
    dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };
  return res.json(result);
}

function getVisaInitInfo(req, res) {
  const countries = [
    {
      value: 'UK',
      label: '英国',
    },
    {
      value: 'FRA',
      label: '法国',
    },
    {
      value: 'AU',
      label: '澳大利亚',
    },
    {
      value: 'NZ',
      label: '新西兰',
    },
    {
      value: 'IN',
      label: '印度',
    },
    {
      value: 'JP',
      label: '日本',
    },
    {
      value: 'KR',
      label: '韩国',
    },
    {
      value: 'IT',
      label: '意大利',
    },
    {
      value: 'DE',
      label: '德国',
    },
    {
      value: 'CH',
      label: '瑞士',
    },
    {
      value: 'GR',
      label: '希腊',
    },
    {
      value: 'ES',
      label: '西班牙',
    },
    {
      value: 'HR',
      label: '克罗地亚',
    },
    {
      value: 'HU',
      label: '匈牙利',
    },
    {
      value: 'AT',
      label: '奥地利',
    },
    {
      value: 'RU',
      label: '俄罗斯',
    },
    {
      value: 'IL',
      label: '以色列',
    },
  ];
  const presentCities = [
    {
      value: 'BJ',
      label: '北京',
    },
    {
      value: 'SH',
      label: '上海',
    },
    {
      value: 'HZ',
      label: '杭州',
    },
    {
      value: 'GZ',
      label: '广州',
    },
    {
      value: 'SZ',
      label: '深圳',
    },
    {
      value: 'CD',
      label: '成都',
    },
  ];
  const types = [
    {
      value: '1',
      label: '旅游',
    },
    {
      value: '2',
      label: '商务',
    },
  ];
  const statusOpts = [
    {
      value: '0',
      label: '草稿',
    },
    {
      value: '1',
      label: '处理中',
    },
    {
      value: '2',
      label: '完成',
    },
    {
      value: '3',
      label: '异常',
    },
  ];
  return res.json({ countries, presentCities, types, statusOpts });
}

export default {
  'GET /visa/visa-list': getVisaList,
  'GET /visa/visa-init-info': getVisaInitInfo,
};
