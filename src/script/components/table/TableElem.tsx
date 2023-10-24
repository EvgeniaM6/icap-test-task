import { useEffect, useState } from 'react';
import { tryGetTable } from '../../utils';
import { ErrorResponse, TableResponse } from '../../models';
import { RESPONSE_STATUS } from '../../constants';
import { TableData } from '../../models/response.model';
import { Table } from 'antd';
import { columns } from './tableColumns';

export const TableElem = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [tableItemsCount, setTableItemsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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
  }, []);

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
      />
    </>
  );
};
