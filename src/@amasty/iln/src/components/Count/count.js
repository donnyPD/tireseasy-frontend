import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { bool, number, shape, string } from 'prop-types';

import defaultClasses from './count.css';

const Count = props => {
  const { count, showProductQuantities } = props;

  if (!showProductQuantities) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  return <span className={classes.root}>({count})</span>;
};

Count.propTypes = {
  count: number,
  showProductQuantities: bool,
  classes: shape({
    root: string
  })
};

export default Count;
