import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../../types';
import { PostDataObj } from '../../../types/post/data';
// eslint-disable-next-line import/no-cycle
import { AppDispatch } from '../../index';
import api from '../../../lib/api';

export interface PostState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | undefined;
  post: PostDataObj | undefined;
  actioned?: boolean;
  editable: boolean;
}

export const initialState: PostState = {
  isLoading: false,
  isLoaded: true,
  error: undefined,
  post: undefined,
  actioned: false,
  editable: false,
};

export interface PostActionPayload {
  results?: PostDataObj[] | undefined;
  error?: string | undefined;
}
export interface EditablePayload {
  editable: boolean;
}

//
// post redux module
//
const post = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // Start loading documents
    loadPostStart(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = false;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
    },

    // Documents loaded
    loadPostComplete(state, { payload }: PayloadAction<PostDataObj>): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;

      if (payload.id) {
        // eslint-disable-next-line no-param-reassign
        state.post = { ...payload };
      }
    },

    // posts load failed
    loadPostFailed(state): void {
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
      state.post = undefined;
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
      // eslint-disable-next-line no-param-reassign
      state.actioned = false;
    },

    postPostStart(state): void {
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
    postPostComplete(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.post = undefined;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
      // eslint-disable-next-line no-param-reassign
      state.actioned = true;
    },

    // posts load failed
    postPostFailed(state, action: PayloadAction<PostActionPayload>): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.error = action.payload.error || 'Unknown error';
      // eslint-disable-next-line no-param-reassign
      state.actioned = false;
    },
    // Clear current results
    actionedClear(state): void {
      // eslint-disable-next-line no-param-reassign
      state.actioned = false;
    },
    // Clear current results
    editableVal(state, { payload }: PayloadAction<EditablePayload>): void {
      // eslint-disable-next-line no-param-reassign
      state.editable = payload.editable;
    },

    deletePostStart(state): void {
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
    deletePostComplete(state): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.post = undefined;
      // eslint-disable-next-line no-param-reassign
      state.error = undefined;
      // eslint-disable-next-line no-param-reassign
      state.actioned = true;
    },

    // posts load failed
    deletePostFailed(state, action: PayloadAction<PostActionPayload>): void {
      // eslint-disable-next-line no-param-reassign
      state.isLoaded = true;
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.error = action.payload.error || 'Unable to delete';
      // eslint-disable-next-line no-param-reassign
      state.actioned = false;
    },
  },
});

// Export actions and reducer
export const {
  loadPostStart,
  loadPostComplete,
  loadPostFailed,
  postPostStart,
  postPostComplete,
  postPostFailed,
  clearResults,
  actionedClear,
  editableVal,
  deletePostStart,
  deletePostComplete,
  deletePostFailed,
} = post.actions;

export default post.reducer;

// Async actions

/**
 * Load document results based on document type
 *
 * @param apiResource {String}
 * @param documentType {String}
 */
export const loadPost = (data: PostDataObj): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(loadPostStart());
  try {
    dispatch(loadPostComplete(data));
  } catch (error) {
    dispatch(loadPostFailed());
  }
};

// Async actions

/**
 * Load document results based on document type
 *
 * @param apiResource {String}
 * @param documentType {String}
 */
export const postPost = (
  apiResource: string,
  val: PostDataObj
): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(postPostStart());

  try {
    const result = await api.posts.postPost(apiResource, val);
    if (result.success) {
      dispatch(postPostComplete());
    } else {
      dispatch(postPostFailed({ error: 'Operation dailed' }));
    }
  } catch (error) {
    let errorMessage = error;
    if (error && error.message) {
      errorMessage = error.message;
    }

    dispatch(
      postPostFailed({
        error: errorMessage,
      })
    );
  }
};

/**
 * Refresh Actioned
 *
 */
export const clearActioned = (): AppThunk => async (dispatch: AppDispatch) => {
  dispatch(actionedClear());
};

/**
 *  Post Editable
 *
 */
export const setEditable = (editable: boolean): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(editableVal({ editable }));
};

/**
 * Load document results based on document type
 *
 * @param apiResource {String}
 * @param id {String}
 */
export const deletePost = (apiResource: string, id: number): AppThunk => async (
  dispatch: AppDispatch
) => {
  dispatch(deletePostStart());

  const url: string = `${apiResource}/`.concat(id ? id.toString() : '');

  try {
    const result = await api.posts.deletePost(url);

    if (result.success) {
      dispatch(deletePostComplete());
    } else {
      dispatch(deletePostFailed({ error: 'Operation dailed' }));
    }
  } catch (error) {
    let errorMessage = error;
    if (error && error.message) {
      errorMessage = error.message;
    }

    dispatch(
      deletePostFailed({
        error: errorMessage,
      })
    );
  }
};
