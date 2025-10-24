import React, { useMemo } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { bool, shape, string } from 'prop-types';

import defaultClasses from './swatch.css';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Check as CheckIcon } from 'react-feather';
import { generateUrl } from '@magento/peregrine/lib/util/imageUtils';

const SWATCH_WIDTH = 96;

const ImageSwatch = props => {
  const { isSelected, style, swatchData, label } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const icon = useMemo(() => {
    return isSelected ? <Icon src={CheckIcon} /> : null;
  }, [isSelected]);

  const finalStyle = useMemo(() => {
    let result = style;

    if (swatchData) {
      let swatchValue = swatchData;

      if (!swatchData.startsWith('#')) {
        const imagePath = generateUrl(swatchData, 'image-swatch')(SWATCH_WIDTH);

        swatchValue = `url("${imagePath}")`;
      }

      result = Object.assign({}, style, {
        '--venia-swatch-bg': swatchValue
      });
    }

    return result;
  }, [style, swatchData]);

  const className = classes[`imageSwatch${isSelected ? '_selected' : ''}`];

  return (
    <span className={className} style={finalStyle}>
      {icon}
      <span className={classes.tooltip}>
        <span className={classes.image} style={finalStyle} />
        <span className={classes.label}>{label}</span>
      </span>
    </span>
  );
};

ImageSwatch.propTypes = {
  isSelected: bool,
  swatchData: string,
  label: string,
  classes: shape({
    root: string
  })
};

export default ImageSwatch;
