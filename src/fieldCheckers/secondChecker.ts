import type { CronData } from '../index'
import { err, Result } from '../result'
import checkField from '../helper'
import type { Options } from '../types'

const checkSeconds = (
  cronData: CronData,
  options: Options
): Result<boolean, string[]> => {
  if (!cronData.seconds) {
    return err([
      'seconds field is undefined, but useSeconds options is enabled.',
    ])
  }

  const { seconds } = cronData

  return checkField(seconds, 'seconds', options)
}

export default checkSeconds
