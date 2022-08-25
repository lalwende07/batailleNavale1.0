export const BOARD_ROWS = 10;
export const BOARD_COLUMNS = 10;
export const BOARD = BOARD_COLUMNS * BOARD_ROWS;

export const SQUARE_STATE = {
    empty: 'empty',
    ship: 'ship',
    hit: 'hit',
    miss: 'miss',
    ship_sunk: 'ship-sunk',
    forbidden: 'forbidden',
    awaiting: 'awaiting',
};

//initialisation des états de chaque case
export const stateToClass = {
    [SQUARE_STATE.empty]: 'empty',
    [SQUARE_STATE.miss]: 'miss',
    [SQUARE_STATE.hit]: 'hit',
    [SQUARE_STATE.ship]: 'ship',
    [SQUARE_STATE.ship_sunk]: 'ship-sunk',
    [SQUARE_STATE.forbidden]: 'forbidden',
    [SQUARE_STATE.awaiting]: 'awaiting',
};

//Generation du layout vide -> affectation de l'etat "empty" sur chaque case
export const generateEmptyLayout = () => {
    return new Array(BOARD_ROWS * BOARD_COLUMNS).fill(SQUARE_STATE.empty);
};

//coordonnées à partir de l'index -> aide stackoverflow
export const coordinatesToIndex = (coordinates) => {
    const { x, y } = coordinates;
    return y * BOARD_ROWS + x;
};

//Index à partir des coordonnées -> aide stackoverflow
export const indexToCoordinates = (index) => {
    return {
        x: index % BOARD_ROWS,
        y: Math.floor(index / BOARD_ROWS),
    };
};

//selection du vaisseau sur lequel on a cliqué
export const elementSelected = (entity) => {

    //obtenir les coordonnées à partir de l'index de l'entité(vaisseau correspondant) - utilise la function coordinatesToIndex
    let position = coordinatesToIndex(entity.position);

    //initialiser le tableau selected
    let selected = [];
    for (let i = 0; i < entity.length; i++) {
        selected.push(position);
        position = entity.orientation === 'vertical' ? position + BOARD_ROWS : position + 1;
    }
    return selected;
};

//a revoir debug sur elementSelected et elementSelectedAlternativ -> stackoverflow
export const elementSelectedAlternativ = (entity) => {
    let selected = [];
    for (let i = 0; i < entity.length; i++) {
        const position = entity.orientation === 'vertical'
        ? coordinatesToIndex({ y: entity.position.y + i, x: entity.position.x }) 
        : coordinatesToIndex({ y: entity.position.y, x: entity.position.x + i });
        selected.push(position);
    }
    return selected;
};

//vérifie si le vaisseau est sur le board - ou plutot si il n'est pas en dehors du board
export const isInBoard = (entity) => {
    return (
        (entity.orientation === 'vertical' && entity.position.y + entity.length <= BOARD_ROWS) 
        || 
        (entity.orientation === 'horizontal' && entity.position.x + entity.length <= BOARD_COLUMNS)
    );
};

//ajouter l'entity(vaisseau) dans le layout
export const addEntityInLayout = (oldLayout, entity, type) => {
    //replication du layout
    let newLayout = oldLayout.slice();

    //gestion case bateau
    if (type === 'ship') {
            elementSelected(entity).forEach((index) => {
            newLayout[index] = SQUARE_STATE.ship;
        });
    }
    //gestion case interdite
    if (type === 'forbidden') {
            elementSelected(entity).forEach((index) => {
            newLayout[index] = SQUARE_STATE.forbidden;
        });
    }
    //gestion du newLayout avec l'etat hit
    if (type === 'hit') {
        newLayout[coordinatesToIndex(entity.position)] = SQUARE_STATE.hit;
    }
    //avec l'etat miss - manquer
    if (type === 'miss') {
        newLayout[coordinatesToIndex(entity.position)] = SQUARE_STATE.miss;
    }
    //avec l'etat bateau coulé
    if (type === 'ship-sunk') {
        elementSelected(entity).forEach((index) => {
          newLayout[index] = SQUARE_STATE.ship_sunk;
        });
    }
    
    return newLayout;
}

//la place est disponible
export const isPlaceFree = (entity, layout) => {
    let shipSelected = elementSelectedAlternativ(entity);
  
    return shipSelected.every((index) => layout[index] === SQUARE_STATE.empty);
};

//calcule si en dehors de la map
export const calculateOverBoard= (entity) =>
    Math.max(
        entity.orientation === 'vertical' ? entity.position.y + entity.length - BOARD_ROWS : entity.position.x + entity.length - BOARD_COLUMNS,
        0
    );

//methode pour check si vaisseau peut être placer
export const canBePlaced = (entity, layout) => isInBoard(entity) && isPlaceFree(entity, layout);

//place tous les vaisseaux du computer -> a vérifier
export const placeAllComputerShips = (computerShips) => {

    let computerLayout = generateEmptyLayout();
  
    return computerShips.map((ship) => {
        while (true) {
            let decoratedShip = randomizeShipProps(ship);

            if (canBePlaced(decoratedShip, computerLayout)) {
                computerLayout = addEntityInLayout(computerLayout, decoratedShip, SQUARE_STATE.ship);
                return { ...decoratedShip, placed: true };
            }
        }
    });
};

//genere un random orientation
export const generateRandomOrientation = () => {

    let randomNumber = Math.floor(Math.random() * Math.floor(2));
    return randomNumber === 1 ? 'vertical' : 'horizontal';
};
 
//genere un random index
export const generateRandomIndex = (value = BOARD) => {
    return Math.floor(Math.random() * Math.floor(value));
};
 
//genere un random des props d'un ship pour notre computer -> demarre IA
export const randomizeShipProps = (ship) => {

    let randomStartIndex = generateRandomIndex();
    console.log("je suis le randomStartIndex" + randomStartIndex)

    return {
        ...ship,
        position: indexToCoordinates(randomStartIndex),
        orientation: generateRandomOrientation(),
    };
};

// Place the computer ship in the layout
export const placeComputerShipInLayout = (ship, computerLayout) => {

    let newComputerLayout = computerLayout.slice();
    //console.log("je suis le newComputerLayout avec slice" , newComputerLayout)
  
    elementSelectedAlternativ(ship).forEach((index) => {
        newComputerLayout[index] = SQUARE_STATE.ship;
    });

    console.log("je suis le newComputerLayout" , newComputerLayout)

    return newComputerLayout;
};

//On construit la matrice des voisins de la case qui a été hit par le computer - afin de le rendre pas trop idiot. IA minimum
export const getNeighborsSquare = (coordinates) => {
    let firstRow = coordinates.y === 0;
    let lastRow = coordinates.y === 9;
    let firstColumn = coordinates.x === 0;
    let lastColumn = coordinates.x === 9;

    let neighborsSquare = [];

    //traitement de la 1ere ligne
    if (firstRow) {
        neighborsSquare.push(
            { x: coordinates.x + 1, y: coordinates.y },
            { x: coordinates.x - 1, y: coordinates.y },
            { x: coordinates.x, y: coordinates.y + 1 }
        );
    };

    //traitement de la derniere ligne
    if (lastRow) {
        neighborsSquare.push(
            { x: coordinates.x + 1, y: coordinates.y },
            { x: coordinates.x - 1, y: coordinates.y },
            { x: coordinates.x, y: coordinates.y - 1 }
        );
    };

    //traitement de la 1ere colonne
    if (firstColumn) {
        neighborsSquare.push(
        { x: coordinates.x + 1, y: coordinates.y },
        { x: coordinates.x, y: coordinates.y + 1 }, 
        { x: coordinates.x, y: coordinates.y - 1 } 
        );
    };

    //traitement de la dernière colonne
    if (lastColumn) {
        neighborsSquare.push(
        { x: coordinates.x - 1, y: coordinates.y }, 
        { x: coordinates.x, y: coordinates.y + 1 }, 
        { x: coordinates.x, y: coordinates.y - 1 } 
        );
    };

    //generation de la matrice complete des voisins de notre case qui a été touché
    if (!lastColumn || !firstColumn || !lastRow || !firstRow) {
        neighborsSquare.push(
        { x: coordinates.x - 1, y: coordinates.y }, 
        { x: coordinates.x + 1, y: coordinates.y }, 
        { x: coordinates.x, y: coordinates.y - 1 }, 
        { x: coordinates.x, y: coordinates.y + 1 } 
        );
    };

    console.log("je suis neighborsSquare final", neighborsSquare)

    let filteredResult = [
        ...new Set(
        neighborsSquare
            .map((coordinates) => coordinatesToIndex(coordinates))
            .filter((number) => number >= 0 && number < BOARD)
        ),
    ];

    return filteredResult;
};

//Mise à jour des bateaux coulés sur le board
export const updateSunkShips = (currentHits, opponentShips) => {

    let playerHitElements = currentHits.map((hit) => coordinatesToIndex(hit.position));
    console.log("playerHitElements: ", playerHitElements)

    let indexWasHit = (index) => playerHitElements.includes(index);

    let shipsWithSunkFlag = opponentShips.map((ship) => {
        let shipElements = elementSelectedAlternativ(ship);
        console.log("shipElements", shipElements)

        if (shipElements.every((index) => indexWasHit(index))) {
            return { ...ship, sunk: true };
        } else {
            return { ...ship, sunk: false };
        }
    });

    return shipsWithSunkFlag;
};


  
