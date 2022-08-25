import React, { useState } from 'react';

import  { AVAILABLE_SHIPS } from '../utils/AVAILABLE_SHIPS';
import {GameView} from './GameView';

import {
    placeAllComputerShips,
    SQUARE_STATE,
    indexToCoordinates,
    addEntityInLayout,
    generateEmptyLayout,
    generateRandomIndex,
    getNeighborsSquare,
    updateSunkShips,
    coordinatesToIndex,

} from './helpers/layoutHelpers';

export const Game = () => {
    const [gameState, setGameState] = useState('placement');
    const [winner, setWinner] = useState(null);
    const [actuelEmplacement, setActuelEmplacement] = useState(null);
    const [placedShips, setPlacedShips] = useState([]);
    const [availableShips, setAvailableShips] = useState(AVAILABLE_SHIPS);
    const [computerShips, setComputerShips] = useState([]);
    const [hitsByPlayer, setHitsByPlayer] = useState([]);
    const [hitsByComputer, setHitsByComputer] = useState([]);

    //Joueur
    //selection du bateau
    const selectShip = (shipName) => {
        let shipIndex = availableShips.findIndex((ship) => ship.name === shipName);
        const shipToPlace = availableShips[shipIndex];

        setActuelEmplacement({
            ...shipToPlace,
            orientation: 'horizontal',
            position: null,
        });
    };

    //emplacement du bateau
    const placeShip = (actuelEmplacement) => {
        setPlacedShips([
            ...placedShips,
            {
                ...actuelEmplacement,
                placed: true,
            },
        ]);

        setAvailableShips((previousShips) => previousShips.filter((ship) => ship.name !== actuelEmplacement.name));
        setActuelEmplacement(null);
    }

    //rotation des vaisseaux
    const rotateShip = (event) => {
        if (actuelEmplacement != null && event.button === 2) {
            setActuelEmplacement({
                ...actuelEmplacement,
                orientation:
                    actuelEmplacement.orientation === 'vertical' ? 'horizontal' : 'vertical',
            });
        }
    };

    //demarrage du tour par tour
    const startTurn = () => {
        generateComputerShips();
        setGameState('player-turn')
    };

    //changement des tours
    const changeTurn = () => {
        setGameState((oldGameState) => oldGameState === 'player-turn' ? 'computer-turn' : 'player-turn');
    };

    //Traitement du computer
    const generateComputerShips = () => {
        let placedComputerShips = placeAllComputerShips(AVAILABLE_SHIPS.slice());
        //console.log("placedComputerShips" , placedComputerShips)
        setComputerShips(placedComputerShips);
    };
    
    //traitement des tires du computer
    const computerFire = (index, layout) => {
        let computerHits;

        if(layout[index] === 'ship') {
            computerHits = [
                ...hitsByComputer,
                {
                    position: indexToCoordinates(index),
                    //tire reussi
                    type: SQUARE_STATE.hit,
                },
            ];
        }
        if (layout[index] === 'empty') {
            computerHits = [
                ...hitsByComputer,
                {
                    position: indexToCoordinates(index),
                    //tire manquer
                    type: SQUARE_STATE.miss,
                },
            ];
        }
        
        //Gestion des bateaux coulés
        const sunkShips = updateSunkShips(computerHits, placedShips);

        //Recup des bateaux coulés
        const sunkShipsAfter = sunkShips.filter((ship) => ship.sunk).length;
        const sunkShipsBefore = placedShips.filter((ship) => ship.sunk).length;

        if (sunkShipsAfter > sunkShipsBefore) {
        console.log("bateau coulé")
        }
        
        setPlacedShips(sunkShips);
        setHitsByComputer(computerHits);
    };
    
    const handleComputerTurn = () => {

        changeTurn();

        //contrôle si gameOver
        if (checkIfGameOver()) {
            return;
        }

        //placement sur le layout
        let layout = placedShips.reduce(
            (prevLayout, currentShip) => addEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship), generateEmptyLayout()
        );
        
        //toucher par le computer
        layout = hitsByComputer.reduce(
            (prevLayout, currentHit) => addEntityInLayout(prevLayout, currentHit, currentHit.type), layout
        );
        
        //gestion des ship coulés
        layout = placedShips.reduce(
            (prevLayout, currentShip) => currentShip.sunk ? addEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk) : prevLayout,layout
        );
        
        //initialisation des frappes reussi du computer
        let successAllComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit');
        
        //initialisation des bateaux encore disponible
        let livingSunkComputerHits = successAllComputerHits.filter((hit) => {

            const hitIndex = coordinatesToIndex(hit.position);
            return layout[hitIndex] === 'hit';
        });

        //creation de notre système de target - utilisation de flatMap qui est un condensé plus efficace que flat et map -> on utilise la fonction getNeighbors pour taper sur les voisins
        let simuTargets = livingSunkComputerHits.flatMap((hit) => getNeighborsSquare(hit.position)).filter((index) => layout[index] === 'empty' || layout[index] === 'ship');

        //
        if (simuTargets.length === 0) {
            let layoutIndices = layout.map((item, index) => index);
                simuTargets = layoutIndices.filter(
                (index) => layout[index] === 'ship' || layout[index] === 'empty'
            );
        }

        //generation d'un randomIndex
        let randomIndex = generateRandomIndex(simuTargets.length);

        //lancement d'un missile avec le randomIndex
        let target = simuTargets[randomIndex];

        setTimeout(() => {
            computerFire(target, layout);
            changeTurn();
        }, 300);
    };

    // *** FIN DU JEU ***

    //contrôle si fin du jeu
    const checkIfGameOver = () => {

        let successAllPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
        let successAllComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;
    
        if (successAllComputerHits === 17 || successAllPlayerHits === 17) {
            setGameState('game-over');
    
            if (successAllComputerHits === 17) {
                setWinner('computer');
            }
            if (successAllPlayerHits === 17) {
                setWinner('player');
            }
            return true;
        }
        return false;
    };
    
    //prepa start game et tour par tour
    const startAgain = () => {
        setGameState('placement');
        setWinner(null);
        setActuelEmplacement(null);
        setPlacedShips([]);
        setAvailableShips(AVAILABLE_SHIPS);
        setComputerShips([]);
        setHitsByPlayer([]);
        setHitsByComputer([]);
    };

    return (
        <React.Fragment>
            <GameView
                availableShips={availableShips}
                selectShip={selectShip}
                actuelEmplacement={actuelEmplacement}
                setActuelEmplacement={setActuelEmplacement}
                rotateShip={rotateShip}
                placeShip={placeShip}
                placedShips={placedShips}
                startTurn={startTurn}
                computerShips={computerShips}
                gameState={gameState}
                changeTurn={changeTurn}
                hitsByPlayer={hitsByPlayer}
                setHitsByPlayer={setHitsByPlayer}
                hitsByComputer={hitsByComputer}
                setHitsByComputer={setHitsByComputer}
                handleComputerTurn={handleComputerTurn}
                checkIfGameOver={checkIfGameOver}
                startAgain={startAgain}
                winner={winner}
                setComputerShips={setComputerShips}
            />
        </React.Fragment>
    )
}
