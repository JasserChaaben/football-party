import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import Lobby from './components/Lobby';

function App() {
  const [lobbyId, setLobbyId] = useState(null);
  const [playerName, setPlayerName] = useState("");
  
  const [players, setPlayers] = useState([]);

  return (
    <div>
      {!lobbyId ? (
        <Lobby players={players} setPlayers={setPlayers}  setLobbyId={setLobbyId} setPlayerName={setPlayerName}  />
      ) : (
        <GameBoard players={players} setPlayers={setPlayers} lobbyId={lobbyId} playerName={playerName} />
      )}
    </div>
  );
}

export default App;
