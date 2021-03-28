// Post redux module tests

import mockAxios, { AxiosResponse } from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { cleanup, waitFor } from '@testing-library/react';
import reducer, {
  PostActionPayload,
  initialState,
  loadPostStart,
  clearResults,
  PostState,
  loadPostFailed,
  loadPostComplete,
  postPostComplete,
  postPostStart,
  postPostFailed,
  actionedClear,
  editableVal,
  deletePostStart,
  deletePostComplete,
  deletePostFailed,
  loadPost,
  getPost,
  deletePost,
  postPost,
} from './index';
import api from '../../../lib/api';
import { URL } from '../../../types/post/data';
import { server, rest } from '../../../testServer';

const mockStore = configureMockStore([thunk]);

const axiosResponse: AxiosResponse = {
  data: [],
  status: 201,
  statusText: 'OK',
  config: {},
  headers: {},
};
const sampleDeleteFailureResponse: AxiosResponse = {
  data: [],
  status: 201,
  statusText: 'OK',
  config: {},
  headers: {},
};

const sampleData = {
  userId: 1,
  id: 1,
  title:
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body:
    'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
  author: 'Varun',
};
afterEach(cleanup);

describe('post reducer', () => {
  let currentState: PostState;
  it('should return default state', () => {
    const state = reducer(undefined, { type: '' });
    currentState = state;
    expect(state).toEqual(initialState);
  });
  it('should change state on loadPostStart', () => {
    const state = reducer(currentState, loadPostStart());
    const { isLoading, isLoaded, error } = state;
    expect(isLoading).toBe(true);
    expect(isLoaded).toBe(false);
    expect(error).toBe(undefined);
  });
  it('should change state on loadPostComplete', () => {
    const state = reducer(currentState, loadPostComplete({ ...sampleData }));
    const { isLoading, isLoaded, post } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(true);
    expect(post).toEqual(sampleData);
  });
  it('should change state on loadPostFailed', () => {
    const state = reducer(currentState, loadPostFailed());
    const { isLoading, isLoaded, error } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(true);
    expect(error).toBe('Unknown error');
  });

  it('should return to initial state when clearResults is called', () => {
    const state = reducer(currentState, clearResults());
    expect(state).toEqual(initialState);
  });

  it('should start post Post data process ', async () => {
    const state = reducer(currentState, postPostStart());
    const { isLoaded, isLoading, actioned, error } = state;
    expect(isLoaded).toBe(false);
    expect(actioned).toBe(false);
    expect(error).toBe(undefined);
    expect(isLoading).toBe(true);
  });
  it('should post Post data with success', async () => {
    const state = reducer(currentState, postPostComplete());
    const { isLoaded, isLoading, editable, actioned } = state;
    expect(isLoaded).toBe(true);
    expect(actioned).toBe(true);
    expect(isLoading).toBe(false);
    expect(editable).toBe(false);
  });
  it('should change state to post failed state', async () => {
    const state = reducer(currentState, postPostFailed({ error: 'Error' }));
    const { isLoaded, isLoading, error, actioned } = state;
    expect(isLoaded).toBe(true);
    expect(actioned).toBe(false);
    expect(isLoading).toBe(false);
    expect(error).toBe('Error');
  });
  it('should change state to action clear state', async () => {
    const state = reducer(currentState, actionedClear());
    const { actioned } = state;
    expect(actioned).toBe(false);
  });
  it('should change state to editableVal state', async () => {
    const state = reducer(currentState, editableVal({ editable: false }));
    const { editable } = state;
    expect(editable).toBe(false);
  });
  it('should change state to delete post start state', async () => {
    const state = reducer(currentState, deletePostStart());
    const { isLoaded, isLoading, error, actioned } = state;
    expect(isLoading).toBe(true);
    expect(isLoaded).toBe(false);
    expect(error).toBe(undefined);
    expect(actioned).toBe(false);
  });
  it('should change state to delete post complete state', async () => {
    const state = reducer(currentState, deletePostComplete());
    const { isLoaded, isLoading, error, actioned, post } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(true);
    expect(post).toBe(undefined);
    expect(error).toBe(undefined);
    expect(actioned).toBe(true);
  });
  it('should change state to delete post failed state', async () => {
    const state = reducer(currentState, deletePostFailed({ error: 'Error' }));
    const { isLoaded, isLoading, error, actioned } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(true);
    expect(error).toBe('Error');
    expect(actioned).toBe(false);
  });
  it('should change state to delete post failed state', async () => {
    const state = reducer(currentState, deletePostFailed({ error: 'Error' }));
    const { isLoaded, isLoading, error, actioned } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(true);
    expect(error).toBe('Error');
    expect(actioned).toBe(false);
  });
  it('should run getPost with success ', async () => {
    const store = mockStore(initialState);
    store.dispatch(getPost({ ...sampleData }));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/loadPostStart');
    expect(actions[1].type).toBe('post/loadPostComplete');
  });
  it('should run getPost with failure ', async () => {
    const store = mockStore(initialState);
    store.dispatch(getPost({ title: '', body: '' }));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/loadPostStart');
    expect(actions[1].type).toBe('post/loadPostFailed');
  });

  it('should run deletePost with success ', async () => {
    const store = mockStore(initialState);
    await waitFor(() => store.dispatch(deletePost(URL, '1')));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/deletePostStart');
    expect(actions[1].type).toBe('post/deletePostComplete');
  });

  it('should run deletePost with failure ', async () => {
    const store = mockStore(initialState);
    await waitFor(() => store.dispatch(deletePost(URL, '1')));
    await mockAxios.delete.mockImplementationOnce(() => ({
      ...axiosResponse,
      data: {},
    }));
    await waitFor(() => store.dispatch(deletePost(URL, '1')));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/deletePostStart');
    expect(actions[1].type).toBe('post/deletePostComplete');
    expect(actions[2].type).toBe('post/deletePostStart');
    expect(actions[3].type).toBe('post/deletePostFailed');
  });

  it('should run deletePost with catch error ', async () => {
    const store = mockStore(initialState);
    await mockAxios.delete.mockImplementationOnce(() =>
      Promise.reject({
        error: 'Something bad happened !',
      })
    );
    await waitFor(() => store.dispatch(deletePost(URL, '2')));

    const actions = store.getActions();
    expect(actions[0].type).toBe('post/deletePostStart');
    expect(actions[1].type).toBe('post/deletePostFailed');
    expect(actions[1].payload.error).toContain('Operation failed');
  });

  it('should run deletePost with custom catch error ', async () => {
    const store = mockStore(initialState);
    await mockAxios.delete.mockImplementationOnce(() =>
      Promise.reject({
        error: { message: 'Something bad happened !' },
      })
    );
    await waitFor(() => store.dispatch(deletePost(URL, '2')));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/deletePostStart');
    expect(actions[1].type).toBe('post/deletePostFailed');
    expect(actions[1].payload.error).toBeTruthy();
  });

  it('should run postPost with success ', async () => {
    const store = mockStore(initialState);
    await waitFor(() => store.dispatch(postPost(URL, { sampleData })));
    await mockAxios.post.mockImplementationOnce(() => ({
      ...axiosResponse,
      data: sampleData,
    }));
    await waitFor(() => store.dispatch(postPost(URL, { sampleData })));

    const actions = store.getActions();
    expect(actions[0].type).toBe('post/postPostStart');
    expect(actions[1].type).toBe('post/postPostFailed');
    expect(actions[2].type).toBe('post/postPostStart');
    expect(actions[3].type).toBe('post/postPostComplete');
  });

  it('should run postPost with failure ', async () => {
    const store = mockStore(initialState);
    await waitFor(() => store.dispatch(postPost(URL, { title: '', body: '' })));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/postPostStart');
    expect(actions[1].type).toBe('post/postPostFailed');
  });

  it('should run postPost with catch error ', async () => {
    const store = mockStore(initialState);
    await mockAxios.delete.mockImplementationOnce(() =>
      Promise.reject({
        error: 'Something bad happened !',
      })
    );
    await waitFor(() => store.dispatch(postPost(URL, { title: '', body: '' })));

    const actions = store.getActions();
    expect(actions[0].type).toBe('post/postPostStart');
    expect(actions[1].type).toBe('post/postPostFailed');
    expect(actions[1].payload.error).toBeTruthy();
  });

  it('should run loadPost with success ', async () => {
    const store = mockStore(initialState);
    await waitFor(() => store.dispatch(loadPost(sampleData)));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/loadPostStart');
    expect(actions[1].type).toBe('post/loadPostComplete');
  });
  it('should run loadPost with failure ', async () => {
    const store = mockStore(initialState);
    await waitFor(() => store.dispatch(loadPost({})));
    const actions = store.getActions();
    expect(actions[0].type).toBe('post/loadPostStart');
    expect(actions[1].type).toBe('post/loadPostFailed');
  });
});
