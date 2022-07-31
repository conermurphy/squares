import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('Should render correctly', () => {
    render(<Header />);

    const title = screen.getByText(/squares/i);
    const link = screen.getByText(/get started/i);

    expect(title).toBeVisible();
    expect(link).toBeVisible();

    expect(link).toHaveAttribute('href', 'https://app.squares.so');
    expect(title).toHaveAttribute('href', '/');
  });
});
