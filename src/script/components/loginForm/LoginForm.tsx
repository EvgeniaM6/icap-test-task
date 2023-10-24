import { Alert, Button, Form, Input } from 'antd';
import { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { LoginFormValues, ErrorResponse } from '../../models';
import { tryLogin } from '../../utils';
import { RESPONSE_STATUS, TIMER_LOGIN } from '../../constants';
import { TextInput } from './TextInput';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const { Item } = Form;

export const LoginForm = () => {
  const [isWrongLoginData, setIsWrongLoginData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formElem] = Form.useForm();

  const navigate: NavigateFunction = useNavigate();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    if (isWrongLoginData) {
      return;
    }

    setIsLoading(true);

    const response: Response | ErrorResponse = await tryLogin(values);
    setIsLoading(false);

    console.log('response.status=', response.status);
    if (response.status !== RESPONSE_STATUS.Ok) {
      setIsWrongLoginData(true);
      setTimeout(() => {
        setIsWrongLoginData(false);
      }, TIMER_LOGIN);
      return;
    }

    navigate('/table');
  };

  //TODO: add timer for button Login

  return (
    <Form form={formElem} onFinish={handleLogin} style={{ maxWidth: 600 }}>
      <TextInput labelName="Username" isRequired={true}>
        <Input prefix={<UserOutlined />} placeholder="superuser" allowClear />
      </TextInput>
      <TextInput labelName="Password" isRequired={true}>
        <Input.Password prefix={<LockOutlined />} placeholder="superpassword" allowClear />
      </TextInput>
      <Item>
        <Button type="primary" htmlType="submit" disabled={isWrongLoginData} loading={isLoading}>
          Log in
        </Button>
      </Item>
      {isWrongLoginData && (
        <Alert showIcon message="Username or password is wrong. Try again" type="error" closable />
      )}
    </Form>
  );
};
