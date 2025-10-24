import React, { useMemo } from 'react';
import { array, shape, string, func } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './filterList.css';
import { useFilterList } from '../../talons/useFilterList';
import setValidator from '@magento/peregrine/lib/validators/set';
import FilterItem from './filterItem';
import SearchField from './searchField';
import ShowMoreLessButton from './showMoreLessButton';
import FromTo from '../FromTo';

const labels = new WeakMap();

const FilterList = props => {
  const { filterState, items, group, ...rest } = props;

  const {
    isListExpanded,
    handleListToggle,
    itemCountToShow,
    itemProps,
    searchProps,
    visibleItems,
    isVisibleFromTo
  } = useFilterList(props);

  const classes = mergeClasses(defaultClasses, props.classes);

  const itemElements = useMemo(
    () =>
      items.map((item, index) => {
        const { title, value } = item;
        const key = `item-${group}-${value}`;
        const itemClass =
          visibleItems.has(value) &&
          (isListExpanded || !itemCountToShow || index < itemCountToShow)
            ? classes.item
            : classes.itemHidden;

        const element = (
          <li key={key} className={itemClass}>
            <FilterItem
              filterState={filterState}
              item={item}
              {...itemProps}
              {...rest}
            />
          </li>
        );

        labels.set(element, title.toUpperCase() || '');

        return element;
      }),
    [
      classes,
      filterState,
      items,
      isListExpanded,
      itemCountToShow,
      itemProps,
      group,
      visibleItems,
      rest
    ]
  );

  const { isShowSearchBox } = searchProps;

  const searchBox = isShowSearchBox ? <SearchField {...searchProps} /> : null;
  const fromToWidget = isVisibleFromTo ? (
    <FromTo {...props} classes={{ root: classes.fromTo }} />
  ) : null;
  const itemsClass = visibleItems.size ? classes.items : classes.itemsEmpty;

  return (
    <div className={classes.root}>
      {searchBox}
      <ul className={itemsClass}>{itemElements}</ul>
      <ShowMoreLessButton
        itemCountToShow={itemCountToShow}
        itemsLength={items.length}
        isListExpanded={isListExpanded}
        handleListToggle={handleListToggle}
      />

      {fromToWidget}
    </div>
  );
};

FilterList.defaultProps = {
  onApply: null,
  isExpanded: false
};

FilterList.propTypes = {
  classes: shape({
    item: string,
    items: string
  }),
  filterApi: shape({}),
  filterState: setValidator,
  group: string,
  items: array,
  onApply: func
};

export default FilterList;
