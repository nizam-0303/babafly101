import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../utils/types';

const storedUser = (() => {
  try { const s = localStorage.getItem('babafly_user'); return s ? JSON.parse(s) : null; } catch { return null; }
})();

const initialState: AuthState = { user: storedUser, isLoading: false, error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) { state.isLoading = true; state.error = null; },
    loginSuccess(state, action: PayloadAction<User>) {
      state.isLoading = false;
      state.user = action.payload;
      localStorage.setItem('babafly_user', JSON.stringify(action.payload));
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('babafly_user');
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
