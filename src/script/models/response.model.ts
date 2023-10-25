import { Dayjs } from 'dayjs';
import { NewTableItemFields } from './tableForm.model';

export type ErrorResponse = {
  status: number;
  error: unknown;
};

export type TableResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TableData[];
};

export interface TableData extends NewTableData {
  id: number;
}

export type NewTableData = {
  name: string;
  email: string;
  birthday_date: string;
  phone_number: string;
  address?: string;
};

export interface TableItemFields extends TableData {
  key: string;
}

export interface TableItemsForm extends Omit<TableItemFields, 'birthday_date'> {
  birthday_date: Dayjs;
}

export type ErrMessagesObj = {
  [key: string]: string[];
};

export type ErrDeleteMessageObj = {
  detail: string;
};

export type ErrValidateForm = {
  errorFields: ErrFieldValidateForm[];
  outOfDate: boolean;
  values: NewTableItemFields;
};

export type ErrFieldValidateForm = {
  errors: string[];
  name: string[];
  warnings: string[];
};
