import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { getToken } from '@/utils/authority';
import { isSuccessful } from '@/utils/VisaUtils';

const { Option } = Select;

class CitySelect extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchCity = debounce(this.fetchCity, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchCity = value => {
    this.setState({ data: [], fetching: true });
    const cityName = value || '';
    const options = {
      method: 'GET',
      headers: {
        DM_AUTH: getToken(),
      },
    };
    fetch(`https://service.dameiweb.com/MT/district/queryAllCity?cityName=${cityName}`, options)
      .then(response => response.json())
      .then(body => {
        let data = [];
        if (isSuccessful(body)) {
          data = body.data
            ? body.data.map(city => ({
                text: city.name,
                value: city.name,
              }))
            : [];
        }
        this.setState({ data, fetching: false });
      });
  };

  handleChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <Select
        showSearch
        maxTagCount={10}
        allowClear
        value={value}
        placeholder="请输入城市名"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchCity}
        onChange={this.handleChange}
        onFocus={this.fetchCity}
        style={{ width: '100%' }}
      >
        {data && data.map(d => <Option key={d.value}>{d.text}</Option>)}
      </Select>
    );
  }
}

export default CitySelect;
