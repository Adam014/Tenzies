import React, {useState, useEffect} from "react"
import Die from "./components/Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App(){


  // cas co trvalo nez user vyhral a zobrazit oboji

  const [allDice, setAllDice] = useState(allNewDice)
  const [tenzies, setTenzies] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [timer, setTimer] = useState(0);

  useEffect (() => {
    const allHeld = allDice.every(die => die.isHeld)
    const firstValue = allDice[0].value
    const allSameValue = allDice.every(die => die.value === firstValue)
    if(allHeld && allSameValue){
        setTenzies(true)
    }
  }, [allDice])

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


  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for(let i = 0; i < 10; i++){
      newDice.push(generateNewDie())
    }
    return newDice
  }

  const diceElements = allDice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>)

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