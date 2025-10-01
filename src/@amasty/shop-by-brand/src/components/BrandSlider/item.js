import React from 'react';
import { bool, number, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './brandSlider.css';
import { Link } from 'react-router-dom';
import { getBrandUrl } from '../../utils';

const Item = props => {
  const {
    img,
    label,
    alt,
    url,
    image_width: imageWidth,
    image_height: imageHeight,
    show_label: showLabel
  } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const link = getBrandUrl(url);

  const image = img ? (
    <img
      className={classes.image}
      src={img}
      width={imageWidth}
      height={imageHeight}
      alt={alt || label}
    />
  ) : (
    <span className={classes.noImage}>{label[0]}</span>
  );

  const imageContainerHeight = Math.max(imageHeight || 0, imageWidth);

  return (
    <div className={classes.item}>
      <Link
        to={link}
        style={{ minHeight: imageContainerHeight }}
        className={classes.imageRoot}
      >
        {image}
      </Link>
      {showLabel && (
        <Link to={link}>
          <span className={classes.label}>{label}</span>
        </Link>
      )}
    </div>
  );
};

Item.propTypes = {
  image_width: number,
  img: string,
  label: string,
  alt: string,
  image_height: number,
  show_label: bool
};

Item.defaultProps = {
  image_width: 130
};

export default Item;
