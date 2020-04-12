import { CronData, Options } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'

const checkMonths = (cronData: CronData, options: Options) => {
  if (!cronData.months) {
    return err(['months field is undefined.'])
  }

  const { months } = cronData

  return checkField(months, 'months', options)
}

export default checkMonths
