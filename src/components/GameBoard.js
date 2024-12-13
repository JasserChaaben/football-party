import React, { useEffect, useState } from "react";
import socket from "../socket";
import "./GameBoard.css";
import MultipleChoices from "./MultipleChoices";
const Grid = {
  1: "Beginning.jpg",
  2: "Deal.jpg",
  3: "Training.jpg",
  4: "Training.jpg",
  5: "MatchDay.jpg",
  6: "Training.jpg",
  7: "Deal.jpg",
  8: "Training.jpg",
  9: "Training.jpg",
  10: "MatchDay.jpg",
  11: "Training.jpg",
  12: "Deal.jpg",
  13: "Training.jpg",
  14: "Training.jpg",
  15: "MatchDay.jpg",
  16: "Training.jpg",
  17: "Deal.jpg",
  18: "Training.jpg",
  19: "Training.jpg",
  20: "MatchDay.jpg",
  21: "Training.jpg",
  22: "Deal.jpg",
  23: "Training.jpg",
  24: "Training.jpg",
  25: "MatchDay.jpg",
  26: "Training.jpg",
  27: "Deal.jpg",
  28: "Training.jpg",
  29: "Training.jpg",
  30: "MatchDay.jpg",
  31: "Training.jpg",
  32: "Deal.jpg",
  33: "Training.jpg",
  34: "Training.jpg",
  35: "MatchDay.jpg",
  36: "Training.jpg",
  37: "Deal.jpg",
  38: "Training.jpg",
  39: "Training.jpg",
  40: "MatchDay.jpg",
  41: "Training.jpg",
  42: "Deal.jpg",
  43: "Training.jpg",
  44: "DisciplinaryHearing.jpg",
  45: "MatchDay.jpg",
  46: "Training.jpg",
  47: "Deal.jpg",
  48: "Training.jpg",
  49: "Training.jpg",
  50: "MatchDay.jpg",
  51: "Training.jpg",
  52: "Deal.jpg",
  53: "Training.jpg",
  54: "Training.jpg",
  55: "MatchDay.jpg",
  56: "Training.jpg",
  57: "Deal.jpg",
  58: "Training.jpg",
  59: "Training.jpg",
  60: "MatchDay.jpg",
  61: "Training.jpg",
  62: "Deal.jpg",
  63: "Training.jpg",
  64: "Training.jpg",
  65: "MatchDay.jpg",
  66: "Training.jpg",
  67: "Deal.jpg",
  68: "Training.jpg",
  69: "Training.jpg",
  70: "MatchDay.jpg",
  71: "Training.jpg",
  72: "Deal.jpg",
  73: "Training.jpg",
  74: "Training.jpg",
  75: "MatchDay.jpg",
  76: "Training.jpg",
  77: "Deal.jpg",
  78: "Training.jpg",
  79: "Training.jpg",
  80: "MatchDay.jpg",
  81: "Training.jpg",
  82: "Deal.jpg",
  83: "Training.jpg",
  84: "Training.jpg",
  85: "MatchDay.jpg",
  86: "Training.jpg",
  87: "Deal.jpg",
  88: "DisciplinaryHearing.jpg",
  89: "Final.jpg",
  90: "Winner.jpg",
};

function GameBoard({ players, setPlayers, lobbyId, playerName }) {
  const [error, setError] = useState(null);
  const [owner, setOwner] = useState(false);
  const [turn, setTurn] = useState(false);
  const [playDice, setPlayDice] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [Dice, setDice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [choices, setChoices] = useState([]);
  const [question, setQuestion] = useState("");
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  useEffect(() => {
    console.log("Joining lobby....");
    socket.emit("checkOwner", { lobbyId }, ({ owner }) => {
      setOwner(owner);
      console.log("testing owner" + owner);
    });
    socket.emit("checkTurn", { lobbyId }, ({ turn }) => {
      setTurn(turn);
      setPlayDice(turn);
      console.log("testing my turn : " + turn);
    });
    socket.emit("gameStarted", { lobbyId }, ({ started }) => {
      setGameStarted(started);
      console.log("testing game if started : " + started);
    });

    socket.off("updateLobby");
    socket.on("updateLobby", handleUpdateLobby);

    console.log("test2");
    return () => {
      socket.off("updateLobby", handleUpdateLobby);
      socket.emit("leaveLobby", { lobbyId, playerId: socket.id });
    };
  }, [lobbyId, playerName]);

  const handleUpdateLobby = (players) => {
    console.log("test");
    setPlayers(players);
    socket.emit("checkOwner", { lobbyId }, ({ owner }) => {
      setOwner(owner);
      console.log("testing owner : " + owner);
    });
    socket.emit("getLobbyQuiz", { lobbyId }, ({ question, choices }) => {
      setChoices(choices);
      setQuestion(question);
    });
    socket.emit("getDice", { lobbyId }, ({ DiceRoll }) => {
      setDice(DiceRoll);
      console.log("Dice is : r" + DiceRoll);
    });
    socket.emit("checkTurn", { lobbyId }, ({ turn }) => {
      setTurn(turn);
      setPlayDice(turn);
      console.log("testing my turn : " + turn);
    });
    socket.emit("openQuiz", { lobbyId }, ({ popUp }) => {
      setShowPopup(popUp);
      console.log("popUp is : " + popUp);
    });

    socket.emit("gameStarted", { lobbyId }, ({ started }) => {
      setGameStarted(started);
      console.log("testing game if started : " + started);
    });
    console.log("Players updated:", players);
  };
  const rollDice = () => {
    socket.emit("rollDice", { lobbyId }, () => {});
  };
  return (
    <div className="GameBord">
      <h3>lobby code is : {lobbyId}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div class="tooltip">
        Rules :
  <span class="question-mark">?</span>
  <div class="tooltip-text">+ :Answer is Correct<br></br>- :Answer is wrong <br></br>MatchDay : -Dice<br></br>Market deal : +3 / -3 <br></br>Disciplinary Hearing : -Go back to beginning<br></br> Final : +Win/-8 <br></br>Training : +Dice</div>
</div>
      <p> in this lobby:</p>
      <ul>
        {players.map((player) =>  {// Check the color value
  return (
    <li
      key={player.id}
      style={{ color: player.playerInfo.color }}
    >
      {gameStarted && player.turn && "--->"}
      {player.playerInfo.name}{" "}
      {playerName === player.playerInfo.name && "(you)"}
    </li>
  );
})}
      </ul>

      {showPopup && (
        <MultipleChoices
          lobbyId={lobbyId}
          Question={question}
          choices={choices}
        />
      )}
      {owner && !gameStarted && (
        <button
          onClick={() => {
            socket.emit("startGame", { lobbyId }, ({ result }) => {
              // Handle result if needed
            });
          }}
        >
          Start Game
        </button>
      )}

      {gameStarted && turn && playDice && (
        <button onClick={rollDice}>Roll Dice</button>
      )}
      <br></br>
      {gameStarted && Dice}
      <div className="grid">
      {Object.entries(Grid).map(([item, image]) => (
        <div
          className="cell"
          style={{
            backgroundImage: `url(/${image})`, 
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          key={item} 
        >
          {players.map(
            (player) =>
              player.position == item && (
                <div 
                className="cell-content" 
                key={player.playerInfo.name} 
                style={{ backgroundColor: player.playerInfo.color }}>
                {player.playerInfo.name}
              </div>
              
              ),
          )}
          <div className="cell-number">{item}</div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default GameBoard;
