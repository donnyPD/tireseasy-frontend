import React from 'react';
import { string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import BrandList from './brandList';
import defaultClasses from './allBrandsPage.css';

const EMPTY_MESSAGE = `Please select brand attribute in Stores -> Configuration ->
Amasty Extensions -> Improved Layered Navigation: Brands.`;

const Letters = props => {
  const { letters, brands, settings } = props;

  const classes = mergeClasses(defaultClasses, props.classes);

  if (!letters) {
    return <div className={classes.message}>{EMPTY_MESSAGE}</div>;
  }

  const items = letters.split(',').map(item => (
    <dl key={item} className={classes.letter}>
      <dt className={classes.letterHeader}>
        <span className={classes.letterName}>{item}</span>
      </dt>
      <dd className={classes.letterBrands}>
        <BrandList brands={brands[item]} settings={settings} />
      </dd>
    </dl>
  ));

  return <div className={classes.letters}>{items}</div>;
};

Letters.propTypes = {
  letters: string
};

export default Letters;
