import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../lib/api';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../../types';
import { PostDataObj } from '../../../types/article/data';
// eslint-disable-next-line import/no-cycle
import { AppDispatch } from '../../index';

export interface ArticlesState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | undefined;
  articles: PostDataObj[];
}

export interface ArticlesActionPayload {
  results?: PostDataObj[] | undefined;
  error?: string | undefined;
}

export const initialState: ArticlesState = {
  isLoading: false,
  isLoaded: false,
  error: undefined,
  articles: [],
};

//
// Articles redux module
//
const articles = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    // Start loading documents
    loadArticlesStart(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = false;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
    },

    // Documents loaded
    loadArticlesComplete(
      state,
      { payload }: PayloadAction<ArticlesActionPayload>
    ): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;

      if (payload.results) {
        // eslint-disable-next-line no-param-reassign
        state.articles = payload.results;
      }
    },

    // articles load failed
    loadArticlesFailed(
      state,
      action: PayloadAction<ArticlesActionPayload>
    ): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = false;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.error = action.payload.error || 'Unknown error';
    },

    // Clear current results
    clearResults(state): void {
      // eslint-disable-next-line no-param-reassign
      state = initialState;
    },
  },
});

// Export actions and reducer
export const {
  loadArticlesStart,
  loadArticlesComplete,
  loadArticlesFailed,
  clearResults,
} = articles.actions;

export default articles.reducer;

// Async actions

/**
 * Load document results based on document type
 *
 * @param apiResource {String}
 * @param documentType {String}
 */
export const loadArticles = (apiResource: string): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(loadArticlesStart());

  try {
    const results = await api.articles.loadArticles(apiResource);
    dispatch(
      loadArticlesComplete({
        results,
      })
    );
  } catch (error) {
    let errorMessage = error;
    if (error && error.message) {
      errorMessage = error.message;
    }

    dispatch(
      loadArticlesFailed({
        error: errorMessage,
      })
    );
  }
};
