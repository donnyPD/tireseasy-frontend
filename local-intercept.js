/* eslint-disable */
/**
 * Custom interceptors for the project.
 *
 * This project has a section in its package.json:
 *    "pwa-studio": {
 *        "targets": {
 *            "intercept": "./local-intercept.js"
 *        }
 *    }
 *
 * This instructs Buildpack to invoke this file during the intercept phase,
 * as the very last intercept to run.
 *
 * A project can intercept targets from any of its dependencies. In a project
 * with many customizations, this function would tap those targets and add
 * or modify functionality from its dependencies.
 */
const moduleOverridePlugin = require('./src/plugins/moduleOverrideWebPack');

function localIntercept(targets) {
    // Configure buildpack to work with our RootComponents
    const builtins = targets.of('@magento/pwa-buildpack');

    // Specify that our component uses ES modules
    builtins.specialFeatures.tap(featuresByModule => {
        featuresByModule['src/RootComponents/Product'] = {
            esModules: true
        };
        featuresByModule['src/RootComponents/Category'] = {
            esModules: true
        };
        featuresByModule['src/RootComponents/Search'] = {
            esModules: true
        };
    });

    // Override components to fix Wishlist errors
    const veniaTargets = targets.of('@magento/venia-ui');

    // Override Gallery component to use our custom version
    veniaTargets.routes.tap(routes => {
        // This helps ensure our custom components are used
        return routes;
    });


    const componentOverrideMapping = {
        '@magento/venia-ui/lib/components/CartPage/cartPage.js': './src/components/CartPage/cartPage.js',
        '@magento/venia-ui/lib/components/SearchPage/searchPage.js': './src/components/SearchPage/searchPage.js',
        '@magento/venia-ui/lib/components/CheckoutPage/checkoutPage.js': './src/components/CheckoutPage/checkoutPage.js',
        '@magento/venia-ui/lib/components/CheckoutPage/OrderConfirmationPage/orderConfirmationPage.js': './src/components/CheckoutPage/OrderConfirmationPage/orderConfirmationPage.js',
    };

    targets.of('@magento/pwa-buildpack').transformUpward.tap(def => {
        def.staticFromRoot.inline.body.file.template.inline =
            './public/{{ filename }}';
    });

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    });

    // Disable EE features that might cause issues
    builtins.envVarDefinitions.tap(defs => {
        defs.sections.push({
            name: 'Custom Features',
            variables: [
                {
                    name: 'DISABLE_EE_FEATURES',
                    type: 'bool',
                    desc: 'Disable Enterprise Edition features',
                    default: true
                }
            ]
        });
    });
}

module.exports = localIntercept;
