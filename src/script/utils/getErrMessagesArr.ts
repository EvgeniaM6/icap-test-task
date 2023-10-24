import { ErrMessagesObj } from '../models';

export const getErrMessagesArr = (respBody: ErrMessagesObj): string[] => {
  return Object.values(respBody).reduce((prevErrMessArr: string[], errMessArr: string[]) => {
    const currentErrMessArr = errMessArr.reduce((prevArr: string[], errMess: string) => {
      prevArr.push(errMess);
      return prevArr;
    }, []);

    return prevErrMessArr.concat(currentErrMessArr);
  }, []);
};
