import { createAsyncThunk } from '@reduxjs/toolkit';

// Async action to fetch posts
export const fetchPosts = createAsyncThunk(
  'post/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      // API call placeholder
      // const response = await api.get('/posts');
      // return response.data;
      
      return [
        { id: 1, title: 'First Post', content: 'Hello World!' },
        { id: 2, title: 'Another Post', content: 'This is another post.' }
      ];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);
