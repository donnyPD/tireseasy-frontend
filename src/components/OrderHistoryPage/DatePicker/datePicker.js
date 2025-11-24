import React, {useEffect, useState} from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import defaultClasses from './dataPicker.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const DateRangePicker = (props) => {
    const { onChange, dateFromText, dateToText } = props;
    const classes = useStyle(defaultClasses, props.classes);
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
        setExpanded(true);
    }

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
    }, [expanded, dateFromText, dateToText]);

    const handleChange = (e) => {
        // setQuery(e.target.value);
        // setBrandTextHandle(e.target.value);
    }

    const reset = () => {
        // setQuery('');
        // setBrandTextHandle('');
    }

    return (
        <div
            className={`${classes.container} ${expanded ? classes.open : ''}`}
            ref={elementRef}
        >
            <div
                className={classes.input}
                onClick={handleTriggerClick}
                ref={triggerRef}
            >
                <h3>{dateFromText}</h3>
                <h3>{dateToText}</h3>
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
