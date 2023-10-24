import { Popconfirm } from 'antd';

export const getColumns = (handleDelete: (id: number) => void) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday_date',
      key: 'birthday_date',
    },
    {
      title: 'Phone number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: unknown, record: { key: React.Key }) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key as number)}>
          <a>Delete</a>
        </Popconfirm>
      ),
    },
  ];

  return columns;
};
