import React from 'react'; 

import {
    SQUARE_STATE,
    stateToClass, 
    generateEmptyLayout,
    addEntityInLayout,
    indexToCoordinates,
    calculateOverBoard,
    canBePlaced,

} from './helpers/layoutHelpers';

export const PlayerBoard = ({ 
  actuelEmplacement, 
  setActuelEmplacement, 
  rotateShip, 
  placeShip, 
  placedShips, 
  hitsByComputer, 
}) => {

    let layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        addEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
        generateEmptyLayout()
    );

    // toucher par le computer
    layout = hitsByComputer.reduce(
      (prevLayout, currentHit) => 
        addEntityInLayout(prevLayout, currentHit, currentHit.type), 
        layout
    );
    
    //contrôle si le bateau est "coulé"
    layout = placedShips.reduce(
      (prevLayout, currentShip) => currentShip.sunk ? addEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk) 
      : prevLayout,
      layout
    )
    
    //contrôle si le vaisseau peut être placer sur le board - pas de depassement possible
    const isPlacingOverBoard = actuelEmplacement && actuelEmplacement.position != null;
    const canPlaceCurrentShip = isPlacingOverBoard && canBePlaced(actuelEmplacement, layout);
  
    if (isPlacingOverBoard) {
      if (canPlaceCurrentShip) {
        layout = addEntityInLayout(layout, actuelEmplacement, SQUARE_STATE.ship);
      } else {
        let forbiddenShip = {
          ...actuelEmplacement,
          length: actuelEmplacement.length - calculateOverBoard(actuelEmplacement),
        };
        layout = addEntityInLayout(layout, forbiddenShip, SQUARE_STATE.forbidden);
      }
    };
    
    let squares = layout.map((square, index) => {
      return (
        <div
          onMouseDown={rotateShip}
          onClick={() => {
            if (canPlaceCurrentShip) {
              console.log('ok vaisseau placé sur le board')
              placeShip(actuelEmplacement);
            }
          }}
          className={`square ${stateToClass[square]}`}
          key={`square-${index}`}
          id={`square-${index}`}
          onMouseOver={() => {
            if (actuelEmplacement) {
              setActuelEmplacement({
                ...actuelEmplacement,
                position: indexToCoordinates(index),
              });
            }
          }}
        />
      );
    });

    return (
        <div>
            <h2 className="player-title">Ready Player One</h2>
            <div className="board">{squares}</div>
        </div>
    );
};