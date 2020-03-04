export enum RoleValues {
    "CONTRIBUTOR",
    "ADMINISTRATOR",
    "ADVISOR"
}

export type RoleType = keyof typeof RoleValues;