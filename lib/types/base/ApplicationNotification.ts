import { ApplicationShared } from "../shared/ApplicationShared";

export interface ApplicationNotification {

    /**
     * A typing flag to denote the format of the entry
     */
    type: "APPLICATION";

    /**
     * The content of the application
     */
    application: ApplicationShared;
}