import React, { useEffect } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

const LogoutPage = () => {
    const [{ isSignedIn }, { signOut }] = useUserContext();
    const client = useApolloClient();
    const history = useHistory();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);

    useEffect(() => {
        const logout = async () => {
            try {
                if (isSignedIn) {
                    await signOut();
                    await client.clearStore();
                    if (localStorage.getItem('punchout_customer')) {
                        localStorage.removeItem('punchout_customer');
                    }
                    if (localStorage.getItem('categoryPrimary')) {
                        if (!urlParams.get('newlocation')) {
                            localStorage.removeItem('categoryPrimary');
                        } else {
                            localStorage.setItem('categoryPrimaryLocation', '1');
                        }
                    }
                }
            } catch (err) {
                console.error('Logout error:', err);
            } finally {
                if (location.search) {
                    history.push('/');
                    setTimeout(() => {
                        history.push(location.search ? '/' + location.search : '/');
                    }, 300);
                } else {
                    history.push('/');
                }

            }
        };

        logout();
    }, [isSignedIn, signOut, client, history]);

    return (
        <div/>
    );
};

export default LogoutPage;
