import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      <div className={props.value === 'Red' ? "circle red-player" : props.value === 'Blue' ? "circle blue-player" : "circle"}></div>
    </button>
  );
}

class Col extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.colValues[i]}
        onClick={() => this.props.colOnClick()}
      />
    );
  }

  render() {
    return (
      <div className="board-col">
        {this.renderSquare(5)}
        {this.renderSquare(4)}
        {this.renderSquare(3)}
        {this.renderSquare(2)}
        {this.renderSquare(1)}
        {this.renderSquare(0)}
      </div>
    );
  }
}

class Board extends React.Component {
  constructor() {
    super();
    var boardVals = [Array(6).fill(null),
                    Array(6).fill(null),
                    Array(6).fill(null),
                    Array(6).fill(null),
                    Array(6).fill(null),
                    Array(6).fill(null),
                    Array(6).fill(null)]
    this.state = {
      boardValues: boardVals,
      redIsNext: true,
      winner: null,
    };
  }

  handleClick(colNum) {
    if(this.state.winner != null) {
      return;
    }
    const squares = this.state.boardValues.slice();
    const currPlayer = this.state.redIsNext ? 'Red' : 'Blue';
    let isWinner;
    for(var j = 0; j < squares[colNum].length; j++) {
      if(squares[colNum][j] === null) {
        squares[colNum][j] = currPlayer;
        isWinner = checkWinner(squares, currPlayer, j, colNum);
        break;
      }
      if((j + 1) === squares[colNum].length) {
        return;
      }
    }

    var currWinner = isWinner ? currPlayer : null;
    this.setState({squares: squares,
                  redIsNext: !this.state.redIsNext,
                  winner: currWinner,});
  }

  renderCol(i) {
    return (
      <Col
        colValues={this.state.boardValues[i]}
        colOnClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    let status;
    if(this.state.winner != null) {
      status = 'Winner: ' + (this.state.winner);
    } else {
      status = 'Next player: ' + (this.state.redIsNext ? 'Red' : 'Blue');

    }

    return (
      <div className="a-game">
        <div className="game-board">
          {this.renderCol(0)}
          {this.renderCol(1)}
          {this.renderCol(2)}
          {this.renderCol(3)}
          {this.renderCol(4)}
          {this.renderCol(5)}
          {this.renderCol(6)}
          </div>
          <div className="status">{status}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">

          <Board />
      </div>
    );
  }
}

function checkWinner(squares, player, rowNum, colNum) {
  var count = 0;
  var currSquare = null;
  var i = 0;
  if(colNum > 2) {
    //check horizontal to the left
    for(i = 0; i < 4; i++) {
      currSquare = squares[colNum - i][rowNum];
      if(currSquare === player) {
        count++;
      } else {
        break;
      }
    }

    if(count >= 4) {
      return true;
    }

    // checking diagonal up and to the left
    count = 0;
    if(rowNum < 3) {
      for(i = 0; i < 4; i++) {
        currSquare = squares[colNum - i][rowNum + i];
        if(currSquare === player) {
          count++;
        } else {
          break;
        }
      }
    }
    if(count >= 4) {
      return true;
    }

    // checking diagonal down and to the left
    count = 0;
    if(rowNum > 2) {
      for(i = 0; i < 4; i++) {
        currSquare = squares[colNum - i][rowNum - i];
        if(currSquare === player) {
          count++;
        } else {
          break;
        }
      }
    }
    if(count >= 4) {
      return true;
    }
  }

  if(colNum < 4) {
    //check horizontal to the right
    count = 0;
    for(i = 0; i < 4; i++) {
      currSquare = squares[colNum + i][rowNum];
      if(currSquare === player) {
        count++;
      } else {
        break;
      }
    }

    if(count >= 4) {
      return true;
    }

    // checking diagonal up and to the right
    count = 0;
    if(rowNum < 3) {
      for(i = 0; i < 4; i++) {
        currSquare = squares[colNum + i][rowNum + i];
        if(currSquare === player) {
          count++;
        } else {
          break;
        }
      }
    }
    if(count >= 4) {
      return true;
    }

    // checking diagonal down and to the right
    count = 0;
    if(rowNum > 2) {
      for(i = 0; i < 4; i++) {
        currSquare = squares[colNum + i][rowNum - i];
        if(currSquare === player) {
          count++;
        } else {
          break;
        }
      }
    }
    if(count >= 4) {
      return true;
    }
  }

  // checking down
  if(rowNum > 2) {
    count = 0;
    for(i = 0; i < 4; i++) {
      currSquare = squares[colNum][rowNum - i];
      if(currSquare === player) {
        count++;
      } else {
        break;
      }
    }
    if(count >= 4) {
      return true;
    }
  }

  // checking up
  if(rowNum < 3) {
    count = 0;
    for(i = 0; i < 4; i++) {
      currSquare = squares[colNum][rowNum + i];
      if(currSquare === player) {
        count++;
      } else {
        break;
      }
    }
    if(count >= 4) {
      return true;
    }
  }

  return false;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
