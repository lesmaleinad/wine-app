export type Id<T> = string & { type: T };

function makeId<T>(id: string): Id<T> {
    return <Id<T>>id;
}

export abstract class Unique<T, N = string> {
    public id: Id<T>;
    constructor(public readonly name: N, unconfirmedId: string) {
        this.id = makeId(unconfirmedId);
    }
}

export class Wine extends Unique<Wine> {
    constructor(name: string, id: string, public winery: Winery) {
        super(name, id);
    }
}

export class Winery extends Unique<Winery> {
    constructor(name: string, id: string, public readonly wines: Wine[] = []) {
        super(name, id);
    }
}

export class Trip extends Unique<Trip> {
    constructor(
        name: string,
        id: string,
        public users: User[] = [],
        public wineries: Winery[] = []
    ) {
        super(name, id);
    }
}

export class User extends Unique<User> {
    constructor(name: string, id: string) {
        super(name, id);
    }
}
