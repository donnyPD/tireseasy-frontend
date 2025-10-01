import React from 'react';
import { array } from 'prop-types';
import BrandItem from './brandItem';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './allBrandsPage.css';

const BrandList = props => {
  const { brands, settings } = props;

  if (!Array.isArray(brands) || !brands.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const list = brands.map(brand => (
    <BrandItem key={brand.label} {...brand} settings={settings} />
  ));

  return <ul className={classes.brandList}>{list}</ul>;
};

BrandList.propTypes = {
  brands: array
};

export default BrandList;
