import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { queryByTitle } = render(<App />);
  const mainDiv = queryByTitle('mainDiv');
  expect(mainDiv).toBeTruthy();
});
