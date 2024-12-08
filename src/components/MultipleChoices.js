import React, { useState } from 'react';
import './MultipleChoices.css';
import socket from '../socket';

function MultipleChoices({ Question, choices, Timer }) {
  const [isMyTurn, setIsMyTurn] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [timer, setTimer] = useState(Timer);

  const handleChoiceClick = (choice) => {
    
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
             selectedChoice === choice ? 'selected' : ''
             } ${!isMyTurn ? 'disabled' : ''}`}
              onClick={() => isMyTurn && handleChoiceClick(choice)}
              disabled={!isMyTurn}
        >
       {choice}
        </button>
        ))}
        </div>
      </div>
    </div>
  );
}

export default MultipleChoices;
