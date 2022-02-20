import express from 'express';
import path from 'path';

const app = express();

type Id<T> = string & { type: T };

function makeId<T>(id: string): Id<T> {
    return <Id<T>>id;
}

abstract class Unique<T, N = string> {
    public id: Id<T>;
    constructor(public readonly name: N, unconfirmedId: string) {
        this.id = makeId(unconfirmedId);
    }
}

class Wine extends Unique<Wine> {
    constructor(name: string, id: string, public winery: Winery) {
        super(name, id);
    }
}

class Winery extends Unique<Winery> {
    constructor(name: string, id: string, public readonly wines: Wine[] = []) {
        super(name, id);
    }
}

class Trip extends Unique<Trip> {
    constructor(
        name: string,
        id: string,
        public users: User[] = [],
        public wineries: Winery[] = []
    ) {
        super(name, id);
    }
}

class User extends Unique<User> {
    public trip: Trip;
}

app.use('/public', express.static(path.join(__dirname, '../../public')));
app.use(
    '/client',
    express.static(path.join(__dirname, '../../dist', 'client'))
);

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => 'Now listening on port 3333!');
