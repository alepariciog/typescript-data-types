import Result from '../src/Result';
import { NoSuchElementError } from '../src/errors/NoSuchElementError';
import { NullPointerError } from '../src/errors/NullPointerError';

describe('Result', () => {
  it('should Result.ok() create an ok result without throwing exception', () => {
    expect(() => Result.ok(3)).not.toThrow(Error);
  });

  it('should Result.error() create an error result without throwing exception', () => {
    expect(() => Result.error(new NullPointerError())).not.toThrow(Error);
  });

  it('should isOk() return true iff it is an ok result', () => {
    const result = Result.ok(3);
    expect(result.isOk()).toBeTruthy();
  });

  it('should isOk() return false iff it is an error result', () => {
    const result = Result.error(new NullPointerError());
    expect(result.isOk()).toBeFalsy();
  });

  it('should get() return the ok value if it is an ok result', () => {
    const result = Result.ok(3);
    expect(result.get()).toBe(3);
  });

  it('should get() throw NoSuchElementError if it is an error result', () => {
    const result = Result.error(new NullPointerError());
    expect(() => result.get()).toThrow(NoSuchElementError);
  });

  it('should throw() do nothing it is an ok result', () => {
    const result = Result.ok(3);
    expect(() => result.throw()).not.toThrow(Error);
  });

  it('should throw() throw inner error it is an error result', () => {
    const result = Result.error(new NullPointerError());
    expect(() => result.throw()).toThrow(NullPointerError);
  });

  it('should map() return an error result with the same error if it is an error result', () => {
    const result = Result.error<number, NullPointerError>(new NullPointerError());
    const mappedResult = result.map(value => value + 1);
    expect(mappedResult).toEqual(result);
  });

  it('should map() return the result obtained from applying fn to an ok result inner value', () => {
    const result = Result.ok(3);
    const mappedResult = result.map(value => value + 1);
    expect(mappedResult.get()).toBe(4);
  });

  it('should fold() return okFn(ok) if it is an ok result', () => {
    const result = Result.ok(3);
    const mappedResult = result.fold(value => value + 1, error => error);
    expect(mappedResult).toBe(4);
  });

  it('should fold() return errorFn(Error) if it is an error result', () => {
    const result = Result.error<number, NullPointerError>(new NullPointerError());
    const mappedResult = result.fold(value => value + 1, error => error);
    expect(mappedResult).toEqual(new NullPointerError());
  });
});
