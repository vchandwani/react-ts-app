import React, { ReactElement } from 'react';
import { fireEvent, render, cleanup, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DisplayPost from './DisplayPost';

afterEach(cleanup);

const mockStore = configureStore([thunk]);
const initialStoreData = {
  article: {
    isLoading: false,
    isLoaded: true,
    actioned: false,
    error: undefined,
  },
  articles: {
    isLoading: false,
    isLoaded: true,
    error: undefined,
    articles: [
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
        userId: 1,
        id: 2,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        author: 'Varun',
      },
      {
        userId: 1,
        id: 3,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        author: 'Varun',
      },
      {
        userId: 1,
        id: 4,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        author: 'Varun',
      },
      {
        userId: 1,
        id: 5,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        author: 'Varun',
      },
      {
        userId: 1,
        id: 6,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        author: 'Varun',
      },
    ],
  },
};
const store = mockStore(initialStoreData);

const setup = (storeData = store) => {
  const renderPost = (
    <Provider store={storeData}>
      <DisplayPost />
    </Provider>
  );
  return renderPost;
};

describe('Post component loaded ', () => {
  let wrapper: ReactElement;

  beforeEach(() => {
    wrapper = setup(store);
  });

  test('initial loads display post component having 4 posts displayed', () => {
    const { getByTestId, getAllByTestId, queryByTestId } = render(wrapper);
    const postDataDiv = getByTestId('postDataDiv');
    expect(postDataDiv).toBeTruthy();
    const postCard = getAllByTestId('postCard');
    expect(postCard).toHaveLength(4);
    const backDropDiv = getByTestId('backDropDiv');
    const style = window.getComputedStyle(backDropDiv);
    expect(style.visibility).toBe('hidden');
    const notificationDiv = queryByTestId('notificationDiv');
    expect(notificationDiv).toBeNull();
  });

  test('display post is in loading state', () => {
    const storeLoading = mockStore({
      ...initialStoreData,
      articles: {
        articles: [{ ...initialStoreData.articles.articles }],
        isLoading: true,
        isLoaded: false,
        error: undefined,
      },
    });
    wrapper = setup(storeLoading);
    const { getByTestId } = render(wrapper);
    const backDropDiv = getByTestId('backDropDiv');
    expect(backDropDiv).toBeTruthy();
  });

  test('display post is in error state', () => {
    const storeError = mockStore({
      ...initialStoreData,
      articles: {
        articles: [{ ...initialStoreData.articles.articles }],
        isLoading: false,
        isLoaded: true,
        error: 'Error displayed',
      },
    });
    wrapper = setup(storeError);
    const { getByTestId } = render(wrapper);
    const notificationDiv = getByTestId('notificationDiv');
    expect(notificationDiv).toBeTruthy();
    expect(notificationDiv.innerHTML).toContain('Error displayed');
  });

  test('display post component without any post rendered', () => {
    const storeEmptyArticles = mockStore({
      ...initialStoreData,
      articles: {
        ...initialStoreData.articles,
        articles: [],
      },
    });
    wrapper = setup(storeEmptyArticles);
    const { getByTestId, queryByTestId } = render(wrapper);
    const postDataDiv = getByTestId('postDataDiv');
    expect(postDataDiv).toBeTruthy();
    const postCard = queryByTestId('postCard');
    expect(postCard).not.toBeTruthy();
  });

  test('display post component renders more post on click of load more button', async () => {
    const { getByTestId, getAllByTestId, rerender } = render(wrapper);
    const postCard = getAllByTestId('postCard');
    expect(postCard).toHaveLength(4);
    const loadMoreButtonDiv = getByTestId('loadMoreButtonDiv');
    expect(loadMoreButtonDiv).toBeTruthy();
    await waitFor(() => fireEvent.click(loadMoreButtonDiv));
    rerender(
      <Provider store={store}>
        <DisplayPost />
      </Provider>
    );
    const postCardNew = getAllByTestId('postCard');
    expect(postCardNew).toHaveLength(6);
  });
  test('on click of post div post is selected', () => {
    const { getByTestId, getAllByTestId, rerender } = render(wrapper);
    const postCard = getAllByTestId('postCard');
    expect(postCard[0]).toBeTruthy();
    fireEvent.click(postCard[0]);
  });
  test('on click of delete button of post request is sent', () => {
    const storeSelectedArticle = mockStore({
      ...initialStoreData,
      article: {},
    });
    wrapper = setup(storeSelectedArticle);
    const { getByTestId, getAllByTestId, rerender } = render(wrapper);
    const postCardDiv = getAllByTestId('postCardDiv');
    expect(postCardDiv[0]).toBeTruthy();
    const deleteLink = getAllByTestId('deleteLink');
    expect(deleteLink[0]).toBeTruthy();
    fireEvent.click(deleteLink[0]);
  });
});
