import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from './locationList.gql';

export const useLocationList = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getLocationDataListQuery } = operations;

    const { data: data} = useQuery(getLocationDataListQuery);

    return {
        locationList: data?.locationDataList || []
    };
};
