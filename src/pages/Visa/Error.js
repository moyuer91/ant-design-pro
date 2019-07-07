import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import Result from '@/components/Result';
import router from 'umi/router';

class Error extends PureComponent {
  render() {
    const {
      location: { query },
    } = this.props;
    const { id } = query;
    const actions = (
      <Button
        type="primary"
        onClick={() => {
          router.push(`/visa/applform/${id}`);
        }}
      >
        返回修改
      </Button>
    );

    return (
      <Card bordered={false}>
        <Result
          type="error"
          title="提交失败"
          description="服务器提交错误，请返回修改并重新提交！"
          actions={actions}
          style={{ marginTop: 48, marginBottom: 16 }}
        />
      </Card>
    );
  }
}

export default Error;
