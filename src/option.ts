import * as yup from 'yup'
import { ValidationError } from 'yup'
import { err, valid, Result } from './result'
import presets from './presets'
import { Options, OptionPreset, InputOptions } from './types'

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

export const getOptionPreset = (
  presetId: string
): Result<OptionPreset, string> => {
  if (optionPresets[presetId]) {
    return valid(optionPresets[presetId])
  }

  return err(`Option preset '${presetId}' not found.`)
}

export const getOptionPresets = (): typeof optionPresets => optionPresets

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
function loadPresets() {
  for (let index = 0; index < presets.length; index += 1) {
    const { name, preset } = presets[index];
    registerOptionPreset(name, preset)
  }
}
loadPresets();

type OptionsCacheKey = string;
const optionsCache: Map<OptionsCacheKey, Options> = new Map();

function toOptionsCacheKey(presetId: string, override?: InputOptions["override"]) {
  return presetId + (JSON.stringify(override) ?? "");
}

function presetToOptionsSchema(preset: OptionPreset) {
  return yup
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
    .required();
}

function presetToOptions(preset: OptionPreset, override?: InputOptions["override"]): Options  {
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
        lowerLimit: preset.seconds.lowerLimit ?? preset.seconds.minValue,
        upperLimit: preset.seconds.upperLimit ?? preset.seconds.maxValue,
      },
      minutes: {
        lowerLimit: preset.minutes.lowerLimit ?? preset.minutes.minValue,
        upperLimit: preset.minutes.upperLimit ?? preset.minutes.maxValue,
      },
      hours: {
        lowerLimit: preset.hours.lowerLimit ?? preset.hours.minValue,
        upperLimit: preset.hours.upperLimit ?? preset.hours.maxValue,
      },
      daysOfMonth: {
        lowerLimit:
          preset.daysOfMonth.lowerLimit ?? preset.daysOfMonth.minValue,
        upperLimit:
          preset.daysOfMonth.upperLimit ?? preset.daysOfMonth.maxValue,
      },
      months: {
        lowerLimit: preset.months.lowerLimit ?? preset.months.minValue,
        upperLimit: preset.months.upperLimit ?? preset.months.maxValue,
      },
      daysOfWeek: {
        lowerLimit:
          preset.daysOfWeek.lowerLimit ?? preset.daysOfWeek.minValue,
        upperLimit:
          preset.daysOfWeek.upperLimit ?? preset.daysOfWeek.maxValue,
      },
      years: {
        lowerLimit: preset.years.lowerLimit ?? preset.years.minValue,
        upperLimit: preset.years.upperLimit ?? preset.years.maxValue,
      },
      ...override,
    },
  }

  const optionsSchema = presetToOptionsSchema(preset);

  const validatedConfig: Options = optionsSchema.validateSync(
    unvalidatedConfig,
    {
      strict: false,
      abortEarly: false,
      stripUnknown: true,
      recursive: true,
    }
  )

  return validatedConfig;
}

export const validateOptions = (
  inputOptions: InputOptions
): Result<Options, string[]> => {
  try {
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

    const cacheKey = toOptionsCacheKey(preset.presetId, inputOptions.override);

    const cachedOptions = optionsCache.get(cacheKey);
    if (cachedOptions) return valid(cachedOptions);

    const options = presetToOptions(preset, inputOptions.override);
    optionsCache.set(cacheKey, options);
    return valid(options);
  } catch (validationError) {
    return err((validationError as ValidationError).errors)
  }
}



