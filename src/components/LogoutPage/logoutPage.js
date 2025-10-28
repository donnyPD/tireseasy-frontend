import React, { useEffect } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

const LogoutPage = () => {
    const [{ isSignedIn }, { signOut }] = useUserContext();
    const client = useApolloClient();
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const logout = async () => {
            try {
                if (isSignedIn) {
                    await signOut();
                    await client.clearStore();
                    await client.refetchQueries({
                        include: ['GetCustomerForHeader']
                    });
                }
            } catch (err) {
                console.error('Logout error:', err);
            } finally {
                history.replace(location.search ? '/' + location.search : '/');
            }
        };

        logout();
    }, [isSignedIn, signOut, client, history]);

    return (
        <div/>
    );
};

export default LogoutPage;
