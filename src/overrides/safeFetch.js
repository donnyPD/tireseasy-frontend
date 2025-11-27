import { customFetchToShrinkQuery } from '@magento/peregrine/lib/Apollo/links/index.js';

export default function safeFetch(uri, options = {}) {
    // Apollo adds AbortSignal — remove it
    if (options.signal) {
        delete options.signal;
    }

    return customFetchToShrinkQuery(uri, options);
}
