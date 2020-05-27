export const keysIn = <T extends {}>(o: T) => Object.keys(o) as Array<keyof T>;
