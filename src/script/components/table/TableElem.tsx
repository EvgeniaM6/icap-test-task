import { useEffect, useState } from 'react';
import {
  getErrMessagesArr,
  getNewTableData,
  tryChangeTableItem,
  tryDeleteTableItem,
  tryGetTable,
} from '../../utils';
import { ErrorResponse, TableResponse, ErrDeleteMessageObj, TableItemFields } from '../../models';
import { RESPONSE_STATUS } from '../../constants';
import { ErrMessagesObj, TableData } from '../../models/response.model';
import { Button, Form, Table, message } from 'antd';
import { getColumns } from './tableColumns';
import { NewItemForm } from './NewItemForm';
import { EditableCell } from './EditableCell';
import dayjs, { Dayjs } from 'dayjs';

export const TableElem = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [tableItemsCount, setTableItemsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddTableData, setIsAddTableData] = useState<boolean>(false);
  const [editingKey, setEditingKey] = useState('');

  const [form] = Form.useForm();

  const isEditing = (record: TableItemFields) => record.key === editingKey;

  const editField = (record: Partial<TableItemFields> & { key: React.Key }) => {
    const birthday = dayjs(record.birthday_date || '', 'DD-MM-YY');
    form.setFieldsValue({ ...record, birthday_date: birthday });
    setEditingKey(record.key);
  };

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    tryGetTable()
      .then((response: Response | ErrorResponse) => {
        if (response.status !== RESPONSE_STATUS.Ok) {
          throw new Error('Opps! something went wrong');
        }

        return (response as Response).json();
      })
      .then((data: TableResponse) => {
        const { count, results } = data;

        setTableItemsCount(count);
        setTableData(results);

        setIsLoading(false);
      })
      .catch(() => {
        //TODO: popup with err
        setIsLoading(false);
      });
  }, [isLoading]);

  const reloadTable = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  };

  const handleAddData = () => {
    setIsAddTableData((prevValue) => !prevValue);
  };

  const handleDelete = async (id: number) => {
    const response = await tryDeleteTableItem(id);

    if (response.status !== RESPONSE_STATUS.Deleted) {
      console.log('not Deleted');
      let errContent;

      if ((response as ErrorResponse).error) {
        const err = (response as ErrorResponse).error;
        errContent = (err as Error).message;
      } else {
        const respBody: ErrDeleteMessageObj = await (response as Response).json();
        console.log('respBody=', respBody);

        errContent = respBody.detail;
      }
      messageApi.open({
        type: 'error',
        content: errContent,
      });

      return;
    }

    messageApi.open({
      type: 'success',
      content: 'Item successful deleted',
    });

    reloadTable();
  };

  const handleCancel = () => {
    setEditingKey('');
  };

  const handleSave = async (id: number): Promise<void> => {
    try {
      const row = (await form.validateFields()) as TableItemFields;
      const { birthday_date, phone_number, ...restValues } = row;

      const values = getNewTableData({
        ...restValues,
        birthday: birthday_date as unknown as Dayjs,
        phone: phone_number,
      });

      const response: Response | ErrorResponse = await tryChangeTableItem(id, values);

      if (response.status !== RESPONSE_STATUS.Ok) {
        let errContent;

        if ((response as ErrorResponse).error) {
          const err = (response as ErrorResponse).error;
          errContent = (err as Error).message;
        } else {
          const respBody: ErrMessagesObj = await (response as Response).json();
          const newErrMessagesArr: string[] = getErrMessagesArr(respBody);

          errContent = newErrMessagesArr.join(' ');
        }
        messageApi.open({
          type: 'error',
          content: errContent,
        });

        return;
      }

      messageApi.open({
        type: 'success',
        content: 'Item successful changed',
      });

      handleCancel();
      reloadTable();
    } catch (error) {
      console.log('error=', error);
    }
  };

  const columns = getColumns(isEditing, handleDelete, handleCancel, handleSave, editField);

  return (
    <>
      <div>{tableItemsCount}</div>
      <div>TableElem</div>
      {contextHolder}
      <Form form={form}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={tableData.map((tableItem: TableData) => {
            return {
              key: tableItem.id.toString(),
              ...tableItem,
            };
          })}
          columns={columns}
          loading={isLoading}
          pagination={false}
        />
      </Form>
      <Button onClick={handleAddData} type="primary">
        Add data
      </Button>
      {isAddTableData && <NewItemForm reloadTable={reloadTable} />}
    </>
  );
};
