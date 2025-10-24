import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Label from '../label';

jest.mock('../../Count', () => 'Count');
jest.mock('../multiSelectIcon', () => 'MultiSelectIcon');
jest.mock('../../Swatch/imageSwatch', () => 'ImageSwatch');
jest.mock('react-intl', () => ({
  useIntl: jest.fn().mockReturnValue({
    formatMessage: jest
      .fn()
      .mockImplementation(options => options.defaultMessage)
  })
}));

test('render correct label', () => {
  const props = {
    item: {
      label: 'test',
      count: 4
    }
  };
  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render label with image', () => {
  const props = {
    item: {
      label: 'test',
      count: 4,
      image: 'imgPatch'
    }
  };
  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render label with multiselect icon', () => {
  const props = {
    item: {
      label: 'test',
      count: 4
    },
    isMultiSelect: true
  };
  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
