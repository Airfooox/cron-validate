export type Response<T, E> = Valid<T, E> | Err<T, E>

export const valid = <T, E>(value: T): Valid<T, E> => new Valid(value)
export const err = <T, E>(error: E): Err<T, E> => new Err(error)

export class Valid<T, E> {
  constructor(readonly value: T) {}

  public isValid(): this is Valid<T, E> {
    return true
  }

  public isError(): this is Err<T, E> {
    return !this.isValid()
  }

  public getValue(): T {
    return this.value
  }

  public getError(): E {
    throw new Error('Tried to get error from a success.')
  }
}

export class Err<T, E> {
  constructor(readonly error: E) {}

  public isError(): this is Err<T, E> {
    return true
  }

  public isValid(): this is Valid<T, E> {
    return !this.isError()
  }

  public getValue(): T {
    throw new Error('Tried to get success value from an error.')
  }

  public getError(): E {
    return this.error
  }
}
