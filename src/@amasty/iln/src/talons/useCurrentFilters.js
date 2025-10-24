import { useMemo, useState, useCallback } from 'react';
import { useAmIlnContext } from '../context';
import customClasses from '../extendStyle/currentFilters.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

export const useCurrentFilters = (props = {}) => {
  const { filterState } = props;
  const {
    amshopby_general_unfolded_options_state: unfoldedOptions
  } = useAmIlnContext();
  const classes = useStyle(customClasses, props.classes);

  const stateLength = useMemo(
    () =>
      Array.from(filterState.values()).reduce(
        (acc, curr) => acc + curr.size,
        0
      ),
    [filterState]
  );

  const [isExpanded, setExpanded] = useState(!unfoldedOptions);

  const handleListToggle = useCallback(() => {
    setExpanded(value => !value);
  }, [setExpanded]);

  const getItemClassName = useCallback(
    elements =>
      isExpanded || !unfoldedOptions || elements.length < unfoldedOptions
        ? classes.item
        : classes.itemHidden,
    [isExpanded, unfoldedOptions, classes]
  );

  return {
    classes,
    getItemClassName,
    unfoldedOptions,
    stateLength,
    isExpanded,
    handleListToggle
  };
};
