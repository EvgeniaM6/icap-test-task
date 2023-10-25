import {
  getArgsProps,
  getErrMessage,
  getErrMessagesArr,
  getErrMsgFromApi,
} from './getErrMessagesArr';
import { getNewTableData } from './getNewTableData';
import { tryAddDataToTable, tryChangeTableItem, tryDeleteTableItem, tryLogin } from './request';

export {
  tryLogin,
  tryAddDataToTable,
  getNewTableData,
  tryDeleteTableItem,
  tryChangeTableItem,
  getErrMessagesArr,
  getErrMessage,
  getArgsProps,
  getErrMsgFromApi,
};
