import React from 'react';
import customClasses from '../src/extendStyle/filterSidebar.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

const WrapFilterSidebar = Component => props => {
  const classes = mergeClasses(customClasses, props.classes);

  return <Component {...props} classes={classes} />;
};

export default WrapFilterSidebar;
