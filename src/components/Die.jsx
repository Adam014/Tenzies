import React from "react"

export default function Die(props){
    return(
        // single card id
        <div className={props.isHeld === true ? "die-green" : "die"} onClick={props.holdDice}>
            <h3>{props.value}</h3>
        </div>
    )
}