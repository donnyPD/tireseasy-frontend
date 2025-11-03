import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './createUser.gql';
import { useHistory, useLocation } from 'react-router-dom';

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
    const history = useHistory();
    const location = useLocation();

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

    // const [editUser, { error: editUserError }] = useMutation(
    //     editUserMutation,
    //     {
    //         fetchPolicy: 'no-cache'
    //     }
    // );

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
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
            setIsSubmitting(false);
        },

        [onSubmit]
    );

    const handleDeleteUser = useCallback(async (email) => {
        try {
            await deleteUser({
                variables: { email },
                refetchQueries: [{ query: getUserListQuery }],
                awaitRefetchQueries: true
            });

        } catch (error) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, []);

    const handleEditUser = useCallback(async (email) => {
        // try {
        //     await editUser({
        //         variables: { email },
        //         refetchQueries: [{ query: getUserListQuery }],
        //         awaitRefetchQueries: true
        //     });
        //
        // } catch (error) {
        //     if (process.env.NODE_ENV !== 'production') {
        //         console.error(error);
        //     }
        // }
    }, []);

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    const errors = useMemo(
        () =>
            new Map([
                ['createUserMutation', createUserError],
                ['deleteUserMutation', deleteUserError],
                // ['editUserMutation', editUserError]
            ]),
        [
            createUserError,
            deleteUserError,
            // editUserError,
        ]
    );

    return {
        errors,
        handleSubmit,
        userList,
        initialValues: sanitizedInitialValues,
        isDisabled: isSubmitting,
        minimumPasswordLength: 8,
        handleDeleteUser,
        handleEditUser
    };
};
