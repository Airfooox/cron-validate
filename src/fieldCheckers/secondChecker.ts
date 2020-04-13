import type { CronData } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'
import type { Options } from '../option'

const checkSeconds = (cronData: CronData, options: Options) => {
  if (!cronData.seconds) {
    return err(['seconds field is undefined, but useSeconds options is enabled.'])
  }

  const { seconds } = cronData

  return checkField(seconds, 'seconds', options)
}

export default checkSeconds
