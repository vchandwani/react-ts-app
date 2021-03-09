import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BackDrop from './BackDrop';

test('loads and displays backdrop', () => {
  const { getByTestId, rerender } = render(<BackDrop open={true} />);
  expect(getByTestId('backDropDiv')).toBeTruthy();
  expect(getByTestId('circularDiv')).toBeTruthy();

  rerender(<BackDrop open={false} />);
  const backDropDiv = getByTestId('backDropDiv');
  const style = window.getComputedStyle(backDropDiv);
  expect(style.opacity).toBe('0');
});

test('loads and backdrop is hidden', () => {
  const { getByTestId, rerender } = render(<BackDrop open={false} />);
  const backDropDiv = getByTestId('backDropDiv');
  const style = window.getComputedStyle(backDropDiv);
  expect(style.visibility).toBe('hidden');
  rerender(<BackDrop open={true} />);
  const circularDiv = getByTestId('circularDiv');
  expect(circularDiv.className).toContain('MuiCircularProgress-root');
});
