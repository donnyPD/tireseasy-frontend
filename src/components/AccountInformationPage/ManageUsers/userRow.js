import React from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './manageUsers.module.css';

const userRow = props => {
    const { user, openConfirmationModal, setIsOpenEdit } = props;
    const {
        email,
        firstname,
        lastname,
    } = user;

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <li className={classes.user}>
            <div>
                <span className={classes.userEmail}>{email}</span>
            </div>
            <div>
                <span className={classes.userFirstName}>{firstname}</span>
            </div>
            <div>
                <span className={classes.userLastName}>{lastname}</span>
            </div>
            <div className={classes.action}>
                <button
                    className={classes.editBtn}
                    onClick={() => setIsOpenEdit(user)}
                    type="button"
                >
                    <FormattedMessage
                        id={'userDelete.text'}
                        defaultMessage={'Edit'}
                    />
                </button>
                <button
                    className={classes.deleteBtn}
                    onClick={() => openConfirmationModal(email)}
                    type="button"
                >
                    <FormattedMessage
                        id={'userDelete.text'}
                        defaultMessage={'Delete'}
                    />
                </button>
            </div>
        </li>
    );
};

export default userRow;
userRow.propTypes = {
    classes: shape({
        user: string,
        editBtn: string,
        deleteBtn: string,
    })
};
