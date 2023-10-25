import { useEffect, useState } from 'react';
import { getArgsProps, getErrMessagesArr, getNewTableData } from '../../utils';
import {
  TableItemFields,
  NewTableData,
  TableData,
  TableItemsForm,
  ErrValidateForm,
} from '../../models';
import { Button, Form, Table, message } from 'antd';
import { getColumns } from './tableColumns';
import { NewItemForm } from './NewItemForm';
import { EditableCell } from './EditableCell';
import dayjs, { Dayjs } from 'dayjs';
import { ArgsProps } from 'antd/es/message';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { resetEditingKey, setEditingKey } from '../../store/tableSlice';
import {
  useChangeTableItemMutation,
  useDeleteTableItemMutation,
  useGetTableDataQuery,
} from '../../redux/tableApi';

export const TableElem = () => {
  const [isAddTableData, setIsAddTableData] = useState<boolean>(false);

  const { editingKey } = useAppSelector((state) => state.table);
  const dispatch = useAppDispatch();

  const [
    deleteTableItem,
    {
      isSuccess: isSuccDelete,
      error: deleteRespErr,
      data: deleteRespData,
      status: statDelete,
      reset: resetDeleteReq,
    },
  ] = useDeleteTableItemMutation();
  const [
    changeTableItem,
    {
      isSuccess: isSuccChange,
      error: changeRespErr,
      data: changeRespData,
      status: statChange,
      reset: resetChangeReq,
    },
  ] = useChangeTableItemMutation();

  const [form] = Form.useForm<TableItemsForm>();

  const isEditing = (record: TableItemFields): boolean => record.key === editingKey;

  const editField = (record: Partial<TableItemFields> & { key: React.Key }): void => {
    const birthday: Dayjs = dayjs(record.birthday_date || '', 'DD-MM-YY');
    form.setFieldsValue({ ...record, birthday_date: birthday });
    dispatch(setEditingKey(record.key));
  };

  const [messageApi, contextHolder] = message.useMessage();

  const {
    data = {
      count: 0,
      results: [],
    },
    error,
    isError,
    isLoading,
    refetch,
  } = useGetTableDataQuery('');

  useEffect(() => {
    if (!isError || !error) return;

    let errMsg = 'Opps! Something went wrong! Try again';
    if ('message' in error) {
      errMsg = error.message || '';
    } else if ('error' in error) {
      errMsg = error.error;
    }

    messageApi.open({
      type: 'error',
      content: errMsg,
    });
  }, [isError, error]);

  const reloadTable = (): void => {
    refetch();
  };

  const handleAddData = (): void => {
    setIsAddTableData((prevValue: boolean) => !prevValue);
  };

  const handleDelete = async (id: number): Promise<void> => {
    await deleteTableItem(id);
  };

  useEffect(() => {
    if (statDelete === 'pending' || statDelete === 'uninitialized') return;

    const msgArgsProps: ArgsProps = getArgsProps(
      deleteRespErr || deleteRespData,
      isSuccDelete,
      'deleted'
    );
    messageApi.open(msgArgsProps);

    reloadTable();

    resetDeleteReq();
  }, [isSuccDelete, deleteRespErr, deleteRespData, statDelete]);

  const handleCancel = (): void => {
    dispatch(resetEditingKey());
  };

  const handleSave = async (id: number): Promise<void> => {
    try {
      const row: TableItemsForm = await form.validateFields();
      const { birthday_date, phone_number, ...restValues } = row;

      const values: NewTableData = getNewTableData({
        ...restValues,
        birthday: birthday_date as unknown as Dayjs,
        phone: phone_number,
      });

      await changeTableItem({ id, ...values });
    } catch (error: unknown) {
      if ((error as ErrValidateForm).errorFields) {
        const errMsgsArr = getErrMessagesArr(error as ErrValidateForm);
        messageApi.open({
          type: 'error',
          content: errMsgsArr,
        });
      }
    }
  };

  useEffect(() => {
    if (statChange === 'pending' || statChange === 'uninitialized') return;

    const msgArgsProps: ArgsProps = getArgsProps(
      changeRespErr || changeRespData,
      isSuccChange,
      'changed'
    );
    messageApi.open(msgArgsProps);

    if (isSuccChange) {
      handleCancel();
      reloadTable();
    }

    resetChangeReq();
  }, [isSuccChange, changeRespErr, changeRespData, statChange]);

  const columns = getColumns(isEditing, handleDelete, handleCancel, handleSave, editField);

  return (
    <>
      <div>pages: {Math.ceil(data.count / 10)}</div>
      <Button onClick={() => reloadTable()}>Reload</Button>
      {contextHolder}
      <Form form={form}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={data.results.map((tableItem: TableData) => {
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
