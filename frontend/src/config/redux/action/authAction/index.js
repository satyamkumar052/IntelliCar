import { createAsyncThunk } from '@reduxjs/toolkit';

// Async action to login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // API call placeholder
      // const response = await api.post('/login', credentials);
      // return response.data;
      
      return { id: 1, name: 'John Doe', email: credentials?.email || 'test@example.com' };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
