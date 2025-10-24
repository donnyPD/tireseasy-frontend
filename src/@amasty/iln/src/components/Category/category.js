import React, { useMemo } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import { useCategoryFilter } from '../../talons/useCategoryFilter';
import defaultClasses from './category.css';
import CategoryItem from './categoryItem';
import SearchField from '../FilterList/searchField';

const Category = props => {
  const { group, filterState } = props;
  const { categoryTree, searchProps, itemProps } = useCategoryFilter(props);

  const classes = mergeClasses(defaultClasses, props.classes);

  const items = useMemo(() => {
    if (!categoryTree || !categoryTree.children) {
      return null;
    }

    return categoryTree.children.map(category => {
      const key = `item-${group}-${category.value}`;

      return (
        <CategoryItem
          key={key}
          {...itemProps}
          filterState={filterState}
          item={category}
        />
      );
    });
  }, [categoryTree, group, itemProps, filterState]);

  const { isShowSearchBox } = searchProps;

  const searchBox = isShowSearchBox ? <SearchField {...searchProps} /> : null;

  return (
    <div className={classes.root}>
      {searchBox}
      <ul className={classes.items}>{items}</ul>
    </div>
  );
};

Category.propTypes = {
  classes: shape({
    root: string
  })
};

export default Category;
