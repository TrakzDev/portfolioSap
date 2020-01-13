import React from 'react';

const Smile = ({gameState, smileState, ...props}) => {

  let subClass = '';

  if (smileState === 'fieldClick') {
    subClass = 'oh';
  } else if (smileState === 'smileClick') {
    subClass = 'click';
  } else if (gameState === 'loose') {
    subClass = 'loose';
  } else if (gameState === 'win') {
    subClass = 'win';
  } else {
    subClass = '';
  }

  let className = 'smile ' + subClass;

  return (
    <div className={className}
         onClick={props.newGame}
         onMouseDown={props.smileMouseDown}
         onMouseUp={props.smileMouseUp}
         onMouseOut={props.smileMouseOut}
         onContextMenu={(e) => e.preventDefault()}
    />
  )
}

export default Smile;
