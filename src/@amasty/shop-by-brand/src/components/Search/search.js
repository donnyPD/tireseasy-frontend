import React from 'react';
import { array } from 'prop-types';
import SearchField from '@magento/venia-ui/lib/components/SearchBar/searchField';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './search.css';
import { Form } from 'informed';
import Autocomplete from './autocomplete';
import { useSearch } from '../../talons/useSearch';

const Search = props => {
  const { items } = props;
  const { handleChange, suggestions } = useSearch({ items });

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div className={classes.root}>
      <Form autoComplete="off" className={classes.form}>
        <div className={classes.search}>
          <SearchField onChange={handleChange} placeholder={'Search brand'} />
        </div>

        <Autocomplete suggestions={suggestions} />
      </Form>
    </div>
  );
};

Search.propTypes = {
  items: array
};

export default Search;
