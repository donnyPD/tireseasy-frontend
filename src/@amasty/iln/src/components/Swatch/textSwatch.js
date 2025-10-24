import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, bool } from 'prop-types';

import defaultClasses from './swatch.css';

const TextSwatch = props => {
  const { label, isSelected, swatchData } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const className = classes[`textSwatch${isSelected ? '_selected' : ''}`];

  return (
    <span className={className}>
      {swatchData || label}
      <span className={classes.tooltip}>
        <span className={classes.label}>{label}</span>
      </span>
    </span>
  );
};

TextSwatch.propTypes = {
  label: string,
  isSelected: bool,
  swatchData: string,
  classes: shape({
    root: string
  })
};

export default TextSwatch;
