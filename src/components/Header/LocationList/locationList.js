import React, { useState, useEffect, useMemo } from 'react';
import { useLocationList } from './useLocationList';
import defaultClasses from './locationList.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { FormattedMessage } from 'react-intl';
import { useCustomHeader } from '../useCustomHeader';

const LocationList = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useLocationList();
    const { currentUser } = useCustomHeader();
    const currentLocation = currentUser?.location_name || null;
    const { locationList, getRedirectUrl } = talonProps;
    const [query, setQuery] = useState('');

    const {
        elementRef,
        expanded,
        setExpanded,
        triggerRef
    } = useDropdown();

    useEffect(() => {
        if (!expanded && query) {
            setQuery('');
        }
    }, [expanded]);

    const filteredOptions = useMemo(() => {
        return locationList && locationList.filter(opt =>
            opt.name.toLowerCase().includes(query.toLowerCase())
        ) || [];
    }, [query, locationList]);

    if (!locationList.length) {
        return (
            <div className={classes.container} />
        )
    }

    const handleTriggerClick = () => {
        setExpanded(isOpen => !isOpen);
    }

    const handleLocationClick = (id) => {
        getRedirectUrl(id);
        handleTriggerClick();
    }

    return (
        <div className={classes.container}>
            <span
                className={classes.locationInfo}
                onClick={handleTriggerClick}
                ref={triggerRef}
            >
                <FormattedMessage
                    id={'locationInfoText.trigger'}
                    defaultMessage={
                        currentLocation ? 'Location: ' + currentLocation : 'Location: is not defined...'
                    }
                />
            </span>
            <div
                className={`${classes.listContainer} ${expanded ? classes.open : ''}`}
                ref={elementRef}
            >
                {expanded && <>
                    <div className={classes.searchContainer}>
                        <input
                            type="text"
                            className={classes.search}
                            placeholder={"Search..."}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <ul>
                        {filteredOptions.map((child) => (
                            <li
                                key={child.id}
                                className={classes.item}
                                onClick={() => handleLocationClick(child.id.toString())}
                            >
                                {child.name}
                            </li>
                        ))}
                    </ul>
                </>}
            </div>
        </div>
    )
};

export default LocationList;

LocationList.propTypes = {
    classes: shape({
        locationInfo: string,
        locationInfoText: string,
        listContainer: string,
        searchContainer: string,
        open: string,
        container: string,
        item: string,
    })
};
