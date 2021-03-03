import { combineReducers } from '@reduxjs/toolkit';
import articlesReducer from './modules/articles/index';

const rootReducer = combineReducers({
  articles: articlesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
