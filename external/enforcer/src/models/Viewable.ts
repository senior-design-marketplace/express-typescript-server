import { Transaction } from "objection";

export interface Viewable {

    getPartialView(transaction?: Transaction): Promise<object>;

    getVerboseView(transaction?: Transaction): Promise<object>;

    getFullView(transaction?: Transaction): Promise<object>;
}