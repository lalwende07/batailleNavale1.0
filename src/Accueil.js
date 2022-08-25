import React from 'react';

export const Accueil = ({ startGame }) => {
  return (
    <main>
      <h2 className="title">Présentation</h2>
      <p className="game-info">
        Nostalgique de la bataille navale - Bienvenue
      </p>
      <h2 className="tip-box-title">test</h2>
      <p className="player-info">
          

      </p>

      <button onClick={startGame}>Play</button>
    </main>
  );
};