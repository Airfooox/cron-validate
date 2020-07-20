import type { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import type { Options } from '../types'

const checkDaysOfWeek = (cronData: CronData, options: Options): Result<boolean, string[]> => {
  if (!cronData.daysOfWeek) {
    return err(['daysOfWeek field is undefined.'])
  }

  const { daysOfWeek } = cronData

  if (
    options.allowOnlyOneBlankDayField &&
    cronData.daysOfMonth === '?' &&
    cronData.daysOfWeek === '?'
  ) {
    return err([
      `Cannot use blank value in daysOfMonth and daysOfWeek field when allowOnlyOneBlankDayField option is enabled.`,
    ])
  }

  if (
    options.mustHaveBlankDayField &&
    cronData.daysOfMonth !== '?' &&
    cronData.daysOfWeek !== '?'
  ) {
    return err([
      `Cannot specify both daysOfMonth and daysOfWeek field when mustHaveBlankDayField option is enabled.`,
    ])
  }

  return checkField(daysOfWeek, 'daysOfWeek', options)
}

export default checkDaysOfWeek
