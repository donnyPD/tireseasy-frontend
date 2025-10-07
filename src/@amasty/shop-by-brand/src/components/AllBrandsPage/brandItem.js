import React from 'react';
import { bool, number, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Link } from 'react-router-dom';
import { getBrandUrl, getBrandLogoUrl } from '../../utils';
import defaultClasses from './brand.css';
import { useCustomHeader } from '../../../../../components/Header/useCustomHeader';

const IMG_DEFAULT_WIDTH = 100;

const BrandItem = props => {
  const { label, url, img, alt, letter, cnt, settings } = props;
  const { storeConfig } = useCustomHeader();

  const classes = mergeClasses(defaultClasses, props.classes);
  const link = getBrandUrl(url);
  const logoUrl = storeConfig.base_media_url && img ? getBrandLogoUrl(storeConfig.base_media_url, img) : img;

  const {
    show_images: showImages,
    image_width: imageWidth = IMG_DEFAULT_WIDTH,
    image_height: imageHeight,
    show_count: showCount,
    display_zero: displayZero
  } = settings;

  if (!displayZero && cnt === 0) {
    return null;
  }

  const imgContainerHeight = Math.max(imageWidth, imageHeight || 0);

  const image =
      logoUrl ? (
      <img
        className={classes.img}
        width={imageWidth}
        height={imageHeight}
        src={logoUrl}
        alt={alt}
      />
    ) : (
      <span
        style={{ fontSize: imgContainerHeight / 1.5 }}
        className={classes.noImage}
      >
        {letter}
      </span>
    );

  return (
    <li className={classes.root} style={{ flexBasis: imageWidth }}>
      <Link to={link} title={label}>
        <div
          className={classes.imgContainer}
          style={{ minHeight: imgContainerHeight }}
        >
          {image}
        </div>
        <span className={classes.label}>{label}</span>
        {showCount && <span className={classes.count}>{cnt}</span>}
      </Link>
    </li>
  );
};

BrandItem.propTypes = {
  label: string,
  alt: string,
  url: string,
  letter: string,
  cnt: number,
  settings: shape({
    show_images: bool,
    image_width: number,
    image_height: number,
    show_count: bool,
    display_zero: bool
  })
};

export default BrandItem;
