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
                <input
                    type="text"
                    name="date"
                    placeholder={'From'}
                    value={dateFromText}
                />
                <input
                    type="text"
                    name="date"
                    placeholder={'To'}
                    value={dateToText}
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
