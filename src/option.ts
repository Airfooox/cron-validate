interface FieldOption {
  lowerLimit?: number
  upperLimit?: number
  noLimits?: boolean
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
    noLimits: true,
  },
}

export const validateOptions = (inputOptions: InputOptions) => {
  return defaultOptions
}
