# cron-validate

![typescript](https://camo.githubusercontent.com/56e4a1d9c38168bd7b1520246d6ee084ab9abbbb/68747470733a2f2f62616467656e2e6e65742f62616467652f69636f6e2f547970655363726970743f69636f6e3d74797065736372697074266c6162656c266c6162656c436f6c6f723d626c756526636f6c6f723d353535353535)
[![dependencies Status](https://david-dm.org/airfooox/cron-validate/status.svg)](https://david-dm.org/airfooox/cron-validate)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Cron-validate is a cron-expression validator written in TypeScript. 
The validation options are customizable and cron fields like seconds and years are supported.

## Installation

Pacakge is available on npm:

`npm install -S cron-validate`

## Usage

### Basic usage

```typescript
import cron from 'cron-validate'

const cronResult = cron('* * * * *')
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
import cron from 'cron-validate'

const cronResult = cron('* * * * *')
if (cronResult.isValid()) {
  const validValue = cronResult.getValue()
  
  // The valid value is a object containing all cron fields
  console.log(validValue)
  // In this case, it would be: 
  // { seconds: undefined, minutes: '*', hours: '*', daysOfMonth: '*', months: '*', daysOfWeek: '*', years: undefiend }
  
} else {
  const errorValue = cronResult.getError()
  
  // The error value contains an array of strings, which represent the cron validation errors.
  console.log(errorValue) // string[] of error messages
  
}
```
Make sure to test the result type beforehand, because `getValue()` only works on `Valid` and `getError()` only works on `Err`. If you don't check, it will throw an error.

For further information, you can check out https://github.com/gDelgado14/neverthrow, because I used his result system for this package.

## Options / Configuration

To configure the validator, cron-validate uses a preset system. There are already defined presets (default, npm-node-cron or aws), but you can also define your own preset to use for your system. You can also use the override property to set certain option on single cron validates.

### Presets

The following presets are already defined by cron-validate:
- default (see: http://crontab.org/)
- npm-node-cron (see: https://github.com/kelektiv/node-cron)
- aws-cloud-watch (see: https://docs.aws.amazon.com/de_de/AmazonCloudWatch/latest/events/ScheduledEvents.html)

To select a preset for your validation, you can simply do this:

```typescript
cron('* * * * *', {
  preset: 'npm-node-cron'
})
```
or 
```typescript
cron('* * * * *', {
  preset: 'aws-cloud-watch'
})
```

#### Defining and using your own preset

To define your own preset, use this:

```typescript
registerOptionPreset('YOUR-PRESET-ID', {
  presetId: 'YOUR-PRESET-ID',
  useSeconds: false,
  useYears: false,
  seconds: {
    minValue: 0,
    maxValue: 59,
    lowerLimit: 0, // optional, default to minValue
    upperLimit: 59 // optional, default to maxValue
  },
  minutes: {
    minValue: 0,
    maxValue: 59,
    lowerLimit: 0, // optional, default to minValue
    upperLimit: 59 // optional, default to maxValue
  },
  hours: {
    minValue: 0,
    maxValue: 23,
    lowerLimit: 0, // optional, default to minValue
    upperLimit: 23 // optional, default to maxValue
  },
  daysOfMonth: {
    minValue: 1,
    maxValue: 31,
    lowerLimit: 1, // optional, default to minValue
    upperLimit: 31 // optional, default to maxValue
  },
  months: {
    minValue: 0,
    maxValue: 12,
    lowerLimit: 0, // optional, default to minValue
    upperLimit: 12 // optional, default to maxValue
  },
  daysOfWeek: {
    minValue: 1,
    maxValue: 7,
    lowerLimit: 1, // optional, default to minValue
    upperLimit: 7 // optional, default to maxValue
  },
  years: {
    minValue: 1970,
    maxValue: 2099,
    lowerLimit: 1970, // optional, default to minValue
    upperLimit: 2099 // optional, default to maxValue
  },
})
```

The preset properties explained:

- `presetId: string`
  - same id as in first function parameter
- `useSeconds: boolean` 
  - enables seconds field in cron expression
- `useYears: boolean` 
  - enables years field in cron expression

- in cron fields (like seconds):
  - `minValue: number` 
    - minimum value of your cron interpreter (like npm-node-cron only supports 0-6 for weekdays)
    - can't be set as override
  - `maxValue: number` 
    - minimum value of your cron interpreter (like npm-node-cron only supports 0-6 for weekdays)
    - can't be set as override
  - `lowerLimit?: number` 
    - lower limit for validation
    - equal or greater than minValue
    - if not set, default to minValue
  - `upperLimit?: number` 
    - upper limit for validation 
    - equal or lower than maxValue
    - if not set, defaults to maxValue

### Override preset options

If you want to override a option for single cron validations, you can use the `override` property:

```typescript
console.log(cron('* * * * * *', {
  preset: 'default' // second field not supported in default preset
  override: {
    useSeconds: true // override preset option
  }
}))

console.log(cron('* 10-20 * * * *', {
  preset: 'default'
  override: {
    minutes: {
      lowerLimit: 10, // override preset option
      upperLimit: 20 // override preset option
    }
  }
}))
```

## Examples

```typescript
import cron from 'cron-validate'

console.log(cron('* * * * *').isValid()) // true

console.log(cron('* * * * *').isError()) // false

console.log(cron('* 2,3,4 * * *').isValid()) // true

console.log(cron('0 */2 */5 * *').isValid()) // true

console.log(cron('* * * * * *', { override: { useSeconds: true } }).isValid()) // true

console.log(cron('* * * * * *', { override: { useYears: true } }).isValid()) // true

console.log(cron('30 * * * * *', { 
  override: {
    useSeconds: true,
    seconds: {
      lowerLimit: 20,
      upperLimit: 40
    }
  }
}).isValid()) // true

console.log(cron('* 3 * * *', {
  override: {
    hours: {
      lowerLimit: 0,
      upperLimit: 2
    }
  }
}).isValid()) // false

```

## (Planned) Features

- [x] Basic cron validation.
- [x] Error messenges with information about invalid cron expression.
- [x] Seconds field support.
- [x] Years field support.
- [x] Option presets (classic cron, node-cron, etc.)
- [ ] Cron alias support.
- [ ] Blank '?' daysOfMonth/daysOfWeek support

