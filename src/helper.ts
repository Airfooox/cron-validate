import type { CronFieldType } from './index'
import { Err, err, Result, Valid, valid } from './result'
import type { Options } from './types'

// Instead of translating the alias to a number, we just validate that it's an accepted alias.
// This is to avoid managing the limits with the translation to numbers.
// e.g.: For AWS, sun = 1, while for normal cron, sun = 0. Translating to numbers would break that.
const monthAliases = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const daysOfWeekAliases = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

const checkWildcardLimit = (cronFieldType: CronFieldType, options: Options) => {
  return (
    options[cronFieldType].lowerLimit ===
      options.preset[cronFieldType].minValue &&
    options[cronFieldType].upperLimit ===
      options.preset[cronFieldType].maxValue
  )
}

const checkSingleElementWithinLimits = (
  element: string,
  cronFieldType: CronFieldType,
  options: Options
): Result<boolean, string> => {
  if (cronFieldType === 'months' && options.useAliases && monthAliases.indexOf(element.toLowerCase()) !== -1) {
    return valid(true)
  }

  if (cronFieldType === 'daysOfWeek' && options.useAliases && daysOfWeekAliases.indexOf(element.toLowerCase()) !== -1) {
    return valid(true)
  }

  const number = Number(element)
  if (isNaN(number)) {
    return err(`Element '${element} of ${cronFieldType} field is invalid.`)
  }

  const { lowerLimit } = options[cronFieldType]
  const { upperLimit } = options[cronFieldType]
  if (lowerLimit && number < lowerLimit) {
    return err(
      `Number ${number} of ${cronFieldType} field is smaller than lower limit '${lowerLimit}'`
    )
  }

  if (upperLimit && number > upperLimit) {
    return err(
      `Number ${number} of ${cronFieldType} field is bigger than upper limit '${upperLimit}'`
    )
  }

  return valid(true)
}

const checkSingleElement = (
  element: string,
  cronFieldType: CronFieldType,
  options: Options
): Result<boolean, string> => {
  if (element === '*') {
    if (!checkWildcardLimit(cronFieldType, options)) {
      return err(
        `Field ${cronFieldType} uses wildcard '*', but is limited to ${options[cronFieldType].lowerLimit}-${options[cronFieldType].upperLimit}`
      )
    }

    return valid(true)
  }

  if (element === '') {
    return err(`One of the elements is empty in ${cronFieldType} field.`)
  }

  if (cronFieldType === 'daysOfMonth' && options.useLastDayOfMonth && element === 'L') {
    return valid(true)
  }

  // We must do that check here because L is used with a number to specify the day of the week for which
  // we look for the last occurrence in the month.
  // We use `endsWith` here because anywhere else is not valid so it will be caught later on.
  if (cronFieldType === 'daysOfWeek' && options.useLastDayOfWeek && element.endsWith('L')) {
      const day = element.slice(0, -1)
      if (day === '') {
        // This means that element is only `L` which is the equivalent of saturdayL
        return valid(true)
      }

      return checkSingleElementWithinLimits(day, cronFieldType, options)
  }

  // We must do that check here because W is used with a number to specify the day of the month for which
  // we must run over a weekday instead.
  // We use `endsWith` here because anywhere else is not valid so it will be caught later on.
  if (cronFieldType === 'daysOfMonth' && options.useNearestWeekday && element.endsWith('W')) {
    const day = element.slice(0, -1)
    if (day === '') {
      return err(`The 'W' must be preceded by a day`)
    }

    // Edge case where the L can be used with W to form last weekday of month
    if (options.useLastDayOfMonth && day === 'L') {
      return valid(true)
    }

    return checkSingleElementWithinLimits(day, cronFieldType, options)
  }

  if (cronFieldType === 'daysOfWeek' && options.useNthWeekdayOfMonth && element.indexOf('#') !== -1) {
    const [day, occurrence, ...leftOvers] = element.split('#')
    if (leftOvers.length !== 0) {
      return err(`Unexpected number of '#' in ${element}, can only be used once.`)
    }

    const occurrenceNum = Number(occurrence)
    if (!occurrence || isNaN(occurrenceNum)) {
      return err(`Unexpected value following the '#' symbol, a positive number was expected but found ${occurrence}.`)
    }

    return checkSingleElementWithinLimits(day, cronFieldType, options)
  }

  return checkSingleElementWithinLimits(element, cronFieldType, options)
}

const checkRangeElement = (
  element: string,
  cronFieldType: CronFieldType,
  options: Options,
  position: 0 | 1
): Result<boolean, string> => {
  if (element === '*') {
    return err(`'*' can't be part of a range in ${cronFieldType} field.`)
  }

  if (element === '') {
    return err(`One of the range elements is empty in ${cronFieldType} field.`)
  }

  // We can have `L` as the first element of a range to specify an offset.
  if (
    options.useLastDayOfMonth &&
    cronFieldType === 'daysOfMonth' &&
    element === 'L' &&
    position === 0
  ) {
    return valid(true)
  }

  return checkSingleElementWithinLimits(element, cronFieldType, options)
}

const checkFirstStepElement = (
  firstStepElement: string,
  cronFieldType: CronFieldType,
  options: Options
): Result<boolean, string> => {
  const rangeArray = firstStepElement.split('-')
  if (rangeArray.length > 2) {
    return err(
      `List element '${firstStepElement}' is not valid. (More than one '-')`
    )
  }

  if (rangeArray.length === 1) {
    return checkSingleElement(rangeArray[0], cronFieldType, options)
  }

  if (rangeArray.length === 2) {
    const firstRangeElementResult = checkRangeElement(
      rangeArray[0],
      cronFieldType,
      options,
      0
    )
    const secondRangeElementResult = checkRangeElement(
      rangeArray[1],
      cronFieldType,
      options,
      1
    )

    if (firstRangeElementResult.isError()) {
      return firstRangeElementResult
    }

    if (secondRangeElementResult.isError()) {
      return secondRangeElementResult
    }

    if (Number(rangeArray[0]) > Number(rangeArray[1])) {
      return err(
        `Lower range end '${rangeArray[0]}' is bigger than upper range end '${rangeArray[1]}' of ${cronFieldType} field.`
      )
    }

    return valid(true)
  }

  return err(
    'Some other error in checkFirstStepElement (rangeArray less than 1)'
  )
}

const checkListElement = (
  listElement: string,
  cronFieldType: CronFieldType,
  options: Options
): Result<boolean, string> => {
  // Checks list element for steps like */2, 10-20/2
  const stepArray = listElement.split('/')
  if (stepArray.length > 2) {
    return err(
      `List element '${listElement}' is not valid. (More than one '/')`
    )
  }

  const firstElementResult = checkFirstStepElement(
    stepArray[0],
    cronFieldType,
    options
  )

  if (firstElementResult.isError()) {
    return firstElementResult
  }

  if (stepArray.length === 2) {
    const secondStepElement = stepArray[1]

    if (!secondStepElement) {
      return err(
        `Second step element '${secondStepElement}' of '${listElement}' is not valid (doesnt exist).`
      )
    }

    if (isNaN(Number(secondStepElement))) {
      return err(
        `Second step element '${secondStepElement}' of '${listElement}' is not valid (not a number).`
      )
    }

    if (Number(secondStepElement) === 0) {
      return err(
        `Second step element '${secondStepElement}' of '${listElement}' cannot be zero.`
      )
    }
  }

  return valid(true)
}

const checkField = (
  cronField: string,
  cronFieldType: CronFieldType,
  options: Options
): Result<boolean, string[]> => {
  if (
    ![
      'seconds',
      'minutes',
      'hours',
      'daysOfMonth',
      'months',
      'daysOfWeek',
      'years',
    ].includes(cronFieldType)
  ) {
    return err([`Cron field type '${cronFieldType}' does not exist.`])
  }

  // Check for blank day
  if (cronField === '?') {
    if (cronFieldType === 'daysOfMonth' || cronFieldType === 'daysOfWeek') {
      if (options.useBlankDay) {
        return valid(true)
      }

      return err([
        `useBlankDay is not enabled, but is used in ${cronFieldType} field`,
      ])
    }

    return err([`blank notation is not allowed in ${cronFieldType} field`])
  }

  // Check for lists e.g. 4,5,6,8-18,20-40/2
  const listArray = cronField.split(',')
  const checkResults: (Valid<boolean, unknown> | Err<unknown, string>)[] = []
  listArray.forEach((listElement: string) => {
    checkResults.push(checkListElement(listElement, cronFieldType, options))
  })

  if (checkResults.every(value => value.isValid())) {
    return valid(true)
  }

  const errorArray: string[] = []
  checkResults.forEach(result => {
    if (result.isError()) {
      errorArray.push(result.getError())
    }
  })
  return err(errorArray)
}

export default checkField
