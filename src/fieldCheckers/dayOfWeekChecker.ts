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

  // Based on this implementation logic:
  // https://github.com/quartz-scheduler/quartz/blob/1e0ed76c5c141597eccd76e44583557729b5a7cb/quartz-core/src/main/java/org/quartz/CronExpression.java#L477
  if (
    options.useLastDayOfWeek &&
    cronData.daysOfWeek.indexOf('L') !== -1 &&
    cronData.daysOfWeek.indexOf(',') !== -1
  ) {
    return err([
      `Cannot specify last day of week while also having other week days specified.`
    ])
  }

  if (
    options.useLastDayOfWeek &&
    cronData.daysOfWeek.indexOf('L') !== -1 &&
    cronData.daysOfWeek.indexOf('/') !== -1
  ) {
    return err([
      `Cannot specify last day of week in a step.`
    ])
  }

  return checkField(daysOfWeek, 'daysOfWeek', options)
}

export default checkDaysOfWeek
