import React, { useEffect, useState } from "react";
import socket from "../socket";
import "./GameBoard.css";
import MultipleChoices from "./MultipleChoices";
const Grid = {
  1: "Beginning.jpg",
  2: "Training.jpg",
  3: "Deal.jpg",
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
  14: "DisciplinaryHearing.jpg",
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
  27: "Training.jpg",
  28: "DisciplinaryHearing.jpg",
  29: "Final.jpg",
  30: "Winner.jpg",
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
      <h1>Game Board</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p> in this lobby:</p>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {gameStarted && player.turn && "--->"}
            {player.playerInfo.name}{" "}
            {playerName == player.playerInfo.name && "(you)"}
          </li>
        ))}
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
                <div className="cell-content" key={player.playerInfo.name}>
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
