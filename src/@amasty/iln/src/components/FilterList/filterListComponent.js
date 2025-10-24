import React from 'react';
import FilterList from './filterList';
import { filterTypeConfig } from './filterTypeConfig';

const FilterListComponent = props => {
  const { filterBlockSettings, filterState, items, ...restProps } = props;
  const { display_mode_label } = filterBlockSettings;

  const filterType = filterTypeConfig[display_mode_label] || {};
  const { listComponent, ...rest } = filterType;

  const ListComponent = listComponent || FilterList;

  const componentProps = {
    filterBlockSettings,
    ...restProps,
    ...rest
  };

  return (
    <ListComponent
      {...componentProps}
      items={items}
      filterState={filterState}
    />
  );
};

export default FilterListComponent;
