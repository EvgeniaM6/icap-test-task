import { Alert, Button, DatePicker, Form, Input, message } from 'antd';
import { TextInput } from '../loginForm/TextInput';
import { useEffect, useState } from 'react';
import { NewItemFormProps, NewTableData, NewTableItemFields } from '../../models';
import { getErrMsgFromApi, getNewTableData } from '../../utils';
import { TIMER_LOGIN } from '../../constants';
import { useAddDataToTableMutation } from '../../redux/tableApi';

const { Item } = Form;

export const NewItemForm = (props: NewItemFormProps) => {
  const { reloadTable } = props;

  const [isWrongNewTableItem, setIsWrongNewTableItem] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMessagesArr, setErrMessagesArr] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(TIMER_LOGIN / 1000);

  const [addDataToTable, { isSuccess, error, data, status, reset }] = useAddDataToTableMutation();

  const [messageApi, contextHolder] = message.useMessage();
  const [formElem] = Form.useForm();

  const handleConfirm = async (values: NewTableItemFields): Promise<void> => {
    const newTableData: NewTableData = getNewTableData(values);

    setIsLoading(true);
    await addDataToTable(newTableData);
  };

  useEffect(() => {
    if (status === 'pending' || status === 'uninitialized') return;

    setIsLoading(false);

    if (!isSuccess && error) {
      const errMsg: string[] = getErrMsgFromApi(error);
      setErrMessagesArr(errMsg);

      const intervalId = setInterval(() => {
        runTimeout();
      }, 1000);

      setIsWrongNewTableItem(true);
      setTimeout(() => {
        setIsWrongNewTableItem(false);
        clearInterval(intervalId);
        setTimer(TIMER_LOGIN / 1000);
      }, TIMER_LOGIN);

      return;
    }

    messageApi.open({
      type: 'success',
      content: 'New table data is saved successful',
    });

    formElem.resetFields();
    reloadTable();

    reset();
  }, [isSuccess, error, data, status]);

  const runTimeout = () => {
    setTimer((prevTime) => {
      if (prevTime > 0) {
        return prevTime - 1;
      }
      return prevTime;
    });
  };

  return (
    <Form form={formElem} onFinish={handleConfirm} style={{ maxWidth: 600 }}>
      {contextHolder}
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
        <Button type="primary" htmlType="submit" disabled={isWrongNewTableItem} loading={isLoading}>
          Confirm
        </Button>
        {isWrongNewTableItem && !!errMessagesArr.length && <div>{timer}</div>}
      </Item>
      {isWrongNewTableItem &&
        !!errMessagesArr.length &&
        errMessagesArr.map((errMess) => {
          return (
            <Alert showIcon message={errMess} type="error" closable key={errMess.slice(0, 10)} />
          );
        })}
    </Form>
  );
};
