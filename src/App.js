import React, {useState, useEffect} from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App(){

  // state for the allDices
  const [allDice, setAllDice] = useState(allNewDice);

  // if is tenzies over 
  const [tenzies, setTenzies] = useState(false);

  // state for the rollCount, how many times user rolls to win the game
  const [rollCount, setRollCount] = useState(0);
 
  // state for the timer
  const [timer, setTimer] = useState(0);

  // Checks if all dice are held and have the same value; sets 'tenzies' state accordingly
  useEffect (() => {
    const allHeld = allDice.every(die => die.isHeld)
    const firstValue = allDice[0].value
    const allSameValue = allDice.every(die => die.value === firstValue)
    if(allHeld && allSameValue){
        setTenzies(true)
    }
  }, [allDice])

  // Manages the timer interval based on the 'tenzies' state
  useEffect(() => {
    let intervalId;

    if (!tenzies) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000); // Update the timer every second
    } else {
      clearInterval(intervalId); // Stop the timer when tenzies becomes true
    }

    return () => {
      clearInterval(intervalId); // Cleanup the interval when the component unmounts or tenzies becomes true
    };
  }, [tenzies]);

  // Generates a new die object with a random value, not held, and a unique id
  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
  }

  // Generates an array of 10 new dice using the 'generateNewDie' function
  function allNewDice() {
    const newDice = []
    for(let i = 0; i < 10; i++){
      newDice.push(generateNewDie())
    }
    return newDice
  }

  // Maps the 'allDice' array to JSX elements representing the Dice component
  const diceElements = allDice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>)

  // Updates the dice based on 'tenzies' state and increments the roll count
  function getNewDice(){
    if (!tenzies){
      setAllDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
      setRollCount(prevState => prevState + 1)
    }
    else{
      setTenzies(false)
      setAllDice(allNewDice())
      setRollCount(0)
    }
  }

  // Toggles the 'isHeld' property of a specific die based on its 'id'
  function holdDice(id){
    setAllDice(prevState => prevState.map(die => {
        return die.id === id ? {...die, isHeld: !die.isHeld} : die
    }))
  }

  return(
    <main>
      {tenzies && <Confetti />}
      <h1>Tenzies</h1>
      <div className="p-container">
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      </div>
      <div className="dies">
          {diceElements}
      </div>

      <div className="button">
          <button onClick={getNewDice}>{tenzies === true ? "New game" : "Roll"}</button>
      </div>

      <div className="stats">
          <h4>Roll count: {rollCount}</h4>
          <h4>Time: {timer} seconds</h4>
       </div>
    </main>
  )
}