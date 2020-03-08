import { TagMaster } from "../../schemas/types/Tag/TagMaster";
import { MajorMaster } from "../../schemas/types/Major/MajorMaster";

export function extractValue(params: (TagMaster | MajorMaster)[]) {
    return params.map((param) => param.value);
}