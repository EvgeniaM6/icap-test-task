import { Alert, Button, DatePicker, Form, Input, message } from 'antd';
import { TextInput } from '../loginForm/TextInput';
import { useState } from 'react';
import { ErrorResponse, NewItemFormProps, NewTableData, NewTableItemFields } from '../../models';
import { getErrMessage, getNewTableData, tryAddDataToTable } from '../../utils';
import { RESPONSE_STATUS, TIMER_LOGIN } from '../../constants';

const { Item } = Form;

export const NewItemForm = (props: NewItemFormProps) => {
  const { reloadTable } = props;

  const [isWrongNewTableItem, setIsWrongNewTableItem] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMessagesArr, setErrMessagesArr] = useState<string[]>([]);

  const [messageApi, contextHolder] = message.useMessage();
  const [formElem] = Form.useForm();

  const handleConfirm = async (values: NewTableItemFields): Promise<void> => {
    const newTableData: NewTableData = getNewTableData(values);

    setIsLoading(true);
    const response: Response | ErrorResponse = await tryAddDataToTable(newTableData);

    setIsLoading(false);

    if (response.status !== RESPONSE_STATUS.Created) {
      const newErrMessagesArr: string[] = await getErrMessage(response);
      setErrMessagesArr(newErrMessagesArr);

      setIsWrongNewTableItem(true);
      setTimeout(() => {
        setIsWrongNewTableItem(false);
      }, TIMER_LOGIN);
      return;
    }

    messageApi.open({
      type: 'success',
      content: 'New table data is saved successful',
    });
    formElem.resetFields();
    reloadTable();
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
