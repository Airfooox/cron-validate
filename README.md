# cron-validate

![typescript](https://camo.githubusercontent.com/56e4a1d9c38168bd7b1520246d6ee084ab9abbbb/68747470733a2f2f62616467656e2e6e65742f62616467652f69636f6e2f547970655363726970743f69636f6e3d74797065736372697074266c6162656c266c6162656c436f6c6f723d626c756526636f6c6f723d353535353535)
[![dependencies Status](https://david-dm.org/airfooox/cron-validate/status.svg)](https://david-dm.org/airfooox/cron-validate)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Cron-validate is a cron-expression validator written in TypeScript. 
The validation options are customizable and cron fields like seconds and years are supported.

## Installation

// not yet released on npm

`npm install cron-validate`

## Usage

### Basic usage

```typescript
import isCronValid from 'cron-validate'

const cronResult = isCronValid('* * * * *')
if (cronResult.isValid()) { // !cronResult.isError()
  // valid code
} else {
  // error code
}
```

### Result system

The `isCronValid` function returns a Result-type, which is either `Valid<T, E>` or `Err<T, E>`.

For checking the returned result, just use `result.isValid()` or `result.isError()`

Both result types contain values: 

```typescript
import isCronValid from 'cron-validate'

const cronResult = isCronValid('* * * * *')
if (cronResult.isValid()) {
  const validValue = cronResult.getValue()
  // The valid value is always a boolean and always is true.
  console.log(validValue) // true
  
} else if (cronResult.isError()) {
  const errorValue = cronResult.getError()
  // The error value contains an array of strings, which represent the cron validation errors.
  console.log(errorValue) // string[] of error messages
  
}
```
Make sure to test the result type beforehand, because `getValue()` only works on `Valid` and `getError()` only works on `Err`. If you don't check, it will throw an error.

For further information, you can check out https://github.com/gDelgado14/neverthrow, because I used his result system for this package.

## Options / Configuration

The options available are:

- `useSeconds: boolean` (`default: false`, enable when using seconds in cron expression)
- `useYears: boolean` (`default: false`, enable when using years in cron expression)
- `seconds: object`
  - `lowerLimit: number` (`default: 0`, lower limit of seconds field (can't be lower than 0))
  - `upperLimit: number` (`default: 59`, upper limit of seconds field (can't be higher than 59))
- `minutes: object`
  - `lowerLimit: number` (`default: 0`, lower limit of minutes field (can't be lower than 0))
  - `upperLimit: number` (`default: 59`, upper limit of minutes field (can't be higher than 59))
- `hours: object`
  - `lowerLimit: number` (`default: 0`, lower limit of hours field (can't be lower than 0))
  - `upperLimit: number` (`default: 23`, upper limit of hours field (can't be higher than 23))
- `daysOfMonth: object`
  - `lowerLimit: number` (`default: 1`, lower limit of daysOfMonth field (can't be lower than 1))
  - `upperLimit: number` (`default: 31`, upper limit of daysOfMonth field (can't be higher than 31))
- `months: object`
  - `lowerLimit: number` (`default: 1`, lower limit of months field (can't be lower than 0))
  - `upperLimit: number` (`default: 12`, upper limit of months field (can't be higher than 12))
- `daysOfWeek: object`
  - `lowerLimit: number` (`default: 1`, lower limit of daysOfWeek field (can't be lower than 0))
  - `upperLimit: number` (`default: 7`, upper limit of daysOfWeek field (can't be higher than 7))

Examples:

```typescript
import isCronValid from 'cron-validate'

console.log(isCronValid('* * * * * *', { useSeconds: true })) // true

console.log(isCronValid('* * * * * *', { useYears: true })) // true

console.log(isCronValid('30 * * * * *', { 
  useSeconds: true,
  seconds: {
    lowerLimit: 20,
    upperLimit: 40
  }
})) // true

console.log(isCronValid('* 3 * * *', {
  hours: {
    lowerLimit: 0,
    upperLimit: 2
  }
})) // false

```

## (Planned) Features

- [x] Basic cron validation.
- [x] Error messenges with information about invalid cron expression.
- [x] Seconds field support.
- [x] Years field support.
- [ ] Cron alias support.
- [ ] Blank '?' daysOfMonth/daysOfWeek support
- [ ] Option presets (classic cron, node-cron, etc.)
