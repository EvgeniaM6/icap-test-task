import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import { useState } from 'react';

const { Item } = Form;

export const LoginForm = () => {
  const [isWrongLoginData, setIsWrongLoginData] = useState(false);

  const [formElem] = Form.useForm();

  const handleLogin = (): void => {
    console.log('handleLogin');
    setIsWrongLoginData(true);
  };

  return (
    <Form form={formElem} onFinish={handleLogin} style={{ maxWidth: 600 }}>
      <Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'enter your username',
          },
        ]}
        tooltip="enter your username"
      >
        <Input prefix={<UserOutlined />} placeholder="superuser" allowClear />
      </Item>
      <Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'enter your password',
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="superpassword" allowClear />
      </Item>
      <Item>
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Item>
      {isWrongLoginData && (
        <Alert
          showIcon
          message="Username or password is wrong. Try enter again"
          type="error"
          closable
        />
      )}
    </Form>
  );
};
