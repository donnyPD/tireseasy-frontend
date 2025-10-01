import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './brands.gql';

export const useBrandSlider = (props = {}) => {
  const {
    image_width: imageWidth,
    image_height: imageHeight,
    sort_by: sortBy,
    display_zero: displayZero,
    items_number: itemsNumber
  } = props;

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { brandsSliderQuery } = operations;

  const { loading, error, data } = useQuery(brandsSliderQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      imageWidth,
      imageHeight,
      sortBy,
      displayZero
    }
  });

  const { ambrandslider } = data || {};

  const breakpoints = useMemo(() => {
    const result = [];

    for (let i = 1; i < itemsNumber; i++) {
      result.push({
        breakpoint: (i + 1) * imageWidth,
        settings: {
          slidesToShow: i
        }
      });
    }

    return result.reverse();
  }, [imageWidth, itemsNumber]);

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    console.log('Check if Amasty modules has been installed!');
  }

  return {
    loading,
    error,
    ...ambrandslider,
    breakpoints
  };
};
