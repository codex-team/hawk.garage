
/**
 * Project event grouping pattern object
 */
export type ProjectEventGroupingPattern = {
    /**
     * Id of the project event grouping pattern object
     */
    id: string,

    /**
     * Pattern string of the project event grouping pattern
     */
    pattern: string,
};

/**
 * What kind of data we send to create a new event grouping pattern in a project
 */
export type AddProjectEventGroupingPatternPayload = {
    /**
     * Id of the project
     */
    projectId: string,

    /**
     * Pattern string of the project event grouping pattern
     */
    pattern: string,
};

/**
 * What kind of data we send to update an event grouping pattern in a project
 */
export type UpdateProjectEventGroupingPatternPayload = ProjectEventGroupingPattern | {
    /**
     * Id of the project
     */
    projectId: string,
};

/**
 * What kind of data we send to remove an event grouping pattern in a project
 */
export type RemoveProjectEventGroupingPatternPayload = {
    /**
     * Id of the project
     */
    projectId: string,

    /**
     * Id of the project event grouping pattern object
     */
    id: string,
};

