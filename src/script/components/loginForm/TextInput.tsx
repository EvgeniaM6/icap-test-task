import { Form } from 'antd';

const { Item } = Form;

type TextInputProps = {
  labelName: string;
  children: React.ReactNode;
};

export const TextInput = (props: TextInputProps) => {
  const { labelName, children } = props;

  const messageText = `enter your ${labelName}`;

  return (
    <Item
      label={labelName}
      name={labelName.toLowerCase()}
      rules={[
        {
          required: true,
          message: messageText,
        },
      ]}
      tooltip={messageText}
    >
      {children}
    </Item>
  );
};
