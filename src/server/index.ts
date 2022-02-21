import express from 'express';
import path from 'path';
import { getManifest } from './routes/manifest';

const app = express();
app.set('view engine', 'ejs');

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

app.use(
    '/statics',
    express.static(path.join(__dirname, '../../dist', 'statics'))
);
app.get('/worker-bundle.js', (_, res) => {
    res.sendFile(
        path.join(__dirname, '../../dist', 'statics', 'worker-bundle.js')
    );
});

app.get('/', (_, res) => {
    res.render(path.join(__dirname, '../../views', 'index.ejs'), {
        jsManifest: getManifest(),
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => `Now listening on port ${port}!`);
