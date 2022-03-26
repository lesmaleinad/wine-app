import { Module, Global } from '@nestjs/common';
import { WinesService } from './wines.service';

@Global()
@Module({
    imports: [],
    providers: [WinesService],
    exports: [WinesService],
})
export class WinesServiceModule {}
