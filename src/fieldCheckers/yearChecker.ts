import { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import { Options } from '../types'

const checkYears = (
  cronData: CronData,
  options: Options
): Result<boolean, string[]> => {
  if (!cronData.years) {
    return err(['years field is undefined, but useYears option is enabled.'])
  }

  const { years } = cronData

  return checkField(years, 'years', options)
}

export default checkYears
