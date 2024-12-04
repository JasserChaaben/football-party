import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import Lobby from './components/Lobby';

function App() {
  const [lobbyId, setLobbyId] = useState(null);
  const [playerName, setPlayerName] = useState("");

  return (
    <div>
      {!lobbyId ? (
        <Lobby setLobbyId={setLobbyId} setPlayerName={setPlayerName}  />
      ) : (
        <GameBoard lobbyId={lobbyId} playerName={playerName} />
      )}
    </div>
  );
}

export default App;
