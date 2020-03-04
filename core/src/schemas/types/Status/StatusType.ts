import { ResponseType } from '../Response/ResponseType';

export enum StatusValues {
    "PENDING"
}

export type StatusType = keyof typeof StatusValues | ResponseType;