import React, { useState, useEffect } from "react";
import "./MultipleChoices.css";
import socket from "../socket";

function MultipleChoices({ lobbyId, Question, choices, Timer }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timer, setTimer] = useState(Timer);
  const [ready, setReady] = useState(true);
  const [result, setResult] = useState("");
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    socket.emit("getToAnswer", { lobbyId }, ({ answer }) => {
      setIsMyTurn(answer);
    });
    return () => {
      socket.off("getToAnswer");
    };
  }, [lobbyId]);
  const handleChoiceClick = (choice) => {
    if (!ready) return;
    setReady(false);
    setSelectedChoice(choice);
    socket.emit("submitAnswer", { lobbyId, choice }, ({}) => {});
  };
  useEffect(() => {
    socket.off("multipleChoicesUpdate");
    socket.on("multipleChoicesUpdate", handleUpdateLobby);
  }, [selectedChoice]);
 
  const handleUpdateLobby = (players) => {
    socket.emit("getSubmittedAnswer", { lobbyId }, ({ subAnsw }) => {
      setSelectedChoice(subAnsw);
      console.log("submitted answer : " + subAnsw);
    });
    socket.emit("getcurrentResult", { lobbyId }, ({ res }) => {
      setResult(res);
      console.log("result is  : " + res);
    });
  };
  return (
    <div className="multiple-choices-overlay">
      <div className="multiple-choices-box">
        <div className="timer">{timer}</div>
        <h2 className="question">{Question}</h2>
        <div className="choices-grid">
          {choices.map((choice, index) => (
            <button
              key={index}
              className={`choice-button ${
                selectedChoice === choice ? "selected" : ""
              } ${!isMyTurn ? "disabled" : ""}`}
              onClick={() => isMyTurn && handleChoiceClick(choice)}
              disabled={!isMyTurn}
            >
              {choice}
            </button>
          ))}
          {result}
        </div>
      </div>
    </div>
  );
}

export default MultipleChoices;
