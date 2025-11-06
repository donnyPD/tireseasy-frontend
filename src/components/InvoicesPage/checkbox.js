import React from 'react';
import { string } from 'prop-types';
import { CheckSquare, Square } from 'react-feather';

import defaultClasses from './invoiceRow.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const checkedIcon = <CheckSquare />;
const uncheckedIcon = <Square />;

const Checkbox = props => {
    const { checked, handleChange } = props;
    const icon = checked ? checkedIcon : uncheckedIcon;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <label className={classes.root_label}>
            <input
                type="checkbox"
                name="checkbox"
                checked={checked}
                onChange={handleChange}
                className={classes.input}
            />
            <span className={classes.icon}>{icon}</span>
        </label>
    );
};

export default Checkbox;

Checkbox.propTypes = {
    root_label: string,
    input: string,
    icon: string
};
