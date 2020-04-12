import { CronData, Options } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'

const checkYears = (cronData: CronData, options: Options) => {
  if (!cronData.years) {
    return err(['years field is undefined, but useYears option is enabled.'])
  }

  const { years } = cronData

  return checkField(years, 'years', options)
}

export default checkYears
