import React, { Fragment } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './label.css';
import Count from '../Count';
import MultiSelectIcon from './multiSelectIcon';
import ImageSwatch from '../Swatch/imageSwatch';
import { useIntl } from 'react-intl';

const Label = props => {
  const {
    isSelected,
    item: { label, image, count },
    onClick,
    showProductQuantities,
    isMultiSelect
  } = props;

  const { formatMessage } = useIntl();

  const classes = mergeClasses(defaultClasses, props.classes);
  const className = classes[`root${isSelected ? '_selected' : ''}`];

  const multiSelectIcon = isMultiSelect ? (
    <MultiSelectIcon isSelected={isSelected} />
  ) : null;

  const img = image ? (
    <ImageSwatch
      isSelected={isSelected}
      swatchData={image}
      classes={{
        imageSwatch: classes.image,
        imageSwatch_selected: classes.image_selected
      }}
    />
  ) : null;

  const labelText = typeof label === 'object' ? formatMessage(label) : label;

  return (
    <Fragment>
      <button
        className={className}
        title={label}
        onClick={onClick}
        type="button"
      >
        {multiSelectIcon}
        {img}
        <span className={classes.label}>{labelText}</span>
        <Count count={count} showProductQuantities={showProductQuantities} />
      </button>
    </Fragment>
  );
};

Label.propTypes = {
  classes: shape({
    root: string
  })
};

export default Label;
