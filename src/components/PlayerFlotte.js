import React from 'react';
import { VaisseauBox } from './VaisseauBox';

export const PlayerFlotte = ({
    availableShips,
    selectShip,
    actuelEmplacement,
    startTurn,
    startAgain,
}) => {

    let shipsLeft = availableShips.map((ship) => ship.name);

    //Pour chaque vaisseau encore dispo - obtenir la box avec le nom du vaiseau et les cases correspondantes à sa longueur
    let shipVaisseauBoxes = shipsLeft.map((shipName) => (
        <VaisseauBox 
            selectShip={selectShip}
            key={shipName}
            isActuelEmplacement={actuelEmplacement && actuelEmplacement.name === shipName}
            shipName={shipName}
            availableShips={availableShips}
        /> 
    ));

    let flotte = (
        <div id="vaisseau-flotte">
            {shipVaisseauBoxes}
            <p className="player-info">Click droit pour changer la rotation du bateau selectionné</p>
            <p className="restart" onClick={startAgain}>Restart</p>
        </div>
    );

    let playButton = (
        <div id="play-ready">
            <p className="player-info">Bateaux en formation de combat - en attente d'instruction.</p>
            <button id="play-button" onClick={startTurn}>Start Game</button>
        </div>
    );

    return (
        <div id="available-ships">
            <div className="tip-box-title">Vos vaisseaux de guerre</div>
            {availableShips.length > 0 ? flotte : playButton}
        </div>
    );
};

