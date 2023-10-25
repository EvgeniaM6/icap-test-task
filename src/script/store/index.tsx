import { configureStore } from '@reduxjs/toolkit';
import tableSlice from './tableSlice';
import loginSlice from './loginSlice';
import { tableApi } from '../redux/tableApi';
import { loginApi } from '../redux/loginApi';

const store = configureStore({
  reducer: {
    [tableApi.reducerPath]: tableApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    table: tableSlice,
    login: loginSlice,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat([tableApi.middleware, loginApi.middleware]),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
