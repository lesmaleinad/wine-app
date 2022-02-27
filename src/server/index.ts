import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const port = process.env['PORT'] || 3000;
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
