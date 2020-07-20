type OptionPresetFieldOptions = {
  minValue: number
  maxValue: number
  lowerLimit?: number
  upperLimit?: number
}

type FieldOption = {
  lowerLimit?: number
  upperLimit?: number
}

type Fields<T> = {
  seconds: T
  minutes: T
  hours: T
  daysOfMonth: T
  months: T
  daysOfWeek: T
  years: T
}

type ExtendFields = {
    useSeconds: boolean
    useYears: boolean
}

type ExtendWildcards = {
  useBlankDay: boolean
  allowOnlyOneBlankDayField: boolean

  // Optional for backward compatibility. Undefined implies false.
  mustHaveBlankDayField?: boolean
  // useAliases: boolean
  // useNonStandardCharacters: boolean
}

export type OptionPreset = {
  presetId: string
} & Fields<OptionPresetFieldOptions> & ExtendFields & ExtendWildcards

export type Options = {
  presetId: string
  preset: OptionPreset
} & Fields<FieldOption> & ExtendFields & ExtendWildcards

export type InputOptions = {
  preset?: string | OptionPreset
  override?: Partial<Fields<FieldOption>> & Partial<ExtendFields> & Partial<ExtendWildcards>
} & Partial<Fields<FieldOption>> & Partial<ExtendFields>
