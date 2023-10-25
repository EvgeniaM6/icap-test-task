import { useEffect, useState } from 'react';
import { getArgsProps, getErrMessagesArr, getNewTableData } from '../../utils';
import {
  TableItemFields,
  NewTableData,
  TableData,
  TableItemsForm,
  ErrValidateForm,
} from '../../models';
import { Button, Divider, Form, Table, message } from 'antd';
import { getColumns } from './tableColumns';
import { NewItemForm } from './NewItemForm';
import { EditableCell } from './EditableCell';
import dayjs, { Dayjs } from 'dayjs';
import { ArgsProps } from 'antd/es/message';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { resetEditingKey, setEditingKey, setNextPage, setPrevPage } from '../../store/tableSlice';
import {
  useChangeTableItemMutation,
  useDeleteTableItemMutation,
  useGetTableDataQuery,
} from '../../redux/tableApi';
import { PageManager } from './PageManager';

export const TableElem = () => {
  const [isAddTableData, setIsAddTableData] = useState<boolean>(false);
  const [currUrl, setCurrUrl] = useState<string>('');
  const [canChangePage, setCanChangePage] = useState<boolean>(true);

  const { editingKey, currPage } = useAppSelector((state) => state.table);
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
      next: null,
      previous: null,
      results: [],
    },
    error,
    isError,
    isLoading,
    refetch,
  } = useGetTableDataQuery(currUrl);

  useEffect(() => {
    setCanChangePage(true);
  }, [data]);

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

  const handlePrevPage = () => {
    if (!data.previous || !canChangePage) return;

    setCanChangePage(false);
    setCurrUrl(data.previous);
    dispatch(setPrevPage());
  };

  const handleNextPage = () => {
    if (!data.next || !canChangePage) return;

    setCanChangePage(false);
    setCurrUrl(data.next);
    dispatch(setNextPage());
  };

  const columns = getColumns(isEditing, handleDelete, handleCancel, handleSave, editField);

  return (
    <>
      {contextHolder}
      <PageManager
        canChangePage={canChangePage}
        currPage={currPage}
        data={data}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
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
      <PageManager
        canChangePage={canChangePage}
        currPage={currPage}
        data={data}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
      />
      <Divider />
      <Button onClick={handleAddData} type="primary" style={{ display: 'block' }}>
        {isAddTableData ? '^ Hide' : 'V Add data to table'}
      </Button>
      {isAddTableData && <NewItemForm reloadTable={reloadTable} />}
    </>
  );
};
