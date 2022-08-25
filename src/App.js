import React, { useState} from 'react';

import { Accueil } from './Accueil';
import { Header } from './Header';
import { Game } from './components/Game';
import { Footer } from './Footer';

import './css/style.css'
 
const App = () =>  {

  const [appState, setAppState] = useState('Bienvenue');

  const startGame = () => {
    setAppState('play');
  }

  return (
      <React.Fragment>
        <Header />
        {appState === 'play' ? <Game /> : <Accueil startGame={startGame} />}
        <Footer />
      </React.Fragment>
  );
}

export default App;
