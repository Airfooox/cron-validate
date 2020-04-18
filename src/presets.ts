import { registerOptionPreset } from './option'

export default () => {
  registerOptionPreset('npm-node-cron', {
    // https://github.com/kelektiv/node-cron
    presetId: 'npm-node-cron',
    useSeconds: true,
    useYears: false,
    useBlankDay: false,
    allowOnlyOneBlankDayField: false,
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
      minValue: 1,
      maxValue: 31,
    },
    months: {
      minValue: 0,
      maxValue: 11,
    },
    daysOfWeek: {
      minValue: 0,
      maxValue: 6,
    },
    years: {
      minValue: 1970,
      maxValue: 2099,
    },
  })

  registerOptionPreset('aws-cloud-watch', {
    // https://docs.aws.amazon.com/de_de/AmazonCloudWatch/latest/events/ScheduledEvents.html
    presetId: 'aws-cloud-watch',
    useSeconds: false,
    useYears: true,
    useBlankDay: true,
    allowOnlyOneBlankDayField: true,
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
      minValue: 1,
      maxValue: 31,
    },
    months: {
      minValue: 0,
      maxValue: 12,
    },
    daysOfWeek: {
      minValue: 1,
      maxValue: 7,
    },
    years: {
      minValue: 1970,
      maxValue: 2199,
    },
  })
}
