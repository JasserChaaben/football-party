import React, { useState } from 'react';
import socket from '../socket'; 

function Lobby({players,setPlayers,setLobbyId, setPlayerName }) {
  const [name, setName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [error, setError] = useState(null);

  const createLobby = () => {
    if (!name) {
      setError('Please enter your name.');
      return;
    }
    let playerInfo={
      name:name,
      color:0,
      owner:true
    }
    socket.emit('createLobby', { playerInfo, isPrivate: true ,started:false}, ({ lobbyId, error, players }) => {
      if (error) {
        setError(error);
        return;
      }
      setLobbyId(lobbyId);
      setPlayerName(name);
      setPlayers(players); 
      setError(null);
    });
  };
  
  const joinLobby = () => {
    if (!name || !lobbyCode) {
      setError('Please enter your name and lobby code.');
      return;
    }
    let playerInfo={
      name:name,
      color:1,
      owner:false
    }
  
    socket.emit('joinLobby', { playerInfo, lobbyId: lobbyCode }, ({ success, message, players }) => {
      if (error) {
        setError(message);
        return;
      }
  
      if (success) {
        setLobbyId(lobbyCode);
        setPlayerName(name);
        setPlayers(players);
      } else {
        setError(message);
      }
    });
  };
  

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
