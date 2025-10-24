import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './locationList.gql';

export const useLocationList = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getLocationDataListQuery } = operations;
    const customerContactHash = localStorage.getItem('customerContactHash') || '';

    const { data: getLocationDataList} = useQuery(getLocationDataListQuery, {
        variables: {
            contactHash: customerContactHash
        }
    });

    const locationList = useMemo(() => {
        if (getLocationDataList) {
            return getLocationDataList?.locationDataList;
        }
    }, [getLocationDataList]);
    console.log(getLocationDataList);

    return {
        locationList: locationList || []
    };
};
