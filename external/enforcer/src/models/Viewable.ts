import { Transaction } from "objection";

export interface Viewable<P, V, F> {

    getPartialView(transaction?: Transaction): Promise<P>;

    getVerboseView(transaction?: Transaction): Promise<V>;

    getFullView(transaction?: Transaction): Promise<F>;
}
