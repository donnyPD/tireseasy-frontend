import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { func, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import defaultClasses from './searchField.css';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { X as ClearIcon } from 'react-feather';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

const clearIcon = <Icon src={ClearIcon} size={24} />;

const SearchField = props => {
  const { onChange, reset, value, field } = props;

  const { formatMessage } = useIntl();

  const resetButton = value ? (
    <Trigger action={reset}>{clearIcon}</Trigger>
  ) : null;

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div className={classes.root}>
      <TextInput
        placeholder={formatMessage({
          id: 'filterList.search',
          defaultMessage: 'Search'
        })}
        after={resetButton}
        field={field}
        autoComplete="off"
        onValueChange={onChange}
      />
    </div>
  );
};

SearchField.propTypes = {
  onChange: func,
  classes: shape({
    root: string
  })
};

SearchField.defaultProps = {};

export default SearchField;
