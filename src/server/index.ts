import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import path from 'path';
import { AppModule } from './app/app.module';

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

// app.get('/', (_, res) => {
//     res.render(path.join(__dirname, '../../views', 'index.ejs'), {
//         jsManifest: getManifest(),
//     });
// });

async function bootstrap() {
    const port = process.env.PORT || 3000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
    app.setViewEngine('ejs');
    app.useStaticAssets(path.join(__dirname, '../../public'), {
        prefix: '/public',
    });
    app.useStaticAssets(path.join(__dirname, '../../dist', 'statics'), {
        prefix: '/statics',
    });
    await app.listen(port, () => console.log(`Now listening on port ${port}!`));
}

bootstrap();

// app.listen(port, () => `Now listening on port ${port}!`);
