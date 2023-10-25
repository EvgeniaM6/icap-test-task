import { BASE_URL, PARTIAL_URL, REQUEST_METHODS, RESPONSE_STATUS } from '../constants';
import { LoginFormValues, ErrorResponse, NewTableData } from '../models';

export const tryLogin = async (values: LoginFormValues): Promise<Response | ErrorResponse> => {
  try {
    return await fetch(`${BASE_URL}/${PARTIAL_URL.LOGIN}/`, {
      method: REQUEST_METHODS.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  } catch (error: unknown) {
    return {
      status: RESPONSE_STATUS.ServerError,
      error,
    };
  }
};

export const tryDeleteTableItem = async (id: number): Promise<Response | ErrorResponse> => {
  try {
    return await fetch(`${BASE_URL}/${PARTIAL_URL.TABLE}/${id}/`, {
      method: REQUEST_METHODS.DELETE,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: unknown) {
    return {
      status: RESPONSE_STATUS.ServerError,
      error,
    };
  }
};

export const tryChangeTableItem = async (
  id: number,
  values: NewTableData
): Promise<Response | ErrorResponse> => {
  try {
    return await fetch(`${BASE_URL}/${PARTIAL_URL.TABLE}/${id}/`, {
      method: REQUEST_METHODS.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  } catch (error: unknown) {
    return {
      status: RESPONSE_STATUS.ServerError,
      error,
    };
  }
};
