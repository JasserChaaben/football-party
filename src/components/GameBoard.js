import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Dice from './Dice';

const socket = io('http://localhost:3001'); // Replace with your backend URL

function GameBoard({ lobbyId, playerName }) {
  const [players, setPlayers] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({}); // Track positions

  useEffect(() => {
    socket.emit('joinGame', { lobbyId, playerName });

    socket.on('updateLobby', (players) => {
      setPlayers(players);
      console.log("players");
    });

    socket.on('updateGameState', (state) => {
      setPlayerPosition(state);
    });

    return () => socket.disconnect();
  }, [lobbyId, playerName]);

  const rollDice = () => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    socket.emit('playerMove', { lobbyId, playerName, diceRoll });
  };

  return (
    <div>
      <h1>Game Board</h1>
      <p>Players in this lobby:</p>
      <ul>
        {players.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <Dice rollDice={rollDice} />
    </div>
  );
}

export default GameBoard;
