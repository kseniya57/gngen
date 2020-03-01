import { omitBy } from "lodash";

export function filterFields<T>(input: object): T {
    //@ts-ignore
    return omitBy(input, (value: any, key: string) => key.includes('Id'));
}