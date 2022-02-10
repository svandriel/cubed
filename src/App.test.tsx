import { render, screen } from '@testing-library/react';

import App from './App';

test.skip('renders the app page', () => {
  render(<App />);
  const linkElement = screen.getByText(/All is working correctly/i);
  expect(linkElement).toBeInTheDocument();
});
