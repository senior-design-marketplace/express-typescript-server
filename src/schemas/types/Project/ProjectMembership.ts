enum ProjectMembershipValues {
    "CONTRIBUTOR",
    "ADMINISTRATOR",
    "ADVISOR"
}

export type ProjectMembership = keyof typeof ProjectMembershipValues;