import React from 'react';

export const PlayerInfo = ({
    gameState, 
    hitsByPlayer, 
    hitsByComputer, 
    startAgain, 
    winner,
}) => {

    let numberOfHits = hitsByPlayer.length;
    let numberOfSuccess = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
    let score = Math.round(100 * (numberOfSuccess / numberOfHits));
    let successComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit').length;

    let gameOverPanel = (
        <div>
            <div className="tip-box-title">Game Over!</div>
            <p className="player-info">
                {winner === 'player' ? 'You win!' : 'You lose.'}
            </p>
            <p className="restart" onClick={startAgain}>
                Play again?
            </p>
        </div>
    );

    let InfoPanel = (
        <div>
            <div className="tip-box-title">Statistiques</div>
            <div id="firing-info">
                <ul>
                    <li>{numberOfSuccess} tires réussis</li>
                    <li>{score > 0 ? `${score}%` : `0%`} precision </li>
                </ul>
                <p className="player-info">Le premier qui coule 5 navires à gagner.</p>
                <p className="restart" onClick="{startAgain}">Restart</p>
            </div>
        </div>
    );

    return (
        <div id="player-info">
            {numberOfSuccess === 17 || successComputerHits === 17 ? gameOverPanel : InfoPanel}
        </div>
    );

}