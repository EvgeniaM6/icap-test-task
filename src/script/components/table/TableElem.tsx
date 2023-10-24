import { useEffect, useState } from 'react';
import { tryDeleteTableItem, tryGetTable } from '../../utils';
import { ErrorResponse, TableResponse, ErrDeleteMessageObj } from '../../models';
import { RESPONSE_STATUS } from '../../constants';
import { TableData } from '../../models/response.model';
import { Button, Table, message } from 'antd';
import { getColumns } from './tableColumns';
import { NewItemForm } from './NewItemForm';

export const TableElem = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [tableItemsCount, setTableItemsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddTableData, setIsAddTableData] = useState<boolean>(false);

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

  const columns = getColumns(handleDelete);

  return (
    <>
      <div>{tableItemsCount}</div>
      <div>TableElem</div>
      {contextHolder}
      <Table
        dataSource={tableData.map((tableItem) => {
          return { key: tableItem.id, ...tableItem };
        })}
        columns={columns}
        loading={isLoading}
        pagination={false}
      />
      <Button onClick={handleAddData} type="primary">
        Add data
      </Button>
      {isAddTableData && <NewItemForm reloadTable={reloadTable} />}
    </>
  );
};
