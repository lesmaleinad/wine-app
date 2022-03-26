import { SocketServer } from '../types/socket';
import {
    SocketWine,
    SocketWineRequest,
    SocketWineResponse,
    SocketWineGetAllResponse,
} from 'common/socket';
import { WinesService } from '../services/wines/wines.service';
import { Socket } from 'socket.io-client';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
    @WebSocketServer()
    server: SocketServer | undefined;

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
    ): WsResponse<SocketWineResponse> | boolean {
        console.log(data);
        switch (data.request) {
            case SocketWine.GetAll:
                return this.getAllWinesEvent();

            case SocketWine.Add:
                const { name } = data.data;
                this.winesService.addWineByName(name);
                return this.emitAllWinesToServer();

            case SocketWine.Delete:
                const wineId = data.data;
                this.winesService.deleteWine(wineId);
                return this.emitAllWinesToServer();
        }
    }

    private getAllWinesEvent(): WsResponse<SocketWineGetAllResponse> & {
        event: 'wines';
    } {
        return {
            event: 'wines',
            data: {
                type: SocketWine.GetAll,
                data: this.winesService.getAllWines(),
            },
        };
    }

    private emitAllWinesToServer(): boolean {
        const event = this.getAllWinesEvent();
        return !!this.server?.sockets.emit(
            event.event,
            this.getAllWinesEvent().data
        );
    }
}
