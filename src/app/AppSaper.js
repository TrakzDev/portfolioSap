import React from 'react';
import Square from '../square/square';
import Smile from '../smile/smile';
import CounterBombs from '../counterBombs/counterBombs';
import CounterTime from '../counterTime/counterTime';

class AppSaper extends React.Component {
  constructor() {
    super();

    this.timer = null;

    this.state = {
      field: [],
      fieldWidth: '145px',
      bombsLeft: 10,
      flagsLeftSet: 10,
      gameState: 'process', // process, loose, win
      smileState: 'smth', // любое значение, fieldClick, smileClick
      seconds: 0
    }
  };

  componentDidMount() {
    this.newGame();

    this.timer = setInterval(() => {
            this.tick();
    }, 1000);
  }

  newGame () {
    this.createField();
    this.setState({bombsLeft: 10, flagsLeftSet: 10, timer: null, seconds: 0});
  };

  createField (bombs = 0, field = []) {
    for (let i = 0; i < 81; i++) {
      if (!field[i] || (field[i] && !field[i].havebomb)) {
        field[i] = {
          id: i,
          havebomb: (Math.floor(Math.random() * Math.floor(1000))) < 50 ? true : false,
          class: 'square', // states: open, opened, flagged, questioned, clickQuestioned, bombed
          bombsAround: 0
        }

        if (field[i].havebomb === true && bombs < 10) {
          bombs++;
        }
        if (bombs > 10) {
          field[i].havebomb = false;
        }
      }
    }

    // если бомб насыпалось мало, то запускаем повторно до тех пор, пока не будет нужное кол-во
    if (bombs < 10) {
      this.createField(bombs, field);
    } else {
      // высчитываем, сколько вокруг какой клетки бомб
      field.forEach(square => {
        if (square.havebomb) {
          let nearSquaresArr = this.calcNearSquaresArr(square.id);

          nearSquaresArr.forEach(near => {
            if (near < 81 && near >= 0 && !field[near].havebomb) {
              field[near].bombsAround++;
            }
          });


        }
      });

      this.setState({field: field});
    }

  }

  looseGame () {
    let field = this.state.field;

    field.forEach(square => {
      if (square.havebomb && square.class !== 'square flagged') {
        square.class = 'square revailed';
      }
      if (!square.havebomb && square.class === 'square flagged') {
        square.class = 'square wrongflagged';
      }
    })

    this.setState({field: field});
  };

  calcNearSquaresArr(index) {
    let nearSquaresArr = [];

    if ((index + 1) % 9 === 0) {
      nearSquaresArr = [index+8, index+9, index-1, index-9, index-10];
    } else if ((index) % 9 === 0) {
      nearSquaresArr = [index+10, index+9, index+1, index-9, index-8];
    } else {
      nearSquaresArr = [index+1, index+8, index+9, index+10, index-1, index-8, index-9, index-10];
    }
    return nearSquaresArr;
  };

  openSquaresClosestToEmpty(id) {
    let field = this.state.field,
        nearSquaresArr = this.calcNearSquaresArr(id);

    nearSquaresArr.forEach(near => {
      let mainCondition = near < 81 && near >= 0 && field[near].class !== 'square flagged';

      if (mainCondition && field[near].bombsAround > 0) {
        field[near].class = 'square open' + field[near].bombsAround;
      } else if (mainCondition && field[near].bombsAround === 0 && field[near].class === 'square') {
        field[near].class = 'square opened'
        this.openSquaresClosestToEmpty(near);
      }
    });
  }

  squareMouseDown(event, id) {
    let button = event.button,
        field = this.state.field,
        gameState = this.state.gameState;

    if (gameState !== 'loose' && gameState !== 'win') {
      switch (button) {
        case 0:
          let className = 'square ';

          if (field[id].class === 'square' ) {
            className += 'open';

            this.setState({smileState: 'fieldClick'});
          } else {
            className = field[id].class;
          }

          if (field[id].class === 'square questioned') {
            className = 'square clickQuestioned';

            this.setState({smileState: 'fieldClick'});
          }

          this.setState(state => {
            let { field } = state;
            field[id].class = className;
            return field;
          });
          break;
        case 1:
          // создать помощник открытия соседних клеток
          break;
        case 2:
          let newClass,
              bombsLeft = this.state.bombsLeft,
              flagsLeftSet = this.state.flagsLeftSet;

          if (field[id].class === 'square') {
            newClass = 'square flagged';

            flagsLeftSet--;
            if (field[id].havebomb) {
              bombsLeft--;
            }
            if (bombsLeft === 0 && flagsLeftSet === 0) {
              gameState = 'win';
              this.setState({gameState: gameState});
            }
          } else if (field[id].class === 'square flagged') {
            newClass = 'square questioned';

            flagsLeftSet++;
            if (field[id].havebomb) {
              bombsLeft++;
            }
          } else if (field[id].class === 'square questioned') {
            newClass = 'square';
          } else {
            break;
          }

          this.setState(state => {
            let { field } = state;
            field[id].class = newClass;
            return field;
          })
          this.setState({bombsLeft: bombsLeft});
          this.setState({flagsLeftSet: flagsLeftSet});

          break;
        default:
          break;
      }
    }
  };

  squareMouseUp(event, id) {
    let button = event.button,
        field = this.state.field,
        gameState = this.state.gameState,
        gameStatus= 'process';

    if (gameState !== 'loose' && gameState !== 'win') {
      switch (button) {
        case 0:
          let className = 'square ',
              bombsAround = field[id].bombsAround;

          if (field[id].class !== 'square flagged') {
            if (field[id].havebomb) {
              className += 'bombed';
              gameStatus = 'loose';
              this.looseGame();
            } else {
              if (bombsAround > 0) {
                className += 'open' + bombsAround;
              } else {
                this.openSquaresClosestToEmpty(id);
                className += 'opened'
              }

              gameStatus = 'process';
            }
          }  else {
            className = field[id].class;
          }


          this.setState(state => {
            let { field } = state;
            field[id].class = className;
            return field;
          })
          this.setState({gameState: gameStatus, smileState: gameStatus});

          break;
        case 1:
          // создать помощник открытия соседних клеток
          break;
        default:
          break;
      }
    }
  };

  squareMouseOut(event, id) {
    let field = this.state.field,
        className = 'square';

    if (this.state.smileState === 'fieldClick') {
      if (field[id].class === 'square clickQuestioned') {
        className += ' questioned';
      }

      if (field[id].class !== 'square open') {
        className = field[id].class;
      }

      this.setState(state => {
        let { field } = state;
        field[id].class = className;
        return field;
      })
    }
  }

  squareMouseOver(event, id) {
    let field = this.state.field;

    // this.setState({smileState: 'smth'});
    if (this.state.smileState === 'fieldClick' && field[id].class === 'square') {
      this.setState(state => {
        let { field } = state;
        field[id].class = 'square open';
        return field;
      })
    }
  }

  smileMouseDown(event) {
    if (event.button === 0) {
      this.setState({smileState: 'smileClick'});
    }
  };

  smileMouseUp() {
    this.setState({gameState: 'process', smileState: 'smth'});
  };

  smileMouseOut() {
    this.setState({smileState: 'smth'});
  }

  tick() {
    let gameState = this.state.gameState;

    if (gameState !== 'loose' && gameState !== 'win') {
      this.setState({ seconds: this.state.seconds + 1 })
    }
  }

  render() {
    const { field, fieldWidth, gameState, smileState, flagsLeftSet, seconds } = this.state;
    // вынести gameHeader в отдельный компонент
    return (
      <div className="AppSaper" style={{width: fieldWidth}}>
        <div className="gameHeader">
          <CounterBombs
            flagsLeftSet={flagsLeftSet}
          />
          <CounterTime
            seconds={seconds}
          />
          <Smile
            gameState={gameState}
            smileState={smileState}
            newGame={() => this.newGame()}
            smileMouseDown={e => this.smileMouseDown(e)}
            smileMouseUp={() => this.smileMouseUp()}
            smileMouseOut={() => this.smileMouseOut()}
          />
        </div>
        <div className="borderAboveGameField"/>
        <div className="gameField">
          {field.map(square => (
            <Square
              key={square.id}
              square={square}
              squareMouseDown={e => this.squareMouseDown(e, square.id)}
              squareMouseUp={e => this.squareMouseUp(e, square.id)}
              squareMouseOut={e => this.squareMouseOut(e, square.id)}
              squareMouseOver={e => this.squareMouseOver(e, square.id)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default AppSaper;
