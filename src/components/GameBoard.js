import React, { useEffect, useState } from 'react';
import socket from '../socket'; 

function GameBoard({players,setPlayers, lobbyId, playerName }) {
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  useEffect(() => {
    console.log("Joining lobby....");
    socket.emit('checkOwner',{lobbyId},({owner})=>{setOwner(owner);console.log("testing owner" + owner)})
    socket.emit('gameStarted',{lobbyId},({started})=>{setGameStarted(started);console.log("testing game if started : " + started)})
   
    socket.off('updateLobby'); 
    socket.on('updateLobby', handleUpdateLobby); 

    console.log("test2")
    return () => {
      socket.off('updateLobby', handleUpdateLobby); 
      socket.emit('leaveLobby', { lobbyId, playerId: socket.id }); 
    };
  }, [lobbyId, playerName]); 

  const handleUpdateLobby = (players) => {
    console.log("test")
    setPlayers(players);
    socket.emit('checkOwner',{lobbyId},({owner})=>{setOwner(owner);console.log("testing owner : " + owner)})
    socket.emit('gameStarted',{lobbyId},({started})=>{setGameStarted(started);console.log("testing game if started : " + started)})
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
          <li key={player.id}>{player.playerInfo.name} {playerName==player.playerInfo.name&&"(you)"}</li>
        ))}
      </ul>
      
     {owner&& !gameStarted&&<input
  type="button"
  value="Start Game"
  onClick={() => {
    socket.emit('startGame', { lobbyId}, ({ result }) => {
    });
  }}
/>}
    </div>
  );
}

export default GameBoard;