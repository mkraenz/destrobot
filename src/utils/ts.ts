export const keysIn = <T extends {}>(o: T) => Object.keys(o) as Array<keyof T>;

export type Unpack<A> = A extends Array<infer E> ? E : A;
