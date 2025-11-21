import React, { useState, useEffect, useMemo } from 'react';
import defaultClasses from '../orderHistoryPage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { X } from 'react-feather';

const BrandSearch = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { brandList, brandTextHandle, setBrandTextHandle } = props;
    const [query, setQuery] = useState('');
    const [isCloseBtn, setIsCloseBtn] = useState(false);

    const {
        elementRef,
        expanded,
        setExpanded,
        triggerRef
    } = useDropdown();

    useEffect(() => {
        if (brandTextHandle === '') {
            setQuery('');
        }
    }, [brandTextHandle]);

    useEffect(() => {
        if (query.length > 2) {
            setIsCloseBtn(true);
        } else {
            setIsCloseBtn(false);
        }
    }, [query]);

    const filteredOptions = useMemo(() => {
        return brandList && brandList.filter(opt =>
            opt.label.toLowerCase().includes(query.toLowerCase())
        ) || [];
    }, [query, brandList]);

    const handleTriggerClick = () => {
        setExpanded(true);
    }

    const handleChange = (e) => {
        setQuery(e.target.value);
        setBrandTextHandle(e.target.value);
    }

    const reset = () => {
        setQuery('');
        setBrandTextHandle('');
    }

    const handleLocationClick = (el) => {
        setQuery(el);
        setBrandTextHandle(el);
        setExpanded(false);
    }

    return (
        <div
            className={`${classes.listContainer} ${expanded ? classes.open : ''}`}
            ref={elementRef}
        >
            <div className={classes.brandContainer}>
                <input
                    type="text"
                    id="brand"
                    ref={triggerRef}
                    className={classes.brand}
                    placeholder={"e.g., Michelin"}
                    value={query}
                    onClick={handleTriggerClick}
                    onChange={(e) => handleChange(e)}
                    autoComplete="off"
                />
                {isCloseBtn && <span
                    onClick={reset}
                    className={classes.closeBtn}
                >
                    <X size={16} />
                </span>}
            </div>
            {expanded && filteredOptions.length ? (<ul>
                {filteredOptions.map((child) => (
                    <li
                        key={child.value}
                        className={classes.item}
                        onClick={() => handleLocationClick(child.label)}
                    >
                        {child.label}
                    </li>
                ))}
            </ul>) : null}
        </div>
    )
};

export default BrandSearch;

BrandSearch.propTypes = {
    classes: shape({
        listContainer: string,
        brandContainer: string,
        open: string,
        closeBtn: string,
        container: string,
        item: string,
    })
};
