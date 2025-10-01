import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './moreFromBrand.gql';

export const useMoreFromBrand = (props = {}) => {
  const { productId } = props;

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { getMoreFromThisBrandQuery } = operations;

  const { loading, error, data } = useQuery(getMoreFromThisBrandQuery, {
    variables: {
      productId
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  const { amBrandGetMoreFromThisBrandBlock } = data || {};

  return {
    loading,
    error,
    ...amBrandGetMoreFromThisBrandBlock
  };
};
