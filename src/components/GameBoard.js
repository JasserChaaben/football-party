import React, { useEffect, useState } from 'react';
import socket from '../socket'; 
import "./GameBoard.css";
import MultipleChoices from './MultipleChoices';
const Grid = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
function GameBoard({players,setPlayers, lobbyId, playerName }) {
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(false);
  const [turn, setTurn] = useState(false);
  const [playDice,setPlayDice]= useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [Dice,setDice]= useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    console.log("Joining lobby....");
    socket.emit('checkOwner',{lobbyId},({owner})=>{setOwner(owner);console.log("testing owner" + owner)})
    socket.emit('checkTurn',{lobbyId},({turn})=>{setTurn(turn);setPlayDice(turn);console.log("testing my turn : " + turn)})
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
    socket.emit('getDice',{lobbyId},({DiceRoll})=>{setDice(DiceRoll);console.log("Dice is : r" + DiceRoll)})
    socket.emit('checkTurn',{lobbyId},({turn})=>{setTurn(turn);setPlayDice(turn);console.log("testing my turn : " + turn)})
    socket.emit('gameStarted',{lobbyId},({started})=>{setGameStarted(started);console.log("testing game if started : " + started)})
    console.log('Players updated:', players);
  };
  const rollDice = () => {
    socket.emit('rollDice', { lobbyId}, () => {
    });
  };
  return (
    <div className='GameBord'>
      <h3>lobby code is : {lobbyId}</h3>
      <h1>Game Board</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>  in this lobby:</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{gameStarted&&player.turn&&"--->"}{player.playerInfo.name} {playerName==player.playerInfo.name&&"(you)"}</li>
        ))}
      </ul>

      <button onClick={handleOpenPopup}>Open Multiple Choices</button>
      {showPopup && (
        <MultipleChoices
          Question="What is the capital of France?"
          choices={['Paris', 'London', 'Berlin', 'Madrid']}
        />
      )}
     {owner&& !gameStarted&&<button
  onClick={() => {
    socket.emit('startGame', { lobbyId }, ({ result }) => {
      // Handle result if needed
    });
  }}
>
  Start Game
</button>
}

{gameStarted&&turn&&playDice&&<button onClick={rollDice}>Roll Dice</button>}
<br></br>
{gameStarted&&Dice}
<div className="grid">
    {Grid.map((item)=>(
      <div className='cell'>
        {players.map((player)=>(player.position==item&&<div className='cell-content'>{player.playerInfo.name}</div>))}
        <div className='cell-number'>{item}</div>
      </div>
    ))}
    </div>
    </div>
  );
}

export default GameBoard;