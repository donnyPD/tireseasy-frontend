import { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const expandOptions = {
  1: 'always',
  2: 'by_click'
};

export const useCategoryItem = props => {
  const {
    filterState,
    filterApi,
    item,
    handleSelectItem,
    subcategoriesExpand,
    visibleCategories,
    subcategoriesView,
    selectedCategories,
    isMultiSelect,
    activeItem
  } = props;

  const history = useHistory();
  const { pathname, search } = useLocation();

  const [isExpanded, setExpanded] = useState(
    expandOptions[subcategoriesExpand] === 'always'
  );
  const visibleCategoriesSize = useRef(visibleCategories.size);

  const { title, value, count } = item;

  const tileItem = {
    ...item,
    label: title,
    value_index: value
  };

  const isSelected = selectedCategories.has(item.value);

  const handleClick = useCallback(() => {
    if (item.isActive) {
      return;
    }

    if (!isMultiSelect && pathname !== '/search.html') {
      return history.push({ pathname: item.categoryUrl, search });
    }

    if (activeItem) {
      handleSelectItem(activeItem);
    }

    const { removeItem } = filterApi;

    if (isSelected && !filterState.has(item)) {
      const findItem = Array.from(filterState).find(
        ({ value }) => value === item.value
      );
      removeItem({ group: 'category_uid', item: findItem });
    } else {
      handleSelectItem(item);
    }
  }, [
    item,
    handleSelectItem,
    filterApi,
    isSelected,
    filterState,
    isMultiSelect,
    pathname,
    search,
    history,
    activeItem
  ]);

  const handleExpandClick = useCallback(() => {
    setExpanded(value => !value);
  }, [setExpanded]);

  useEffect(() => {
    if (visibleCategoriesSize.current !== visibleCategories.size) {
      setExpanded(true);
    }
  }, [visibleCategories, visibleCategoriesSize]);

  const isShowExpandBtn =
    subcategoriesView === 1 &&
    expandOptions[subcategoriesExpand] === 'by_click' &&
    item.children.length;

  const isHidden =
    !count || (visibleCategories && !visibleCategories.has(value));

  return {
    handleClick,
    isSelected,
    tileItem,
    isShowExpandBtn,
    handleExpandClick,
    isExpanded,
    isHidden,
    expandClass: expandOptions[subcategoriesExpand]
  };
};
