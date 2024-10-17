import { NoSuchElementError } from "./errors/NoSuchElementError";

type Status = 'OK' | 'ERROR'

/**
 * Result data type
 */
export default class Result<U, V extends Error> {
  private static OK: Status = 'OK';
  private static ERROR: Status = 'ERROR';

  private readonly value: U | V;
  private readonly status: Status;

  private constructor(status: Status, value: U | V) {
    this.value = value;
    this.status = status;
  }

  /**
   * Returns ok Result instance.
   * @param value
   */
  public static ok<U, V extends Error>(value: U): Result<U, V> {
    return new Result<U, V>(Result.OK, value);
  }

  /**
   * Returns error Result instance.
   * @param value
   */
  public static error<U, V extends Error>(value: V): Result<U, V> {
    return new Result<U, V>(Result.ERROR, value);
  }

  /**
   * Returns true iff the Result is ok.
   */
  public isOk(): boolean {
    return this.status === Result.OK;
  }

  /**
   * If it is an error result, throws NoSuchElementError, else returns the ok element.
   */
  public get(): U {
    if (!this.isOk()) {
      throw new NoSuchElementError()
    }
    return <U>this.value;
  }

  /**
   * If it is an error result, throws the error, else does nothing.
   */
  public throw() {
    if (!this.isOk()) {
      throw this.value
    }
  }

  /**
   * If it is an error result, returns an error result with different ok type, else
   * returns fn(ok).
   * @param fn
   */
  public map<T>(fn: (value: U) => T): Result<T, V> {
    if (!this.isOk()) {
      return Result.error<T, V>(<V>this.value)
    }
    return Result.ok(fn(this.get()))
  }

  /**
   * If it is an error result, returns errorFn(error), else, returns okFn(ok).
   * @param okFn 
   * @param errorFn 
   */
  public fold<X, Y extends Error>(okFn: (ok: U) => X, errorFn: (error: V) => Y): X | Y {
    if (this.isOk()) {
      return okFn(<U>this.value)
    } else {
      return errorFn(<V>this.value)
    }
  }

  /** 
   * Returns a String representation of the Result.
   */
  public toString(): string {
    return `Result[status: ${this.status}, value: ${this.value}]`;
  }
}
