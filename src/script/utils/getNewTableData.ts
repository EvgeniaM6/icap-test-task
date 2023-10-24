import { NewTableData, NewTableItemFields } from '../models';

export const getNewTableData = (values: NewTableItemFields): NewTableData => {
  const { name, email, birthday, phone, address } = values;

  const { $D, $M, $y } = birthday;
  const birthdayStr = `${$y}-${$M + 1}-${$D}`;

  const newTableData: NewTableData = {
    name,
    email,
    birthday_date: birthdayStr,
    phone_number: phone,
  };

  if (address) {
    newTableData.address = address;
  }

  return newTableData;
};
