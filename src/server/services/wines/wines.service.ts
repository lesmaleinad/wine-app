import { Id, Wine } from 'common/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WinesService {
    private wines: Wine[] = [];

    public getAllWines(): Wine[] {
        return this.wines;
    }

    public getWineById(id: Id<Wine>): Wine | undefined {
        return this.wines.find((wine) => wine.id === id);
    }

    public addWine(newWine: Wine): Wine {
        this.wines.push(newWine);
        return newWine;
    }

    public deleteWine(id: Id<Wine>): boolean {
        const prevLength = this.wines.length;
        const newWines = this.wines.filter((wine) => wine.id !== id);
        if (newWines.length === prevLength - 1) {
            this.wines = newWines;
            return true;
        } else {
            console.error('Attempted to delete wine with id: ' + id);
            return false;
        }
    }
}
