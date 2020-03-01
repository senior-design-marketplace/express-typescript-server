import { ProjectMutable } from "./ProjectMutable";

export interface ProjectImmutable extends ProjectMutable {
    /**
     * Identifier of the project
     * @format uuid
     */
    id: string;

    /**
     * The title of the project
     * @minLength 1
     * @maxLength 256
     */
    title: string;

    /**
     * A short description of the project
     * @minLength 1
     * @maxLength 256
     */
    tagline: string;
}