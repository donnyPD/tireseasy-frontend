import React from 'react';
import { bool, func, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './filter.css';

const FilterBtn = props => {
  const { label, value, handleFilter, allLetters, currentFilter } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const fullClassName = `${classes.btn} ${
    currentFilter === value ? classes.btnActive : ''
  }`;

  return (
    <button
      className={fullClassName}
      onClick={() => handleFilter(value)}
      disabled={!allLetters.includes(value)}
    >
      {label || value}
    </button>
  );
};

FilterBtn.propTypes = {
  label: string,
  value: string,
  disabled: bool,
  handleFilter: func
};

export default FilterBtn;
