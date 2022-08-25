import React from 'react';

import {
    stateToClass, 
    generateEmptyLayout,
    addEntityInLayout,
    SQUARE_STATE,
    indexToCoordinates,
    updateSunkShips,

} from './helpers/layoutHelpers';

export const ComputerBoard = ({ 
    computerShips,
    gameState,
    hitsByPlayer,
    setHitsByPlayer,
    handleComputerTurn,
    checkIfGameOver,
    setComputerShips,
    
 }) => {

    let computerLayout = computerShips.reduce(
        (prevLayout, currentShip) => addEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
        generateEmptyLayout()
    );
    console.log("computerLayout0:", computerLayout)

    computerLayout = hitsByPlayer.reduce(
        (prevLayout, currentHit) => addEntityInLayout(prevLayout, currentHit, currentHit.type),
        computerLayout
    );
    console.log("computerLayout1:", computerLayout)

    computerLayout = computerShips.reduce(
        (prevLayout, currentShip) => currentShip.sunk ? addEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk) : prevLayout,
        computerLayout
    );
    console.log("computerLayout2:", computerLayout)

    //système de tire - gestion state setHitsByPlayer
    const fireMissile = (index) => {
        if (computerLayout[index] === 'ship') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoordinates(index),
                    type: SQUARE_STATE.hit,
                }
            ];

            setHitsByPlayer(newHits);
            return newHits;
        };
        if (computerLayout[index] === 'empty') {
            const newHits = [
                ...hitsByPlayer,
                {
                    position: indexToCoordinates(index),
                    type: SQUARE_STATE.miss,
                }
            ];
            setHitsByPlayer(newHits);
            return newHits;
        }
    };

    //affectation de l'etat gameState pour le player
    const playerTurn = gameState === 'player-turn';

    //Lancement du mode tire pour le joueur si il est player-turn
    const playerCanFire = playerTurn && !checkIfGameOver();

    // Affectation de l'index computerLayout
    let alreadyLaunch = (index) => computerLayout[index] === 'hit' || computerLayout[index] === 'miss' || computerLayout[index] === 'ship-sunk';

    let computerSquares = computerLayout.map((square, index) => {
        return (
            <div
                className={
                    stateToClass[square] === 'hit' ||
                    stateToClass[square] === 'miss' ||
                    stateToClass[square] === 'ship-sunk' ? `square ${stateToClass[square]}` : `square`
                }

                key={`computer-square-${index}`}
                id={`computer-square-${index}`}

                onClick={() => {

                    if (playerCanFire && !alreadyLaunch(index)) {
                        console.log('playeFire');

                        const newHits = fireMissile(index);
                        console.log("newHits" + newHits);

                        const shipsWithSunkFlag = updateSunkShips(newHits, computerShips);
                        console.log("shipsWithSunkFlag" + shipsWithSunkFlag);

                        const sunkShipsAfter = shipsWithSunkFlag.filter((ship) => ship.sunk).length;
                        
                        const sunkShipsBefore = computerShips.filter((ship) => ship.sunk).length;
                        
                        if (sunkShipsAfter > sunkShipsBefore) {
                        console.log('vaisseau coulé ');
                        }
                        setComputerShips(shipsWithSunkFlag);
                        handleComputerTurn();
                    }
                }}
            />
        );
    })
    
    return(
        <div>
            <h2 className="player-title">Computer</h2>
            <div className="board">{computerSquares}</div>
        </div>
    )

};

