import { CronData } from '../index'
import { err, valid } from '../result'
import checkField from '../helper'
import { doc } from 'prettier'
import { Options } from '../option'

const checkDaysOfMonth = (cronData: CronData, options: Options) => {
  if (!cronData.daysOfMonth) {
    return err(['daysOfMonth field is undefined.'])
  }

  const { daysOfMonth } = cronData

  return checkField(daysOfMonth, 'daysOfMonth', options)
}

export default checkDaysOfMonth
