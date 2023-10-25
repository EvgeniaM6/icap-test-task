import { Dayjs } from 'dayjs';

export type NewTableItemFields = {
  name: string;
  email: string;
  birthday: Dayjs;
  phone: string;
  address?: string;
};

export type NewItemFormProps = {
  reloadTable: () => void;
};
