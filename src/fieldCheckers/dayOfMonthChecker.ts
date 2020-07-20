import type { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import type { Options } from '../option'

const checkDaysOfMonth = (cronData: CronData, options: Options): Result<boolean, string[]> => {
  if (!cronData.daysOfMonth) {
    return err(['daysOfMonth field is undefined.'])
  }

  const { daysOfMonth } = cronData

  if (
    options.allowOnlyOneBlankDayField &&
    options.useBlankDay &&
    cronData.daysOfMonth === '?' &&
    cronData.daysOfWeek === '?'
  ) {
    return err([
      `Cannot use blank value in daysOfMonth and daysOfWeek field when allowOnlyOneBlankDayField option is enabled.`,
    ])
  }

  return checkField(daysOfMonth, 'daysOfMonth', options)
}

export default checkDaysOfMonth
