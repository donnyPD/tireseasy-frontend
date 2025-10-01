import React from 'react';
import { Link } from 'react-router-dom';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Breadcrumbs/breadcrumbs.module.css';
import { string } from 'prop-types';

const Breadcrumbs = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { currentBrand } = props;

  return (
    <div className={classes.root}>
      <Link className={classes.link} to="/">
        {'Home'}
      </Link>
      <span className={classes.divider}>/</span>
      <span className={classes.text}>{currentBrand}</span>
    </div>
  );
};

Breadcrumbs.propTypes = {
  currentBrand: string.isRequired
};

export default Breadcrumbs;
