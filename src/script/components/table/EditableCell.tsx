import { DatePicker, Form, Input } from 'antd';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputtype: 'date' | 'text';
  index: number;
  children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputtype,
  children,
  ...restProps
}) => {
  const inputNode: JSX.Element = inputtype === 'date' ? <DatePicker /> : <Input />;
  const isRequired: boolean = dataIndex !== 'address';

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: isRequired,
              message: `Please enter ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
