import React, { useEffect, useState } from 'react';
import socket from '../socket'; // Import the singleton socket

function GameBoard({players,setPlayers, lobbyId, playerName }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Joining lobby....");
    
    console.log("test")
   
    
    socket.off('updateLobby'); 
    socket.on('updateLobby', handleUpdateLobby); 

    console.log("test2")
    return () => {
      socket.off('updateLobby', handleUpdateLobby); 
      socket.emit('leaveLobby', { lobbyId, playerId: socket.id }); 
    };
  }, [lobbyId, playerName]); // Re-run when lobbyId or playerName changes

  const handleUpdateLobby = (players) => {
    console.log("test")
    setPlayers(players);
    console.log('Players updated:', players);
  };

  return (
    <div>
      <h3>lobby code is : {lobbyId}</h3>
      <h1>Game Board</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Players in this lobby:</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default GameBoard;