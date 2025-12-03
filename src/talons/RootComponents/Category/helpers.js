/**
 * Looks for filter values within a search string and returns a map like
 * {
 *   "category_id": ["Bottoms,28", "Pants & Shorts,19"]
 * }
 * filter[category_id]=Bottoms,28&filter[category_id]=Pants & Shorts,19
 * @param {String} initialValue a search string, as in from location.search
 */
export const getCustomFiltersFromSearch = initialValue => {
    // preserve all existing params
    const params = new URLSearchParams(initialValue);
    const uniqueKeys = new Set(params.keys());
    const filters = new Map();

    // iterate over existing param keys
    for (const key of uniqueKeys) {
        // if a key matches a known filter, add its items to the next state
        if (key.startsWith('front_') || key.startsWith('rear_')) {
            // derive the group by slicing off `[filter]`
            const group = key;
            const items = new Set();

            // map item values to items
            for (const value of params.getAll(key)) {
                items.add(value);
            }

            // add items to the next state, keyed by group
            filters.set(group, items);
        }
    }

    return filters;
};

export const getCustomFilterInput = (value) => {
    return value.values().next().value;
};

export const chunkArray = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};
