import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './filter.css';
import FilterBtn from './filterBtn';
import { string, bool } from 'prop-types';

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'];

const Filter = props => {
  const { allLetters, filterDisplayAll } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const letters = filterDisplayAll ? ALPHABET : allLetters.split(',');

  const buttons = letters.map(btn => (
    <FilterBtn key={btn} value={btn} {...props} />
  ));

  return (
    <div className={classes.root}>
      <FilterBtn label={'All brands'} value={allLetters} {...props} />
      {buttons}
    </div>
  );
};

Filter.propTypes = {
  allLetters: string,
  filterDisplayAll: bool
};

export default Filter;
