import { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

export const useSearch = props => {
  const { items } = props;
  const [suggestions, setSuggestions] = useState([]);

  const debouncedSetSuggestions = useMemo(
    () =>
      debounce(val => {
        const newSuggestions = val
          ? items.filter(({ label }) =>
              label.toLowerCase().includes(val.toLowerCase())
            )
          : [];
        setSuggestions(newSuggestions);
      }, 350),
    [setSuggestions, items]
  );

  const handleChange = useCallback(
    value => {
      debouncedSetSuggestions(value);
    },
    [debouncedSetSuggestions]
  );

  return {
    handleChange,
    suggestions
  };
};
