import type { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import type { Options } from '../types'

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

  if (
    options.mustHaveBlankDayField &&
    cronData.daysOfMonth !== '?' &&
    cronData.daysOfWeek !== '?'
  ) {
    return err([
      `Cannot specify both daysOfMonth and daysOfWeek field when mustHaveBlankDayField option is enabled.`,
    ])
  }

  // Based on this implementation logic:
  // https://github.com/quartz-scheduler/quartz/blob/1e0ed76c5c141597eccd76e44583557729b5a7cb/quartz-core/src/main/java/org/quartz/CronExpression.java#L473
  if (
    options.useLastDayOfMonth &&
    cronData.daysOfMonth.indexOf('L') !== -1 &&
    cronData.daysOfMonth.indexOf(',') !== -1
  ) {
    return err([
      `Cannot specify last day of month while also having other days specified.`
    ])
  }

  if (
    options.useLastDayOfMonth &&
    cronData.daysOfMonth.indexOf('L') !== -1 &&
    cronData.daysOfMonth.indexOf('/') !== -1
  ) {
    return err([
      `Cannot specify last day of month in a step.`
    ])
  }

  return checkField(daysOfMonth, 'daysOfMonth', options)
}

export default checkDaysOfMonth
