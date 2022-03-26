import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinesModule } from '../wines/wines.module';
import { AppLoggerMiddleware } from '../logger/logger.service';
import { AppController } from './app.controller';

@Module({
    imports: [WinesModule],
    controllers: [AppController],
    providers: [AppLoggerMiddleware],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
