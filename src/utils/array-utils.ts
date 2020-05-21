import { random } from "lodash";

export const randomEle = <T>(arr: T[]) =>
    arr.length ? arr[random(arr.length - 1)] : undefined;
