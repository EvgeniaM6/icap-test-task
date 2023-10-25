import { ArgsProps } from 'antd/es/message';
import {
  ErrDeleteMessageObj,
  ErrFieldValidateForm,
  ErrMessagesObj,
  ErrValidateForm,
  ErrorResponse,
} from '../models';

export const getErrMessagesArr = (respBody: ErrMessagesObj | ErrValidateForm): string[] => {
  const errorsArray: string[][] | ErrFieldValidateForm[] =
    (respBody as ErrValidateForm)?.errorFields || Object.values(respBody);

  return errorsArray.reduce(
    (prevErrMessArr: string[], errMessArr: string[] | ErrFieldValidateForm) => {
      const errMessArray: string[] = (errMessArr as ErrFieldValidateForm)?.errors || errMessArr;

      const currentErrMessArr = errMessArray.reduce((prevArr: string[], errMess: string) => {
        prevArr.push(errMess);
        return prevArr;
      }, []);

      return prevErrMessArr.concat(currentErrMessArr);
    },
    []
  );
};

export const getErrMessage = async (response: Response | ErrorResponse): Promise<string[]> => {
  if ((response as ErrorResponse).error) {
    const err = (response as ErrorResponse).error;
    return [(err as Error).message];
  }

  const respBody: ErrDeleteMessageObj | ErrMessagesObj = await (response as Response).json();

  if (respBody.detail) {
    return [(respBody as ErrDeleteMessageObj).detail];
  }

  const newErrMessagesArr: string[] = getErrMessagesArr(respBody as ErrMessagesObj);
  return newErrMessagesArr;
};

export const getArgsProps = async (
  response: Response | ErrorResponse,
  isSuccess: boolean,
  action: string
): Promise<ArgsProps> => {
  const messageType = isSuccess ? 'success' : 'error';
  const succMsg = `Item successful ${action}`;
  const msgContent: string = isSuccess ? succMsg : (await getErrMessage(response)).join(' ');

  return {
    type: messageType,
    content: msgContent,
  };
};
