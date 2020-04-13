import { CronData } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'
import { Options } from '../option'

const checkMinutes = (cronData: CronData, options: Options) => {
  if (!cronData.minutes) {
    return err(['minutes field is undefined.'])
  }

  const { minutes } = cronData

  return checkField(minutes, 'minutes', options)
}

export default checkMinutes
