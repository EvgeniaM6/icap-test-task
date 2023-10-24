import { Button, Popconfirm, Space } from 'antd';
import { TableItemFields } from '../../models';

export const getColumns = (
  isEditing: (record: TableItemFields) => boolean,
  handleDelete: (id: number) => void,
  handleCancel: () => void,
  handleSave: (record: TableItemFields) => void,
  editField: (record: Partial<TableItemFields> & { key: React.Key }) => void
) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      editable: true,
    },
    {
      title: 'Birthday',
      dataIndex: 'birthday_date',
      key: 'birthday_date',
      editable: true,
    },
    {
      title: 'Phone number',
      dataIndex: 'phone_number',
      key: 'phone_number',
      editable: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: unknown, record: TableItemFields) => {
        return isEditing(record) ? (
          <Space>
            <Popconfirm title="Sure to save?" onConfirm={() => handleSave(record)}>
              <Button>Save</Button>
            </Popconfirm>
            <Popconfirm title="Sure to cancel?" onConfirm={() => handleCancel()}>
              <Button>Cancel</Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space>
            <Button onClick={() => editField(record)}>Edit</Button>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(Number(record.key))}>
              <Button>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: TableItemFields) => ({
        record,
        inputtype: col.dataIndex === 'birthday_date' ? 'date' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return mergedColumns;
};
