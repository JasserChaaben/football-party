import React, { useState, useEffect } from "react";
import "./MultipleChoices.css";
import socket from "../socket";

function NumberChoice({ lobbyId, Question, Timer }) {
  const [Answers,setAnswers] = useState([]);
  const [myAnswer,setmyAnswer] = useState();
  const [timer, setTimer] = useState(Timer);
  const [ready, setReady] = useState(true);
  const [result, setResult] = useState("");
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    socket.emit("getToAnswer", { lobbyId }, ({ answer }) => {
      setIsMyTurn(answer);
    });
    
    socket.emit("getNumberSubmittedAnswer", { lobbyId }, ({ subAnsw }) => {
        setAnswers(subAnsw);
      });
      socket.emit("getcurrentResult", { lobbyId }, ({ res }) => {
        setResult(res);
        console.log(result)
      });
    socket.off("numberChoiceUpdate");
    socket.on("numberChoiceUpdate", handleUpdateLobby);
    return () => {
      socket.off("getToAnswer");
    };
  }, [lobbyId]);
  const handleUpdateLobby = (players) => {
    socket.emit("getToAnswer", { lobbyId }, ({ answer }) => {
        setIsMyTurn(answer);
      });
      socket.emit("getNumberSubmittedAnswer", { lobbyId }, ({ subAnsw }) => {
        setAnswers(subAnsw);
      });
      socket.emit("getcurrentResult", { lobbyId }, ({ res }) => {
        setResult(res);
      });
  };
  const handleSubmit=()=>{
    console.log(myAnswer)
    if (!ready) return;
    setReady(false);
    socket.emit("submitNumberAnswer", { lobbyId, choice:myAnswer }, ({}) => {});
  }
  return (
    <div className="multiple-choices-overlay">
      <div className="multiple-choices-box">
        <div className="timer">{timer}</div>
        <h2 className="question">{Question}</h2>

        <input 
  type="number" 
  className={`numberInput ${!isMyTurn ? "disabled" : ""}`}
  value={myAnswer}
  onChange={(e) => setmyAnswer(e.target.value)}
  onKeyDown={(e) => {
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  }} 
/>       

<button 
  className={`${!isMyTurn ? "disabled" : ""}`}
  onClick={() => isMyTurn && handleSubmit()}
>
  Submit Answer
</button>

                
<div className="Answers-box">{Answers.map((answer,index) => {
 return (
    <div key={index}>
      { !isMyTurn 
        ? `${index + 1} : ${answer.name} chose ${answer.answer}` 
        : `${index + 1} : ${answer.name} Answered`
      }
      
    </div>
    
  );
  
})}  </div>
<br></br>
{result}
      </div>
    </div>
  );
}

export default NumberChoice;
