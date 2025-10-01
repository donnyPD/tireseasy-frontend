import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DEFAULT_OPERATIONS from './brands.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useAllBrands = (props = {}) => {
  const {
    image_width: imageWidth,
    image_height: imageHeight,
    show_count: showCount,
    display_zero: displayZero
  } = props;

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { allBrandsPageQuery } = operations;

  const [renderedLetters, setRenderedLetters] = useState('');

  const { loading, error, data } = useQuery(allBrandsPageQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      imageWidth,
      imageHeight,
      showCount,
      displayZero
    }
  });

  const { ambrandlist } = data || {};
  const { all_letters, items = [] } = ambrandlist || {};

  useEffect(() => {
    setRenderedLetters(all_letters);
  }, [all_letters]);

  const brandsByLetter = useMemo(
    () =>
      items.reduce((res, curr) => {
        const { letter } = curr;
        const section = res[letter] || [];
        section.push(curr);

        return {
          ...res,
          [letter]: section
        };
      }, {}),
    [items]
  );

  const handleFilter = useCallback(
    letter => {
      setRenderedLetters(letter);
    },
    [setRenderedLetters]
  );

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    console.log('Check if Amasty modules has been installed!');
  }

  return {
    loading,
    error,
    renderedLetters,
    brandsByLetter,
    handleFilter,
    allLetters: all_letters,
    brandList: items
  };
};
