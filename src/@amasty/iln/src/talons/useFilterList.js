import { useCallback, useMemo, useState } from 'react';
import { useFieldApi } from 'informed';

export const useFilterList = (props = {}) => {
  const {
    group,
    filterApi,
    onApply,
    filterBlockSettings,
    items,
    filterState
  } = props;

  const [isListExpanded, setExpanded] = useState(false);
  const searchFieldName = `search_${group}`;

  const [searchValue, setSearchValue] = useState('');
  const { reset } = useFieldApi(searchFieldName);

  const {
    is_multiselect: isMultiSelect,
    is_show_search_box,
    number_unfolded_options: itemCountToShow,
    show_product_quantities,
    add_from_to_widget: isVisibleFromTo,
    limit_options_show_search_box
  } = filterBlockSettings;

  const visibleItems = useMemo(() => {
    let list = items;

    if (isVisibleFromTo) {
      list = items.filter(({ custom }) => !custom);
    }

    if (searchValue) {
      list = items.filter(({ title }) =>
        title.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    return new Set(list.map(({ value }) => value));
  }, [items, searchValue, isVisibleFromTo]);

  const handleListToggle = useCallback(() => {
    setExpanded(value => !value);
  }, [setExpanded]);

  const { toggleItem, changeItem } = filterApi;

  const handleSelectItem = useCallback(
    item => {
      const isSelected = filterState && filterState.has(item);
      const duplicatedItem = filterState && Array.from(filterState).find(({ value }) => value === item.value);

      if (!isMultiSelect && !isSelected) {
        changeItem({ group, item });
      } else if (!duplicatedItem || isSelected) {
        toggleItem({ group, item });
      }

      if (typeof onApply === 'function') {
        onApply(group, item);
      }
    },
    [group, isMultiSelect, toggleItem, onApply, changeItem, filterState]
  );

  const changeSearch = useCallback(value => setSearchValue(value), [
    setSearchValue
  ]);

  const resetSearch = useCallback(() => reset(), [reset]);

  return {
    handleListToggle,
    isListExpanded,
    itemCountToShow,
    visibleItems,
    searchProps: {
      field: searchFieldName,
      onChange: changeSearch,
      value: searchValue,
      reset: resetSearch,
      isShowSearchBox:
        is_show_search_box &&
        (!limit_options_show_search_box ||
          limit_options_show_search_box < items.length)
    },

    itemProps: {
      showProductQuantities: !!show_product_quantities,
      isMultiSelect,
      handleSelectItem
    },
    isVisibleFromTo
  };
};
