import type { CronData } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'
import type { Options } from '../option'

const checkHours = (cronData: CronData, options: Options) => {
  if (!cronData.hours) {
    return err(['hours field is undefined.'])
  }

  const { hours } = cronData

  return checkField(hours, 'hours', options)
}

export default checkHours
