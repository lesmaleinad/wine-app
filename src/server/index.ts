import express from 'express';
import path from 'path';

const app = express();

type Id<T> = string & { type: T };

function makeId<T>(id: string): Id<T> {
    return <Id<T>>id;
}

abstract class Unique<T, N = string> {
    constructor(public readonly name: N, public readonly id: Id<T>) {}
}

class Wine extends Unique<Wine> {
    constructor(name: string, id: string, public winery: Winery) {
        super(name, makeId<Wine>(id));
    }
}

class Winery extends Unique<Winery> {
    constructor(
        name: string,
        id: Id<Winery>,
        public readonly wines: Wine[] = []
    ) {
        super(name, id);
    }
}

class Trip extends Unique<Trip> {
    constructor(
        name: string,
        id: Id<Trip>,
        public users: User[] = [],
        public wineries: Winery[] = []
    ) {
        super(name, id);
    }
}

interface User extends Unique<User> {
    trip: Trip;
}

app.use('/public', express.static(path.join(__dirname, '../../public')));
app.use('/client', express.static(path.join(__dirname, '../../lib', 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

app.listen(8000, () => 'Now listening on port 8000!');
