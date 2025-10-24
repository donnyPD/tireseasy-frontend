import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Swatch from '../swatch';

jest.mock('../imageSwatch', () => 'ImageSwatch');
jest.mock('../textSwatch', () => 'TextSwatch');

test('render text swatch', () => {
  const props = {
    item: {
      label: 'test',
      count: 4
    }
  };
  const tree = createTestInstance(<Swatch {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('render image swatch', () => {
  const props = {
    item: {
      label: 'test',
      count: 4,
      image: 'imgSrc'
    }
  };
  const tree = createTestInstance(<Swatch {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
