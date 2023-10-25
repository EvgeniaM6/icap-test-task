import { createSlice } from '@reduxjs/toolkit';
import { TableState } from '../models';

const initialState: TableState = {
  editingKey: '',
  currPage: 1,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setEditingKey(state, action) {
      return { ...state, editingKey: action.payload };
    },
    resetEditingKey(state) {
      return { ...state, editingKey: '' };
    },
    setPrevPage(state) {
      return { ...state, currPage: state.currPage - 1 };
    },
    setNextPage(state) {
      return { ...state, currPage: state.currPage + 1 };
    },
  },
});

export const { setEditingKey, resetEditingKey, setPrevPage, setNextPage } = tableSlice.actions;
export default tableSlice.reducer;
