import React from 'react';
import { useAllBrands } from '../../talons/useAllBrands';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Letters from './letters';
import Filter from '../Filter';
import defaultClasses from './allBrandsPage.css';
import Search from '../Search';

const AllBrandsPage = props => {
  const {
    loading,
    error,
    renderedLetters,
    brandsByLetter,
    handleFilter,
    allLetters,
    brandList
  } = useAllBrands({ ...props });

  if (loading) {
    return fullPageLoadingIndicator;
  }

  if (error) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);
  const {
    show_search: showSearch,
    show_filter: showFilter,
    filter_display_all: filterDisplayAll
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        {showFilter && (
          <Filter
            handleFilter={handleFilter}
            allLetters={allLetters}
            filterDisplayAll={filterDisplayAll}
            currentFilter={renderedLetters}
          />
        )}

        {showSearch && <Search items={brandList} />}
      </div>

      <Letters
        letters={renderedLetters}
        brands={brandsByLetter}
        settings={props}
      />
    </div>
  );
};

export default AllBrandsPage;
