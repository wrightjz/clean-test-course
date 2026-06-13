import { render, screen } from '@testing-library/react';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import Home from '.';

describe('Test Home', () => {
  // Shared mock: intercept axios GET and return a canned category response
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockImplementation((url) => {
      switch (url) {
        case `${API_URL}/api/category/?format=json`:
          return Promise.resolve({
            data: {
              status: 'success',
              data: [
                {
                  id: 1,
                  name: 'Handhelds',
                  description: "So big, you don't need thumbs.",
                },
                {
                  id: 2,
                  name: 'Appeteasers',
                  description: 'Tease the hangry hippo, he get hangrier',
                },
              ],
            },
          });
        default:
          return Promise.resolve({
            data: {
              status: 'fail',
            },
          });
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Functional test: the page renders and shows the category items
  test('renders the category items', async () => {
    render(<Home />);

    // There should be 2 categories as defined in the mock response
    expect(await screen.findAllByTestId(/category-item/i)).toHaveLength(2);
  });

  // Integration test: data fetched via axios is wired through to the UI
  test('fetches categories and displays them', async () => {
    render(<Home />);

    // 'Appeteasers' comes from the mocked GET response
    expect(await screen.findByText('Appeteasers')).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/api/category/?format=json`
    );
  });
});
