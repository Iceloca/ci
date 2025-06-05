import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {

    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token');
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 <= Date.now()) {
        localStorage.removeItem('token');
        return rejectWithValue('Token expired');
      }

      const userId = decoded.userId || decoded.sub;
      if (!userId) {
        localStorage.removeItem('token');
        return rejectWithValue('Invalid token');
      }

      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Fetch user failed');
      const userData = await response.json();

      return { token, user: userData };
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue(err.message);
    }
  }
);

// Функция для создания login/register thunk
const createAuthThunk = (type) =>
  createAsyncThunk(
    `auth/${type}`,
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await fetch(`/api/auth/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) {
          return rejectWithValue(data.error || 'Auth failed');
        }
        console.log('data', data.token, data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }

        return { token: data.token, user: data.user };
      } catch (err) {
        console.log('err');
        return rejectWithValue(err.message);
      }
    }
  );

export const login = createAuthThunk('login');
export const register = createAuthThunk('reg');

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      Object.assign(state, { ...initialState, isLoading: false });
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state, { payload }) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        console.log('login.fulfilled payload:', payload); 
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.error = payload;
        state.isLoading = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.error = payload;
        state.isLoading = false;
      });
  },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
