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
                }
            } catch (err) {
                console.error('Logout error:', err);
            } finally {
                history.push('/');
                setTimeout(() => {
                    history.push(location.search ? '/' + location.search : '/');
                }, 300);
            }
        };

        logout();
    }, [isSignedIn, signOut, client, history]);

    return (
        <div/>
    );
};

export default LogoutPage;
