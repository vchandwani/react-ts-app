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
import PostForm, { FormProps } from './PostForm';
import { AUTHOR, PostDataObj, USERID } from '../../types/post/data';
import userEvent from '@testing-library/user-event';

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
  title: 'Test title',
  body: 'Test body',
  author: AUTHOR,
  userId: USERID,
};
const handleSubmit = jest.fn();
const backClick = jest.fn();

const setup = (storeData = store) => {
  const renderPostForm = (
    <Provider store={storeData}>
      <PostForm
        formValues={filledData}
        onSubmit={handleSubmit}
        backClick={backClick}
        editable={false}
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

  test('initial loads display post form having fields filled', async () => {
    const { getByTestId } = render(wrapper);
    const title = getByTestId('postFormTitleField');
    const content = getByTestId('postFormBodyField');
    fireEvent.change(title, { target: { value: 'Test title' } });
    fireEvent.change(content, { target: { value: 'Test body' } });
    userEvent.click(screen.getByRole('button', { name: /Add Post/i }));
    expect(handleSubmit).toHaveBeenCalled();

    // await waitFor(() =>
    //   expect(handleSubmit).toHaveBeenCalledWith(
    //     {
    //       title: 'Test title',
    //       body: 'Test body',
    //       author: 'Varun',
    //       userId: 1,
    //     },
    //     expect.anything()
    //   )
    // );
  });
});
