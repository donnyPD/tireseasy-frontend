# QuickLookups Component

The QuickLookups component provides two forms for searching vehicle information:

## Functionality

### Vehicle Lookup
- **Year** - year of manufacture (required field, dropdown list)
- **Make** - vehicle make (required field, dropdown list, disabled until year is selected)  
- **Model** - vehicle model (required field, dropdown list, disabled until year and make are selected)

### VIN Lookup
- **VIN** - vehicle identification number (required field, 17 characters)
- Validation: Must be exactly 17 alphanumeric characters, cannot contain I, O, or Q
- Automatically converts to uppercase
- Shows validation errors if VIN format is invalid
- Hint: "VIN: 17 characters, no I, O, or Q"

## Usage

```jsx
import QuickLookups from '../QuickLookups';

// In component
<QuickLookups />
```

## Components

### YearSelect
Component for selecting year from dropdown list:
- Loads years list via GraphQL query
- Displays years in descending order (newest first)
- Shows loading state
- Handles loading errors

### useYearList
Custom hook for working with years data:
- Executes GraphQL query `GET_YEAR_LIST`
- Returns sorted list of years
- Provides loading state and errors

### MakeSelect
Component for selecting make from dropdown list:
- Loads makes list via GraphQL query based on selected year
- Displays makes in alphabetical order
- Shows loading state and handles errors
- Disabled until year is selected

### useMakeList
Custom hook for working with makes data:
- Executes GraphQL query `GET_MAKE_LIST` with year parameter
- Returns sorted list of makes for specific year
- Provides loading state and errors
- Skips query if no year is provided

### ModelSelect
Component for selecting model from dropdown list:
- Loads models list via GraphQL query based on selected year and make
- Displays models in alphabetical order
- Shows loading state and handles errors
- Disabled until year and make are selected

### useModelList
Custom hook for working with models data:
- Executes GraphQL query `GET_MODEL_LIST` with year and make parameters
- Returns sorted list of models for specific year and make
- Provides loading state and errors
- Skips query if no year or make is provided

### useOptions
Custom hook for getting vehicle options:
- Uses lazy query `GET_OPTIONS` with year, make and model parameters
- Executes query only when explicitly called (on form submission)
- Logs results to console as requested
- Provides loading state and error handling

### useVinLookup
Custom hook for VIN lookup functionality:
- Uses lazy query `GET_OPTIONS_BY_VIN` with VIN parameter
- Includes VIN validation function `validateVin`
- Executes query only when explicitly called (on VIN form submission)
- Logs results to console as requested
- Provides loading state and error handling
- Validates VIN format before making GraphQL request

### validateVin
Utility function for VIN validation:
- Checks that VIN is exactly 17 characters long
- Ensures VIN contains only alphanumeric characters
- Validates that VIN doesn't contain I, O, or Q characters
- Returns boolean indicating if VIN is valid

## Data Processing

When each form is submitted, data is logged to console:
- `console.log('Vehicle Lookup Form Data:', values)` - for Vehicle Lookup form data
- `console.log('Vehicle Options:', options)` - for vehicle options response
- `console.log('Query executed with:', { year, make, model })` - for query parameters
- `console.log('VIN Lookup Form Data:', values)` - for VIN Lookup form data
- `console.log('VIN Lookup Query Result:', result.data)` - for VIN lookup GraphQL response
- `console.log('Query executed with VIN:', vin)` - for VIN query parameter

### Vehicle Options Flow
1. User fills all required fields (Year, Make, Model)
2. User clicks "LOOKUP VEHICLE" button
3. GraphQL query `getOptions` is executed with selected parameters
4. Response with options is logged to console
5. Button shows loading state during request

### VIN Lookup Flow
1. User enters VIN number (automatically converted to uppercase)
2. User clicks "LOOKUP VIN" button
3. VIN is validated (17 characters, alphanumeric, no I/O/Q)
4. If valid, GraphQL query `getOptionsByVin` is executed with VIN parameter
5. Response is logged to console in format: `{ "data": { "getOptionsByVin": ... } }`
6. Button shows loading state during request
7. Validation or query errors are displayed to user

## Field Disabling Logic

Vehicle Lookup form fields are disabled based on selection sequence:
- **Make field**: Disabled until year is selected
- **Model field**: Disabled until both year and make are selected
- **Submit button**: Disabled until year, make and model are selected, or during options loading

This ensures proper form filling sequence and prevents invalid submissions.

## Styling

The component uses CSS modules and Venia theme variables:
- `--color-accent-orange` - main orange color
- `--color-primary-deep` - deep blue color for headers
- `--color-neutral-bg` - section background color

## Responsiveness

The component is fully responsive and displays correctly on all devices:
- Desktop: two forms in a row
- Tablet: forms adapt to screen size
- Mobile: forms in a single column
