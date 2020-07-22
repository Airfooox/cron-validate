import cron from './index'
import type { InputOptions } from './types'

type TestCase = {
  value: string
  description?: string
}

type Matrix = {
  describe: string
  options: InputOptions

  validIndexes?: number[]
  valids: TestCase[]
  invalids: TestCase[]
  unuseds: TestCase[]
}

describe('test', () => {
  const itSucceeds = (testCase: TestCase, expression: string, options: InputOptions = {}) => {
    it(`${expression.padEnd(15, ' ')} should be valid ${testCase.description ? `(${testCase.description})` : ''}`, () => {
      expect(cron(expression, options).isValid()).toBeTruthy()
    })
  }

  const itFails = (testCase: TestCase, expression: string, options: InputOptions = {}) => {
    it(`${expression.padEnd(15, ' ')} should be invalid ${testCase.description ? `(${testCase.description})` : ''}`, () => {
      expect(cron(expression, options).isValid()).toBeFalsy()
    })
  }

  const forEachIndex = (testCase: TestCase): [number, string][] => {
    return [0, 1, 2, 3, 4].map((index: number): [number, string] => {
      const fragments = Array(5).fill('*')
      fragments[index] = testCase.value
      return [index, fragments.join(' ')]
    })
  }

  const withOptions = (matrix: Matrix) => {
    describe('With Options', () => {
      for (const valid of matrix.valids) {
        for (const [index, expression] of forEachIndex(valid)) {
          if (matrix.validIndexes?.indexOf(index) !== -1) {
            itSucceeds(valid, expression, matrix.options)
          } else {
            itFails(valid, expression, matrix.options)
          }
        }
      }

      for (const invalid of matrix.invalids) {
        for (const [_index, expression] of forEachIndex(invalid)) {
          itFails(invalid, expression, matrix.options)
        }
      }
    })
  }

  const withoutOptions = (matrix: Matrix) => {
    describe('Without Options', () => {
      for (const testCase of [...matrix.valids, ...matrix.invalids]) {
        for (const [_index, expression] of forEachIndex(testCase)) {
          itFails(testCase, expression)
        }
      }
    })
  }

  const flagValueUnused = (matrix: Matrix) => {
    describe('Flag value unused', () => {
      for (const unused of matrix.unuseds) {
        for (const index of (matrix.validIndexes ?? [])) {
          const fragments = Array(5).fill('*')
          fragments[index] = unused.value
          const expression = fragments.join(' ')
          itSucceeds(unused, expression, matrix.options)
        }
      }
    })
  }

  const matrixes: Matrix[] = [{
    describe: 'useLastDayOfMonth',
    options: {
      override: {
        useLastDayOfMonth: true,
        daysOfMonth: { lowerLimit: 1, upperLimit: 31 },
      },
    },
    validIndexes: [2],
    valids: [
      { value: 'L', description: 'alone' },
      { value: 'L-2', description: 'with offset' },
    ],
    invalids: [
      { value: '15,L', description: 'cannot be in a list' },
      { value: '2-L', description: 'cannot be the end of a range' },
      { value: '2/L', description: 'cannot be in a step' },
      { value: 'L/2', description: 'cannot be in a step' },
      { value: 'L-32', description: 'cannot have offset out of limit range' }
    ],
    unuseds: [
      { value: '1-15,20-22', description: 'no impact when option is on but no L specified' },
    ],
  }, {
    describe: 'useLastDayOfWeek',
    options: {
      override: {
        useLastDayOfWeek: true,
        daysOfWeek: { lowerLimit: 1, upperLimit: 7 },
      },
    },
    validIndexes: [4],
    valids: [
      { value: 'L', description: 'alone implies last saturday' },
      { value: '5L', description: 'with a day implies last 5th weekday of the month' },
    ],
    invalids: [
      { value: '15,5L', description: 'cannot be in a list' },
      { value: '1-5L', description: 'cannot be in a range' },
      { value: '5/L', description: 'cannot be in a step' },
      { value: 'L/5', description: 'cannot be in a step' },
      { value: '8L', description: 'cannot have a weekday value out of limit' },
    ],
    unuseds: [
      { value: '1-3,5-7', description: 'no impact when option is on but no L specified' },
    ],
  }, {
    describe: 'useNearestWeekday',
    options: {
      override: {
        useNearestWeekday: true,
        daysOfMonth: { lowerLimit: 1, upperLimit: 31 },
      }
    },
    validIndexes: [2],
    valids: [
      { value: '15W', description: 'nearest weekday to the 15th' },
    ],
    invalids: [
      { value: 'W', description: 'means nothing alone' },
      { value: '1,15W', description: 'cannot be in a list' },
      { value: '1-15W', description: 'cannot be in a range' },
      { value: '15/W', description: 'cannot be in a step' },
      { value: 'W/15', description: 'cannot be in a step' },
    ],
    unuseds: [
      { value: '1-15,20-25', description: 'no impact when option is on but no W specified' },
    ],
  }, {
    describe: 'useNearestWeekday with useLastDayOfMonth',
    options: {
      override: {
        useLastDayOfMonth: true,
        useNearestWeekday: true,
        daysOfMonth: { lowerLimit: 1, upperLimit: 31 },
      }
    },
    validIndexes: [2],
    valids: [
      { value: 'LW', description: 'last weekday of month' },
    ],
    invalids: [
      { value: '15,LW', description: 'cannot be in a list' },
      { value: 'WL', description: 'cannot be reversed' },
      { value: '1-15LW', description: 'cannot be in a range' },
      { value: '15/LW', description: 'cannot be in a step' },
      { value: 'LW/15', description: 'cannot be in a step' },
    ],
    unuseds: [
      { value: '1-15,20-25', description: 'no impact when option is on but no W or L specified' },
    ],
  }]

  for (const matrix of matrixes) {
    describe(matrix.describe, () => {
      withOptions(matrix)
      withoutOptions(matrix)
      flagValueUnused(matrix)
    })
  }
})
