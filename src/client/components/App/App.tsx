import { Wine, Winery } from 'common/types';
import React, { useState } from 'react';

export default function App() {
    const [wines, setWines] = useState<Wine[]>([]);

    function addWine() {
        const nextNum = wines.length;
        const newWines = wines.concat([
            new Wine('Wine ' + nextNum, nextNum.toString(), {} as Winery),
        ]);
        setWines(newWines);
    }

    function removeWine(wine: Wine) {
        const newWines = wines.filter((w) => w.id !== wine.id);
        setWines(newWines);
    }

    return (
        <>
            <button onClick={addWine}>ADD WINE</button>
            {wines.map((wine) => (
                <div key={Math.random()} style={{ display: 'flex' }}>
                    <span>{wine.name}</span>
                    <button onClick={() => removeWine(wine)}>X</button>
                </div>
            ))}
        </>
    );
}
