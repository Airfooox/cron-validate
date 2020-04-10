interface Options {
  useSeconds?: boolean
  useYears?: boolean
  // useAliases: boolean
  // useNonStandardCharacters: boolean
}

interface CronData {
  seconds?: string
  minutes: string
  hours: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
  year?: string
}

const splitCronString = (cronString: string, options: Options) => {
  const splittedCronString = cronString.trim().split(' ')

  if (
    options.useSeconds &&
    options.useYears &&
    splittedCronString.length !== 7
  ) {
    // throw new Error(`Expected 7 values, but got ${splittedCronString.length}.`)
    console.error(`Expected 7 values, but got ${splittedCronString.length}.`)
  } else if (
    ((options.useSeconds && !options.useYears) ||
      (options.useYears && !options.useSeconds)) &&
    splittedCronString.length !== 6
  ) {
    // throw new Error(`Expected 6 values, but got ${splittedCronString.length}.`)
    console.error(`Expected 6 values, but got ${splittedCronString.length}.`)
  } else if (
    !options.useSeconds &&
    !options.useYears &&
    splittedCronString.length !== 5
  ) {
    // throw new Error(`Expected 5 values, but got ${splittedCronString.length}.`)
    console.error(`Expected 5 values, but got ${splittedCronString.length}.`)
  }

  const cronData: CronData = {
    seconds: options.useSeconds ? splittedCronString[0] : undefined,
    minutes: splittedCronString[options.useSeconds ? 1 : 0],
    hours: splittedCronString[options.useSeconds ? 2 : 1],
    dayOfMonth: splittedCronString[options.useSeconds ? 3 : 2],
    month: splittedCronString[options.useSeconds ? 4 : 3],
    dayOfWeek: splittedCronString[options.useSeconds ? 5 : 4],
    year: options.useYears
      ? splittedCronString[options.useSeconds ? 6 : 5]
      : undefined,
  }

  return cronData
}

const isCronValid = (cronString: string, options: Options) => {
  const cronData = splitCronString(cronString, options)
  
  return cronData
}

export default isCronValid
