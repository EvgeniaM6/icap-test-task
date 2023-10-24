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

export type TableData = {
  id: number;
  name: string;
  email: string;
  birthday_date: string;
  phone_number: string;
  address?: string;
};
