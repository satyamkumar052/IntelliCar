import { createSlice } from '@reduxjs/toolkit';
import { fetchPosts } from '../../action/postAction';

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearPostError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPostError } = postSlice.actions;
export default postSlice.reducer;
