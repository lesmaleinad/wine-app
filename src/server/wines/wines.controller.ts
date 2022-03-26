import { WinesService } from '../services/wines/wines.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Id, Wine, WinePostBody, Winery } from 'common/types';
import { NOT_FOUND, OK } from 'common/statusCodes';

@Controller('wines')
export class WinesController {
    constructor(private readonly wineService: WinesService) {}
    @Get()
    public getAllWines(): Wine[] {
        return this.wineService.getAllWines();
    }

    @Get(':id')
    public getWineById(@Param('id') id: Id<Wine>): Wine | typeof NOT_FOUND {
        const wine = this.wineService.getWineById(id);
        return wine ?? NOT_FOUND;
    }

    @Post()
    public addWine(@Body() body: WinePostBody): Wine {
        const { name } = body;
        console.log(body);
        const id = 'wine-' + Math.random().toString();
        const wine = new Wine(name, id, {} as Winery);
        this.wineService.addWine(wine);
        return wine;
    }

    @Delete(':id')
    public deleteWine(@Param('id') id: Id<Wine>): typeof OK | typeof NOT_FOUND {
        const deleted = this.wineService.deleteWine(id);
        return deleted ? OK : NOT_FOUND;
    }
}
