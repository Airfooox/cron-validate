import type { CronFieldType } from './index'
import { Err, err, Valid, valid } from './result'
import type { Options } from './option'

const checkWildcardLimit = (cronFieldType: CronFieldType, options: Options) => {
  return (
    options[cronFieldType].lowerLimit ===
      options.preset[cronFieldType].lowerLimit &&
    options[cronFieldType].upperLimit ===
      options.preset[cronFieldType].upperLimit
  )
}

const checkSingleElement = (
  element: string,
  cronFieldType: CronFieldType,
  options: Options
) => {
  if (element === '*') {
    if (!checkWildcardLimit(cronFieldType, options)) {
      // console.log(
      //   `Field ${cronFieldType} uses wildcard '*', but is limited to ${options[cronFieldType].lowerLimit}-${options[cronFieldType].upperLimit}`
      // )
      return err(
        `Field ${cronFieldType} uses wildcard '*', but is limited to ${options[cronFieldType].lowerLimit}-${options[cronFieldType].upperLimit}`
      )
    }

    return valid(true)
  }

  if (element === '') {
    return err(`One of the elements is empty in ${cronFieldType} field.`)
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

const checkRangeElement = (
  element: string,
  cronFieldType: CronFieldType,
  options: Options
) => {
  if (element === '*') {
    return err(`'*' can't be part of a range in ${cronFieldType} field.`)
  }

  if (element === '') {
    return err(`One of the range elements is empty in ${cronFieldType} field.`)
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

const checkFirstStepElement = (
  firstStepElement: string,
  cronFieldType: CronFieldType,
  options: Options
) => {
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
      options
    )
    const secondRangeElementResult = checkRangeElement(
      rangeArray[1],
      cronFieldType,
      options
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
) => {
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
        `Second step element '${secondStepElement}' of '${listElement}' is cannot be zero.`
      )
    }
  }

  return valid(true)
}

const checkField = (
  cronField: string,
  cronFieldType: CronFieldType,
  options: Options
) => {
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
