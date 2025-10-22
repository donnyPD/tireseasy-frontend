import React, { Fragment, Suspense, useMemo, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { array, number, shape, string } from 'prop-types';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { useStyle } from '@magento/venia-ui/lib/classify';
import classnames from 'classnames';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import ProductSort, { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import defaultClasses from './category.module.css';
import NoProductsFound from '@magento/venia-ui/lib/RootComponents/Category/NoProductsFound';

const FilterModal = React.lazy(() => import('@magento/venia-ui/lib/components/FilterModal'));
const FilterSidebar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/FilterSidebar')
);

import { GalleryShimmer } from '../../components/Gallery';
import Gallery from '../../components/Gallery';
import QuickLookups from "../../components/QuickLookups";

const DISPLAY_MODE = {
    PRODUCTS: 'PRODUCTS',
    PAGE: 'PAGE',
    PRODUCTS_AND_PAGE: 'PRODUCTS_AND_PAGE'
};

const CategoryContent = props => {
    const {
        categoryId,
        data,
        isLoading,
        pageControl,
        sortProps,
        pageSize
    } = props;
    const [currentSort] = sortProps;

    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });

    const {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        setFilterOptions,
        items,
        totalCount,
        totalPagesFromData,
        categoryDisplayMode,
        cmsBlockContent
    } = talonProps;

    const sidebarRef = useRef(null);
    const classes = useStyle(defaultClasses, props.classes);
    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData && availableSortMethods;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} setFilterOptions={setFilterOptions} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort
            sortProps={sortProps}
            availableSortMethods={availableSortMethods}
        />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const categoryResultsHeading =
        totalCount > 0 ? (
            <div>
                {' '}
                <FormattedMessage
                    id={'categoryContent.resultCount'}
                    values={{
                        count: totalCount
                    }}
                    defaultMessage={'{count} Results'}
                />{' '}
            </div>
        ) : isLoading ? (
            <Shimmer width={5} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const shouldRenderCmsOnly = categoryDisplayMode === DISPLAY_MODE.PAGE;
    const shouldRenderProducts =
        categoryDisplayMode === null ||
        categoryDisplayMode === DISPLAY_MODE.PRODUCTS ||
        categoryDisplayMode === DISPLAY_MODE.PRODUCTS_AND_PAGE;
    const shouldRenderCmsWithProducts =
        categoryDisplayMode === DISPLAY_MODE.PRODUCTS_AND_PAGE;

    const content = useMemo(() => {
        if (!totalPagesFromData && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery = totalPagesFromData ? (
            <Gallery items={items} />
        ) : (
            <GalleryShimmer items={items} />
        );

        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} />
        ) : null;

        return (
            <Fragment>
                <section className={classes.gallery}>{gallery}</section>
                <div className={classes.pagination}>{pagination}</div>
            </Fragment>
        );
    }, [
        categoryId,
        classes.gallery,
        classes.pagination,
        isLoading,
        items,
        pageControl,
        totalPagesFromData
    ]);

    const categoryTitle = categoryName ? (
        categoryName
    ) : (
        <Shimmer width={5} />
    );

    return (
        <Fragment>
            <div>
                <div style={{ maxWidth: '1370px', margin: '0 auto' }}>
                    <Breadcrumbs categoryId={categoryId} />
                </div>

                <StoreTitle>{categoryName}</StoreTitle>
                <article
                    className={classes.root}
                    style={{ gap: '20px' }}
                    data-cy="CategoryContent-root"
                >
                    {shouldRenderProducts && (
                        <div
                            className={classes.contentWrapper}
                            style={{ padding: '0 20px' }}
                        >
                            <div
                                ref={sidebarRef}
                                className={classes.sidebar}
                            >
                                <QuickLookups />
                                <Suspense
                                    fallback={<FilterSidebarShimmer />}
                                >
                                    {shouldRenderSidebarContent
                                        ? sidebar
                                        : null}
                                </Suspense>
                            </div>
                            <div
                                className={classnames(
                                    classes.categoryContent,
                                    'px-2xs'
                                )}
                            >
                                <div className={classes.categoryHeader}>
                                    <h1
                                        aria-live="polite"
                                        className={classes.title}
                                    >
                                        <div
                                            className={
                                                classes.categoryTitle
                                            }
                                            data-cy="CategoryContent-categoryTitle"
                                        >
                                            <div>{categoryTitle}</div>
                                        </div>
                                    </h1>
                                    {/*{categoryDescriptionElement}*/}
                                    {/* CMS Block always after description if shown */}
                                    {/*{(shouldRenderCmsOnly || shouldRenderCmsWithProducts) &&*/}
                                    {/*    cmsBlockContent && (*/}
                                    {/*        <RichContent html={cmsBlockContent} />*/}
                                    {/*    )}*/}
                                </div>
                                <div className={classes.heading}>
                                    <div
                                        data-cy="CategoryContent-categoryInfo"
                                        className={classes.categoryInfo}
                                    >
                                        {categoryResultsHeading}
                                    </div>
                                    <div className={classes.headerButtons}>
                                        {maybeFilterButtons}
                                        {maybeSortButton}
                                    </div>
                                    {maybeSortContainer}
                                </div>
                                {content}
                                <Suspense fallback={null}>
                                    {filtersModal}
                                </Suspense>
                            </div>
                        </div>
                    )}
                </article>
            </div>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        gallery: string,
        pagination: string,
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string
    }),
    // sortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    sortProps: array,
    pageSize: number
};
