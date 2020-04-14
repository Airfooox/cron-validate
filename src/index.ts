import { Err, err, Result, Valid, valid } from './result'
import checkSeconds from './fieldCheckers/secondChecker'
import checkMinutes from './fieldCheckers/minuteChecker'
import checkHours from './fieldCheckers/hourChecker'
import checkDaysOfMonth from './fieldCheckers/dayOfMonthChecker'
import checkMonths from './fieldCheckers/monthChecker'
import checkDaysOfWeek from './fieldCheckers/dayOfWeekChecker'
import checkYears from './fieldCheckers/yearChecker'
import { InputOptions, Options, validateOptions } from './option'

export interface CronData {
  seconds?: string
  minutes: string
  hours: string
  daysOfMonth: string
  months: string
  daysOfWeek: string
  years?: string
}

export type CronFieldType =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'daysOfMonth'
  | 'months'
  | 'daysOfWeek'
  | 'years'

const splitCronString = (cronString: string, options: Options) => {
  const splittedCronString = cronString.trim().split(' ')

  if (
    options.useSeconds &&
    options.useYears &&
    splittedCronString.length !== 7
  ) {
    return err(`Expected 7 values, but got ${splittedCronString.length}.`)
  } else if (
    ((options.useSeconds && !options.useYears) ||
      (options.useYears && !options.useSeconds)) &&
    splittedCronString.length !== 6
  ) {
    return err(`Expected 6 values, but got ${splittedCronString.length}.`)
  } else if (
    !options.useSeconds &&
    !options.useYears &&
    splittedCronString.length !== 5
  ) {
    return err(`Expected 5 values, but got ${splittedCronString.length}.`)
  }

  const cronData: CronData = {
    seconds: options.useSeconds ? splittedCronString[0] : undefined,
    minutes: splittedCronString[options.useSeconds ? 1 : 0],
    hours: splittedCronString[options.useSeconds ? 2 : 1],
    daysOfMonth: splittedCronString[options.useSeconds ? 3 : 2],
    months: splittedCronString[options.useSeconds ? 4 : 3],
    daysOfWeek: splittedCronString[options.useSeconds ? 5 : 4],
    years: options.useYears
      ? splittedCronString[options.useSeconds ? 6 : 5]
      : undefined,
  }

  return valid(cronData)
}

const isCronValid = (cronString: string, inputOptions: InputOptions = {}) => {
  // Validate option
  const optionsResult = validateOptions(inputOptions)
  if (optionsResult.isError()) {
    return optionsResult
  }
  const options = optionsResult.getValue()

  const cronDataResult = splitCronString(cronString, options)
  if (cronDataResult.isError()) {
    return err([`${cronDataResult.getError()} (Input cron: '${cronString}')`])
  }

  const cronData = cronDataResult.getValue()
  const checkResults: (Valid<boolean, unknown> | Err<unknown, string[]>)[] = []
  if (options.useSeconds) {
    checkResults.push(checkSeconds(cronData, options))
  }

  checkResults.push(checkMinutes(cronData, options))
  checkResults.push(checkHours(cronData, options))
  checkResults.push(checkDaysOfMonth(cronData, options))
  checkResults.push(checkMonths(cronData, options))
  checkResults.push(checkDaysOfWeek(cronData, options))

  if (options.useYears) {
    checkResults.push(checkYears(cronData, options))
  }

  if (checkResults.every(value => value.isValid())) {
    return valid(cronData)
  }

  // TODO: Right error return
  const errorArray: string[] = []
  checkResults.forEach(result => {
    if (result.isError()) {
      result.getError().forEach((error: string) => {
        errorArray.push(error)
      })
    }
  })

  // Make sure cron string is in every error
  errorArray.forEach((error: string, index: number) => {
    errorArray[index] = `${error} (Input cron: '${cronString}')`
  })

  return err(errorArray)
}

export default isCronValid
