import { Form } from 'antd';

const { Item } = Form;

type TextInputProps = {
  labelName: string;
  isRequired: boolean;
  children: React.ReactNode;
};

export const TextInput = (props: TextInputProps) => {
  const { labelName, isRequired, children } = props;

  const messageText = `enter ${labelName}`;

  return (
    <Item
      label={labelName}
      name={labelName.toLowerCase()}
      rules={[
        {
          required: isRequired,
          message: messageText,
        },
      ]}
    >
      {children}
    </Item>
  );
};
