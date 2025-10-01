import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './brands.gql';
import { BRANDS_URL_KEY } from '../constants';

export const useBrandSettings = (props = {}) => {
  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { brandConfigQuery } = operations;

  const { loading, error, data } = useQuery(brandConfigQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  const { storeConfig } = data || {};

  const {
    amshopby_brand_general_topmenu_enabled: topmenuEnabled,
    amshopby_brand_general_menu_item_label: label
  } = storeConfig || {};

  const isEnabled = loading || error || topmenuEnabled;

  return {
    topMenuPosition: topmenuEnabled,
    isEnabled,
    label,
    urlKey: BRANDS_URL_KEY
  };
};
