import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import postReducer from './reducer/postReducer';
import customMiddleware from './middleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(customMiddleware),
});

export default store;
