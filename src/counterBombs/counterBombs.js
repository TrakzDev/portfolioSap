import React from 'react';

const CounterBombs = ({flagsLeftSet, ...props}) => {

  let firstNumber, secondNumber, thirdNumber,
      cellClass = 'number',
      flagsLeft = flagsLeftSet.toString();

  if (flagsLeft.length === 3) {
    firstNumber = cellClass + flagsLeft[0];
    secondNumber = cellClass + flagsLeft[1];
    thirdNumber = cellClass + flagsLeft[2];
  } else if (flagsLeft.length === 2) {
    firstNumber = cellClass + 0;
    secondNumber = cellClass + flagsLeft[0];
    thirdNumber = cellClass + flagsLeft[1];
  } else if (flagsLeft.length === 1) {
    firstNumber = cellClass + 0;
    secondNumber = cellClass + 0;
    thirdNumber = cellClass + flagsLeft[0];
  } else {
    firstNumber = cellClass + 0;
    secondNumber = cellClass + 0;
    thirdNumber = cellClass + 0;
  }

  return (
    <div className="counterBombs">
      <div className={'сell leftCell ' + firstNumber}/>
      <div className={'сell leftCell ' + secondNumber}/>
      <div className={'сell leftCell ' + thirdNumber}/>
    </div>
  )
}

export default CounterBombs;
