import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import defaultClasses from './dataPicker.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { getVisualDate } from '../../../talons/OrderHistoryPage/helper';
import { FormattedMessage } from 'react-intl';

const DateRangePicker = (props) => {
    const {
        onChange,
        dateFromText,
        dateToText,
        resetDate,
        isSearchClick,
        setIsSearchClick,
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const [isClearBtn, setIsClearBtn] = useState(false);
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ]);

    const {
        elementRef,
        expanded,
        setExpanded,
        triggerRef
    } = useDropdown();

    const handleSelect = (ranges) => {
        setState([ranges.selection]);
        if (onChange) {
            onChange(ranges.selection);
        }
    };

    const handleTriggerClick = () => {
        setIsSearchClick(false);
        setExpanded(true);
    }

    const resetDateHandle = () => {
        resetDate();
        setExpanded(false);
    };

    useEffect(() => {
        if (isSearchClick && expanded) {
            setExpanded(false);
            setIsSearchClick(false);
        }
    }, [isSearchClick]);

    useEffect(() => {
        if (!expanded && dateFromText === '' && dateToText === '') {
            setState([
                {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection'
                }
            ])
        }
        if (dateFromText !== '' || dateToText !== '') {
            setIsClearBtn(true);
        } else {
            setIsClearBtn(false);
        }
    }, [expanded, dateFromText, dateToText]);

    return (
        <div
            className={classes.container}
            ref={elementRef}
        >
            {isClearBtn && <span
                className={classes.clear}
                onClick={resetDateHandle}
            >
                <FormattedMessage
                    id={'orderHistoryPage.date.clear'}
                    defaultMessage={'Clear'}
                />
            </span>}
            <div
                className={classes.input}
                onClick={handleTriggerClick}
                ref={triggerRef}
            >
                <input
                    type="text"
                    name="date"
                    placeholder={'From'}
                    defaultValue={getVisualDate(dateFromText)}
                />
                <input
                    type="text"
                    name="date"
                    placeholder={'To'}
                    defaultValue={getVisualDate(dateToText)}
                />
            </div>
            {expanded && <DateRange
                className={classes.range}
                ranges={state}
                onChange={handleSelect}
            />}
        </div>
    );
};

export default DateRangePicker;
