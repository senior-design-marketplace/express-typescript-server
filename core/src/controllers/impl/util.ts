import { TagMaster } from "../../schemas/types/Tag/TagMaster";
import { MajorMaster } from "../../schemas/types/Major/MajorMaster";

export function extractValue(params: (TagMaster | MajorMaster)[]) {
    return params.map((param) => param.value);
}

type KeysMatching<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];
type NoRelations<T> = Omit<T, KeysMatching<T, Array<any>>>

/**
 * Allow certain relations to be passed directly through to the client
 */
export type PassThrough<T, K extends keyof T> = Pick<T, K> & NoRelations<T>;