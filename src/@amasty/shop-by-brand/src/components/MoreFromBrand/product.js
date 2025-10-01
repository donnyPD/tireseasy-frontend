import React, { useCallback } from 'react';
import { number, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './moreFromBrand.css';
import Image from '@magento/venia-ui/lib/components/Image';
import { Price } from '@magento/peregrine';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import Button from '@magento/venia-ui/lib/components/Button';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import {
  ADD_CONFIGURABLE_MUTATION,
  ADD_SIMPLE_MUTATION
} from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.gql';
import { useHistory, Link } from 'react-router-dom';
import { Form } from 'informed';

// The placeholder image is 4:5, so we should make sure to size our product
// images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map()
  .set(640, IMAGE_WIDTH)
  .set(UNCONSTRAINED_SIZE_KEY, 840);

const Product = props => {
  const { product } = props;
  const history = useHistory();

  const talonProps = useProductFullDetail({
    addSimpleProductToCartMutation: ADD_SIMPLE_MUTATION,
    addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION,
    product
  });

  const { handleAddToCart, isAddToCartDisabled } = talonProps;

  const classes = mergeClasses(defaultClasses, props.classes);

  const { name, price, small_image, url_rewrites } = product;
  const productLink = resourceUrl(
    `/${url_rewrites && url_rewrites.length ? url_rewrites[0].url : ''}`
  );
  const isConfigurable = isProductConfigurable(product);

  const addToCart = useCallback(() => {
    if (!isConfigurable) {
      handleAddToCart({ quantity: 1 });
    } else {
      history.push(productLink);
    }
  }, [history, productLink, handleAddToCart, isConfigurable]);

  return (
    <li className={classes.product}>
      <Form onSubmit={addToCart}>
        <Link to={productLink} className={classes.images}>
          <Image
            alt={name}
            classes={{
              image: classes.image,
              root: classes.imageContainer
            }}
            height={IMAGE_HEIGHT}
            resource={small_image}
            widths={IMAGE_WIDTHS}
          />
        </Link>
        <Link to={productLink} className={classes.name}>
          <span>{name}</span>
        </Link>
        <div className={classes.price}>
          <Price
            value={price.regularPrice.amount.value}
            currencyCode={price.regularPrice.amount.currency}
          />
        </div>
        <div className={classes.actions}>
          <Button
            type="submit"
            priority="high"
            disabled={!isConfigurable && isAddToCartDisabled}
          >
            {'Add to Cart'}
          </Button>
        </div>
      </Form>
    </li>
  );
};

Product.propTypes = {
  product: shape({
    id: number.isRequired,
    name: string.isRequired,
    small_image: string.isRequired,
    price: shape({
      regularPrice: shape({
        amount: shape({
          value: number.isRequired,
          currency: string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  })
};

export default Product;
