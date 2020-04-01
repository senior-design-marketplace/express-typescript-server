import { HistoryEvent } from "../events/HistoryEvent";
import { ViewableModel } from "../../../external/enforcer/src/models/ViewableModel";

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

    /**
     * A view of the model before modification.
     * If the model was created in this event,
     * this will be undefined.
     */
    before?: ViewableModel;

    /**
     * A view of the model after modification.
     * If the model was deleted in this event,
     * this will be undefined.
     */
    after?: ViewableModel;
}
