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

export type ErrMessagesObj = {
  [key: string]: string[];
};

export type ErrDeleteMessageObj = {
  detail: string;
};
