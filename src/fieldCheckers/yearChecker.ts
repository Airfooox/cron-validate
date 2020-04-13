import type { CronData } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'
import type { Options } from '../option'

const checkYears = (cronData: CronData, options: Options) => {
  if (!cronData.years) {
    return err(['years field is undefined, but useYears option is enabled.'])
  }

  const { years } = cronData

  return checkField(years, 'years', options)
}

export default checkYears
