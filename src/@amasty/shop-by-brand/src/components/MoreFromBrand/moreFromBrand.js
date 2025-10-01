import React from 'react';
import { number } from 'prop-types';
import { useMoreFromBrand } from '../../talons/useMoreFromBrand';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './moreFromBrand.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Product from './product';

// map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape to maintain backwards compatibility
const mapGalleryItem = item => {
  const { small_image } = item;
  return {
    ...item,
    small_image: typeof small_image === 'object' ? small_image.url : small_image
  };
};

const MoreFromBrand = props => {
  const { productId } = props;
  const { loading, error, title, items } = useMoreFromBrand({ productId });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!productId || error || !Array.isArray(items) || !items.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const products = items.map(item => (
    <Product key={item.uid} product={mapGalleryItem(item)} />
  ));

  return (
    <div className={classes.root}>
      {title && <h3 className={classes.title}>{title}</h3>}
      <ul className={classes.products}>{products}</ul>
    </div>
  );
};

MoreFromBrand.propTypes = {
  productId: number
};

export default MoreFromBrand;
