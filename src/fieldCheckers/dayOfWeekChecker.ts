import type { CronData } from '../index'
import { err } from '../result'
import checkField from '../helper'
import type { Options } from '../option'

const checkDaysOfWeek = (cronData: CronData, options: Options) => {
  if (!cronData.daysOfWeek) {
    return err(['daysOfWeek field is undefined.'])
  }

  const { daysOfWeek } = cronData

  return checkField(daysOfWeek, 'daysOfWeek', options)
}

export default checkDaysOfWeek
