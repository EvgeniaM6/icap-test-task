import { createSlice } from '@reduxjs/toolkit';
import { TableState } from '../models';

const initialState: TableState = {
  editingKey: '',
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
  },
});

export const { setEditingKey, resetEditingKey } = tableSlice.actions;
export default tableSlice.reducer;
