import React, { Fragment } from 'react';
import ShowMoreLessButton from '../src/components/FilterList/showMoreLessButton';
import { useCurrentFilters } from '../src/talons/useCurrentFilters';

const WrapCurrentFilters = Component => props => {
  const { filterState } = props;
  const {
    classes,
    getItemClassName,
    unfoldedOptions,
    stateLength,
    isExpanded,
    handleListToggle
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useCurrentFilters({ filterState });

  return (
    <Fragment>
      <Component
        {...props}
        classes={classes}
        getItemClassName={getItemClassName}
      />
      <div className={classes.showMore}>
        <ShowMoreLessButton
          itemCountToShow={unfoldedOptions}
          itemsLength={stateLength}
          isListExpanded={isExpanded}
          handleListToggle={handleListToggle}
        />
      </div>
    </Fragment>
  );
};

export default WrapCurrentFilters;
