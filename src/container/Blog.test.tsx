import React, { ReactElement } from 'react';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Blog from './Blog';

const mockStore = configureStore([thunk]);
const store = mockStore({
  post: {
    isLoading: false,
    isLoaded: true,
    actioned: false,
    error: undefined,
  },
  posts: {},
});

const setup = (storeData = store) => {
  const renderBlog = (
    <Provider store={storeData}>
      <Blog />
    </Provider>
  );
  return renderBlog;
};

afterEach(cleanup);

describe('Blog container loaded ', () => {
  let wrapper: ReactElement;

  beforeEach(() => {
    wrapper = setup(store);
  });

  test('renders portal container', () => {
    const { getByTestId } = render(wrapper);
    expect(getByTestId('portalContainer')).toBeTruthy();
  });
  test('renders portal header', () => {
    const { getByTestId } = render(wrapper);
    const portalHeader = getByTestId('portalHeader');
    expect(portalHeader).toBeTruthy();
    expect(portalHeader.innerHTML).toContain('Post Portal');
  });
  test('renders portal navigation', () => {
    const { getByTestId } = render(wrapper);
    const navigationLink = getByTestId('navigationLink');
    expect(navigationLink).toBeTruthy();
    expect(navigationLink.innerHTML).toContain('List');
    expect(navigationLink.innerHTML).toContain('Add Post');
  });
  test('renders portal sub header', () => {
    const { getByTestId } = render(wrapper);
    const portalSubHeader = getByTestId('portalSubHeader');
    expect(portalSubHeader).toBeTruthy();
    expect(portalSubHeader.innerHTML).toContain('Posts Portal!');
  });
  test('renders portal description', () => {
    const { getByTestId } = render(wrapper);
    const portalDescription = getByTestId('portalDescription');
    expect(portalDescription).toBeTruthy();
    expect(portalDescription.innerHTML).toContain(
      'Posts can be added, edited and deleted'
    );
  });
});
