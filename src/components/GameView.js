import React from 'react';

import { PlayerFlotte } from './PlayerFlotte';
import { PlayerBoard } from './PlayerBoard';
import { ComputerBoard } from './ComputerBoard';
import { PlayerInfo } from './PlayerInfo'; 

export const GameView = ({
    availableShips,
    selectShip,
    actuelEmplacement,
    setActuelEmplacement,
    rotateShip,
    placeShip,
    placedShips,
    startTurn,
    computerShips,
    gameState,
    changeTurn,
    hitComputer,
    hitsByPlayer,
    setHitsByPlayer,
    hitsByComputer,
    handleComputerTurn,
    checkIfGameOver,
    winner,
    startAgain,
    setComputerShips,
}) => {
    return (
        <section id="game-screen">
            {gameState !== 'placement' ? (
                <PlayerInfo 
                    gameState={gameState}
                    hitsByPlayer={hitsByPlayer}
                    hitsByComputer={hitsByComputer}
                    winner={winner}
                    startAgain={startAgain}
                />
            ) : (
                <PlayerFlotte 
                    availableShips={availableShips}
                    selectShip={selectShip}
                    actuelEmplacement={actuelEmplacement}
                    startTurn={startTurn}
                    startAgain={startAgain}
                />    
            )}        
            <PlayerBoard 
                actuelEmplacement={actuelEmplacement}
                setActuelEmplacement={setActuelEmplacement}
                rotateShip={rotateShip}
                placeShip={placeShip}
                placedShips={placedShips}
                hitsByComputer={hitsByComputer}
            />
            <ComputerBoard 
                computerShips={computerShips}
                changeTurn={changeTurn}
                gameState={gameState}
                hitComputer={hitComputer}
                hitsByPlayer={hitsByPlayer}
                setHitsByPlayer={setHitsByPlayer}
                handleComputerTurn={handleComputerTurn}
                checkIfGameOver={checkIfGameOver}
                setComputerShips={setComputerShips}
            />
        </section>
    )
}