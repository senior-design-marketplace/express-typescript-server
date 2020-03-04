export enum ResponseValues {
    "ACCEPTED",
    "REJECTED"
}

export type ResponseType = keyof typeof ResponseValues;