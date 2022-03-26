import { Module } from '@nestjs/common';
import { WinesController } from './wines.controller';

@Module({
    imports: [],
    controllers: [WinesController],
    providers: [],
})
export class WinesModule {}
