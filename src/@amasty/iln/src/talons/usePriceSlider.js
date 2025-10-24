import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import debounce from 'lodash.debounce';
import { useAmIlnContext } from '../context';
import { formatPrice, getRangeTitle } from '../utils/titles';

const formatValueFromRange = item => {
  const { value } = item;
  const [from, to] = value.split('_');

  return [from, to];
};

const getValueFromState = state => {
  if (!state || !state.size) {
    return null;
  }

  const setIter = state.values();
  const range = formatValueFromRange(setIter.next().value);

  return range;
};

export const usePriceSlider = props => {
  const {
    items,
    filterBlockSettings,
    group,
    filterApi,
    onApply,
    filterState
  } = props;

  const { formatMessage } = useIntl();
  const {
    amshopby_slider_slider_style: sliderStyle,
    locale,
    currencyCode
  } = useAmIlnContext();

  const {
    slider_max,
    slider_min,
    slider_step,
    add_from_to_widget
  } = filterBlockSettings;

  const { changeItem } = filterApi;

  const defaultValue = useMemo(() => {
    const min = slider_min || formatValueFromRange(items[0])[0];
    const max =
      slider_max ||
      Math.max(
        ...items
          .filter(({ custom }) => !custom)
          .map(item => +formatValueFromRange(item)[1])
      );

    return [+min, +max];
  }, [slider_min, slider_max, items]);

  const debounceApply = useMemo(
    () =>
      debounce((group, item) => {
        onApply(group, item);
      }, 500),
    [onApply]
  );

  const formatValue = useCallback(
    value => formatPrice(value, currencyCode, locale),
    [currencyCode, locale]
  );

  const handleChange = useCallback(
    value => {
      const item = {
        value: value.join('_'),
        title: formatMessage(
          ...getRangeTitle(value.join('_'), { currencyCode, locale })
        )
      };

      changeItem({ group, item });

      if (typeof onApply === 'function') {
        debounceApply(group, item);
      }
    },
    [
      changeItem,
      debounceApply,
      onApply,
      group,
      formatMessage,
      currencyCode,
      locale
    ]
  );

  const inputValue = useMemo(() => {
    if (!filterState || !filterState.size) {
      return defaultValue;
    }

    return getValueFromState(filterState);
  }, [filterState, defaultValue]);

  return {
    step: slider_step,
    defaultValue,
    handleChange,
    inputValue,
    isShowFromToWidget: add_from_to_widget,
    sliderStyle,
    formatValue,
    currencyCode
  };
};
