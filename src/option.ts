import * as yup from 'yup'
import type { ValidationError } from 'yup'
import { err, valid } from './result'

interface FieldOption {
  lowerLimit?: number
  upperLimit?: number
}

export interface Options {
  useSeconds: boolean
  useYears: boolean
  seconds: FieldOption
  minutes: FieldOption
  hours: FieldOption
  daysOfMonth: FieldOption
  months: FieldOption
  daysOfWeek: FieldOption
  years: FieldOption
  // useAliases: boolean
  // useNonStandardCharacters: boolean
}

export interface InputOptions {
  useSeconds?: boolean
  useYears?: boolean
  seconds?: FieldOption
  minutes?: FieldOption
  hours?: FieldOption
  daysOfMonth?: FieldOption
  months?: FieldOption
  daysOfWeek?: FieldOption
  years?: FieldOption
  // useAliases: boolean
  // useNonStandardCharacters: boolean
}

// Field
const fieldLimits = {
  seconds: {
    lowerLimit: 0,
    upperLimit: 59,
  },
  minutes: {
    lowerLimit: 0,
    upperLimit: 59,
  },
  hours: {
    lowerLimit: 0,
    upperLimit: 23,
  },
  daysOfMonth: {
    lowerLimit: 1,
    upperLimit: 31,
  },
  months: {
    // Allow 0-12 for libraries like node-cron
    lowerLimit: 0,
    upperLimit: 12,
  },
  daysOfWeek: {
    lowerLimit: 0,
    upperLimit: 7,
  },
  years: {
    lowerLimit: 1970,
    upperLimit: 2099,
  },
}

export const defaultOptions: Options = {
  useSeconds: false,
  useYears: false,
  seconds: {
    lowerLimit: 0,
    upperLimit: 59,
  },
  minutes: {
    lowerLimit: 0,
    upperLimit: 59,
  },
  hours: {
    lowerLimit: 0,
    upperLimit: 23,
  },
  daysOfMonth: {
    lowerLimit: 1,
    upperLimit: 31,
  },
  months: {
    lowerLimit: 1,
    upperLimit: 12,
  },
  daysOfWeek: {
    lowerLimit: 1,
    upperLimit: 7,
  },
  years: {
    lowerLimit: 1970,
    upperLimit: 2099,
  },
}

const optionsSchema = yup.object({
  useSeconds: yup.boolean(),
  useYears: yup.boolean(),
  seconds: yup.object({
    lowerLimit: yup
      .number()
      .min(fieldLimits.seconds.lowerLimit)
      .max(fieldLimits.seconds.upperLimit),
    upperLimit: yup
      .number()
      .min(fieldLimits.seconds.lowerLimit)
      .max(fieldLimits.seconds.upperLimit),
  }),
  minutes: yup.object({
    lowerLimit: yup
      .number()
      .min(fieldLimits.minutes.lowerLimit)
      .max(fieldLimits.minutes.upperLimit),
    upperLimit: yup
      .number()
      .min(fieldLimits.minutes.lowerLimit)
      .max(fieldLimits.minutes.upperLimit),
  }),
  hours: yup.object({
    lowerLimit: yup
      .number()
      .min(fieldLimits.hours.lowerLimit)
      .max(fieldLimits.hours.upperLimit),
    upperLimit: yup
      .number()
      .min(fieldLimits.hours.lowerLimit)
      .max(fieldLimits.hours.upperLimit),
  }),
  daysOfMonth: yup.object({
    lowerLimit: yup
      .number()
      .min(fieldLimits.daysOfMonth.lowerLimit)
      .max(fieldLimits.daysOfMonth.upperLimit),
    upperLimit: yup
      .number()
      .min(fieldLimits.daysOfMonth.lowerLimit)
      .max(fieldLimits.daysOfMonth.upperLimit),
  }),
  months: yup.object({
    lowerLimit: yup
      .number()
      .min(fieldLimits.months.lowerLimit)
      .max(fieldLimits.months.upperLimit),
    upperLimit: yup
      .number()
      .min(fieldLimits.months.lowerLimit)
      .max(fieldLimits.months.upperLimit),
  }),
  daysOfWeek: yup.object({
    lowerLimit: yup
      .number()
      .min(fieldLimits.daysOfWeek.lowerLimit)
      .max(fieldLimits.daysOfWeek.upperLimit),
    upperLimit: yup
      .number()
      .min(fieldLimits.daysOfWeek.lowerLimit)
      .max(fieldLimits.daysOfWeek.upperLimit),
  }),
  years: yup.object({
    lowerLimit: yup
      .number()
      .min(fieldLimits.years.lowerLimit)
      .max(fieldLimits.years.upperLimit),
    upperLimit: yup
      .number()
      .min(fieldLimits.years.lowerLimit)
      .max(fieldLimits.years.upperLimit),
  }),
})

export const validateOptions = (inputOptions: InputOptions) => {
  try {
    const unvalidatedConfig = { ...defaultOptions, ...inputOptions }
    const validatedConfig: Options = optionsSchema.validateSync(
      unvalidatedConfig,
      {
        strict: false,
        abortEarly: false,
        stripUnknown: true,
        recursive: true,
      }
    )

    return valid(validatedConfig)
  } catch (validationError) {
    return err((validationError as ValidationError).errors)
  }
}
