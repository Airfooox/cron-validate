import type { CronData } from '../index'
import { err } from '../result'
import checkField from '../helper'
import type { Options } from '../option'

const checkDaysOfMonth = (cronData: CronData, options: Options) => {
  if (!cronData.daysOfMonth) {
    return err(['daysOfMonth field is undefined.'])
  }

  const { daysOfMonth } = cronData

  return checkField(daysOfMonth, 'daysOfMonth', options)
}

export default checkDaysOfMonth
