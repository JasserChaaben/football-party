import React, { useState, useEffect } from 'react';
import socket from '../socket'; // Assuming you have your socket.js setup
import './Lobby.css';

function Lobby({ players, setPlayers, setLobbyId, setPlayerName }) {
  const [name, setName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [error, setError] = useState(null);
  const [color, setColor] = useState('Green');

  // Use effect to restore session data if the user has been disconnected and reconnected
  useEffect(() => {
    const userID = localStorage.getItem('userID');
    console.log(userID)
    if (userID) {
      socket.emit('restoreSession', { userID }); 

      socket.on('restoreData', (data) => {
        if (data) {
          const { user, players } = data;
      
          if (user) {
            setName(user.name); 
            setPlayerName(user.name)
            setLobbyId(user.lobbyId);
          }
      
          if (players) {
            setPlayers(players); 
          }
        }
      });
      
    }
  }, []);

  // Create a new lobby
  const createLobby = () => {
    if (!name) {
      setError('Please enter your name.');
      return;
    }

    const playerInfo = {
      name,
      color,
      owner: true,
    };

    socket.emit('createLobby', { playerInfo, isPrivate: true, started: false }, ({ lobbyId, error, players }) => {
      if (error) {
        setError(error);
        return;
      }
      setLobbyId(lobbyId);
      setPlayerName(name);
      setPlayers(players);
      setError(null);

      localStorage.setItem('userID', socket.id);
    });
  };

  // Join an existing lobby
  const joinLobby = () => {
    if (!name || !lobbyCode) {
      setError('Please enter your name and lobby code.');
      return;
    }

    const playerInfo = {
      name,
      color,
      owner: false,
    };

    socket.emit('joinLobby', { playerInfo, lobbyId: lobbyCode }, ({ success, message, players }) => {
      if (success) {
        setLobbyId(lobbyCode);
        setPlayerName(name);
        setPlayers(players);
        setError(null);
      } else {
        setError(message);
      }

      
      localStorage.setItem('userID', socket.id);
    });
  };

  return (
    <div className="Lobby">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select
        className="color-picker"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      >
        <option value="green">Green</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="yellow">Yellow</option>
        <option value="orange">Orange</option>
        <option value="purple">Purple</option>
        <option value="pink">Pink</option>
        <option value="brown">Brown</option>
        <option value="cyan">Cyan</option>
        <option value="lime">Lime</option>
        <option value="teal">Teal</option>
        <option value="magenta">Magenta</option>
        <option value="gray">Gray</option>
        <option value="indigo">Indigo</option>
      </select>
      <button onClick={createLobby}>Create Private Lobby</button>
      <br />
      <input
        type="text"
        placeholder="Enter Lobby Code"
        value={lobbyCode}
        onChange={(e) => setLobbyCode(e.target.value)}
      />
      <button onClick={joinLobby}>Join Private Lobby</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Lobby;
