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
import PostForm, { FormProps } from './PostForm';
import { AUTHOR, PostDataObj, USERID } from '../../types/post/data';

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
const store = mockStore(initialStoreData);

const filledData: PostDataObj = {
  title: '',
  body: '',
  author: AUTHOR,
  userId: USERID,
};
const editFilledData: PostDataObj = {
  title: 'Test title',
  body: 'Test body',
  author: AUTHOR,
  userId: USERID,
  id: 1,
};
const handleSubmit = jest.fn();
const backClick = jest.fn();

const setup = (storeData = store, editable: boolean = false) => {
  const renderPostForm = (
    <Provider store={storeData}>
      <PostForm
        formValues={editable ? editFilledData : filledData}
        handleSubmit={handleSubmit}
        backClick={backClick}
        editable={editable}
      />
    </Provider>
  );
  return renderPostForm;
};

describe('Render Post form component', () => {
  let wrapper: ReactElement;

  beforeEach(() => {
    wrapper = setup(store);
  });
  test('initial loads display post form having error fields', async () => {
    const { getByTestId } = render(wrapper);
    const titlediv = getByTestId('postFormTitleDiv');
    const title = getByTestId('postFormTitleField');
    const content = getByTestId('postFormBodyField');
    const postFormSubmitButton = getByTestId('postFormSubmitButton');
    fireEvent.change(title, { target: { value: 'Te' } });
    expect(title.value).toBe('Te');
    fireEvent.change(content, { target: { value: '' } });
    expect(content.value).toBe('');
    await waitFor(() => fireEvent.click(postFormSubmitButton));
    expect(screen.getByText(/Minimum 5 characters!/i)).toBeInTheDocument();
    expect(getByTestId('errorIcon')).toBeTruthy();
  });
  test('initial loads display post form having fields filled', async () => {
    const { getByTestId } = render(wrapper);
    const title = getByTestId('postFormTitleField');
    const content = getByTestId('postFormBodyField');
    const successIcon = getByTestId('successIcon');
    fireEvent.change(title, { target: { value: 'Test title' } });
    fireEvent.change(content, { target: { value: 'Test body' } });
    const postFormSubmitButton = getByTestId('postFormSubmitButton');
    await waitFor(() => fireEvent.click(postFormSubmitButton));
    expect(successIcon).toBeTruthy();

    expect(handleSubmit).toHaveBeenCalled();

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        title: 'Test title',
        body: 'Test body',
        author: 'Varun',
        userId: 1,
      })
    );
  });

  test('initial loads of edit mode ', async () => {
    wrapper = setup(store, true);
    const { getByTestId } = render(wrapper);
    const titlediv = getByTestId('postFormTitleDiv');
    const title = getByTestId('postFormTitleField');
    const content = getByTestId('postFormBodyField');
    const postFormSubmitButton = getByTestId('postFormSubmitButton');
    expect(title.value).toBe(editFilledData.title);
    expect(content.value).toBe(editFilledData.body);
    fireEvent.change(title, { target: { value: 'New title' } });
    expect(title.value).toBe('New title');
    fireEvent.change(content, { target: { value: 'New body' } });
    expect(content.value).toBe('New body');
    expect(screen.getByText(/Edit Post/i)).toBeInTheDocument();
    await waitFor(() => fireEvent.click(postFormSubmitButton));
    expect(handleSubmit).toHaveBeenCalled();
    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        title: 'New title',
        body: 'New body',
        author: 'Varun',
        userId: 1,
        id: 1,
      })
    );
  });
});
