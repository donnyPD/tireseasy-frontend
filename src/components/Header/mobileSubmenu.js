import React, { useEffect, useState, useRef } from 'react';
import { shape, string } from 'prop-types';
import { ChevronRight, ChevronDown } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './mobileSubmenu.module.css';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

const MobileSubmenu = props => {
    const { subCategory } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef(null);

    if (!subCategory) {
        return null;
    }

    const {
        elementRef: subMenuRef,
        expanded: subMenuIsOpen,
        setExpanded: setSubMenuIsOpen,
        triggerRef: subMenuTriggerRef
    } = useDropdown();

    const handleTriggerClick = () => {
        setSubMenuIsOpen(isOpen => !isOpen);
    }

    useEffect(() => {
        if (contentRef.current && subMenuIsOpen) {
            setContentHeight(contentRef.current.scrollHeight);
        } else {
            setContentHeight(0);
        }
    }, [subMenuIsOpen]);

    return  (
        <div className={classes.container}>
            <button
                className={classes.triggerBtn}
                onClick={handleTriggerClick}
                ref={subMenuTriggerRef}
            >
                {subMenuIsOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <div ref={subMenuRef}>
                <div
                    ref={contentRef}
                    className={classes.subMenuContainer}
                    style={{
                        maxHeight: subMenuIsOpen ? `${contentHeight}px` : '0px',
                        transition: 'max-height 0.35s ease',
                    }}
                >
                    {subCategory}
                </div>
            </div>
        </div>
    );
};

export default MobileSubmenu;

MobileSubmenu.propTypes = {
    classes: shape({
        container: string,
        triggerBtn: string,
        subMenuContainer: string
    })
};
