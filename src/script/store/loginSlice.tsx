import { createSlice } from '@reduxjs/toolkit';
import { LoginState } from '../models';

const initialState: LoginState = {
  isAuthorized: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setIsAuthorized(state, action) {
      return { ...state, isAuthorized: action.payload };
    },
  },
});

export const { setIsAuthorized } = loginSlice.actions;
export default loginSlice.reducer;
