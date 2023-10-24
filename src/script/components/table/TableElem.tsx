import { useEffect, useState } from 'react';
import { tryGetTable } from '../../utils';
import { ErrorResponse, TableResponse } from '../../models';
import { RESPONSE_STATUS } from '../../constants';
import { TableData } from '../../models/response.model';
import { Button, Table } from 'antd';
import { columns } from './tableColumns';
import { NewItemForm } from './NewItemForm';

export const TableElem = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [tableItemsCount, setTableItemsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddTableData, setIsAddTableData] = useState<boolean>(false);

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

  const handleAddData = () => {
    setIsAddTableData((prevValue) => !prevValue);
  };

  return (
    <>
      <div>{tableItemsCount}</div>
      <div>TableElem</div>
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
      {isAddTableData && <NewItemForm setIsLoadingTable={setIsLoading} />}
    </>
  );
};
