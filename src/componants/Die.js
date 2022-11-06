import React from "react"

export default function Die(props) {
    const holdStyle = {
         opacity : props.isHeld ? "0.8" : "1",
         border: props.isHeld ? "1px solid #5035FF" : "none"
    }
    return (
        <div className="block-container" >
          <img 
               className="dice" 
               src={require(`../img/Die${props.value}.svg`)}
               alt="Dice" 
               style = {holdStyle}
               onClick = {props.holdDice}
            />
        </div>
    )
}
