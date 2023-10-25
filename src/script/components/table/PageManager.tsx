import { Button, Space } from 'antd';
import { TableResponse } from '../../models';

type PageManagerProps = {
  canChangePage: boolean;
  currPage: number;
  data: TableResponse;
  handlePrevPage: () => void;
  handleNextPage: () => void;
};

export const PageManager = ({
  canChangePage,
  currPage,
  data,
  handlePrevPage,
  handleNextPage,
}: PageManagerProps) => {
  return (
    <Space>
      <Button
        onClick={() => handlePrevPage()}
        type="primary"
        disabled={!data.previous || !canChangePage}
      >
        {'<'}
      </Button>
      <div>{`${currPage} / ${Math.ceil(data.count / 10)}`}</div>
      <Button
        onClick={() => handleNextPage()}
        type="primary"
        disabled={!data.next || !canChangePage}
      >
        {'>'}
      </Button>
    </Space>
  );
};
