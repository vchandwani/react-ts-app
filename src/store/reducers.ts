import { combineReducers } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import articleReducer from './modules/article';
// eslint-disable-next-line import/no-cycle
import articlesReducer from './modules/articles';

const rootReducer = combineReducers({
  articles: articlesReducer,
  article: articleReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
