import { SocketWineRequest, SocketWineResponse } from 'common/socket';
import { Server } from 'socket.io';

export type SocketServer = Server<
    { 'wines': (req: SocketWineRequest) => void },
    { 'wines': (res: SocketWineResponse) => void }
>;
