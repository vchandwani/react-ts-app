import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../../lib/api';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../../types';
import { PostDataObj } from '../../../types/post/data';
// eslint-disable-next-line import/no-cycle
import { AppDispatch } from '../../index';

export interface PostsState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | undefined;
  posts: PostDataObj[];
}

export interface PostsActionPayload {
  results?: PostDataObj[] | undefined;
  error?: string | undefined;
}

export const initialState: PostsState = {
  isLoading: false,
  isLoaded: false,
  error: undefined,
  posts: [],
};

//
// posts redux module
//
const posts = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Start loading documents
    loadPostsStart(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = false;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
    },

    // Documents loaded
    loadPostsComplete(
      state,
      { payload }: PayloadAction<PostsActionPayload>
    ): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;

      if (payload.results) {
        // eslint-disable-next-line no-param-reassign
        state.posts = payload.results;
      }
    },

    // Posts load failed
    loadPostsFailed(state, action: PayloadAction<PostsActionPayload>): void {
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
  loadPostsStart,
  loadPostsComplete,
  loadPostsFailed,
  clearResults,
} = posts.actions;

export default posts.reducer;

// Async actions

/**
 * Load document results based on document type
 *
 * @param apiResource {String}
 * @param documentType {String}
 */
export const loadPosts = (apiResource: string): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(loadPostsStart());

  try {
    const results = await api.posts.loadPosts(apiResource);
    dispatch(
      loadPostsComplete({
        results,
      })
    );
  } catch (error) {
    let errorMessage = error;
    if (error && error.message) {
      errorMessage = error.message;
    }

    dispatch(
      loadPostsFailed({
        error: errorMessage,
      })
    );
  }
};
