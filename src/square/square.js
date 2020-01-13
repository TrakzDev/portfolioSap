import React from 'react';

const Square = ({state, ...props}) => {
  return (
    <div className={props.square.class}
         onMouseDown={props.squareMouseDown}
         onMouseUp={props.squareMouseUp}
         onMouseOut={props.squareMouseOut}
         onMouseOver={props.squareMouseOver}
         onContextMenu={(e) => e.preventDefault()}
         />
  )
}

export default Square;
