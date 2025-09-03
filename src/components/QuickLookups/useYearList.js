import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_YEAR_LIST } from './quickLookupsQueries';

/**
 * Custom hook to get the list of years
 * @returns {Object} Object with years data, loading state and errors
 */
export const useYearList = () => {
    const { data, loading, error } = useQuery(GET_YEAR_LIST, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        errorPolicy: 'all'
    });

    /**
     * Processed list of years, sorted in descending order
     */
    const years = useMemo(() => {
        if (!data?.yearList?.years) {
            return [];
        }
        
        // Sort years in descending order (newest first)
        return [...data.yearList.years].sort((a, b) => b - a);
    }, [data]);

    return {
        years,
        loading,
        error,
        hasData: years.length > 0
    };
};
