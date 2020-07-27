import type { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import type { Options } from '../types'

const checkMinutes = (cronData: CronData, options: Options): Result<boolean, string[]> => {
  if (!cronData.minutes) {
    return err(['minutes field is undefined.'])
  }

  const { minutes } = cronData

  return checkField(minutes, 'minutes', options)
}

export default checkMinutes
