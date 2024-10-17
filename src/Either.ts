import { NoSuchElementError } from "./errors/NoSuchElementError";

type Status = 'LEFT' | 'RIGHT'

/**
 * Either data type
 */
export default class Either<U, V> {
  private static LEFT: Status = 'LEFT';
  private static RIGHT: Status = 'RIGHT';

  private readonly value: U | V;
  private readonly status: Status;

  private constructor(status: Status, value: U | V) {
    this.value = value;
    this.status = status;
  }

  /**
   * Returns an left Either instance.
   * @param value
   */
  public static left<U, V>(value: U): Either<U, V> {
    return new Either<U, V>(Either.LEFT, value);
  }

  /**
   * Returns an right Either instance.
   * @param value
   */
  public static right<U, V>(value: V): Either<U, V> {
    return new Either<U, V>(Either.RIGHT, value);
  }

  /**
   * Returns true iff the Either is a left Either.
   */
  public isLeft(): boolean {
    return this.status === Either.LEFT;
  }

  /**
   * Returns true iff the Either is a right Either.
   */
  public isRight(): boolean {
    return this.status === Either.RIGHT;
  }

  /**
   * If it is a left either, throws NoSuchElementError, else,
   * returns the right element of the either.
   */
  public get(): V {
    if (this.isLeft()) {
      throw new NoSuchElementError()
    }
    return <V>this.value;
  }

  /**
   * If it is a right either, throws NoSuchElementError, else,
   * returns the left element of the either.
   */
  public getLeft(): U {
    if (this.isRight()) {
      throw new NoSuchElementError()
    }
    return <U>this.value;
  }

  /**
   * If it is a left either, returns other, else, returns the right element.
   * @param other
   */
  public orElse(other: V): V {
    if (this.isLeft()) {
      return other
    }
    return <V>this.value;
  }

  /**
   * If it is a left either, returns the result produced by the supplying function, else,
   * returns the right element of the either.
   * @param supplier
   */
  public orElseGet(supplier: () => V): V {
    return this.orElse(supplier())
  }

  /**
   * If it is a left either, returns a left either resulting from applying leftFn to the left value.
   * If it is not, returns a right either resulting from applying rightFn to the right value.
   * @param leftFn
   * @param rightFn
   */
  public bimap<X, Y>(leftFn: (leftValue: U) => X, rightFn: (rightValue: V) => Y): Either<X, Y> {
    if (this.isLeft()) {
      return Either.left(leftFn(<U>this.value))
    }
    return Either.right(rightFn(<V>this.value))
  }

  /**
   * If it is a left either, returns the result of applying leftFn to the left value, else, 
   * returns the result of applying rightFn to the right value.
   * @param leftFn 
   * @param rightFn 
   */
  public fold<X, Y>(leftFn: (left: U) => X, rightFn: (right: V) => Y): X | Y {
    if (this.isLeft()) {
      return leftFn(<U>this.value)
    } else {
      return rightFn(<V>this.value)
    }
  }

  /**
   * If it is a left either returns a copy of the either, else returns the resulting
   * either from applying rightFn to the right value.
   * @param rightFn 
   */
  public map<T>(rightFn: (right: V) => T): Either<U, T> {
    return this.fold(
      (leftValue) => Either.left(leftValue),
      (rightValue) => Either.right(rightFn(rightValue)));
  }

  /**
   * If it is a right either, returns a copy of the either, else, returns the resulting
   * either from applying leftFn to the left value.
   * @param leftFn 
   */
  public mapLeft<T>(leftFn: (left: U) => T): Either<T, V> {
    return this.fold(
      (leftValue) => Either.left(leftFn(leftValue)),
      (rightValue) => Either.right(rightValue));
  }

  /**
   * If it is a left either, returns a copy of the either, else, returns the resulting
   * either from applying rightFn to the right value.
   * @param rightFn 
   */
  public flatMap<T>(rightFn: (right: V) => Either<U, T>): Either<U, T> {
    return this.fold(
      (leftValue) => Either.left(leftValue),
      (rightValue) => rightFn(rightValue));
  }

  /** 
   * Returns a String representation of the Either.
   */
  public toString(): string {
    return `Either[status: ${this.status}, value: ${this.value}]`;
  }

  /** 
   * Returns true iff the content of both eithers fulfill strict equals comparison.
   * @param other
   */
  public equals(other: Either<unknown, unknown>): boolean {
    if (this.isLeft() !== other.isLeft())
      return false
    if (this.isLeft())
      return this.getLeft() === other.getLeft();
    return this.get() === other.get()
  }
}
