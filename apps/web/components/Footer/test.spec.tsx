import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('Should render correctly', () => {
    render(<Footer />);

    const title = screen.getAllByText(/squares/i)[0];
    const copyright = screen.getByText(
      /© Copyright 2022 Squares. All rights reserved./i
    );
    const credits = screen.getByText(
      /Built for the PlanetScale & Hashnode Hackathon./i
    );

    expect(title).toBeVisible();
    expect(copyright).toBeVisible();
    expect(credits).toBeVisible();
  });
});
