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
import userEvent from '@testing-library/user-event';
import NewPost from './NewPost';
import { PostDataObj, AUTHOR } from '../../types/post/data';

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

    const postFormTitleField = getByTestId('postFormTitleField');
    expect(postFormTitleField).toBeTruthy();
    expect(postFormTitleField.innerHTML).toContain('Required');

    const postFormBackButton = getByTestId('postFormBackButton');
    expect(postFormBackButton).toBeTruthy();
    await waitFor(() => fireEvent.click(postFormBackButton));
    expect(mockHistoryPush.mock.calls[0][0]).toBe(`/`);
  });

  test('check post form submit with values', async () => {
    const { getByTestId, getAllByTestId } = render(wrapper);
    const postFormSubmitButton = getByTestId('postFormSubmitButton');
    expect(postFormSubmitButton).toBeTruthy();

    const title = screen.getByLabelText('Title');
    const content = screen.getByLabelText('Content');
    const author = getByTestId('postFormAuthorField');
    expect(title.value).toBe('');
    expect(content.value).toBe('');
    // fireEvent.change(title, { target: { value: 'Test Title' } });
    // fireEvent.change(content, { target: { value: 'Content example' } });

    userEvent.type(title, 'Test Title');
    userEvent.type(content, 'Content example');
    expect(title.value).toBe('Test Title');
    expect(content.value).toBe('Content example');
  });
});
