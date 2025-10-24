import React, { useState, useEffect, useMemo } from 'react';
import { useLocationList } from './useLocationList';
import defaultClasses from './locationList.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

const LocationList = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useLocationList();
    const { locationList } = talonProps;
    const [query, setQuery] = useState('');
    const {
        elementRef,
        expanded,
        setExpanded,
        triggerRef
    } = useDropdown();

    if (!locationList.length) {
        return (
            <div className={classes.container}>
                <span className={classes.locationInfo}>Location: is not defined...</span>
            </div>
        )
    }

    useEffect(() => {
        if (!expanded && query) {
            setQuery('');
        }
    }, [expanded]);

    const handleTriggerClick = () => {
        setExpanded(isOpen => !isOpen);
    }

    const filteredOptions = useMemo(() => {
        return locationList.filter(opt =>
            opt.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query, locationList]);

    return (
        <div className={classes.container}>
            <span
                className={classes.locationInfo}
                onClick={handleTriggerClick}
                ref={triggerRef}
            >
                Location: Main Warehouse, Gear City
            </span>
            <div
                className={`${classes.listContainer} ${expanded ? classes.open : ''}`}
                ref={elementRef}
            >
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
                            onClick={handleTriggerClick}
                        >
                            {child.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default LocationList;

LocationList.propTypes = {
    classes: shape({
        locationInfo: string,
        listContainer: string,
        searchContainer: string,
        open: string,
        container: string,
        item: string,
    })
};
