import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import FilterList from '../filterList';
import { useFilterList } from '../../../talons/useFilterList';

jest.mock('../filterItem', () => 'FilterItem');
jest.mock('../searchField', () => 'SearchField');
jest.mock('../showMoreLessButton', () => 'ShowMoreLessButton');

jest.mock('../../../talons/useFilterList', () => {
  const useFilterList = jest.fn(() => {});

  return { useFilterList };
});

const props = {
  items: [
    {
      title: 'test1',
      value: '1'
    },
    {
      title: 'test2',
      value: '2'
    }
  ]
};

test('render correct list', () => {
  useFilterList.mockReturnValue({
    isListExpanded: true,
    itemCountToShow: 5,
    searchProps: {},
    visibleItems: new Set()
  });

  const tree = createTestInstance(<FilterList {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render correct list with search', () => {
  useFilterList.mockReturnValue({
    isListExpanded: true,
    itemCountToShow: 5,
    searchProps: {
      isShowSearchBox: true
    },
    visibleItems: new Set()
  });

  const tree = createTestInstance(<FilterList {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
