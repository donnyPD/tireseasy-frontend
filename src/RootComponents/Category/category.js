import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useCategory } from '../../talons/RootComponents/Category';
import { useStyle } from '@magento/venia-ui/lib/classify';

import CategoryContent from './categoryContent';
import defaultClasses from './category.module.css';
import customClasses from './categoryContent.module.css';
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { GET_PAGE_SIZE } from './category.gql';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { useIntl } from 'react-intl';

const MESSAGES = new Map().set(
    'NOT_FOUND',
    "Looks like the category you were hoping to find doesn't exist. Sorry about that."
);

const Category = props => {
    const { uid } = props;
    const { formatMessage } = useIntl();

    const talonProps = useCategory({
        id: uid,
        queries: {
            getPageSize: GET_PAGE_SIZE
        }
    });

    const {
        error,
        metaDescription,
        loading,
        categoryData,
        pageControl,
        sortProps,
        pageSize,
        categoryNotFound
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes, customClasses);

    if (!categoryData) {
        if (error && pageControl.currentPage === 1) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }

            return <ErrorView />;
        }
    }

    if (categoryNotFound) {
        return (
            <ErrorView
                message={formatMessage({
                    id: 'category.notFound',
                    defaultMessage: MESSAGES.get('NOT_FOUND')
                })}
            />
        );
    }

    return (
        <>
            <main className={classes.mainContent}>
                <Meta name="description" content={metaDescription}/>
                <CategoryContent
                    categoryId={uid}
                    classes={classes}
                    data={categoryData}
                    isLoading={loading}
                    pageControl={pageControl}
                    sortProps={sortProps}
                    pageSize={pageSize}
                />
            </main>
        </>
    );
};

Category.propTypes = {
    classes: shape({
        gallery: string,
        root: string,
        title: string
    }),
    uid: string
};

Category.defaultProps = {
    uid: 'Mg=='
};

export default Category;
