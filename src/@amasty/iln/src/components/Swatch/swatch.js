import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import defaultClasses from './swatch.css';
import ImageSwatch from './imageSwatch';
import TextSwatch from './textSwatch';

const Swatch = props => {
  const {
    isSelected,
    item: { label, image },
    onClick,
    textOnly
  } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const className = classes[`root${isSelected ? '_selected' : ''}`];

  const child =
    !textOnly && image ? (
      <ImageSwatch isSelected={isSelected} label={label} swatchData={image} />
    ) : (
      <TextSwatch label={label} isSelected={isSelected} swatchData={image} />
    );

  return (
    <button className={className} title={label} onClick={onClick} type="button">
      {child}
    </button>
  );
};

Swatch.propTypes = {
  classes: shape({
    root: string
  })
};

export default Swatch;
