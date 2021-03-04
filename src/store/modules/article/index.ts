import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../../types';
import { PostDataObj } from '../../../types/article/data';
// eslint-disable-next-line import/no-cycle
import { AppDispatch } from '../../index';
import api from '../../../lib/api';

export interface ArticleState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | undefined;
  article: PostDataObj | undefined;
  actioned?: boolean;
}

export const initialState: ArticleState = {
  isLoading: false,
  isLoaded: true,
  error: undefined,
  article: undefined,
  actioned: false,
};

export interface ArticleActionPayload {
  results?: PostDataObj[] | undefined;
  error?: string | undefined;
}

//
// Articles redux module
//
const article = createSlice({
  name: 'article',
  initialState,
  reducers: {
    // Start loading documents
    loadArticleStart(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = false;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
    },

    // Documents loaded
    loadArticleComplete(state, { payload }: PayloadAction<PostDataObj>): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;

      if (payload.id) {
        // eslint-disable-next-line no-param-reassign
        state.article = { ...payload };
      }
    },

    // articles load failed
    loadArticleFailed(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.error = 'Unknown error';
    },

    // Clear current results
    clearResults(state): void {
      // eslint-disable-next-line no-param-reassign
      state.article = undefined;
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
      // eslint-disable-next-line no-param-reassign
      state.actioned = false;
    },

    postArticleStart(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = false;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
      // eslint-disable-next-line no-param-reassign
      state.actioned = false;
    },

    // Documents loaded
    postArticleComplete(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.article = undefined;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
      // eslint-disable-next-line no-param-reassign
      state.actioned = true;
    },

    // articles load failed
    postArticleFailed(
      state,
      action: PayloadAction<ArticleActionPayload>
    ): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.error = action.payload.error || 'Unknown error';
      // eslint-disable-next-line no-param-reassign
      state.actioned = false;
    },
  },
});

// Export actions and reducer
export const {
  loadArticleStart,
  loadArticleComplete,
  loadArticleFailed,
  postArticleStart,
  postArticleComplete,
  postArticleFailed,
  clearResults,
} = article.actions;

export default article.reducer;

// Async actions

/**
 * Load document results based on document type
 *
 * @param apiResource {String}
 * @param documentType {String}
 */
export const loadArticle = (data: PostDataObj): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(loadArticleStart());

  try {
    dispatch(loadArticleComplete(data));
  } catch (error) {
    dispatch(loadArticleFailed());
  }
};

// Async actions

/**
 * Load document results based on document type
 *
 * @param apiResource {String}
 * @param documentType {String}
 */
export const postArticle = (
  apiResource: string,
  val: PostDataObj
): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(postArticleStart());

  try {
    const result = await api.articles.postArticle(apiResource, val);
    if (result.success) {
      dispatch(postArticleComplete());
    } else {
      dispatch(postArticleFailed({ error: 'Operation dailed' }));
    }
  } catch (error) {
    let errorMessage = error;
    if (error && error.message) {
      errorMessage = error.message;
    }

    dispatch(
      postArticleFailed({
        error: errorMessage,
      })
    );
  }
};
