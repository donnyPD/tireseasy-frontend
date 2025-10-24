import React from 'react';
import { number } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './rating.css';
import Count from '../Count/count';

const Rating = props => {
  const { onClick, item, showProductQuantities, isSelected } = props;
  const { count, value, title } = item;
  const classes = mergeClasses(defaultClasses, props.classes);

  const label = Number(value) < 5 ? '& up' : null;

  const className = classes[`root${isSelected ? '_selected' : ''}`];

  return (
    <button className={className} onClick={onClick} type={'button'}>
      <span className={classes.stars} title={`${title}%`}>
        <span
          style={{ width: `${value * 20}%` }}
          className={classes.starsFilled}
        />
      </span>

      <span className={classes.label}>{label}</span>
      <Count count={count} showProductQuantities={showProductQuantities} />
    </button>
  );
};

Rating.propTypes = {
  percent: number,
  value: number
};

export default Rating;
