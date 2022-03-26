import { plainToInstance } from 'class-transformer';
import { Id, Wine } from 'common/types';
import React, { useEffect, useState } from 'react';

const initialWines = fetch('/wines').then(async (response) => {
    const wines = await response.json();
    console.log(wines);
    return plainToInstance(Wine, wines);
});

export default function App() {
    const [wines, setWines] = useState<Wine[]>([]);

    useEffect(() => {
        initialWines.then(setWines);
    }, []);

    async function addWine() {
        const name = 'Wine ' + (wines.length + 1);
        const response = await fetch('/wines', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(Wine.postBody(name)),
        });
        if (response.ok) {
            const newWine = plainToInstance(Wine, await response.json());
            const newWines = wines.concat(newWine);
            setWines(newWines);
        }
    }

    async function removeWineById(wineId: Id<Wine>) {
        const response = await fetch('/wines/' + wineId, {
            method: 'DELETE',
        });
        if (response.ok) {
            const newWines = wines.filter((wine) => wine.id !== wineId);
            setWines(newWines);
        } else {
            throw new Error('NO WINE WAS FOUND WITH ID: ' + wineId);
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
