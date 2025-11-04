import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './createUser.gql';

export const useCreateUser = props => {
    const { initialValues = {}, onSubmit } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getUserListQuery,
        createUserMutation,
        deleteUserMutation,
        editUserMutation
    } = operations;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [displayError, setDisplayError] = useState(false);

    const [createUser, { error: createUserError }] = useMutation(
        createUserMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const [deleteUser, { error: deleteUserError }] = useMutation(
        deleteUserMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const [editUser, { error: editUserError }] = useMutation(
        editUserMutation,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const { data: userListData } = useQuery(getUserListQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const userList = useMemo(() => {
        if (userListData) {
            return userListData?.contactList;
        }
    }, [userListData]);

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                await createUser({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password
                    },
                    refetchQueries: [{ query: getUserListQuery }],
                    awaitRefetchQueries: true
                });
                setIsSuccess(true);
            } catch (error) {
                setDisplayError(true);
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
            setIsSubmitting(false);
        },

        [onSubmit]
    );

    const handleDeleteUser = useCallback(async (email) => {
        setIsSubmitting(true);
        try {
            await deleteUser({
                variables: { email },
                refetchQueries: [{ query: getUserListQuery }],
                awaitRefetchQueries: true
            });
            setIsSuccess(true);
        } catch (error) {
            setDisplayError(true);
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
        setIsSubmitting(false);
    }, []);

    const handleEditUser = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                await editUser({
                    variables: {
                        id: formValues.id,
                        email: formValues.email,
                        firstname: formValues.firstname || '',
                        lastname: formValues.lastname || '',
                        password: formValues.password || '',
                        new_password: formValues.newPassword || ''
                    },
                    refetchQueries: [{ query: getUserListQuery }],
                    awaitRefetchQueries: true
                });
                setIsSuccess(true);
            } catch (error) {
                setDisplayError(true);
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
            setIsSubmitting(false);
    }, []);

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    const errors = displayError
        ? [createUserError]
        : [];
    const errorsEdit = displayError
        ? [editUserError]
        : [];
    const errorsDelete = displayError
        ? [deleteUserError]
        : [];

    return {
        errors,
        errorsEdit,
        errorsDelete,
        handleSubmit,
        userList,
        initialValues: sanitizedInitialValues,
        isDisabled: isSubmitting,
        minimumPasswordLength: 8,
        handleDeleteUser,
        handleEditUser,
        isSuccess,
        setIsSuccess,
        setDisplayError
    };
};
