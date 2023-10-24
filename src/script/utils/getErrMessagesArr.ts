import { ArgsProps } from 'antd/es/message';
import { ErrDeleteMessageObj, ErrMessagesObj, ErrorResponse } from '../models';

export const getErrMessagesArr = (respBody: ErrMessagesObj): string[] => {
  return Object.values(respBody).reduce((prevErrMessArr: string[], errMessArr: string[]) => {
    const currentErrMessArr = errMessArr.reduce((prevArr: string[], errMess: string) => {
      prevArr.push(errMess);
      return prevArr;
    }, []);

    return prevErrMessArr.concat(currentErrMessArr);
  }, []);
};

export const getErrMessage = async (response: Response | ErrorResponse): Promise<string> => {
  if ((response as ErrorResponse).error) {
    const err = (response as ErrorResponse).error;
    return (err as Error).message;
  }

  const respBody: ErrDeleteMessageObj | ErrMessagesObj = await (response as Response).json();
  console.log('respBody=', respBody);

  if (respBody.detail) {
    return (respBody as ErrDeleteMessageObj).detail;
  }

  const newErrMessagesArr: string[] = getErrMessagesArr(respBody as ErrMessagesObj);
  return newErrMessagesArr.join(' ');
};

export const getArgsProps = async (
  response: Response | ErrorResponse,
  isSuccess: boolean,
  action: string
): Promise<ArgsProps> => {
  const messageType = isSuccess ? 'success' : 'error';
  const succMsg = `Item successful ${action}`;
  const msgContent: string = isSuccess ? succMsg : await getErrMessage(response);

  return {
    type: messageType,
    content: msgContent,
  };
};
