import { BASE_URL, REQUEST_METHODS, RESPONSE_STATUS } from '../constants';
import { LoginFormValues, ErrorResponse } from '../models';

export const tryLogin = async (values: LoginFormValues): Promise<Response | ErrorResponse> => {
  try {
    return await fetch(`${BASE_URL}/login/`, {
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
