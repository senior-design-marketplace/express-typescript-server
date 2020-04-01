import { HistoryEvent } from "../../../../lib/types/events/HistoryEvent";
import { HistoryEventShared } from "../../../../lib/types/shared/HistoryEventShared";
import { BaseModel } from "./BaseModel";
import { ViewableModel } from "./ViewableModel";

export class HistoryEventModel extends BaseModel implements HistoryEventShared {

    static tableName = "historyEvents";

    id!: string;
    projectId!: string;
    initiateId!: string;
    createdAt!: Date;
    type!: HistoryEvent;

    before!: ViewableModel;
    after!: ViewableModel;

    static modifiers = {
        mostRecent(query) {
            query.orderBy('createdAt', 'desc');
        }
    }
}