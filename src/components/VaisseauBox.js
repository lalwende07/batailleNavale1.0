import React from "react";

export const VaisseauBox = ({shipName, selectShip, availableShips, isActuelEmplacement}) => {
    
    //Trouver le bateau à partir des bateaux provenant de utils/AVAILABLE_SHIPS
    let ship = availableShips.find((item) => item.name === shipName);
    //console.log("je suis ship", ship);

    //fill method renvoit les elements du tableau modifié
    let shipLength = new Array(ship.length).fill('ship');
    //console.log("je suis shipLength", shipLength)

    //Permet d'obtenir les divs correspondantes à la taille du vaisseau
    let allVaisseauSquares = shipLength.map((item, index) => (
        <div className="small-square" key={index} /> 
    ));

    return(
        <div
            id={`${shipName}-vaisseau`}
            onClick={() => selectShip(shipName)}
            key={`${shipName}`}
            className={isActuelEmplacement ? 'vaisseau emplacement' : 'vaisseau'}
        >
            <div className="vaisseau-titre">{shipName}</div>
            <div className="vaisseau-squares">{allVaisseauSquares}</div>

        </div>
    );
};


