import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, PARTIAL_URL, REQUEST_METHODS } from '../constants';
import fetch from 'isomorphic-fetch';
import { LoginFormValues } from '../models';

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, fetchFn: fetch }),
  endpoints: (build) => ({
    logIn: build.mutation<Response, LoginFormValues>({
      query: (values: LoginFormValues) => ({
        url: `/${PARTIAL_URL.LOGIN}/`,
        method: REQUEST_METHODS.POST,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(values),
      }),
    }),
  }),
});

export const { useLogInMutation } = loginApi;
