import { HistoryEvent } from "../events/HistoryEvent";
import { Viewable } from "../../../external/enforcer/src/models/Viewable";

export interface HistoryEventShared {

    /**
     * An identifier for this history event
     */
    id: string;

    /**
     * The project to which this history
     * event belongs
     */
    projectId: string;

    /**
     * The user that triggered the event
     */
    initiateId: string;

    /**
     * A tag to denote what type of event
     * triggered this record
     */
    type: HistoryEvent;

    /**
     * When the event was generated
     */
    createdAt: Date;

    before?: Viewable;

    after?: Viewable;
}
