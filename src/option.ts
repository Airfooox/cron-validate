import * as yup from 'yup'
import type { ValidationError } from 'yup'
import { err, valid, Result } from './result'
import presets from './presets'
import type { Options, OptionPreset, InputOptions } from './types'

const optionPresets: { [presetId: string]: OptionPreset } = {
  // http://crontab.org/
  default: {
    presetId: 'default',
    useSeconds: false,
    useYears: false,
    useAliases: false,
    useBlankDay: false,
    allowOnlyOneBlankDayField: false,
    mustHaveBlankDayField: false,
    useLastDayOfMonth: false,
    useLastDayOfWeek: false,
    useNearestWeekday: false,
    useNthWeekdayOfMonth: false,
    seconds: {
      minValue: 0,
      maxValue: 59,
    },
    minutes: {
      minValue: 0,
      maxValue: 59,
    },
    hours: {
      minValue: 0,
      maxValue: 23,
    },
    daysOfMonth: {
      minValue: 0,
      maxValue: 31,
    },
    months: {
      minValue: 0,
      maxValue: 12,
    },
    daysOfWeek: {
      minValue: 0,
      maxValue: 7,
    },
    years: {
      minValue: 1970,
      maxValue: 2099,
    },
  },
}

const optionPresetSchema = yup
  .object({
    presetId: yup.string().required(),
    useSeconds: yup.boolean().required(),
    useYears: yup.boolean().required(),
    useAliases: yup.boolean(),
    useBlankDay: yup.boolean().required(),
    allowOnlyOneBlankDayField: yup.boolean().required(),
    mustHaveBlankDayField: yup.boolean(),
    useLastDayOfMonth: yup.boolean(),
    useLastDayOfWeek: yup.boolean(),
    useNearestWeekday: yup.boolean(),
    useNthWeekdayOfMonth: yup.boolean(),
    seconds: yup
      .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
      })
      .required(),
    minutes: yup
      .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
      })
      .required(),
    hours: yup
      .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
      })
      .required(),
    daysOfMonth: yup
      .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
      })
      .required(),
    months: yup
      .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
      })
      .required(),
    daysOfWeek: yup
      .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
      })
      .required(),
    years: yup
      .object({
        minValue: yup.number().min(0).required(),
        maxValue: yup.number().min(0).required(),
        lowerLimit: yup.number().min(0),
        upperLimit: yup.number().min(0),
      })
      .required(),
  })
  .required()

export const getOptionPreset = (presetId: string): Result<OptionPreset, string> => {
  if (optionPresets[presetId]) {
    return valid(optionPresets[presetId])
  }

  return err(`Option preset '${presetId}' not found.`)
}

export const getOptionPresets = (): typeof optionPresets => {
  return optionPresets
}

export const registerOptionPreset = (
  presetName: string,
  preset: OptionPreset
): void => {
  optionPresets[presetName] = optionPresetSchema.validateSync(preset, {
    strict: false,
    abortEarly: false,
    stripUnknown: true,
    recursive: true,
  })
}

export const validateOptions = (inputOptions: InputOptions): Result<Options, string[]> => {
  try {
    // load default presets
    presets()

    let preset: OptionPreset
    if (inputOptions.preset) {
      if (typeof inputOptions.preset === 'string') {
        if (!optionPresets[inputOptions.preset]) {
          return err([`Option preset ${inputOptions.preset} does not exist.`])
        }

        preset = optionPresets[inputOptions.preset as string]
      } else {
        preset = inputOptions.preset
      }
    } else {
      preset = optionPresets.default
    }

    const unvalidatedConfig = {
      presetId: preset.presetId,
      preset,
      ...{
        useSeconds: preset.useSeconds,
        useYears: preset.useYears,
        useAliases: preset.useAliases ?? false,
        useBlankDay: preset.useBlankDay,
        allowOnlyOneBlankDayField: preset.allowOnlyOneBlankDayField,
        mustHaveBlankDayField: preset.mustHaveBlankDayField ?? false,
        useLastDayOfMonth: preset.useLastDayOfMonth ?? false,
        useLastDayOfWeek: preset.useLastDayOfWeek ?? false,
        useNearestWeekday: preset.useNearestWeekday ?? false,
        useNthWeekdayOfMonth: preset.useNthWeekdayOfMonth ?? false,
        seconds: {
          lowerLimit: preset.seconds.lowerLimit,
          upperLimit: preset.seconds.upperLimit,
        },
        minutes: {
          lowerLimit: preset.minutes.lowerLimit,
          upperLimit: preset.minutes.upperLimit,
        },
        hours: {
          lowerLimit: preset.hours.lowerLimit,
          upperLimit: preset.hours.upperLimit,
        },
        daysOfMonth: {
          lowerLimit: preset.daysOfMonth.lowerLimit,
          upperLimit: preset.daysOfMonth.upperLimit,
        },
        months: {
          lowerLimit: preset.months.lowerLimit,
          upperLimit: preset.months.upperLimit,
        },
        daysOfWeek: {
          lowerLimit: preset.daysOfWeek.lowerLimit,
          upperLimit: preset.daysOfWeek.upperLimit,
        },
        years: {
          lowerLimit: preset.years.lowerLimit,
          upperLimit: preset.years.upperLimit,
        },
      },
      ...inputOptions.override,
    }

    const optionsSchema = yup
      .object({
        presetId: yup.string().required(),
        preset: optionPresetSchema.required(),
        useSeconds: yup.boolean().required(),
        useYears: yup.boolean().required(),
        useAliases: yup.boolean(),
        useBlankDay: yup.boolean().required(),
        allowOnlyOneBlankDayField: yup.boolean().required(),
        mustHaveBlankDayField: yup.boolean(),
        useLastDayOfMonth: yup.boolean(),
        useLastDayOfWeek: yup.boolean(),
        useNearestWeekday: yup.boolean(),
        useNthWeekdayOfMonth: yup.boolean(),
        seconds: yup
          .object({
            lowerLimit: yup
              .number()
              .min(preset.seconds.minValue)
              .max(preset.seconds.maxValue),
            upperLimit: yup
              .number()
              .min(preset.seconds.minValue)
              .max(preset.seconds.maxValue),
          })
          .required(),
        minutes: yup
          .object({
            lowerLimit: yup
              .number()
              .min(preset.minutes.minValue)
              .max(preset.minutes.maxValue),
            upperLimit: yup
              .number()
              .min(preset.minutes.minValue)
              .max(preset.minutes.maxValue),
          })
          .required(),
        hours: yup
          .object({
            lowerLimit: yup
              .number()
              .min(preset.hours.minValue)
              .max(preset.hours.maxValue),
            upperLimit: yup
              .number()
              .min(preset.hours.minValue)
              .max(preset.hours.maxValue),
          })
          .required(),
        daysOfMonth: yup
          .object({
            lowerLimit: yup
              .number()
              .min(preset.daysOfMonth.minValue)
              .max(preset.daysOfMonth.maxValue),
            upperLimit: yup
              .number()
              .min(preset.daysOfMonth.minValue)
              .max(preset.daysOfMonth.maxValue),
          })
          .required(),
        months: yup
          .object({
            lowerLimit: yup
              .number()
              .min(preset.months.minValue)
              .max(preset.months.maxValue),
            upperLimit: yup
              .number()
              .min(preset.months.minValue)
              .max(preset.months.maxValue),
          })
          .required(),
        daysOfWeek: yup
          .object({
            lowerLimit: yup
              .number()
              .min(preset.daysOfWeek.minValue)
              .max(preset.daysOfWeek.maxValue),
            upperLimit: yup
              .number()
              .min(preset.daysOfWeek.minValue)
              .max(preset.daysOfWeek.maxValue),
          })
          .required(),
        years: yup
          .object({
            lowerLimit: yup
              .number()
              .min(preset.years.minValue)
              .max(preset.years.maxValue),
            upperLimit: yup
              .number()
              .min(preset.years.minValue)
              .max(preset.years.maxValue),
          })
          .required(),
      })
      .required()

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
