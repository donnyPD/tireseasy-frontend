/**
 * This file is augmented at build time using the @magento/venia-ui build
 * target "checkoutPagePaymentTypes", which allows third-party modules to
 * add new payment component mappings for the checkout page.
 *
 * @see [Payment definition object]{@link PaymentDefinition}
 */
import defaultCollection from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
import InvoicePayment from './InvoicePayment';

export const paymentMethodCollection = {
    ...defaultCollection,
    invoice: {
        importPath: './InvoicePayment',
        component: InvoicePayment
    }
};

export default paymentMethodCollection;

/**
 * A payment definition object that describes a payment in your storefront.
 *
 * @typedef {Object} PaymentDefinition
 * @property {string} paymentCode is use to map your payment
 * @property {string} importPath Resolvable path to the component the
 *   Route component will render
 *
 * @example <caption>A custom payment method</caption>
 * const myCustomPayment = {
 *      paymentCode: 'cc',
 *      importPath: '@partner/module/path_to_your_component'
 * }
 */
