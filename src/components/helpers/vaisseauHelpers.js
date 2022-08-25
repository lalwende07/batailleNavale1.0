import React from 'react';
import { VaisseauBox } from './VaiseauBox';

export const getVaisseau = (availableShips, shipName, selectShip) => {
    let ship = availableShips.find((item) => item.name === shipName);

    let shipLength = new Array(ship.length).fill('ship');

    let allVaisseauSquares = shipLength.map((item, index) => {
        <div className="small-square" key={index} />
    });

    return (
        <VaisseauBox
            key={shipName}
            selectShip={selectShip}
            shipName={shipName}
            squares={allVaisseauSquares}
        />
    );
};