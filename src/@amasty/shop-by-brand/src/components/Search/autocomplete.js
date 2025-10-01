import React from 'react';
import { func, array } from 'prop-types';
import { Link } from 'react-router-dom';
import { getBrandUrl } from '../../utils';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './search.css';

const Autocomplete = props => {
  const { suggestions } = props;

  if (!Array.isArray(suggestions) || !suggestions.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const list = suggestions.map(item => (
    <Link
      to={getBrandUrl(item.url)}
      key={item.brandId}
      className={classes.suggestion}
    >
      {item.label}
    </Link>
  ));

  return <div className={classes.autocomplete}>{list}</div>;
};

Autocomplete.propTypes = {
  handleSearch: func,
  suggestions: array
};

export default Autocomplete;
