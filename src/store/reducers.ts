import { combineReducers } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import postReducer from './modules/post';
// eslint-disable-next-line import/no-cycle
import postsReducer from './modules/posts';

const rootReducer = combineReducers({
  posts: postsReducer,
  post: postReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
