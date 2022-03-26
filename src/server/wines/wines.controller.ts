import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Id, Wine, WinePostBody, Winery } from 'common/types';
import { NOT_FOUND, OK } from 'common/statusCodes';

@Controller('wines')
export class WinesController {
    private wines: Wine[] = [];

    @Get()
    public getAllWines(): Wine[] {
        return this.wines;
    }

    @Get(':id')
    public getWineById(@Param('id') id: Id<Wine>): Wine | typeof NOT_FOUND {
        const wine = this.wines.find((wine) => wine.id === id);
        if (wine) return wine;

        return NOT_FOUND;
    }

    @Post()
    public addWine(@Body() body: WinePostBody): Wine {
        const { name } = body;
        console.log(body);
        const id = 'wine-' + Math.random().toString();
        const wine = new Wine(name, id, {} as Winery);
        this.wines.push(wine);
        return wine;
    }

    @Delete(':id')
    public deleteWine(@Param('id') id: Id<Wine>): typeof OK | typeof NOT_FOUND {
        const prevLength = this.wines.length;
        const newWines = this.wines.filter((wine) => wine.id !== id);
        if (newWines.length !== prevLength) {
            this.wines = newWines;
            return OK;
        }

        return NOT_FOUND;
    }
}
