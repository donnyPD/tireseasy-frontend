import { useCallback, useState, useEffect } from 'react';
import { usePriceSlider } from './usePriceSlider';

const emptyValues = ['', '*'];
const inRange = (value, [min, max]) => {
  return !emptyValues.includes(value) && value >= min && value <= max;
};

const getValidRange = (value, defaultValue) => {
  let range = [...value];

  if (
    !range.some(item => emptyValues.includes(item)) &&
    Number(value[1]) < Number(value[0])
  ) {
    range = [...value].reverse();
  }

  const [from, to] = range;
  const validFrom = inRange(from, defaultValue) ? from : defaultValue[0];
  const validTo = inRange(to, defaultValue) ? to : defaultValue[1];

  return [validFrom, validTo];
};

const rangeToFixed = range => {
  const [from, to] = range;

  return [parseFloat(from).toFixed(2), parseFloat(to).toFixed(2)];
};

export const useFromTo = props => {
  const { group } = props;
  const {
    handleChange: changeFilterState,
    inputValue: stateValue,
    currencyCode,
    defaultValue
  } = usePriceSlider(props);

  const [inputValue, setInputValue] = useState(stateValue);

  const handleChange = useCallback(
    ({ target }) => {
      const { name, value } = target;
      const from = name === `${group}_from` ? value : inputValue[0];
      const to = name === `${group}_to` ? value : inputValue[1];

      setInputValue([from, to]);
    },
    [setInputValue, inputValue, group]
  );

  const handleApply = useCallback(() => {
    const range = getValidRange([...inputValue], defaultValue);
    changeFilterState(range);
  }, [inputValue, changeFilterState, defaultValue]);

  useEffect(() => {
    setInputValue(rangeToFixed(stateValue));
  }, [stateValue]);

  return {
    handleApply,
    handleChange,
    inputValue,
    currencyCode
  };
};
