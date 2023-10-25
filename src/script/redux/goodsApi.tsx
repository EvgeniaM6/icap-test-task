import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, PARTIAL_URL } from '../constants';
import fetch from 'isomorphic-fetch';
import { TableResponse } from '../models';

export const tableApi = createApi({
  reducerPath: 'tableApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, fetchFn: fetch }),
  endpoints: (build) => ({
    getTableData: build.query<TableResponse, string>({
      query: (page: string) => ({
        url: page ? `/${PARTIAL_URL.TABLE}/${page}` : `/${PARTIAL_URL.TABLE}`,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const { useGetTableDataQuery } = tableApi;
