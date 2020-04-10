import isCronValid from './index'

describe('Test crons', () => {
  it('Test', () => {
    expect(isCronValid('* * * * *', {})).toBeTruthy()
    expect(isCronValid('* * * * * *', {})).toBeFalsy()
    expect(isCronValid('* * * * * *', { useSeconds: true })).toBeTruthy()
    expect(isCronValid('* * * * * *', { useYears: true })).toBeTruthy()
    expect(isCronValid('* * * * * * *', { useSeconds: true })).toBeFalsy()
    expect(isCronValid('* * * * * * *', { useYears: true })).toBeFalsy()
    expect(
      isCronValid('* * * * * * *', { useSeconds: true, useYears: true })
    ).toBeTruthy()
  })
})
