import { configureStore } from '@reduxjs/toolkit';
import tableSlice from './tableSlice';
import { tableApi } from '../redux/tableApi';

const store = configureStore({
  reducer: {
    [tableApi.reducerPath]: tableApi.reducer,
    table: tableSlice,
  },
  middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(tableApi.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
