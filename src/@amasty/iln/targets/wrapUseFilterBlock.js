import { useEffect, useMemo, useRef } from 'react';
import { useWindowSize } from '@magento/peregrine';
import { useAmIlnContext } from '../src/context';

const alwaysVisibleModes = ['Slider', 'From-To Only', 'category_ids'];

const wrapUseFilterBlock = original => props => {
  const defaultProps = original(props);

  const { isExpanded, handleClick } = defaultProps;
  const { amshopby_general_keep_single_choice_visible } =
    useAmIlnContext() || {};

  const { filterApi, group, filterState } = props;

  const filterBlockSettings = useMemo(() => filterApi && filterApi.getAmFilterData(group)
      || {
      is_expanded: null,
          is_multiselect: null,
          display_mode_label: null
      }, [
    group,
    filterApi
  ]);

  const {
    is_expanded,
    is_multiselect,
    display_mode_label
  } = filterBlockSettings;

  const windowSize = useWindowSize();
  const isMobile = windowSize.innerWidth <= 1024;

  const isExpandedByDevice = useMemo(() => {
    return !isMobile ? !!is_expanded : is_expanded && is_expanded !== 2; // 2 - expand only desktop
  }, [is_expanded, isMobile]);

  const prevExpanded = useRef(null);

  useEffect(() => {
    if (prevExpanded.current === null && isExpandedByDevice && !isExpanded) {
      prevExpanded.current = isExpanded;
      handleClick();
    }
  }, [isExpandedByDevice, prevExpanded, isExpanded, handleClick]);

  const isHidden = useMemo(
    () =>
      filterState &&
      filterState.size &&
      !is_multiselect &&
      !amshopby_general_keep_single_choice_visible &&
      !alwaysVisibleModes.includes(display_mode_label),
    [
      filterState,
      is_multiselect,
      amshopby_general_keep_single_choice_visible,
      display_mode_label
    ]
  );

  return {
    ...defaultProps,
    filterBlockSettings,
    isHidden
  };
};

export default wrapUseFilterBlock;
