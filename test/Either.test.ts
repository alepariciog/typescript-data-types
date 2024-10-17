import Either from '../src/Either';
import { NoSuchElementError } from '../src/errors/NoSuchElementError';

describe('Either', () => {
  it('should Either.left() create an either with left value without throwing exception', () => {
    expect(() => Either.left(3)).not.toThrow(Error);
  });

  it('should Either.right() create an either with right value without throwing exception', () => {
    expect(() => Either.right(3)).not.toThrow(Error);
  });

  it('should isLeft() return true iff it is a left either', () => {
    const either = Either.left(3);
    expect(either.isLeft()).toBeTruthy();
  });

  it('should isLeft() return false iff it is a right either', () => {
    const either = Either.right(3);
    expect(either.isLeft()).toBeFalsy();
  });

  it('should isRight() return true iff it is a right either', () => {
    const either = Either.right(3);
    expect(either.isRight()).toBeTruthy();
  });

  it('should isRight() return false iff it is a left either', () => {
    const either = Either.left(3);
    expect(either.isRight()).toBeFalsy();
  });

  it('should get() return the right element if it is a right either', () => {
    const either = Either.right(3);
    expect(either.get()).toBe(3);
  });

  it('should get() throw NoSuchElementError if it is a left either', () => {
    const either = Either.left(3);
    expect(() => either.get()).toThrow(NoSuchElementError);
  });

  it('should getLeft() throw NoSuchElementError if it is a right either', () => {
    const either = Either.right(3);
    expect(() => either.getLeft()).toThrow(NoSuchElementError);
  });

  it('should getLeft() return the left element if it is a left either', () => {
    const either = Either.left(3);
    expect(either.getLeft()).toBe(3);
  });

  it('should orElse() return the right element if it is a right either', () => {
    const either = Either.right(3);
    expect(either.orElse(5)).toBe(3);
  });

  it('should orElse() return other if it is a left either', () => {
    const either = Either.left(3);
    expect(either.orElse(5)).toBe(5);
  });

  it('should orElseGet() return the right element if it is a right either', () => {
    const either = Either.right(3);
    expect(either.orElseGet(() => 5)).toBe(3);
  });

  it('should orElseGet() return the supplier function result if it is a left either', () => {
    const either = Either.left(3);
    expect(either.orElseGet(() => 5)).toBe(5);
  });

  it('should bimap() return a left either resulting from applying leftFn to the left value.', () => {
    const either = Either.left<number, boolean>(3);
    const bimappedEither = either.bimap((val: number) => val + 1, (val: boolean) => +val)
    expect(bimappedEither.getLeft()).toBe(4);
  });

  it('should bimap() return a right either resulting from applying rightFn to the right value.', () => {
    const either = Either.right<boolean, number>(3);
    const bimappedEither = either.bimap((val: boolean) => +val, (val: number) => val + 1)
    expect(bimappedEither.get()).toBe(4);
  });

  it('should fold() return the result of the left function if the either is left', () => {
    const either = Either.left<number, boolean>(3);
    const foldedEither = either.fold((val: number) => val + 1, (val: boolean) => +val)
    expect(foldedEither).toBe(4);
  });

  it('should fold() return the result of the right function if the either is right', () => {
    const either = Either.right<number, boolean>(true);
    const foldedEither = either.fold((val: number) => val + 1, (val: boolean) => +val)
    expect(foldedEither).toBe(1);
  });

  it('should map() return a copy if the either is left', () => {
    const either = Either.left<boolean, number>(true);
    const mappedEither = either.map((val: number) => val + 1)
    expect(mappedEither).toEqual(either);
  });

  it('should map() return the resulting either from applying rightFn to inner value', () => {
    const either = Either.right<boolean, number>(3);
    const mappedEither = either.map((val: number) => val + 1)
    expect(mappedEither.get()).toBe(4);
  });

  it('should mapLeft() return a copy if the either is right', () => {
    const either = Either.right<boolean, number>(3);
    const mappedEither = either.mapLeft((val: boolean) => +val)
    expect(mappedEither).toEqual(either);
  });

  it('should mapLeft() return the resulting either from applying leftFn to inner value', () => {
    const either = Either.left<boolean, number>(true);
    const mappedEither = either.mapLeft((val: boolean) => +val)
    expect(mappedEither.getLeft()).toBe(1);
  });

  it('should flatMap() return a copy if the either is left', () => {
    const either = Either.left<number, boolean>(3);
    const flatmappedEither = either.flatMap((val: boolean) => Either.right(+val))
    expect(flatmappedEither).toEqual(either);
  });

  it('should map() return the resulting either from applying rightFn to inner value', () => {
    const either = Either.right<number, boolean>(true);
    const flatmappedEither = either.flatMap((val: boolean) => Either.right(+val))
    expect(flatmappedEither.get()).toBe(1);
  });

  it('should equals() return false if eithers dont match status', () => {
    const result = Either.right(3).equals(Either.left(3));
    expect(result).toBeFalsy();
  });

  it('should equals() return false if eithers match status but dont match inner value', () => {
    const result = Either.right(3).equals(Either.right(4));
    expect(result).toBeFalsy();
  });

  it('should equals() return true if eithers match status and inner value', () => {
    const result = Either.right(3).equals(Either.right(3));
    expect(result).toBeTruthy();
  });
});
