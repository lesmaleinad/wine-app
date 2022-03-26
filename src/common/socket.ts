import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Wine, WinePostBody, Id } from './types';

export enum SocketWine {
    GetAll = 'GET_ALL',
    Add = 'ADD',
    Delete = 'DELETE',
}

/**
 * REQUESTS
 */

export const SOCKET_GET_ALL_REQUEST = {
    request: SocketWine.GetAll,
} as const;

export interface SocketWineAddRequest {
    request: SocketWine.Add;
    data: WinePostBody;
}

export interface SocketWineDeleteRequest {
    request: SocketWine.Delete;
    data: Id<Wine>;
}

export type SocketWineRequest =
    | typeof SOCKET_GET_ALL_REQUEST
    | SocketWineAddRequest
    | SocketWineDeleteRequest;

/**
 * RESPONSES
 */

export interface SocketWineGetAllResponse {
    type: SocketWine.GetAll;
    data: Wine[];
}

export type SocketWineResponse = SocketWineGetAllResponse;
