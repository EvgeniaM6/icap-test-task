import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, PARTIAL_URL, REQUEST_METHODS } from '../constants';
import fetch from 'isomorphic-fetch';
import { NewTableData, TableData, TableResponse } from '../models';

export const tableApi = createApi({
  reducerPath: 'tableApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, fetchFn: fetch }),
  endpoints: (build) => ({
    getTableData: build.query<TableResponse, string>({
      query: (page: string) => ({
        url: `/${PARTIAL_URL.TABLE}/${page ? page.split('/').at(-1) : ''}`,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    addDataToTable: build.mutation<TableData, NewTableData>({
      query: (values: NewTableData) => ({
        url: `/${PARTIAL_URL.TABLE}/`,
        method: REQUEST_METHODS.POST,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(values),
      }),
    }),
    deleteTableItem: build.mutation<Response, number>({
      query: (id: number) => ({
        url: `/${PARTIAL_URL.TABLE}/${id}/`,
        method: REQUEST_METHODS.DELETE,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    changeTableItem: build.mutation<TableData, TableData>({
      query: ({ id, ...values }: TableData) => ({
        url: `/${PARTIAL_URL.TABLE}/${id}/`,
        method: REQUEST_METHODS.PUT,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(values),
      }),
    }),
  }),
});

export const {
  useGetTableDataQuery,
  useAddDataToTableMutation,
  useDeleteTableItemMutation,
  useChangeTableItemMutation,
} = tableApi;
