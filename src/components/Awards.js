import React, { useState, useEffect } from "react";
import "./MultipleChoices.css";
import socket from "../socket";

function Awards({ lobbyId }) {
  const [awards,setAwards] = useState([]);
  const [myAnswer,setmyAnswer] = useState();
  const [choosed,setChoosed] = useState("");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [playerAwarded,setPlayerAwarded] = useState(null);

  useEffect(() => {
    socket.emit("getAwards", { lobbyId }, ({ awards }) => {
        setAwards(awards);
      });

      socket.emit("getPlayerAwarded", { lobbyId }, ({ playerAwarded }) => {
        setPlayerAwarded(playerAwarded);
        console.log("player awarded :"+JSON.stringify(playerAwarded));
        console.log(playerAwarded.id, playerAwarded.name);
      });
      
      socket.emit("getMyAward", { lobbyId }, ({ res }) => {
        setIsMyTurn(res); 
      });
      socket.emit("getAwardChosen", { lobbyId }, ({ chosen }) => {
        setChoosed(chosen);
      });
    socket.off("awardsUpdate");
    socket.on("awardsUpdate", handleUpdateLobby);
    return () => {
      socket.off("getToAnswer");
    };
  }, [lobbyId]);
  const handleUpdateLobby = (players) => {
    socket.emit("getAwards", { lobbyId }, ({ awards }) => {
        setAwards(awards);
        console.log(awards)
      });
      socket.emit("getPlayerAwarded", { lobbyId }, ({ playerAwarded }) => {
        setPlayerAwarded(playerAwarded);
        console.log("player awarded :"+JSON.stringify(playerAwarded));
        console.log(playerAwarded.id, playerAwarded.name);
      });
      
      socket.emit("getMyAward", { lobbyId }, ({ res }) => {
        setIsMyTurn(res);
      });
      
      socket.emit("getAwardChosen", { lobbyId }, ({ chosen }) => {
        setChoosed(chosen);
        console.log(chosen)
        console.log(choosed)
      });
  };
  const handleSubmit=(choice)=>{
    setmyAnswer(choice);
    setIsMyTurn(false);
    console.log(myAnswer)
    socket.emit("submitAward", { lobbyId,choice }, () => {
      });
  }
  return (
    <div className="multiple-choices-overlay">
      <div className="multiple-choices-box">
      {playerAwarded&& <div style={{ color:playerAwarded.name.color , fontSize:"200%"}}>  {playerAwarded.name.name}</div>} Is Choosing a reward
      <br></br> <br></br>
      {awards.map((choice,index)=>(<button   key={index}
              className={`choice-button ${
                (myAnswer === choice || choosed===choice)? "selected" : ""
              } ${!isMyTurn ? "disabled" : ""}`}
              onClick={() => isMyTurn && handleSubmit(choice)}
              disabled={!isMyTurn}>{choice}</button>))}
    </div>
     </div>
  );
}

export default Awards;
