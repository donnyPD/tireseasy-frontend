import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { GET_MAKE_LIST } from './quickLookupsQueries';

/**
 * Custom hook to get the list of makes for a specific year
 * @param {number|null} year - Selected year
 * @returns {Object} Object with makes data, loading state and errors
 */
export const useMakeList = (year) => {
    const { data, loading, error } = useQuery(GET_MAKE_LIST, {
        variables: { year: parseInt(year) },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        errorPolicy: 'all',
        skip: !year || isNaN(parseInt(year))
    });

    /**
     * Processed list of makes, sorted alphabetically
     */
    const makes = useMemo(() => {
        if (!data?.makeList?.makes) {
            return [];
        }
        
        // Sort makes alphabetically
        return [...data.makeList.makes].sort((a, b) => a.localeCompare(b));
    }, [data]);

    return {
        makes,
        loading,
        error,
        hasData: makes.length > 0
    };
};


