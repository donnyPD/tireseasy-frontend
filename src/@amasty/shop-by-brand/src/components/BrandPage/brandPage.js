import React, {Fragment, Suspense, useEffect, useMemo, useRef, useState} from 'react';
import { string } from 'prop-types';
import { useBrandPage } from '../../talons/useBrandPage';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Gallery from '../../../../../components/Gallery';
import Pagination from '../../../../../components/Pagination';
import NoProductsFound from '../../../../../RootComponents/Category/NoProductsFound';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import ProductSort from '@magento/venia-ui/lib/components/ProductSort';
import Breadcrumbs from './breadcrumbs';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import defaultClasses from '../../../../../RootComponents/Category/category.module.css';
import brandPageClasses from './brandPage.css';
import { FormattedMessage } from 'react-intl';
import FilterModalOpenButton from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import SortedByContainer from '@magento/venia-ui/lib/components/SortedByContainer';
import QuickLookups from '../../../../../components/QuickLookups';
import SelectSize from '../../../../../components/InvoicesPage/selectSize';
import { ChevronUp, ChevronDown } from 'react-feather';

const FilterModal = React.lazy(() =>
  import('@magento/venia-ui/lib/components/FilterModal')
);
const FilterSidebar = React.lazy(() =>
  import('@magento/venia-ui/lib/components/FilterSidebar')
);

const BrandPage = props => {
  const { brand } = props;
  const [contentHeight, setContentHeight] = useState(160);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const talonProps = useBrandPage({ brand, isOpen, setIsOpen });
  const classes = mergeClasses(defaultClasses, brandPageClasses, props.classes);

  const {
    items,
    totalPagesFromData,
    filters,
    isLoading,
    pageControl,
    sortProps,
    pageTitle,
    brandDescription,
    brandImage,
    totalCount,
    pageSize,
    optionsSize,
    setPageSize
  } = talonProps;

  useEffect(() => {
    if (contentRef.current && isOpen) {
        setContentHeight(contentRef.current.scrollHeight);
    } else {
        setContentHeight(160);
    }
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  }

  const [currentSort] = sortProps;
  const shouldShowFilterButtons = filters && filters.length;
  const isShowMoreBtn = contentRef.current && contentRef.current.scrollHeight > 160 || null;

  // If there are no products we can hide the sort button.
  const shouldShowSortButtons = totalPagesFromData;

  const maybeFilterButtons = shouldShowFilterButtons ? (
    <FilterModalOpenButton filters={filters} />
  ) : null;

  const maybeSelectSize = shouldShowFilterButtons ? (
    <SelectSize
      classes={classes}
      optionsSize={optionsSize}
      pageSize={pageSize}
      setPageSize={setPageSize}
    />
  ) : null;

  const filtersModal = shouldShowFilterButtons ? (
    <FilterModal filters={filters} />
  ) : null;

  const sidebar = shouldShowFilterButtons ? (
    <FilterSidebar filters={filters} />
  ) : null;

  const maybeSortButton = shouldShowSortButtons ? (
    <ProductSort sortProps={sortProps} />
  ) : null;

  const maybeSortContainer = shouldShowSortButtons ? (
    <SortedByContainer currentSort={currentSort} />
  ) : null;

  const categoryResultsHeading =
    totalCount > 0 ? (
      <FormattedMessage
        id={'categoryContent.resultCount'}
        values={{
          count: totalCount
        }}
        defaultMessage={'{count} Results'}
      />
    ) : null;

  const content = useMemo(() => {
    if (totalPagesFromData) {
      return (
        <Fragment>
          <section className={classes.gallery}>
            <Gallery items={items} />
          </section>
          <div className={classes.pagination}>
            <Pagination pageControl={pageControl} />
          </div>
        </Fragment>
      );
    } else {
      if (isLoading) {
        return <LoadingIndicator />;
      } else {
        return <NoProductsFound />;
      }
    }
  }, [
    classes.gallery,
    classes.pagination,
    isLoading,
    items,
    pageControl,
    totalPagesFromData
  ]);

  const brandDescriptionBlock = brandDescription ? (
      <Fragment>
        <div
            ref={contentRef}
            className={`${classes.descriptionContainer} ${isShowMoreBtn ? isOpen ? '' : classes.collapsed : ''}`}
            style={{
                maxHeight: isOpen ? `${contentHeight}px` : '160px',
                transition: 'max-height 0.35s ease',
            }}
        >
          <RichContent html={brandDescription} />
        </div>
        {isShowMoreBtn && <button
          className={classes.triggerBtn}
          onClick={handleTriggerClick}
        >
          <FormattedMessage
              id={'descriptionContainer.button'}
              defaultMessage={isOpen ? 'Show Less Description' : 'Show More Description'}
          />
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>}
      </Fragment>
  ) : null;

  const imageBlock = brandImage ? (
    <div className={classes.imageContainer}>
      <img src={`/${brandImage}`} alt={pageTitle} className={classes.image} />
    </div>
  ) : null;

  return (
    <div className={classes.root_container}>
      <Breadcrumbs currentBrand={pageTitle} />
      <Title>{pageTitle}</Title>
      <Meta name="title" content={pageTitle} />
      <article className={classes.root}>
        <div className={classes.contentWrapper}>
          <div className={classes.sidebar}>
            <QuickLookups />
            <Suspense fallback={null}>{sidebar}</Suspense>
          </div>
          <div className={classes.categoryContent}>
              <div className={classes.categoryHeader}>
                  <h1 className={classes.categoryTitle}>
                      {pageTitle || '...'}
                  </h1>
                  {imageBlock}
                  {brandDescriptionBlock}
              </div>
            <div className={classes.heading}>
              <div className={classes.categoryInfo}>
                {categoryResultsHeading}
              </div>
              <div className={classes.headerButtons}>
                {maybeFilterButtons}
                {maybeSelectSize}
                {maybeSortButton}
              </div>
              {maybeSortContainer}
            </div>
            {content}
            <Suspense fallback={null}>{filtersModal}</Suspense>
          </div>
        </div>
      </article>
    </div>
  );
};

BrandPage.propTypes = {
  brand: string.isRequired
};

export default BrandPage;
