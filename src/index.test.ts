import isCronValid from './index'
import { getOptionPreset, registerOptionPreset } from './option'

describe('Test cron validation', () => {
  it('Test cron length (5 chars allowed)', () => {
    const emptyStringCron = isCronValid('')
    expect(emptyStringCron.isValid()).toBeFalsy()

    const oneCharStringCron = isCronValid('*')
    expect(oneCharStringCron.isValid()).toBeFalsy()

    const twoCharStringCron = isCronValid('* *')
    expect(twoCharStringCron.isValid()).toBeFalsy()

    const threeCharStringCron = isCronValid('* * *')
    expect(threeCharStringCron.isValid()).toBeFalsy()

    const fourCharStringCron = isCronValid('* * * *')
    expect(fourCharStringCron.isValid()).toBeFalsy()

    const fiveCharStringCron = isCronValid('* * * * *')
    expect(fiveCharStringCron.isValid()).toBeTruthy()

    const sixCharStringCron = isCronValid('* * * * * *')
    expect(sixCharStringCron.isValid()).toBeFalsy()

    const sevenCharStringCron = isCronValid('* * * * * * *')
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with seconds option (6 chars allowed)', () => {
    const fiveCharStringCron = isCronValid('* * * * *', {
      override: { useSeconds: true },
    })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = isCronValid('* * * * * *', {
      override: { useSeconds: true },
    })
    expect(sixCharStringCron.isValid()).toBeTruthy()

    const sevenCharStringCron = isCronValid('* * * * * * *', {
      override: {
        useSeconds: true,
      },
    })
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with years option (6 chars allowed)', () => {
    const fiveCharStringCron = isCronValid('* * * * *', {
      override: { useYears: true },
    })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = isCronValid('* * * * * *', {
      override: { useYears: true },
    })
    expect(sixCharStringCron.isValid()).toBeTruthy()

    const sevenCharStringCron = isCronValid('* * * * * * *', {
      override: { useYears: true },
    })
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with seconds and years option (7 chars allowed)', () => {
    const fiveCharStringCron = isCronValid('* * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
      },
    })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = isCronValid('* * * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
        seconds: {
          upperLimit: 60,
        },
      },
    })
    expect(sixCharStringCron.isValid()).toBeFalsy()

    const sevenCharStringCron = isCronValid('* * * * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
      },
    })
    expect(sevenCharStringCron.isValid()).toBeTruthy()

    const eightCharStringCron = isCronValid('* * * * * * * *', {
      override: {
        useSeconds: true,
        useYears: true,
      },
    })
    expect(eightCharStringCron.isValid()).toBeFalsy()
  })

  it('Test number input', () => {
    expect(isCronValid('1,2,3 4,5,6 1 1 1').isValid()).toBeTruthy()

    expect(isCronValid('01,02,03 04,05,06 01 01 01').isValid()).toBeTruthy()
  })

  it('Test cron field assignment', () => {
    const cronResult = isCronValid('0 */4 * 1 6')
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
    const cronResult = isCronValid('2 0 */4 * 1 6', {
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
    const cronResult = isCronValid('0 */4 * 1 6 2020', {
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
    const cronResult = isCronValid('2 0 */4 * 1 6 2020', {
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
      isCronValid('5-7 2-4/2 1,2-4,5-8,10-20/3,20-30/4 * *').isValid()
    ).toBeTruthy()

    expect(isCronValid('5-7,8-9,10-20,21-23 * * * *').isValid()).toBeTruthy()

    expect(isCronValid('7-5 * * *').isValid()).toBeFalsy()

    expect(
      isCronValid('7-5 * * * *', { override: { useSeconds: true } }).isValid()
    ).toBeFalsy()

    expect(
      isCronValid('* * * * 2020-2019', {
        override: { useYears: true },
      }).isValid()
    ).toBeFalsy()
  })

  it('Test range limits', () => {
    expect(isCronValid('* * * * *').isValid()).toBeTruthy()

    expect(
      isCronValid('* * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      isCronValid('10 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('15 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('20 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('10-20 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('10-20/2 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('10-21/2 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      isCronValid('*/2 * * * *', {
        override: {
          minutes: { lowerLimit: 10, upperLimit: 20 },
        },
      }).isValid()
    ).toBeFalsy()

    expect(
      isCronValid('10,12,21 * * * *', {
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

    expect(getOptionPreset('testPreset')).toBeTruthy()

    expect(
      isCronValid('* * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeFalsy()

    expect(
      isCronValid('* * * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('* * * * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeFalsy()

    expect(
      isCronValid('* * * * * * *', {
        preset: 'testPreset',
        override: {
          useYears: true,
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('* 10-30 * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('* 9 * * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeFalsy()

    expect(
      isCronValid('* 9 * * * *', {
        preset: 'testPreset',
        override: {
          minutes: { lowerLimit: 9 },
        },
      }).isValid()
    ).toBeTruthy()

    expect(
      isCronValid('* 10-30 */2 * * *', {
        preset: 'testPreset',
      }).isValid()
    ).toBeTruthy()
  })

  it('Test invalid ranges', () => {
    expect(
      isCronValid('1-2-3 * * * * *', {
        override: { useSeconds: true },
      }).isValid()
    ).toBeFalsy()

    expect(isCronValid('* 1-2-3 * * * ').isValid()).toBeFalsy()

    expect(isCronValid('* * 1-2-3 * * ').isValid()).toBeFalsy()

    expect(isCronValid('1-* * * * *').isValid()).toBeFalsy()
  })

  it('Test invalid steps', () => {
    expect(
      isCronValid('1/2/3 * * * * *', {
        override: { useSeconds: true },
      }).isValid()
    ).toBeFalsy()

    expect(isCronValid('1/2/3 * * * *').isValid()).toBeFalsy()

    expect(isCronValid('1/2/3/4 * * * *').isValid()).toBeFalsy()

    expect(isCronValid('1/* * * * *').isValid()).toBeFalsy()

    expect(isCronValid('1/0 * * * *').isValid()).toBeFalsy()
  })

  it('Test incomplete statements', () => {
    expect(isCronValid('1/ * * * *').isValid()).toBeFalsy()

    expect(isCronValid('20-30/ * * * * ').isValid()).toBeFalsy()

    expect(isCronValid('*/ * * * * ').isValid()).toBeFalsy()
  })

  it('Test massive cron-expression', () => {
    expect(
      isCronValid(
        '*/2,11,12,13-17,30-40/4 1,2,3,*/5,10-20 0-3,4-6,8-20/3,23 1,2,3,4,*/2,20-25/2,26-27 1-2,3-7/2,*/2,8-9/2 1,*/2,4-6',
        {
          override: { useSeconds: true },
        }
      ).isValid()
    ).toBeTruthy()
  })
})
