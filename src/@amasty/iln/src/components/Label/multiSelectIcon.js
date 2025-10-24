import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { bool, shape, string } from 'prop-types';

import defaultClasses from './label.css';
import { CheckSquare, Square } from 'react-feather';
const checkedIcon = <CheckSquare />;
const uncheckedIcon = <Square />;

const MultiSelectIcon = props => {
  const { isSelected } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const icon = isSelected ? checkedIcon : uncheckedIcon;

  return <span className={classes.checkbox}>{icon}</span>;
};

MultiSelectIcon.propTypes = {
  isSelected: bool,
  classes: shape({
    root: string
  })
};

export default MultiSelectIcon;
