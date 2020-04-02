//TODO: find an actual type for this
type Verb = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export interface Event {
    httpMethod: Verb,
    path: string,
    body?: string,
    queryStringParameters: any,
    headers: any
}

export class EventFactory {

    private event?: Event;
    private tokens: Record<string, string>;

    constructor(tokens: Record<string, string>) {
        this.tokens = tokens;
    }

    public createEvent(httpMethod: Verb, path: string) {
        this.event = {
            httpMethod,
            path,
            queryStringParameters: {},
            headers: {
                "content-type": "application/json"
            }
        }

        return this;
    }

    public withBody(params: object) {
        if (!this.event) {
            throw "Event not initialized"
        }
        
        this.event.body = JSON.stringify(params);
        return this;
    }

    public withQuery(params: object) {
        if (!this.event) {
            throw "Event not initialized"
        }
        this.event.queryStringParameters = Object.assign(this.event.queryStringParameters, params);
        return this;
    }

    public withUser(username: string) {
        if (!this.event) {
            throw "Event not initialized"
        }

        this.event.queryStringParameters.id_token = this.tokens[username];
        return this;
    }

    public build(): Event {
        if (!this.event) {
            throw new Error("No event exists to be built");
        }

        const copy = this.event;
        this.event = undefined;
        return copy;
    }
}