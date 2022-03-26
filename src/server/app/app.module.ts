import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinesModule } from '../wines/wines.module';
import { AppLoggerMiddleware } from '../logger/logger.service';
import { AppController } from './app.controller';
import { EventsModule } from '../events/events.module';
import { WinesServiceModule } from '../services/wines/wines.module';

@Module({
    imports: [WinesModule, WinesServiceModule, EventsModule],
    controllers: [AppController],
    providers: [AppLoggerMiddleware],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
