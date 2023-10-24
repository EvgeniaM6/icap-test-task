import { Alert, Button, DatePicker, Form, Input } from 'antd';
import { TextInput } from '../loginForm/TextInput';
import { useState } from 'react';
import {
  ErrMessagesObj,
  ErrorResponse,
  NewItemFormProps,
  NewTableData,
  NewTableItemFields,
} from '../../models';
import { getNewTableData, tryAddDataToTable } from '../../utils';
import { RESPONSE_STATUS, TIMER_LOGIN } from '../../constants';

const { Item } = Form;

export const NewItemForm = (props: NewItemFormProps) => {
  const { setIsLoadingTable } = props;

  const [isWrongLoginData, setIsWrongLoginData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMessagesArr, setErrMessagesArr] = useState<string[]>([]);

  const [formElem] = Form.useForm();

  const getErrMessagesArr = (respBody: ErrMessagesObj): string[] => {
    return Object.values(respBody).reduce((prevErrMessArr: string[], errMessArr: string[]) => {
      const currentErrMessArr = errMessArr.reduce((prevArr: string[], errMess: string) => {
        prevArr.push(errMess);
        return prevArr;
      }, []);

      const concatedErrMessArr = prevErrMessArr.concat(currentErrMessArr);
      return concatedErrMessArr;
    }, []);
  };

  const handleConfirm = async (values: NewTableItemFields): Promise<void> => {
    const newTableData: NewTableData = getNewTableData(values);

    setIsLoading(true);
    const response: Response | ErrorResponse = await tryAddDataToTable(newTableData);

    setIsLoading(false);

    if (response.status !== RESPONSE_STATUS.Created) {
      if ((response as ErrorResponse).error) {
        const err = (response as ErrorResponse).error;
        setErrMessagesArr([(err as Error).message]);
      } else {
        const respBody: ErrMessagesObj = await (response as Response).json();

        const newErrMessagesArr: string[] = getErrMessagesArr(respBody);
        setErrMessagesArr(newErrMessagesArr);
      }

      setIsWrongLoginData(true);
      setTimeout(() => {
        setIsWrongLoginData(false);
      }, TIMER_LOGIN);
      return;
    }

    setIsLoadingTable(true);
    setTimeout(() => {
      setIsLoadingTable(false);
    }, 0);
  };

  return (
    <Form form={formElem} onFinish={handleConfirm} style={{ maxWidth: 600 }}>
      <TextInput labelName="Name" isRequired={true}>
        <Input placeholder="Alex" allowClear />
      </TextInput>
      <TextInput labelName="Email" isRequired={true}>
        <Input placeholder="example@email.ua" allowClear />
      </TextInput>
      <TextInput labelName="Birthday" isRequired={true}>
        <DatePicker allowClear />
      </TextInput>
      <TextInput labelName="Phone" isRequired={true}>
        <Input placeholder="0123456789" allowClear />
      </TextInput>
      <TextInput labelName="Address" isRequired={false}>
        <Input placeholder="Ukraine, Kharkiv, Sumskaya str., 10" allowClear />
      </TextInput>
      <Item>
        <Button type="primary" htmlType="submit" disabled={isWrongLoginData} loading={isLoading}>
          Confirm
        </Button>
      </Item>
      {isWrongLoginData &&
        !!errMessagesArr.length &&
        errMessagesArr.map((errMess) => {
          return (
            <Alert showIcon message={errMess} type="error" closable key={errMess.slice(0, 10)} />
          );
        })}
    </Form>
  );
};
