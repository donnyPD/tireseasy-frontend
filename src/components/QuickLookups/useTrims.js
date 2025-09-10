import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_TRIMS } from './quickLookupsQueries';

/**
 * Custom hook to get trims for a specific year, make and model
 * @returns {Object} Object with getTrims function, data, loading state and errors
 */
export const useTrims = () => {
    const [getTrimsQuery, { data, loading, error }] = useLazyQuery(GET_TRIMS, {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all'
    });

    /**
     * Execute trims query with vehicle parameters
     * @param {number} year - Selected year
     * @param {string} make - Selected make
     * @param {string} model - Selected model
     * @returns {Promise} Query promise
     */
    const getTrims = useCallback(async (year, make, model) => {
        try {
            console.log('getTrims called with:', { 
                year: parseInt(year), 
                make, 
                model 
            });

            const result = await getTrimsQuery({
                variables: {
                    year: parseInt(year),
                    make: make,
                    model: model
                }
            });
            
            // Log the response to console
            if (result.data?.getTrims?.items) {
                console.log('Trims:', result.data.getTrims.items);
                console.log('Query executed with:', { year: parseInt(year), make, model });
            }
            
            return result;
            
        } catch (err) {
            console.error('Error fetching trims:', err);
            throw err;
        }
    }, [getTrimsQuery]);

    return {
        getTrims,
        data,
        loading,
        error,
        trims: data?.getTrims?.items || []
    };
};


