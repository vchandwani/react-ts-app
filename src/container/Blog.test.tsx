import React, { ReactElement } from 'react';
import { render, cleanup, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

const mockStore = configureStore([thunk]);
const store = mockStore({
  post: {
    isLoading: false,
    isLoaded: true,
    actioned: false,
    error: undefined,
    editable: false,
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

  test('redirect to home page on click of list link', async () => {
    const history = createMemoryHistory();
    const route = '/';
    history.push(route);
    const { getByTestId } = render(
      <Router history={history}>
        <Provider store={store}>
          <Blog />
        </Provider>
      </Router>
    );
    const loadMoreButtonDiv = getByTestId('loadMoreButtonDiv');
    expect(loadMoreButtonDiv).toBeTruthy();
  });
  test('redirect to home page on click of add post link', async () => {
    const history = createMemoryHistory();
    const route = '/newPost';
    history.push(route);
    const { getByTestId } = render(
      <Router history={history}>
        <Provider store={store}>
          <Blog />
        </Provider>
      </Router>
    );
    // const postFormSubmitButton = getByTestId('postFormSubmitButton');
    const leftClick = { button: 0 };
    userEvent.click(screen.getByText(/Add Post/i), leftClick);
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Title/i)).toBeInTheDocument();
  });
});
