import { useState, useCallback } from 'react';

/**
 * Validates VIN number format
 * @param {string} vin - VIN number to validate
 * @returns {boolean} True if VIN is valid
 */
export const validateVin = (vin) => {
    if (!vin || typeof vin !== 'string') {
        return false;
    }
    
    // VIN must be 17 characters
    if (vin.length !== 17) {
        return false;
    }
    
    // VIN cannot contain I, O, Q
    const invalidChars = /[IOQ]/i;
    if (invalidChars.test(vin)) {
        return false;
    }
    
    // VIN must contain only letters and numbers
    const validChars = /^[A-HJ-NPR-Z0-9]+$/i;
    if (!validChars.test(vin)) {
        return false;
    }
    
    return true;
};

/**
 * Custom hook for VIN lookup functionality
 * @returns {Object} Hook result object
 */
export const useVinLookup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    /**
     * Get vehicle options by VIN number
     * @param {string} vin - VIN number
     * @returns {Promise<Object>} Vehicle options data
     */
    const getOptionsByVin = useCallback(async (vin) => {
        if (!validateVin(vin)) {
            const vinError = new Error('Invalid VIN number');
            setError(vinError);
            throw vinError;
        }

        setLoading(true);
        setError(null);

        try {
            // TODO: Implement actual VIN lookup API call
            // This should be replaced with real GraphQL query or REST API call
            console.log('VIN Lookup called with:', vin);
            
            // For now, throw an error to indicate that VIN lookup is not implemented yet
            throw new Error('VIN lookup API not implemented yet. Please use the Year/Make/Model search instead.');
            
            // When implementing, this should look something like:
            // const result = await vinLookupQuery({ variables: { vin } });
            // setData(result.data);
            // setLoading(false);
            // console.log('VIN Lookup successful:', result.data);
            // return result;
            
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    }, []);

    /**
     * Reset hook state
     */
    const reset = useCallback(() => {
        setLoading(false);
        setError(null);
        setData(null);
    }, []);

    return {
        getOptionsByVin,
        loading,
        error,
        data,
        reset
    };
};
