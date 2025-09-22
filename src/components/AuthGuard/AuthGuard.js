import React from 'react';
import { node } from 'prop-types';
import { useAuthGuard } from '../../hooks/useAuthGuard';

/**
 * Authentication Guard Component
 * Wraps the application and handles authentication checks
 * Redirects unauthenticated users to sign-in page
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render
 * @returns {ReactElement} Rendered children or null during redirect
 */
const AuthGuard = ({ children }) => {
    const { isAuthenticated, isPublicRoute } = useAuthGuard();

    // Always render children - the redirect logic is handled in the hook
    // This ensures smooth navigation and prevents flash of content
    return children;
};

AuthGuard.propTypes = {
    children: node.isRequired
};

export default AuthGuard;
