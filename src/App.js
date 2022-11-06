import logo from './logo.svg';
import './App.css';
import React from 'react';
import { nanoid } from 'nanoid'
import Die from "./componants/Die"
import Confetti from 'react-confetti'

export default function App() {
    const[dice, setDice] = React.useState(allNewDice)
    const[tenzies,setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    
    const [time, setTime] = React.useState(0)
    const [bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem("bestTime")) || [])
    
    React.useEffect(() => {
        let interval = null
        if (!tenzies) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10)
            }, 10)
        }
        return () => clearInterval(interval)
    }, [tenzies])
    
    React.useEffect(() => {
        const currentBestTime = localStorage.getItem("bestTime")
        if (tenzies) {
            if (!currentBestTime) {
                localStorage.setItem("bestTime", JSON.stringify(time))
            } else if (time < currentBestTime) {
                setBestTime(time)
            }
        }
    },[tenzies,time])
    
    React.useEffect(()=> {
        if(dice.every(die=> die.isHeld && die.value === dice[0].value)){
            setTenzies(true)
          }
    } ,[dice])
    
    function generateNewDie() {
        return {
                id: nanoid(),
                value: Math.ceil(Math.random() * 6)
                } 
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if (!tenzies) {
        setRollCount(preCount => preCount + 1)
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
    }
        else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            setTime(0)
            setBestTime(localStorage.getItem("bestTime"))
        }
    }
    function holdDice(id) {
       setDice(prevDice => prevDice.map (die => {
               return die.id === id ? 
               {...die, isHeld: !die.isHeld} :
                die
           }))
   }
   function padDigits(number, requiredDigits) {
    let numberStr = number.toString();
    if (numberStr.length >= requiredDigits) {
        return number;
    }
    return "0".repeat(requiredDigits - numberStr.length) + number;
}

    function formatTime(time) {
        return {
            minutes: padDigits(Math.floor(time / 60000), 2),
            seconds: padDigits(Math.floor((time / 1000) % 60), 2),
            miliseconds: padDigits(Math.floor((time / 10) % 100), 2),
        };
    }
    const timer = formatTime(time)
    const bestTimer = formatTime(bestTime)
    
    const dicElements = dice.map(die => 
    <Die key={die.id}  
         value={die.value} 
         isHeld = {die.isHeld}
         holdDice = {() => holdDice(die.id)}
         id = {die.id}
    />)
    
    return (
        <main>
        {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="timer">
              ⏱ 
                <span className="digits"> {timer.minutes}</span>
                <span> : </span>
                <span className="digits"> {timer.seconds}</span>
                <span> : </span>
                <span className="digits"> {timer.miliseconds}</span>
            </div>
            <div className="bestTimer">
            🏆 Best time
            <span className="digits"> {bestTimer.minutes}</span>
            <span> : </span>
            <span className="digits"> {bestTimer.seconds}</span>
            <span> : </span>
            <span className="digits"> {bestTimer.miliseconds}</span>
            </div>
            <div className="dice-container">
                {dicElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>
               {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="rollCount">
             Number of Rolls: {rollCount}
            </div>
        </main>
    )
}
