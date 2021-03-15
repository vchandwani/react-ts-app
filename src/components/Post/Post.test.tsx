import React, { ReactElement } from 'react';
import {
  fireEvent,
  render,
  cleanup,
  waitFor,
  screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AUTHOR, USERID } from '../../types/post/data';
import Post, { PostProps } from './Post';

afterEach(cleanup);

const mockStore = configureStore([thunk]);
const store = mockStore({
  post: {
    isLoading: false,
    isLoaded: true,
    actioned: false,
    error: undefined,
  },
  posts: {
    isLoading: false,
    isLoaded: true,
    posts: [
      {
        userId: 1,
        id: 1,
        title:
          'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        body:
          'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        author: 'Varun',
      },
    ],
  },
});

const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

const initialData: PostProps = {
  userId: USERID,
  id: 1,
  title:
    'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body:
    'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
  author: AUTHOR,
  clicked: jest.fn(),
  deleteOperation: jest.fn(),
};

const setup = (data: PostProps = initialData, storeData = store) => {
  const renderPost = (
    <Provider store={storeData}>
      <Post {...data} />
    </Provider>
  );
  return renderPost;
};

describe('Post component loaded ', () => {
  let wrapper: ReactElement;

  beforeEach(() => {
    wrapper = setup(initialData, store);
  });

  test('displays initial component with post Card div', async () => {
    const { getByTestId } = render(wrapper);
    const postCardDiv = getByTestId('postCardDiv');
    expect(postCardDiv).toBeTruthy();
    const postContent = getByTestId('postContent');
    expect(postContent).toBeTruthy();
    const postAuthor = getByTestId('postAuthor');
    expect(postAuthor).toBeTruthy();
    const readMoreButton = getByTestId('readMoreButton');
    expect(readMoreButton).toBeTruthy();
    const editLink = getByTestId('editLink');
    expect(editLink).toBeTruthy();
    const deleteLink = getByTestId('deleteLink');
    expect(deleteLink).toBeTruthy();

    const postCard = getByTestId('postCard');
    expect(postCard).toBeTruthy();
    await waitFor(() => fireEvent.click(postCard));
  });
  test('displays component with truncated title, author and body values', () => {
    const { getByTestId } = render(wrapper);
    const postTitle = getByTestId('postTitle');
    expect(postTitle).toBeTruthy();
    expect(postTitle.innerHTML).toContain('sunt aut');
    expect(postTitle.innerHTML).toHaveLength(20);

    const postContent = getByTestId('postContent');
    expect(postContent).toBeTruthy();
    expect(postContent.innerHTML).toContain('quia et sus');
    expect(postContent.innerHTML).toHaveLength(20);

    const postAuthor = getByTestId('postAuthor');
    expect(postAuthor).toBeTruthy();
    expect(postAuthor.innerHTML).toContain(AUTHOR);
  });

  test('displays component with full values of title, author and body values', () => {
    const { getByTestId } = render(wrapper);
    const readMoreButton = getByTestId('readMoreButton');
    expect(readMoreButton).toBeTruthy();
    fireEvent.click(readMoreButton);

    const postTitle = getByTestId('postTitle');
    expect(postTitle).toBeTruthy();
    expect(postTitle.innerHTML).toContain(
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
    );

    const postContent = getByTestId('postContent');
    expect(postContent).toBeTruthy();
    expect(postContent.innerHTML).toContain(
      'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'
    );
  });

  test('displays confirmation dialog on click of delete icon', async () => {
    const { getByTestId, rerender } = render(wrapper);
    const deleteLink = getByTestId('deleteLink');
    expect(deleteLink).toBeTruthy();
    fireEvent.click(deleteLink);

    const postDialogDiv = getByTestId('postDialogDiv');
    expect(postDialogDiv).toBeTruthy();
    const dialogHeader = getByTestId('dialogHeader');
    expect(dialogHeader).toBeTruthy();
    expect(dialogHeader.innerHTML).toContain(
      'Are you sure you want to continue?'
    );

    const dialogTitle = getByTestId('dialogTitle');
    expect(dialogTitle).toBeTruthy();
    expect(dialogTitle.innerHTML).toContain(
      'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
    );

    const dialogBody = getByTestId('dialogBody');
    expect(dialogBody).toBeTruthy();
    expect(dialogBody.innerHTML).toContain(
      'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto'
    );

    const dialogDeleteButton = getByTestId('dialogDeleteButton');
    expect(dialogDeleteButton).toBeTruthy();
    expect(dialogDeleteButton.innerHTML).toContain('Confirm');
    await waitFor(() => fireEvent.click(dialogDeleteButton));
  });

  test('after click of delete icon and loading is visible', () => {
    const storeLoading = mockStore({
      ...store,
      post: {
        isLoading: true,
        isLoaded: false,
        actioned: false,
        error: undefined,
      },
    });
    wrapper = setup(initialData, storeLoading);
    const { getByTestId } = render(wrapper);
    const deleteLink = getByTestId('deleteLink');
    expect(deleteLink).toBeTruthy();
    fireEvent.click(deleteLink);

    const circularDiv = getByTestId('circularDiv');
    expect(circularDiv).toBeTruthy();
    const backDropDiv = getByTestId('backDropDiv');
    const style = window.getComputedStyle(backDropDiv);
    expect(style.visibility).toBe('visible');
  });

  test('On click of close button on Dialog it closes', async () => {
    const { getByTestId } = render(wrapper);
    const deleteLink = getByTestId('deleteLink');
    expect(deleteLink).toBeTruthy();
    fireEvent.click(deleteLink);
    const dialogCloseButton = getByTestId('dialogCloseButton');
    expect(dialogCloseButton).toBeTruthy();
    await waitFor(() => fireEvent.click(dialogCloseButton));
    const backDropDiv = getByTestId('backDropDiv');
    const style = window.getComputedStyle(backDropDiv);
    expect(style.visibility).toBe('hidden');
  });

  test('On click of edit button correct history push is called', async () => {
    const { getByTestId } = render(wrapper);
    const editLink = getByTestId('editLink');
    expect(editLink).toBeTruthy();
    await waitFor(() => fireEvent.click(editLink));
    expect(mockHistoryPush.mock.calls[0][0]).toBe(`/newPost`);
  });

  test('On actioned success close button is visible', async () => {
    const storeActioned = mockStore({
      ...store,
      post: {
        isLoading: false,
        isLoaded: false,
        actioned: true,
        error: undefined,
      },
    });
    wrapper = setup(initialData, storeActioned);

    const { getByTestId } = render(wrapper);
    const deleteLink = getByTestId('deleteLink');
    fireEvent.click(deleteLink);
    const dialogCloseButton = getByTestId('dialogCloseButton');
    expect(dialogCloseButton).toBeTruthy();
    expect(dialogCloseButton.innerHTML).toContain('Close');
    const notificationDiv = getByTestId('notificationDiv');
    expect(notificationDiv).toBeTruthy();
    expect(notificationDiv.innerHTML).toContain('Post deleted');
  });

  test('On action error, error notitification is displayed ', async () => {
    const storeError = mockStore({
      ...store,
      post: {
        isLoading: false,
        isLoaded: false,
        actioned: false,
        error: 'Error encountered',
      },
    });
    wrapper = setup(initialData, storeError);

    const { getByTestId } = render(wrapper);
    const deleteLink = getByTestId('deleteLink');
    fireEvent.click(deleteLink);
    const dialogCloseButton = getByTestId('dialogCloseButton');
    expect(dialogCloseButton).toBeTruthy();
    expect(dialogCloseButton.innerHTML).toContain('Cancel');
    const notificationDiv = getByTestId('notificationDiv');
    expect(notificationDiv).toBeTruthy();
    expect(notificationDiv.innerHTML).toContain('Error encountered');
    const postDialogDiv = getByTestId('postDialogDiv');
    expect(postDialogDiv).toBeTruthy();
    fireEvent.click(postDialogDiv);
  });
});
