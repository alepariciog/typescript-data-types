/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoSuchElementError } from "./errors/NoSuchElementError";
import { NullPointerError } from "./errors/NullPointerError";

/**
 * Optional datatype
 */
export default class Optional<T> {
  private readonly value?: T;

  private constructor(value?: T) {
    this.value = value;
  }

  /**
   * Returns an empty Optional instance.
   */
  static empty(): Optional<any> {
    return new Optional<any>();
  }

  /**
   * Returns an Optional describing the given non-null value.
   * If a null or undefined value is passed, it will throw NullPointerError.
   * In this case, see ofNullable method
   * @param value
   * @throws NullPointerError
   */
  static of<T>(value: T) {
    // Loose equality for null and undefined
    if (value == null) {
      throw new NullPointerError();
    }
    return new Optional<T>(value);
  }

  /**
   * Returns an Optional describing the given value.
   * @param value
   */
  static ofNullable<T>(value: T) {
    return new Optional<T>(value);
  }

  /**
   * If a value is present, returns the value, otherwise throws NoSuchElementError.
   * @throws NoSuchElementError
   */
  public get(): T {
    if (this.value === undefined) {
      throw new NoSuchElementError()
    }
    return this.value;
  }

  /**
   * Returns true iff a value is present.
   */
  public isPresent(): boolean {
    return this.value !== undefined;
  }

  /**
   * Returns true iff a value is not present.
   */
  public isEmpty(): boolean {
    return !this.isPresent();
  }

  /**
   * If a value is present, performs the given action with the value, otherwise does nothing.
   * @param action 
   */
  public ifPresent(action: (value: T) => void): void {
    if (this.isPresent()) {
      action(this.get());
    }
  }

  /**
   * If a value is present, performs the given action with the value, 
   * otherwise performs the given empty-based action.
   * @param action 
   * @param emptyAction
   */
  public ifPresentOrElse(action: (value: T) => void, emptyAction: () => void): void {
    if (this.isPresent()) {
      action(this.get());
    } else {
      emptyAction();
    }
  }

  /**
   * If a value is present, and the value matches the given predicate, returns an Optional 
   * describing the value, otherwise returns an empty Optional.
   * @param predicate
   */
  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (this.isEmpty()) {
      return Optional.empty();
    }
    if (!predicate(this.get())) {
      return Optional.empty();
    }
    return Optional.of(this.get());
  }

  /**
   * If a value is present, returns an Optional describing (as if by ofNullable(T)) 
   * the result of applying the given mapping function to the value, otherwise 
   * returns an empty Optional. If the mapping function returns a null or undefined 
   * result then this method returns an empty Optional.
   * @param mapper
   */
  public map<U>(mapper: (value: T) => U): Optional<U> {
    if (this.isEmpty()) {
      return Optional.empty();
    }

    const mappedValue = mapper(this.get())
    // Loose equality for null and undefined
    if (mappedValue == null) {
      return Optional.empty();
    }

    return Optional.of(mappedValue);
  }

  /**
   * If a value is present, returns the result of applying the given Optional-bearing mapping 
   * function to the value, otherwise returns an empty Optional. This method is similar to 
   * map(Function), but the mapping function is one whose result is already an Optional, 
   * and if invoked, flatMap does not wrap it within an additional Optional.
   * @param mapper
   */
  public flatMap<U>(mapper: (value: T) => Optional<U>): Optional<U> {
    if (this.isEmpty()) {
      return Optional.empty();
    }
    return mapper(this.get())
  }

  /**
   * If a value is present, returns an Optional describing the value, 
   * otherwise returns an Optional produced by the supplying function.
   * @param supplier 
   */
  public or(supplier: () => Optional<T>): Optional<T> {
    if (this.isPresent()) {
      return this;
    }
    return supplier()
  }

  /**
   * If a value is present, returns the value, otherwise returns other.
   * @param other 
   */
  public orElse(other: T): T {
    if (this.isEmpty()) {
      return other;
    }
    return this.get();
  }

  /**
   * If a value is present, returns the value, otherwise returns the result 
   * produced by the supplying function.
   * @param supplier 
   */
  public orElseGet(supplier: () => T): T {
    if (this.isPresent()) {
      return this.get();
    }
    return supplier();
  }

  /**
   * If a value is present, returns the value, otherwise, if supplier is present,
   * throws an exception produced by the exception supplying function, else, throws
   * a NoSuchElementError.
   * @param supplier
   * @throws NoSuchElementError
   */
  public orElseThrow(supplier?: () => Error): T {
    if (this.isPresent()) {
      return this.get()
    }

    // Loose equality for null and undefined
    if (supplier == null) {
      throw new NoSuchElementError()
    }

    throw supplier()
  }

  // Extra Methods

  /**
   * If a value is present, returns the result of applying fn to it, else, returns
   * the result of executing emptyFn.
   * @param emptyFn 
   * @param fn 
   */
  public fold<U>(emptyFn: () => U, fn: (right: T) => U): U {
    if (this.isEmpty()) {
      return emptyFn()
    }
    return fn(this.get())
  }

  /** 
   * Returns a String representation of the optional.
   */
  public toString(): string {
    if (this.isEmpty()) {
      return `Optional[]`;
    }
    return `Optional[value: ${this.value}]`;
  }

  /** 
   * Returns true iff the content of both optionals fulfill strict equals comparison.
   * @param other
   */
  public equals(other: Optional<unknown>): boolean {
    if (other.isEmpty() && this.isEmpty())
      return true
    if (other.isEmpty() || this.isEmpty())
      return false;
    return this.get() === other.get()
  }
}
