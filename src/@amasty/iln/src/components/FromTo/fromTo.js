import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './fromTo.css';
import { useIntl, FormattedMessage } from 'react-intl';
import CurrencySymbol from '@magento/venia-ui/lib/components/CurrencySymbol';
import { useFromTo } from '../../talons/useFromTo';

const FromTo = props => {
  const { group } = props;
  const { formatMessage } = useIntl();

  const talonProps = useFromTo(props);
  const { handleChange, handleApply, inputValue, currencyCode } = talonProps;

  const classes = mergeClasses(defaultClasses, props.classes);

  const inputProps = {
    type: 'number',
    className: classes.input,
    onChange: handleChange
  };

  return (
    <div className={classes.root}>
      <div className={classes.inputs}>
        <input
          name={`${group}_from`}
          value={inputValue[0]}
          placeholder={formatMessage({
            id: 'amIln.from',
            defaultMessage: 'From'
          })}
          {...inputProps}
        />
        <span className={classes.separator} />
        <input
          name={`${group}_to`}
          value={inputValue[1]}
          placeholder={formatMessage({
            id: 'amIln.to',
            defaultMessage: 'To'
          })}
          {...inputProps}
        />

        <CurrencySymbol
          classes={{ currency: classes.currency }}
          currencyCode={currencyCode}
        />
      </div>

      <div className={classes.buttons}>
        <Button onClick={handleApply}>
          <FormattedMessage id={'amIln.Apply'} defaultMessage={'Apply'} />
        </Button>
      </div>
    </div>
  );
};

FromTo.propTypes = {
  group: string,
  classes: shape({
    root: string
  })
};

export default FromTo;
