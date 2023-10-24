import { NewTableData, NewTableItemFields } from '../models';

export const getNewTableData = (values: NewTableItemFields): NewTableData => {
  const { name, email, birthday, phone, address } = values;

  const birthdayStr = `${birthday.year()}-${birthday.month() + 1}-${birthday.date()}`;

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
