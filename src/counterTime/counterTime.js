import React from 'react';

const CounterTime = ({seconds, ...props}) => {

  let firstNumber, secondNumber, thirdNumber,
      cellClass = 'number',
      second = seconds.toString();

  if (second.length === 3) {
    firstNumber = cellClass + second[0];
    secondNumber = cellClass + second[1];
    thirdNumber = cellClass + second[2];
  } else if (second.length === 2) {
    firstNumber = cellClass + 0;
    secondNumber = cellClass + second[0];
    thirdNumber = cellClass + second[1];
  } else if (second.length === 1) {
    firstNumber = cellClass + 0;
    secondNumber = cellClass + 0;
    thirdNumber = cellClass + second[0];
  } else {
    firstNumber = cellClass + 0;
    secondNumber = cellClass + 0;
    thirdNumber = cellClass + 0;
  }

  return (
    <div className="counterTime">
      <div className={'сell rightCell ' + thirdNumber}/>
      <div className={'сell rightCell ' + secondNumber}/>
      <div className={'сell rightCell ' + firstNumber}/>
    </div>
  )
}

export default CounterTime;
