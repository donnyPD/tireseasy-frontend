import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import ImageSwatch from '../imageSwatch';
import Icon from '@magento/venia-ui/lib/components/Icon';

jest.mock('@magento/venia-ui/lib/components/Icon', () => 'Icon');
jest.mock('@magento/peregrine/lib/util/imageUtils', () => {
  return {
    generateUrl: jest.fn(() => () => '')
  };
});

const defaultProps = {
  swatchData: '#ccc',
  label: 'Test',
  isSelected: false
};

test('renders a Swatch correctly', () => {
  const component = createTestInstance(<ImageSwatch {...defaultProps} />);

  expect(() => component.root.findByType(Icon)).toThrow();

  expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Swatch correctly image', () => {
  const props = {
    ...defaultProps,
    swatchData: '/imgSrc'
  };
  const component = createTestInstance(<ImageSwatch {...props} />);

  expect(component.toJSON()).toMatchSnapshot();
});

test('renders an icon if isSelected is true', () => {
  const props = {
    ...defaultProps,
    isSelected: true
  };

  const component = createTestInstance(<ImageSwatch {...props} />);

  expect(() => component.root.findByType(Icon)).not.toThrow();
  expect(component.toJSON()).toMatchSnapshot();
});
