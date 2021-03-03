import { combineReducers } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import articlesReducer from './modules/articles/index';

const rootReducer = combineReducers({
  articles: articlesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
