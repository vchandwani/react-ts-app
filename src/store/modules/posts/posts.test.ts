import mockAxios, { AxiosResponse } from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { cleanup, waitFor } from '@testing-library/react';
import reducer, {
  loadPostsComplete,
  PostsState,
  deleteResult,
  loadPosts,
  initialState,
  deletePost,
  loadPostsFailed,
  clearResults,
  loadPostsStart,
} from './index';
import { URL } from '../../../types/post/data';

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

const sampleData = [
  {
    userId: 1,
    id: 1,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body:
      'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
    author: 'Varun',
  },
  {
    userId: 2,
    id: 2,
    title:
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body:
      'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
    author: 'Varun',
  },
];
afterEach(cleanup);

describe('posts reducer', () => {
  let currentState: PostsState;

  it('should change state on loadPostsComplete', () => {
    const state = reducer(
      currentState,
      loadPostsComplete({ results: sampleData })
    );
    const { isLoading, isLoaded, posts } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(true);
    expect(posts).toHaveLength(2);
  });

  it('should run postPost with loadPostsComplete ', async () => {
    const store = mockStore(initialState);
    await waitFor(() =>
      store.dispatch(loadPostsComplete({ results: sampleData }))
    );

    const actions = store.getActions();
    expect(actions[0].type).toBe('posts/loadPostsComplete');
    expect(actions[0].payload.results).toHaveLength(2);
  });

  it('should change state on deleteResult ', () => {
    const state = reducer(
      currentState,
      deleteResult({ newPosts: [{ ...sampleData[0] }] })
    );
    const { isLoading, isLoaded, posts } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(true);
    expect(posts).toHaveLength(1);
  });
  it('should change state on loadPosts ', async () => {
    const store = mockStore(initialState);
    await mockAxios.get.mockImplementationOnce(() => ({
      ...axiosResponse,
      data: sampleData,
    }));
    await waitFor(() => store.dispatch(loadPosts(URL)));
    const actions = store.getActions();
    expect(actions[0].type).toBe('posts/loadPostsStart');
    expect(actions[1].type).toBe('posts/loadPostsComplete');
  });

  it('should show error state on loadPosts ', async () => {
    const store = mockStore(initialState);
    await mockAxios.get.mockImplementationOnce(() =>
      Promise.reject({
        error: { message: 'Something bad happened !' },
      })
    );
    await waitFor(() => store.dispatch(loadPosts(URL)));
    const actions = store.getActions();
    expect(actions[0].type).toBe('posts/loadPostsStart');
    expect(actions[1].type).toBe('posts/loadPostsFailed');
    expect(actions[1].payload.error.error.message).toContain(
      'Something bad happened'
    );
  });

  it('should change state on deletePost ', async () => {
    const store = mockStore(initialState);
    await mockAxios.get.mockImplementationOnce(() => ({
      ...axiosResponse,
      data: sampleData,
    }));
    await waitFor(() => store.dispatch(deletePost(sampleData)));
    const actions = store.getActions();
    expect(actions[0].type).toBe('posts/loadPostsStart');
    expect(actions[1].type).toBe('posts/deleteResult');
  });

  it('should change state on loadPostsFailed', () => {
    const state = reducer(currentState, loadPostsFailed({ error: 'Error' }));
    const { isLoading, isLoaded, error } = state;
    expect(isLoading).toBe(false);
    expect(isLoaded).toBe(false);
    expect(error).toBe('Error');
  });
  it('should change state on clearResults', () => {
    const state = reducer(currentState, clearResults());
    expect(state).toEqual(initialState);
  });

  it('should change state on loadPostsStart', () => {
    const state = reducer(currentState, loadPostsStart());
    const { isLoading, isLoaded, error } = state;
    expect(isLoading).toBe(true);
    expect(isLoaded).toBe(false);
    expect(error).toBe(undefined);
  });
});
