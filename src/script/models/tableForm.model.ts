export type NewTableItemFields = {
  name: string;
  email: string;
  birthday: BirthdayObj;
  phone: string;
  address?: string;
};

type BirthdayObj = {
  $D: number;
  $M: number;
  $y: number;
};
