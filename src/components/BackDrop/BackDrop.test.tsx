import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import BackDrop from './BackDrop';

test('loads and displays backdrop', () => {
  const { getByTestId, rerender } = render(<BackDrop open={true} />);
  expect(getByTestId('backdropDiv')).toBeTruthy();
  expect(getByTestId('circularDiv')).toBeTruthy();

  rerender(<BackDrop open={false} />);
  const backdropDiv = getByTestId('backdropDiv');
  const style = window.getComputedStyle(backdropDiv);
  expect(style.opacity).toBe('0');
});

test('loads and backdrop is hidden', () => {
  const { getByTestId, rerender } = render(<BackDrop open={false} />);
  const backdropDiv = getByTestId('backdropDiv');
  const style = window.getComputedStyle(backdropDiv);
  expect(style.visibility).toBe('hidden');
  rerender(<BackDrop open={true} />);
  const circularDiv = getByTestId('circularDiv');
  expect(circularDiv.className).toContain('MuiCircularProgress-root');
});
