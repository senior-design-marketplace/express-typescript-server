import { Transaction } from "objection";
import { BaseModel } from "./BaseModel";

export abstract class ViewableModel extends BaseModel {

    abstract getPartialView(transaction?: Transaction): Promise<ViewableModel>;

    abstract getVerboseView(transaction?: Transaction): Promise<ViewableModel>;

    abstract getFullView(transaction?: Transaction): Promise<ViewableModel>;
}