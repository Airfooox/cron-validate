import { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import { Options } from '../types'

const checkHours = (
  cronData: CronData,
  options: Options
): Result<boolean, string[]> => {
  if (!cronData.hours) {
    return err(['hours field is undefined.'])
  }

  const { hours } = cronData

  return checkField(hours, 'hours', options)
}

export default checkHours
