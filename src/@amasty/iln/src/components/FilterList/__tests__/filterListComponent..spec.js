import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import FilterListComponent from '../filterListComponent';

jest.mock('../filterList', () => 'FilterList');
jest.mock('../filterTypeConfig', () => {
  return {
    filterTypeConfig: 'filterTypeConfig'
  };
});

test('renders default filter list', () => {
  const props = {
    filterBlockSettings: {
      display_mode_label: undefined
    }
  };

  const tree = createTestInstance(<FilterListComponent {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders from config', () => {
  const props = {
    filterBlockSettings: {
      display_mode_label: 'Slider'
    }
  };

  const tree = createTestInstance(<FilterListComponent {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
