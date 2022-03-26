import { SocketWineGetAllResponse } from './../../../dist/shared/socket.d';
import {
    SocketWine,
    SocketWineRequest,
    SocketWineResponse,
} from 'common/socket';
import { WinesService } from '../services/wines/wines.service';
import { Socket } from 'socket.io-client';
import { Server } from 'socket.io';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Wine, Winery } from 'common/types';

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: Server | undefined;

    constructor(private readonly winesService: WinesService) {}

    @SubscribeMessage('events')
    public handleEvent(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { [key: string]: string }
    ): { [key: string]: string } {
        console.log(data);
        client.emit('events', 'RECEIVED: ' + JSON.stringify(data));
        return data;
    }

    @SubscribeMessage('wines')
    public handleWineAction(
        @MessageBody() data: SocketWineRequest
    ): WsResponse<SocketWineResponse> {
        console.log(data);
        switch (data.request) {
            case SocketWine.GetAll:
                return this.getAllWinesEvent();

            case SocketWine.Add:
                const { name } = data.data;
                const wine = new Wine(
                    name,
                    Math.random().toString(),
                    {} as Winery
                );
                this.winesService.addWine(wine);
                return this.getAllWinesEvent();

            case SocketWine.Delete:
                const wineId = data.data;
                this.winesService.deleteWine(wineId);
                return this.getAllWinesEvent();
        }
    }

    private getAllWinesEvent(): WsResponse<SocketWineGetAllResponse> {
        return {
            event: 'wines',
            data: {
                type: SocketWine.GetAll,
                data: this.winesService.getAllWines(),
            },
        };
    }
}
