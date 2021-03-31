import { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import { Options } from '../types'

const checkMonths = (
  cronData: CronData,
  options: Options
): Result<boolean, string[]> => {
  if (!cronData.months) {
    return err(['months field is undefined.'])
  }

  const { months } = cronData

  return checkField(months, 'months', options)
}

export default checkMonths
