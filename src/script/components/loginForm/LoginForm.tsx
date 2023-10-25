import { Alert, Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { LoginFormValues } from '../../models';
import { TIMER_LOGIN } from '../../constants';
import { TextInput } from './TextInput';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useLogInMutation } from '../../redux/loginApi';

const { Item } = Form;

export const LoginForm = () => {
  const [isWrongLoginData, setIsWrongLoginData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(TIMER_LOGIN / 1000);

  const [formElem] = Form.useForm();

  const navigate: NavigateFunction = useNavigate();
  const [logIn, { isSuccess, error, data, status, reset }] = useLogInMutation();

  const handleLogin = async (values: LoginFormValues): Promise<void> => {
    if (isWrongLoginData) {
      return;
    }

    setIsLoading(true);
    await logIn(values);
  };

  useEffect(() => {
    if (status === 'pending' || status === 'uninitialized') return;

    setIsLoading(false);

    if (!isSuccess) {
      setIsWrongLoginData(true);
      const intervalId = setInterval(() => {
        runTimeout();
      }, 1000);

      setTimeout(() => {
        setIsWrongLoginData(false);
        clearInterval(intervalId);
        setTimer(TIMER_LOGIN / 1000);
      }, TIMER_LOGIN);
      return;
    }

    navigate('/table');
    reset();
  }, [isSuccess, error, data, status]);

  const runTimeout = () => {
    setTimer((prevTime) => {
      if (timer > 0) {
        return prevTime - 1;
      }
      return prevTime;
    });
  };

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
        {isWrongLoginData && <div>{timer}</div>}
      </Item>
      {isWrongLoginData && (
        <Alert showIcon message="Username or password is wrong. Try again" type="error" closable />
      )}
    </Form>
  );
};
