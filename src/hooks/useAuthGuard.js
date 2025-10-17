import { useEffect, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Custom hook for authentication guard functionality
 * Redirects unauthenticated users to /sign-in page
 * Skips authentication check for specific routes
 *
 * @returns {Object} Authentication state and utilities
 */
export const useAuthGuard = () => {
    const location = useLocation();
    const history = useHistory();
    const [{ isSignedIn, token }] = useUserContext();
    /**
     * Routes that don't require authentication
     */
    const publicRoutes = ['/sign-in', '/create-account', '/forgot-password', '/punchout/session'];

    /**
     * Check if current route is public (doesn't require auth)
     */
    const isPublicRoute = useMemo(() => {
        return publicRoutes.some(route => location.pathname.startsWith(route));
    }, [location.pathname]);

    /**
     * Check if user token is valid
     */
    const isValidToken = useMemo(() => {
        if (!token) return false;

        try {
            // Basic JWT token format validation
            const tokenParts = token.split('.');
            return tokenParts.length === 3;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }, [token]);

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = useMemo(() => {
        return isSignedIn && isValidToken;
    }, [isSignedIn, isValidToken]);

    useEffect(() => {
        // Skip authentication check for public routes
        if (isPublicRoute) {
            return;
        }

        // If user is not authenticated, redirect to sign-in
        if (!isAuthenticated) {
            console.log('User not authenticated, redirecting to /sign-in');
            history.push('/sign-in');
        }
    }, [location.pathname, isSignedIn, token, history, isPublicRoute, isAuthenticated]);

    return {
        isAuthenticated,
        isPublicRoute,
        isSignedIn,
        token
    };
};

export default useAuthGuard;
