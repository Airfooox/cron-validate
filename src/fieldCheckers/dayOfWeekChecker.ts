import { CronData, Options } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'

const checkDaysOfWeek = (cronData: CronData, options: Options) => {
  if (!cronData.daysOfWeek) {
    return err(['daysOfWeek field is undefined.'])
  }

  const { daysOfWeek } = cronData

  return checkField(daysOfWeek, 'daysOfWeek', options)
}

export default checkDaysOfWeek
