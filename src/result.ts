/*
From:
https://dev.to/_gdelgado/type-safe-error-handling-in-typescript-1p4n
https://github.com/gDelgado14/neverthrow

MIT License

Copyright (c) 2019 Giorgio Delgado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

export type Result<T, E> = Valid<T, E> | Err<T, E>

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
    throw new Error('Tried to get error from a valid.')
  }

  public map<A>(func: (t: T) => A): Result<A, E> {
    return valid(func(this.value))
  }

  public mapErr<U>(func: (e: E) => U): Result<T, U> {
    return valid(this.value)
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

  public map<A>(func: (t: T) => A): Result<A, E> {
    return err(this.error)
  }

  public mapErr<U>(func: (e: E) => U): Result<T, U> {
    return err(func(this.error))
  }
}
