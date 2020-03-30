//TODO: find an actual type for this
type Verb = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export class Event {

    private httpMethod: Verb;
    private path: string;
    private body?: string;
    private queryStringParameters: any;
    private headers: any;

    constructor(verb: Verb, path: string) {
        this.httpMethod = verb;
        this.path = path;
        this.queryStringParameters = {};
        this.headers = {
            "content-type": "application/json"
        };
    }

    public withBody(params: object): Event {
        this.body = JSON.stringify(params);
        return this;
    }

    public withQuery(params: object): Event {
        this.queryStringParameters = Object.assign(this.queryStringParameters, params); // don't overwrite token
        return this;
    }

    public withToken(token: string): Event {
        this.queryStringParameters.id_token = token;
        return this;
    }
}

export class EventFactory {

    private event?: Event;
    private tokens: Record<string, string>;

    constructor(tokens: Record<string, string>) {
        this.tokens = tokens;
    }

    public createEvent(verb: Verb, path: string) {
        this.event = new Event(verb, path);
        return this;
    }

    public withBody(params: object) {
        if (!this.event) {
            throw "Event not initialized"
        }
        
        this.event.withBody(params);
        return this;
    }

    public withQuery(params: object) {
        if (!this.event) {
            throw "Event not initialized"
        }

        this.event.withQuery(params);
        return this;
    }

    public withUser(username: string) {
        if (!this.event) {
            throw "Event not initialized"
        }

        this.event.withToken(this.tokens[username]);
        return this;
    }

    public build() {
        const copy = this.event;
        this.event = undefined;
        return copy;
    }
}