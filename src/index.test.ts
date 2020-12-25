import cron from './index'
import { getOptionPreset, registerOptionPreset } from './option'

describe('Test cron validation', () => {
  it('Test cron length (5 chars allowed)', () => {
    const emptyStringCron = cron('')
    expect(emptyStringCron.isValid()).toBeFalsy()

    const oneCharStringCron = cron('*')
    expect(oneCharStringCron.isValid()).toBeFalsy()

    const twoCharStringCron = cron('* *')
    expect(twoCharStringCron.isValid()).toBeFalsy()

    const threeCharStringCron = cron('* * *')
    expect(threeCharStringCron.isValid()).toBeFalsy()

    const fourCharStringCron = cron('* * * *')
    expect(fourCharStringCron.isValid()).toBeFalsy()

    const fiveCharStringCron = cron('* * * * *')
    expect(fiveCharStringCron.isValid()).toBeTruthy()

    const sixCharStringCron = cron('* * * * * *')
    expect(sixCharStringCron.isValid()).toBeFalsy()

    const sevenCharStringCron = cron('* * * * * * *')
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with seconds option (6 chars allowed)', () => {
    const fiveCharStringCron = cron('* * * * *', {
      override: { useSeconds: true },
    })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = cron('* * * * * *', {
      override: { useSeconds: true },
    })
    expect(sixCharStringCron.isValid()).toBeTruthy()

    const sevenCharStringCron = cron('* * * * * * *', {
      override: {
        useSeconds: true,
      },
    })
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with years option (6 chars allowed)', () => {
    const fiveCharStringCron = cron('* * * * *', {
      override: { useYears: true },
    })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = cron('* * * * * *', {
      override: { useYears: true },
    })
    expect(sixCharStringCron.isValid()).toBeTruthy()

    const sevenCharStringCron = cron('* * * * * * *', {
      override: { useYears: true },
    })
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with seconds and years option (7 chars allowed)', () => {
    const fiveCharStringCron = cron('* * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
      },
    })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = cron('* * * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
        seconds: {
          upperLimit: 60,
        },
      },
    })
    expect(sixCharStringCron.isValid()).toBeFalsy()

    const sevenCharStringCron = cron('* * * * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
      },
    })
    expect(sevenCharStringCron.isValid()).toBeTruthy()

    const eightCharStringCron = cron('* * * * * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
      },
    })
    expect(eightCharStringCron.isValid()).toBeFalsy()
  })

  it('Test number input', () => {
    expect(cron('1,2,3 4,5,6 1 1 1').isValid()).toBeTruthy()

    expect(cron('01,02,03 04,05,06 01 01 01').isValid()).toBeTruthy()
  })

  it('Test cron field assignment', () => {
    const cronResult = cron('0 */4 * 1 6')
    expect(cronResult.isValid()).toBeTruthy()

    if (cronResult.isValid()) {
      const cronData = cronResult.getValue()
      expect(cronData.seconds).toBeUndefined()
      expect(cronData.minutes).toBe('0')
      expect(cronData.hours).toBe('*/4')
      expect(cronData.daysOfMonth).toBe('*')
      expect(cronData.months).toBe('1')
      expect(cronData.daysOfWeek).toBe('6')
      expect(cronData.years).toBeUndefined()
    }
  })

  it('Test cron field assignment with useSeconds option', () => {
    const cronResult = cron('2 0 */4 * 1 6', {
      override: { useSeconds: true },
    })
    expect(cronResult.isValid()).toBeTruthy()

    if (cronResult.isValid()) {
      const cronData = cronResult.getValue()
      expect(cronData.seconds).toBe('2')
      expect(cronData.minutes).toBe('0')
      expect(cronData.hours).toBe('*/4')
      expect(cronData.daysOfMonth).toBe('*')
      expect(cronData.months).toBe('1')
      expect(cronData.daysOfWeek).toBe('6')
      expect(cronData.years).toBeUndefined()
    }
  })

  it('Test cron field assignment with useYears option', () => {
    const cronResult = cron('0 */4 * 1 6 2020', {
      override: { useYears: true },
    })
    expect(cronResult.isValid()).toBeTruthy()

    if (cronResult.isValid()) {
      const cronData = cronResult.getValue()
      expect(cronData.seconds).toBeUndefined()
      expect(cronData.minutes).toBe('0')
      expect(cronData.hours).toBe('*/4')
      expect(cronData.daysOfMonth).toBe('*')
      expect(cronData.months).toBe('1')
      expect(cronData.daysOfWeek).toBe('6')
      expect(cronData.years).toBe('2020')
    }
  })

  it('Test cron field assignment with useSeconds and useYears option', () => {
    const cronResult = cron('2 0 */4 * 1 6 2020', {
      override: {
        useSeconds: true,
        useYears: true,
      },
    })
    expect(cronResult.isValid()).toBeTruthy()

    if (cronResult.isValid()) {
      const cronData = cronResult.getValue()
      expect(cronData.seconds).toBe('2')
      expect(cronData.minutes).toBe('0')
      expect(cronData.hours).toBe('*/4')
      expect(cronData.daysOfMonth).toBe('*')
      expect(cronData.months).toBe('1')
      expect(cronData.daysOfWeek).toBe('6')
      expect(cronData.years).toBe('2020')
    }
  })

  it('Test list, range and steps', () => {
    expect(
      cron('5-7 2-4/2 1,2-4,5-8,10-20/3,20-30/4 * *').isValid()
    ).toBeTruthy()

    expect(cron('5-7,8-9,10-20,21-23 * * * *').isValid()).toBeTruthy()

    expect(cron('7-5 * * *').isValid()).toBeFalsy()

    expect(
      cron('7-5 * * * *', { override: { useSeconds: true } }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * 2020-2019', {
        override: { useYears: true },
      }).isValid()
    ).toBeFalsy()
  })

  it('Test range limits', () => {
    expect(cron('* * * * *').isValid()).toBeTruthy()

    expect(
      cron('* * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('10 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('15 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('20 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('10-20 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('10-20/2 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('10-21/2 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('*/2 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('10,12,21 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeFalsy()
  })

  it('Test preset system', () => {
    registerOptionPreset('testPreset', {
      presetId: 'testPreset',
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
    })

    registerOptionPreset('testPreset2', {
      presetId: 'testPreset2',
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
        lowerLimit: 10,
        upperLimit: 30,
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
    })

    registerOptionPreset('testPreset3', {
      presetId: 'testPreset3',
      useSeconds: true,
      useYears: false,
      useBlankDay: false,
      allowOnlyOneBlankDayField: false,
      seconds: {
        minValue: 1,
        maxValue: 60,
      },
      minutes: {
        minValue: 1,
        maxValue: 60,
      },
      hours: {
        minValue: 1,
        maxValue: 24,
      },
      daysOfMonth: {
        minValue: 1,
        maxValue: 31,
      },
      months: {
        minValue: 1,
        maxValue: 12,
      },
      daysOfWeek: {
        minValue: 1,
        maxValue: 7,
      },
      years: {
        minValue: 1970,
        maxValue: 2099,
      },
    })

    expect(getOptionPreset('testPreset')).toBeTruthy()
    expect(getOptionPreset('testPreset2')).toBeTruthy()
    expect(getOptionPreset('testPreset3')).toBeTruthy()

    // testPreset1

    expect(
      cron('* * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * * *', {
        preset: 'testPreset',
        override: {
          useYears: true,
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 10-30 * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 9 * * * *', {
        preset: 'testPreset',
        override: {
          minutes: { lowerLimit: 9 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 10-30 */2 * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeTruthy()

    // testPreset 2

    expect(
      cron('* * * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* 10-30 * * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 9-30 * * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * * *', {
        preset: 'testPreset2',
        override: {
          useYears: true,
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* 20 * * * * *', {
        preset: 'testPreset2',
        override: {
          useYears: true,
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 9 * * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* 9 * * * *', {
        preset: 'testPreset2',
        override: {
          minutes: { lowerLimit: 9 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * * * *', {
        preset: 'testPreset2',
        override: {
          minutes: { lowerLimit: 0, upperLimit: 59 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 10-30 */2 * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 9-30 */2 * * *', {
        preset: 'testPreset2',
      }).isValid()
    ).toBeFalsy()

    // testPreset3

    expect(
      cron('* * * * *', {
        preset: 'testPreset3',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * *', {
        preset: 'testPreset3',
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * * * * *', {
        preset: 'testPreset3',
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * * *', {
        preset: 'testPreset3',
        override: {
          useYears: true,
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 10-30 * * * *', {
        preset: 'testPreset3',
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 9 * * * *', {
        preset: 'testPreset3',
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* 0 * * * *', {
        preset: 'testPreset3',
      }).isValid()
    ).toBeFalsy()

    //

    expect(
      cron('* * ? * 8 *', {
        preset: 'aws-cloud-watch',
      }).isValid()
    ).toBeFalsy()
  })

  it('Test invalid ranges', () => {
    expect(
      cron('1-2-3 * * * * *', {
        override: { useSeconds: true },
      }).isValid()
    ).toBeFalsy()

    expect(cron('* 1-2-3 * * * ').isValid()).toBeFalsy()

    expect(cron('* * 1-2-3 * * ').isValid()).toBeFalsy()

    expect(cron('1-* * * * *').isValid()).toBeFalsy()
  })

  it('Test invalid steps', () => {
    expect(
      cron('1/2/3 * * * * *', {
        override: { useSeconds: true },
      }).isValid()
    ).toBeFalsy()

    expect(cron('1/2/3 * * * *').isValid()).toBeFalsy()

    expect(cron('1/2/3/4 * * * *').isValid()).toBeFalsy()

    expect(cron('1/* * * * *').isValid()).toBeFalsy()

    expect(cron('1/0 * * * *').isValid()).toBeFalsy()
  })

  it('Test incomplete statements', () => {
    expect(cron('1/ * * * *').isValid()).toBeFalsy()

    expect(cron('20-30/ * * * * ').isValid()).toBeFalsy()

    expect(cron('*/ * * * * ').isValid()).toBeFalsy()
  })

  it('Test massive cron-expression', () => {
    expect(
      cron(
        '*/2,11,12,13-17,30-40/4 1,2,3,*/5,10-20 0-3,4-6,8-20/3,23 1,2,3,4,*/2,20-25/2,26-27 1-2,3-7/2,*/2,8-9/2 1,*/2,4-6',
        {
          override: { useSeconds: true },
        }
      ).isValid()
    ).toBeTruthy()
  })

  it('Test blank day option', () => {
    // No useBlankDays
    expect(cron('* * ? * *').isValid()).toBeFalsy()

    expect(cron('* * * * ?').isValid()).toBeFalsy()

    expect(
      cron('* * * ? * *', { override: { useSeconds: true } }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * ?', { override: { useSeconds: true } }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * ? * * *', { override: { useYears: true } }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * ? *', { override: { useYears: true } }).isValid()
    ).toBeFalsy()

    // useBlankDays true
    expect(
      cron('* * ? * *', { override: { useBlankDay: true } }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * * ?', { override: { useBlankDay: true } }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * ? * *', {
        override: { useSeconds: true, useBlankDay: true },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * * * ?', {
        override: { useSeconds: true, useBlankDay: true },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * ? * * *', {
        override: { useYears: true, useBlankDay: true },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * * ? *', {
        override: { useYears: true, useBlankDay: true },
      }).isValid()
    ).toBeTruthy()

    // both fields blank allowed
    expect(
      cron('* * ? * ?', { override: { useBlankDay: true } }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * ? * ?', {
        override: { useSeconds: true, useBlankDay: true },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * ? * ? *', {
        override: { useYears: true, useBlankDay: true },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * ? * ? *', {
        override: { useSeconds: true, useYears: true, useBlankDay: true },
      }).isValid()
    ).toBeTruthy()

    // both fields blank not allowed
    expect(
      cron('* * ? * ?', {
        override: { useBlankDay: true, allowOnlyOneBlankDayField: true },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * ? * ?', {
        override: {
          useSeconds: true,
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * ? * ? *', {
        override: {
          useYears: true,
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * ? * ? *', {
        override: {
          useSeconds: true,
          useYears: true,
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
        },
      }).isValid()
    ).toBeFalsy()

    // minimum one blank required
    expect(
      cron('* * * * *', {
        override: {
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
          mustHaveBlankDayField: true,
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * ?', {
        override: {
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
          mustHaveBlankDayField: true,
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * ? * *', {
        override: {
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
          mustHaveBlankDayField: true,
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      cron('* * * * * *', {
        override: {
          useSeconds: true,
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
          mustHaveBlankDayField: true,
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * *', {
        override: {
          useYears: true,
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
          mustHaveBlankDayField: true,
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      cron('* * * * * * *', {
        override: {
          useSeconds: true,
          useYears: true,
          useBlankDay: true,
          allowOnlyOneBlankDayField: true,
          mustHaveBlankDayField: true,
        },
      }).isValid()
    ).toBeFalsy()
  })
})
