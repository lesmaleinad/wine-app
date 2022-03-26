import { SocketWineRequest, SocketWineResponse } from 'common/socket';
import { Socket } from 'socket.io-client';

export type ClientSocket = Socket<
    { 'wines': (res: SocketWineResponse) => void },
    { 'wines': (req: SocketWineRequest) => void }
>;
