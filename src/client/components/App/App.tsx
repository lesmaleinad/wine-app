import { plainToInstance } from 'class-transformer';
import { Id, Wine } from 'common/types';
import { SocketWine, SocketWineResponse } from 'common/socket';
import { io } from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { ClientSocket } from '../../types/socket';

const initialWines = fetch('/wines').then(async (response) => {
    const wines = await response.json();
    console.log(wines);
    return plainToInstance(Wine, wines);
});

export default function App() {
    const [socket, setSocket] = useState<ClientSocket>();
    const [wines, setWines] = useState<Wine[]>([]);

    useEffect(() => {
        initialWines.then(setWines);
    }, []);

    useEffect(() => {
        const ws: ClientSocket = io(window.location.toString());
        ws.on('connect', () => {
            console.log('WS connected');
            setSocket(ws);
        });
        ws.on('disconnect', () => {
            console.log('WS disconnected');
            setSocket(undefined);
        });

        ws.on('wines', ({ type, data }) => {
            switch (type) {
                case SocketWine.GetAll:
                    setWines(plainToInstance(Wine, data));
            }
        });

        return () => {
            ws.disconnect();
        };
    }, []);

    function addWine() {
        const name = 'Wine ' + (wines.length + 1);
        if (socket) {
            socket.emit('wines', {
                request: SocketWine.Add,
                data: Wine.postBody(name),
            });
        }
    }

    function removeWineById(wineId: Id<Wine>) {
        if (socket) {
            socket.emit('wines', {
                request: SocketWine.Delete,
                data: wineId,
            });
        }
    }

    return (
        <>
            <button onClick={addWine}>ADD WINE</button>
            {wines.map((wine) => (
                <div key={wine.id} style={{ display: 'flex' }}>
                    <span>{wine.label}</span>
                    <button onClick={() => removeWineById(wine.id)}>X</button>
                </div>
            ))}
        </>
    );
}
