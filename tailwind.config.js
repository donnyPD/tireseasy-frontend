// TODO @TW:
// Node path should be committed, but it makes preset dev impossible.
// Local path is the only way to develop "tailwind.preset.js".
const venia = require('@magento/pwa-theme-venia');
// const venia = require('../pwa-theme-venia');

const config = {
    mode: 'jit',
    // Include your custom theme here.
    presets: [venia],
    // Configure how Tailwind statically analyzes your code here.
    // Note that the Tailwind's `jit` mode doesn't actually use PurgeCSS.
    content: {
        files: [
            './node_modules/@magento/venia-ui/lib/**/*.module.css',
            '../venia-ui/lib/**/*.module.css',
            './src/**/*.module.css',
            './template.html'
        ],
        // Extract Tailwind classnames from source files.
        // Our default matcher only matches targets of CSS Modules' `composes`,
        // not classnames included directly in HTML or JS!
        extract: {
            css: content => content.match(matcher) || []
        }
    },
    // Set the character Tailwind uses when prefixing classnames with variants.
    // CSS Modules doesn't like Tailwind's default `:`, so we use `_`.
    separator: '_',
    theme: {
        screens: {
            xs: '480px',
            '-xs': {
                max: '479px'
            },
            sm: '640px',
            '-sm': {
                max: '639px'
            },
            hsm: {
                raw: '(min-height: 640px)'
            },
            '-hsm': {
                raw: '(max-height: 639px)'
            },
            md: '768px',
            '-md': {
                max: '767px'
            },
            hmd: {
                raw: '(min-height: 800px)'
            },
            '-hmd': {
                raw: '(max-height: 799px)'
            },
            lg: '960px',
            '-lg': {
                max: '959px'
            },
            hlg: {
                raw: '(min-height: 960px)'
            },
            '-hlg': {
                raw: '(max-height: 959px)'
            },
            xl: '1024px',
            '-xl': {
                max: '1023px'
            },
            '2xl': '1280px',
            '-2xl': {
                max: '-1279px'
            },
            '3xl': '1440px',
            '-3xl': {
                max: '-1439px'
            },
            '4xl': '1600px',
            '-4xl': {
                max: '1599px'
            },
            max: '1920px',
            '-max': {
                max: '1920px'
            }
        },
        extend: {
            colors: {
                // Primary Colors (Dominant)
                'primary-navy': '#003366',      // Navy Blue
                'primary-deep': '#1A2C5B',     // Deep Blue
                'primary-charcoal': '#333333', // Charcoal Gray
                'primary-dark-gray': '#4A4A4A', // Dark Gray

                // Secondary/Accent Colors
                'accent-green': '#4CAF50',      // Standard Green
                'accent-success': '#28A745',    // Bootstrap Success Green
                'accent-soft-green': '#66CC66', // Softer Green
                'accent-orange': '#FF8C00',     // Dark Orange
                'accent-bright-orange': '#FF9933', // Brighter Orange
                'accent-amber': '#FFA500',      // Orange/Amber

                // Neutral/Background Colors
                'neutral-light': '#F8F8F8',     // Off-White
                'neutral-lighter': '#EEEEEE',   // Light Gray
                'neutral-bg': '#FAFAFA',        // Background

                'text-primary': '#333333',      // Primary text
                'text-secondary': '#666666',    // Secondary text
                'text-muted': '#999999',        // Muted text

                // Venia UI Brand Colors Override (complete set)
                'brand': '#1A2C5B',             // Main brand color
                'brand-base': '#1A2C5B',        // Brand base
                'brand-100': '#F8F8F8',         // Light brand variant
                'brand-700': '#1A2C5B',         // Dark brand variant
                'brand-dark': '#1A2C5B',        // Brand dark
                'brand-darkest': '#003366',      // Brand darkest
                'brand-light': '#f7fafc',      // Brand light
                'brand-light2': '#ebf7ff',      // Brand light

                'primary-red': '#e12528',
                'primary-dark': '#111827',
            }
        }
    }
};

module.exports = config;

/**
 * Matches declarations that contain tailwind classnames.
 * Only classnames matched by this expression will be included in the build.
 *
 * @example
 * .foo {
 *   composes: mx-auto from global;
 * }
 */
const matcher = /(?<=composes:.*)(\S+)(?=.*from global;)/g;
