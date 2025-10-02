import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Menu, X, Clock, Search } from 'react-feather';
import { useStyle } from '@magento/venia-ui/lib/classify';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useCustomHeader } from './useCustomHeader';
import defaultClasses from './header.module.css';
import CartTrigger from './cartTrigger';
import Logo from '../../assets/images/Logo-Negative.svg';

const Header = (props) => {
    const classes = useStyle(defaultClasses, props.classes);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        isSignedIn,
        currentUser,
        menuCategories,
        cartId,
        storeConfig,
        loading,
        hasError
    } = useCustomHeader();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = resourceUrl(`/search.html?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const renderLogo = () => {
        if (storeConfig?.header_logo_src) {
            // Construct full URL for the logo based on your Magento setup
            let logoSrc;

            if (storeConfig.header_logo_src.startsWith('http')) {
                logoSrc = storeConfig.header_logo_src;
            } else {
                // For your specific setup: https://devadmin.driveline-auto.com/media/logo/stores/1/fE1rSh8Wg75A5ZonH2_1.png
                const baseUrl = 'https://devadmin.driveline-auto.com';
                const logoPath = storeConfig.header_logo_src.replace(/^\/+/, '');
                logoSrc = `${baseUrl}/media/logo/${logoPath}`;
            }

            return (
                <div className={classes.logoSection}>
                    <Link to={resourceUrl('/')} className={classes.logoText}>
                        <img
                            src={Logo}
                            alt={storeConfig.logo_alt || 'DriveLine'}
                            style={{
                                height: storeConfig.logo_height ? `${storeConfig.logo_height}px` : '32px',
                                width: storeConfig.logo_width ? `${storeConfig.logo_width}px` : 'auto'
                            }}
                            onError={(e) => {
                                console.error('Logo failed to load:', logoSrc);
                                console.log('Trying fallback...');
                            }}
                        />
                    </Link>
                </div>
            );
        }

        // Fallback to text logo with icon
        return (
            <div className={classes.logoSection}>
                <Link to={resourceUrl('/')} className={classes.logoText}>
                <div className={classes.logoIcon}>D</div>
                </Link>
            </div>
        );
    };

    const renderCategoryDropdown = (category) => {
        if (!category.children || category.children.length === 0) {
            return null;
        }

        return (
            <div className={classes.dropdown}>
                <ul className={classes.dropdownList}>
                    {category.children.map((child) => (
                        <li key={child.uid} className={classes.dropdownItem}>
                            <Link
                                to={resourceUrl(`/${child.url_path}`)}
                                className={classes.dropdownLink}
                            >
                                {child.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderUserInfo = () => {
        if (loading) {
            return (
                <span className={classes.userStatus}>
                    Loading user info...
                </span>
            );
        }

        if (isSignedIn && currentUser) {
            return (
                <>
                    <span className={classes.userStatus}>
                        Logged in as: <strong>{currentUser.firstname} {currentUser.lastname}</strong>
                    </span>
                </>
            );
        }

        return null;
    };

    return (
        <header className={classes.header}>
            {/* Main Navigation Bar */}
            <div className={classes.mainNavBar}>
                <div className={classes.navContainer}>
                    {/* Mobile Menu Button */}
                    <button
                        className={classes.mobileMenuButton}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    {renderLogo()}

                    {/* Search Bar */}
                    <div className={classes.searchContainer}>
                        <form onSubmit={handleSearchSubmit} className={classes.searchForm}>
                            <div className={classes.searchInputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Search all Products"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className={classes.searchInput}
                                    aria-label="Search products"
                                />
                                <button
                                    type="submit"
                                    className={classes.searchButton}
                                    aria-label="Search"
                                >
                                    <Search size={18} />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order History and Cart Icons */}
                    <div className={classes.navActions}>
                        <Link to={resourceUrl('/order-history')} className={classes.orderHistoryIcon} aria-label="Order History">
                            <Clock size={20} />
                        </Link>
                        <CartTrigger />
                    </div>

                    {/* Main Navigation */}
                    <nav className={`${classes.mainNavigation} ${isMobileMenuOpen ? classes.navigationOpen : ''}`}>
                        <ul className={classes.navList}>
                            {loading ? (
                                <li className={classes.navItem}>
                                    <span className={classes.navLink} style={{ color: '#ffffff' }}>
                                        Loading navigation...
                                    </span>
                                </li>
                            ) : (
                                menuCategories.map((category) => (
                                    <li key={category.uid} className={classes.navItem}>
                                        <Link
                                            to={resourceUrl(`/${category.url_path}`)}
                                            className={classes.navLink}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                        {renderCategoryDropdown(category)}
                                    </li>
                                ))
                            )}
                            <li className={classes.navItem}>
                                <Link
                                    to={resourceUrl('/wheels')}
                                    className={classes.navLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FormattedMessage id="header.wheels" defaultMessage="Wheels" />
                                </Link>
                            </li>
                            <li className={classes.navItem}>
                                <Link
                                    to={resourceUrl('/auto-parts')}
                                    className={classes.navLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FormattedMessage id="header.autoParts" defaultMessage="Auto Parts" />
                                </Link>
                            </li>
                            <li className={classes.navItem}>
                                <Link
                                    to={resourceUrl('/tools-supplies')}
                                    className={classes.navLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FormattedMessage id="header.toolsSupplies" defaultMessage="Tools & Supplies" />
                                </Link>
                            </li>
                            <li className={classes.navItem}>
                                <Link
                                    to={resourceUrl('/fluids')}
                                    className={classes.navLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FormattedMessage id="header.fluids" defaultMessage="Fluids" />
                                </Link>
            </li>
                            <li className={classes.navItem}>
                                <Link
                                    to={resourceUrl('/order-history')}
                                    className={classes.navLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FormattedMessage id="header.orderHistory" defaultMessage="Order History" />
                                </Link>
                            </li>
                            <li className={classes.navItem}>
                                <Link
                                    to={resourceUrl('/account-information')}
                                    className={classes.navLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FormattedMessage id="header.accountSettings" defaultMessage="Account Settings" />
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* User Info Bar */}
            <div className={classes.userInfoBar}>
                <div className={classes.userInfoContainer}>
                    <div className={classes.userInfoLeft}>
                        {renderUserInfo()}
                    </div>
                    <div className={classes.userInfoRight}>
                        <span className={classes.locationInfo}>Location: Main Warehouse, Gear City</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
