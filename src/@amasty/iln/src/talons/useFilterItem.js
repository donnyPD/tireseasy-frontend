import { useCallback, useMemo } from 'react';

export const useFilterItem = (props = {}) => {
  const { filterState, item, handleSelectItem } = props;

  const isSelected = filterState && filterState.has(item);

  const tileItem = useMemo(() => {
    const { title, value } = item;

    return {
      ...item,
      label: title,
      value_index: value
    };
  }, [item]);

  const handleClick = useCallback(() => {
    handleSelectItem(item);
  }, [item, handleSelectItem]);

  return {
    isSelected,
    tileItem,
    handleClick
  };
};
