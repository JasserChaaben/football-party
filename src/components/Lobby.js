import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your backend URL

function Lobby({ setLobbyId, setPlayerName }) {
  const [name, setName] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");

  const createLobby = () => {
    socket.emit('createLobby', { name, isPrivate: true }, ({ lobbyId }) => {
      setLobbyId(lobbyId);
      setPlayerName(name);
    });
  };

  const joinLobby = () => {
    socket.emit('joinLobby', { name, lobbyId: lobbyCode }, ({ success }) => {
      if (success) {
        setLobbyId(lobbyCode);
        setPlayerName(name);
      } else {
        alert("Lobby not found!");
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
      <input
        type="text"
        placeholder="Enter Lobby Code"
        value={lobbyCode}
        onChange={(e) => setLobbyCode(e.target.value)}
      />
      <button onClick={joinLobby}>Join Private Lobby</button>
    </div>
  );
}

export default Lobby;
