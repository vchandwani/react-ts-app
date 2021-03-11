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
import NewPost from './NewPost';

afterEach(cleanup);

const mockStore = configureStore([thunk]);
const initialStoreData = {
  post: {
    isLoading: false,
    isLoaded: true,
    actioned: false,
    error: undefined,
    post: {},
  },
  posts: {},
};
const mockHistoryPush = jest.fn();
const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    replace: mockHistoryReplace,
  }),
}));

const store = mockStore(initialStoreData);

const setup = (storeData = store) => {
  const renderPostForm = (
    <Provider store={storeData}>
      <NewPost />
    </Provider>
  );
  return renderPostForm;
};

describe('Render Post form ', () => {
  let wrapper: ReactElement;

  beforeEach(() => {
    wrapper = setup(store);
  });
  test('initial loads display post form having fields visible', () => {
    const { getByTestId } = render(wrapper);
    const postFormDiv = getByTestId('postFormDiv');
    expect(postFormDiv).toBeTruthy();
    const postFormHeader = getByTestId('postFormHeader');
    expect(postFormHeader).toBeTruthy();
    expect(postFormHeader.innerHTML).toContain('Add Post');
    const postFormContainer = getByTestId('postFormContainer');
    expect(postFormContainer).toBeTruthy();
  });

  test('check post form required fields and back button click', async () => {
    const { getByTestId } = render(wrapper);
    const postFormSubmitButton = getByTestId('postFormSubmitButton');
    expect(postFormSubmitButton).toBeTruthy();
    expect(postFormSubmitButton.innerHTML).toContain('Add Post');
    await waitFor(() => fireEvent.click(postFormSubmitButton));

    const postFormTitleDiv = getByTestId('postFormTitleDiv');
    expect(postFormTitleDiv).toBeTruthy();
    expect(postFormTitleDiv.innerHTML).toContain('Required');

    const postFormBackButton = getByTestId('postFormBackButton');
    expect(postFormBackButton).toBeTruthy();
    await waitFor(() => fireEvent.click(postFormBackButton));
    expect(mockHistoryPush.mock.calls[0][0]).toBe(`/`);
  });

  test('check post form with values', async () => {
    const { getByTestId, getAllByTestId } = render(wrapper);
    const title = getByTestId('postFormTitleField');
    const content = getByTestId('postFormBodyField');
    expect(title.value).toBe('');
    expect(content.value).toBe('');
    fireEvent.change(title, { target: { value: 'Test title' } });
    fireEvent.change(content, { target: { value: 'Content example' } });
    expect(title.value).toBe('Test title');
    expect(content.value).toBe('Content example');

    const select = await waitFor(() => getByTestId('postFormAuthorField'));
    fireEvent.change(select, { target: { value: 'Unknown' } });
    await waitFor(() => expect(select.value).toBe('Unknown'));
  });

  test('check loader on laoding state', async () => {
    const storeWithError = mockStore({
      ...initialStoreData,
      post: {
        isLoading: true,
        isLoaded: true,
        actioned: false,
        error: undefined,
      },
    });
    const { getByTestId } = render(
      <Provider store={storeWithError}>
        <NewPost />
      </Provider>
    );
    const backDropDiv = getByTestId('backDropDiv');
    const style = window.getComputedStyle(backDropDiv);
    expect(style.opacity).toBe('1');
  });

  test('check error notification when error encountered ', async () => {
    const storeWithError = mockStore({
      ...initialStoreData,
      post: {
        isLoading: false,
        isLoaded: true,
        actioned: false,
        error: 'Error notification',
      },
    });
    render(
      <Provider store={storeWithError}>
        <NewPost />
      </Provider>
    );
    expect(screen.getByText(/Error notification/i)).toBeInTheDocument();
  });

  test('check success notification when add data submitted ', async () => {
    const storeWithActioned = mockStore({
      ...initialStoreData,
      post: {
        isLoading: false,
        isLoaded: true,
        actioned: true,
        error: undefined,
      },
    });
    wrapper = setup(storeWithActioned);
    render(wrapper);

    expect(screen.getByText(/Post added/i)).toBeInTheDocument();
  });
  test('check success notification when edit data submitted ', async () => {
    const storeWithActioned = mockStore({
      ...initialStoreData,
      post: {
        isLoading: false,
        isLoaded: true,
        actioned: true,
        error: undefined,
        editable: true,
      },
    });
    wrapper = setup(storeWithActioned);
    render(wrapper);

    expect(screen.getByText(/Post edited/i)).toBeInTheDocument();
  });
});
