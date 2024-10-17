import { NoSuchElementError } from '../src/errors/NoSuchElementError';
import { NullPointerError } from '../src/errors/NullPointerError';
import Optional from '../src/Optional';

describe('Optional', () => {
  it('should Optional.empty() not throw exception when creating an empty optional', () => {
    expect(() => Optional.empty()).not.toThrow(Error);
  });

  it('should Optional.of() not throw an exception when creating an optional with a non nullable value', () => {
    expect(() => Optional.of(3)).not.toThrow(Error);
  });

  it('should Optional.of() throw an exception when creating an optional with a nullable value', () => {
    expect(() => Optional.of(null)).toThrow(NullPointerError);
  });

  it('should Optional.ofNullable() not throw exception when creating an optional with a nullable value', () => {
    expect(() => Optional.ofNullable(null)).not.toThrow(NullPointerError);
  });

  it('should Optional.ofNullable() not throw exception when creating an optional with a non nullable value', () => {
    expect(() => Optional.ofNullable(3)).not.toThrow(NullPointerError);
  });

  it('should get() return optional inner value when non empty optional', () => {
    const value = 3;
    const optional = Optional.of(value);
    expect(optional.get()).toEqual(value);
  });

  it('should get() throw a NoSuchElementError when using empty optional', () => {
    const optional = Optional.empty();
    expect(() => optional.get()).toThrow(NoSuchElementError);
  });

  it('should isPresent() return true iff the optional has a value', () => {
    const optional = Optional.of(3);
    expect(optional.isPresent()).toBeTruthy();
  });

  it('should isPresent() return false iff the optional is empty', () => {
    const optional = Optional.empty();
    expect(optional.isPresent()).toBeFalsy();
  });

  it('should isEmpty() return true iff the optional is empty', () => {
    const optional = Optional.empty();
    expect(optional.isEmpty()).toBeTruthy();
  });

  it('should isEmpty() return false iff the optional has a value', () => {
    const optional = Optional.of(3);
    expect(optional.isEmpty()).toBeFalsy();
  });

  it('should ifPresent() do nothing when empty optional', () => {
    let counter = 1;
    const incrementFunction = (value: number) => counter = counter + value
    const optional = Optional.empty();
    optional.ifPresent(incrementFunction)
    expect(counter).toBe(1);
  });

  it('should ifPresent() execute the action when non empty optional', () => {
    let counter = 1;
    const incrementFunction = (value: number) => counter = counter + value
    const optional = Optional.of(1);
    optional.ifPresent(incrementFunction)
    expect(counter).toEqual(2);
  });

  it('should ifPresentOrElse() execute emptyAction function when empty optional', () => {
    let counter = 1;
    const incrementFunction = (value: number) => counter = counter + value
    const decrementFunction = () => counter = counter - 1
    const optional = Optional.empty();
    optional.ifPresentOrElse(incrementFunction, decrementFunction)
    expect(counter).toBe(0);
  });

  it('should ifPresentOrElse() execute action function when non empty optional', () => {
    let counter = 1;
    const incrementFunction = (value: number) => counter = counter + value
    const decrementFunction = () => counter = counter - 1
    const optional = Optional.of<number>(1);
    optional.ifPresentOrElse(incrementFunction, decrementFunction)
    expect(counter).toBe(2);
  });

  it('should filter() return an empty optional when applied over empty optional', () => {
    const greaterThanZeroFunction = (value: number) => value > 0
    let optional = Optional.empty();
    optional = optional.filter(greaterThanZeroFunction)
    expect(optional.isEmpty()).toBeTruthy();
  });

  it('should filter() return an empty optional when predicate applied to inner value returns false', () => {
    const greaterThanZeroFunction = (value: number) => value > 0
    let optional = Optional.of(-1);
    optional = optional.filter(greaterThanZeroFunction)
    expect(optional.isEmpty()).toBeTruthy();
  });

  it('should filter() return an optional describing a value when predicate applied to inner value returns true', () => {
    const greaterThanZeroFunction = (value: number) => value > 0
    let optional = Optional.of(1);
    optional = optional.filter(greaterThanZeroFunction)
    expect(optional.isPresent()).toBeTruthy();
    expect(optional.get()).toEqual(1);
  });

  it('should map() return an empty optional when applied on an empty optional', () => {
    const addOne = (value: number) => value + 1
    let optional = Optional.empty();
    optional = optional.map(addOne)
    expect(optional.isEmpty()).toBeTruthy();
  });

  it('should map() return an empty optional when mapper function returns null', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addOne = (value: number) => null
    const initialOptional = Optional.empty();
    const mappedOptional = initialOptional.map(addOne)
    expect(mappedOptional.isEmpty()).toBeTruthy();
  });

  it('should map() return an optional describing the resulting value from applying the mapper'
    + ' function to the inner value of the existing optional', () => {
      const addOne = (value: number) => value + 1
      let optional = Optional.of(1);
      optional = optional.map(addOne)
      expect(optional.get()).toEqual(2);
    });

  it('should flatMap() return an empty optional when applied on an empty optional', () => {
    const numberToString = (value: number) => Optional.of(value.toString)
    const initialOptional = Optional.empty();
    const mappedOptional = initialOptional.flatMap(numberToString)
    expect(mappedOptional.isEmpty()).toBeTruthy();
  });

  it('should flatMap() return the resulting optional from applying mapper function to the optional inner value', () => {
    const numberToString = (value: number) => Optional.of(value.toString())
    const initialOptional = Optional.of<number>(3);
    const mappedOptional = initialOptional.flatMap(numberToString)
    expect(mappedOptional.get()).toStrictEqual(initialOptional.get().toString());
  });

  it('should or() return an optional describing the inner value of the optional when a value is present', () => {
    const optional = Optional.of<number>(3);
    const finalOptional = optional.or(() => Optional.of(4))
    expect(finalOptional.get()).toEqual(3);
  });

  it('should or() return an optional given by the supplier function when a value is not present', () => {
    const optional = Optional.empty();
    const finalOptional = optional.or(() => Optional.of(4))
    expect(finalOptional.get()).toEqual(4);
  });

  it('should orElse() return the optional inner value when a value is present', () => {
    const optional = Optional.of(3);
    const value = optional.orElse(4)
    expect(value).toEqual(3);
  });

  it('should orElse() return other when the optional is empty', () => {
    const optional = Optional.empty();
    const value = optional.orElse(4)
    expect(value).toEqual(4);
  });

  it('should orElseGet() return the optional inner value when a value is present', () => {
    const supplier = () => 4
    const optional = Optional.of(3);
    const value = optional.orElseGet(supplier)
    expect(value).toEqual(3);
  });

  it('should orElseGet() return the supplier function result when the optional is empty', () => {
    const supplier = () => 4
    const optional = Optional.empty();
    const value = optional.orElseGet(supplier)
    expect(value).toEqual(4);
  });

  it('should orElseThrow() return the optional inner value when a value is present', () => {
    const supplier = () => { throw new NullPointerError() }
    const optional = Optional.of(3);
    const value = optional.orElseThrow(supplier)
    expect(value).toEqual(3);
  });

  it('should orElseThrow() throw the supplier function result when the optional is empty and supplier is present', () => {
    const supplier = () => { throw new NullPointerError() }
    const optional = Optional.empty();
    expect(() => optional.orElseThrow(supplier)).toThrow(NullPointerError);
  });

  it('should orElseThrow() throw NoSuchElementError when the optional is empty and supplier is not present', () => {
    const optional = Optional.empty();
    expect(() => optional.orElseThrow()).toThrow(NoSuchElementError);
  });

  it('should equals() return true if both optionals are empty', () => {
    const result = Optional.empty().equals(Optional.empty());
    expect(result).toBeTruthy();
  });

  it('should equals() return false if only one optional is empty', () => {
    const result = Optional.empty().equals(Optional.of(3));
    expect(result).toBeFalsy();
  });

  it('should equals() return true if the value of both optionals match strict equals comparison', () => {
    const result = Optional.of(3).equals(Optional.of(3));
    expect(result).toBeTruthy();
  });

  it('should equals() return false if the value of both optionals do not match strict equals comparison', () => {
    const result = Optional.of(3).equals(Optional.of("3"));
    expect(result).toBeFalsy();
  });

  it('should fold() return the result of the parameterless function execution if the optional is empty', () => {
    const optional = Optional.empty();
    const value = optional.fold(() => 4, value => value + 1);
    expect(value).toBe(4);
  });

  it('should fold() return the result of the function with parameter execution if the optional is not empty', () => {
    const optional = Optional.of(0);
    const value = optional.fold(() => 4, value => value + 1);
    expect(value).toBe(1);
  });
});
