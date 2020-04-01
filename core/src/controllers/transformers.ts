import { TagShared } from "../../../lib/types/shared/TagShared";
import { MajorShared } from "../../../lib/types/shared/MajorShared";
import { ProjectShared } from "../../../lib/types/shared/ProjectShared";

/**
 * An object comes in as a set of keys and values.  We can
 * map these keys into other values if we have a rough idea
 * of their structure.
 */
export function extractValue(params: (TagShared | MajorShared)[]) {
    return params.map((param) => param.value);
}

export const transformers = {
    'tags': extractValue,
    'majors': extractValue, // need both because supported majors and requested majors differ by name, should consolidate
    'requestedMajors': extractValue
}

export function applyTransformation(obj: object) {
    for (const key of Object.keys(obj)) {

        if (transformers[key]) {
            obj[key] = transformers[key](obj[key]);
        }
    }

    return obj;
}