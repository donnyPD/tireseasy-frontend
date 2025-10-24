import React from 'react';
import { object, shape, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { usePriceSlider } from '../../talons/usePriceSlider';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import defaultClasses from './priceSlider.css';
import FromTo from '../FromTo';

const Range = Slider.createSliderWithTooltip(Slider.Range);

const PriceSlider = props => {
  const talonProps = usePriceSlider(props);

  const {
    step,
    handleChange,
    inputValue,
    defaultValue,
    isShowFromToWidget,
    sliderStyle,
    formatValue
  } = talonProps;

  const classes = mergeClasses(defaultClasses, props.classes);

  const [from, to] = inputValue;
  const result = `${formatValue(from)} - ${formatValue(to)}`;

  const footer = isShowFromToWidget ? (
    <FromTo {...props} />
  ) : (
    <span className={classes.result}>{result}</span>
  );

  const rangeClassName = [classes.range, classes[`range${sliderStyle}`]].join(
    ' '
  );

  return (
    <div className={classes.root}>
      <div className={rangeClassName}>
        <Range
          min={defaultValue[0]}
          max={defaultValue[1]}
          step={step || 1}
          defaultValue={defaultValue}
          onChange={handleChange}
          tipFormatter={formatValue}
          value={[
            inputValue[0] === '*' || inputValue[0] < defaultValue[0]
              ? defaultValue[0]
              : +inputValue[0],
            inputValue[1] === '*' || inputValue[1] > defaultValue[1]
              ? defaultValue[1]
              : +inputValue[1]
          ]}
        />
      </div>

      {footer}
    </div>
  );
};

export default PriceSlider;

PriceSlider.propTypes = {
  classes: shape({
    root: string,
    range: string
  }),
  item: object,
  filterApi: object,
  filterState: object
};
