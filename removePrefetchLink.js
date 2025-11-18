module.exports = function removePrefetchLink(links) {
    const newLinks = new Map();

    for (const [key, link] of links.entries()) {
        if (
            link &&
            link.constructor &&
            link.constructor.name === 'HttpPrefetchLink'
        ) {
            continue; // remove prefetch link
        }
        newLinks.set(key, link);
    }

    return newLinks;
};
