import React, { useState, useEffect } from "react";
import "./MultipleChoices.css";
import socket from "../socket";

function NumberChoice({ lobbyId, Question, Timer }) {
  const [Answers,setAnswers] = useState([]);
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
 

  return (
    <div className="multiple-choices-overlay">
      <div className="multiple-choices-box">
        <div className="timer">{timer}</div>
        <h2 className="question">{Question}</h2>

        <input 
  type="number" 
  className="numberInput" 
  onKeyDown={(e) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  }} 
/>          
<div className="Answers-box"></div>
<button>Submit Answer</button>
      </div>
    </div>
  );
}

export default NumberChoice;
