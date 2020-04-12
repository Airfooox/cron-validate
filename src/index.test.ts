import isCronValid from './index'

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
    const fiveCharStringCron = isCronValid('* * * * *', { useSeconds: true })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = isCronValid('* * * * * *', { useSeconds: true })
    expect(sixCharStringCron.isValid()).toBeTruthy()

    const sevenCharStringCron = isCronValid('* * * * * * *', {
      useSeconds: true,
    })
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with years option (6 chars allowed)', () => {
    const fiveCharStringCron = isCronValid('* * * * *', { useYears: true })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = isCronValid('* * * * * *', { useYears: true })
    expect(sixCharStringCron.isValid()).toBeTruthy()

    const sevenCharStringCron = isCronValid('* * * * * * *', { useYears: true })
    expect(sevenCharStringCron.isValid()).toBeFalsy()
  })

  it('Test cron length with seconds and years option (7 chars allowed)', () => {
    const fiveCharStringCron = isCronValid('* * * * *', {
      useSeconds: true,
      useYears: true,
    })
    expect(fiveCharStringCron.isValid()).toBeFalsy()

    const sixCharStringCron = isCronValid('* * * * * *', {
      useSeconds: true,
      useYears: true,
    })
    expect(sixCharStringCron.isValid()).toBeFalsy()

    const sevenCharStringCron = isCronValid('* * * * * * *', {
      useSeconds: true,
      useYears: true,
    })
    expect(sevenCharStringCron.isValid()).toBeTruthy()

    const eightCharStringCron = isCronValid('* * * * * * * *', {
      useSeconds: true,
      useYears: true,
    })
    expect(eightCharStringCron.isValid()).toBeFalsy()
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
    const cronResult = isCronValid('2 0 */4 * 1 6', { useSeconds: true })
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
    const cronResult = isCronValid('0 */4 * 1 6 2', { useYears: true })
    expect(cronResult.isValid()).toBeTruthy()

    if (cronResult.isValid()) {
      const cronData = cronResult.getValue()
      expect(cronData.seconds).toBeUndefined()
      expect(cronData.minutes).toBe('0')
      expect(cronData.hours).toBe('*/4')
      expect(cronData.daysOfMonth).toBe('*')
      expect(cronData.months).toBe('1')
      expect(cronData.daysOfWeek).toBe('6')
      expect(cronData.years).toBe('2')
    }
  })

  it('Test cron field assignment with useSeconds and useYears option', () => {
    const cronResult = isCronValid('2 0 */4 * 1 6 3', {
      useSeconds: true,
      useYears: true,
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
      expect(cronData.years).toBe('3')
    }
  })
})
