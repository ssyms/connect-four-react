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
      boardSize: 7,
      scoreCache: []
    };
  }

  getHash() {
    var p = this.state.redIsNext ? 'r' : 'b';
    return ''+p+this.state.boardVals.toString();
  }

  getMiniMax() {
    if(this.state.winner != null) {
      return;
    }
    var currMaxCol = -1;
    var currMaxScore = -10000;
    const squares = this.state.boardValues.slice();
    const currPlayer = this.state.redIsNext ? 'Red' : 'Blue';
    const opposingPlayer = this.state.redIsNext ? 'Blue' : 'Red';
    var colScores = Array(7).fill(-10000);
    for (var k = 0; k < 7; k++) { colScores[k]=[0,0]; }
    for(var colNum = 0; colNum < this.state.boardSize; colNum++) {
      for(var j = 0; j < squares[colNum].length; j++) {
        if(squares[colNum][j] === null) {
          if(checkWinner(squares, currPlayer, j, colNum)) {
            return colNum;
          } else {
            var maxScore = this.getScore(squares, colNum, j, currPlayer);
            var minScore = -this.getScore(squares, colNum, j, opposingPlayer);
            colScores[colNum] = maxScore - minScore;
            if(checkWinner(squares, opposingPlayer, j, colNum)) {
                colScores[colNum] = 9999;
            }
          }
          break;
        }
      }
    }

    for(colNum = 0; colNum < 7; colNum++) {
      if(currMaxCol === -1 || currMaxScore < colScores[colNum]) {
        currMaxScore = colScores[colNum];
        currMaxCol = colNum;
      }
    }
    return currMaxCol;
  }

  getScore(squares, colNum, rowNum, player) {
    var score = 0;
    // column
    for(var i = 1; i < 4; i++) {
      if((rowNum - i) >= 0) {
        if(squares[colNum][rowNum - i] === player) {
          score += 100;
        } else {
          break;
        }
      }
    }

    // row to the left
    for(i = 1; i < 4; i++) {
      if((colNum - i) >= 0) {
        if(squares[colNum - i][rowNum] === player) {
          score += 100;
        } else if(squares[colNum - i][rowNum] === null) {
          score += 50;
        } else {
          break;
        }
      }
    }

    // row to the right
    for(i = 1; i < 4; i++) {
      if((colNum + i) < 7) {
        if(squares[colNum + i][rowNum] === player) {
          score += 100;
        } else if(squares[colNum + i][rowNum] === null) {
          score += 50;
        } else {
          break;
        }
      }
    }

    // down left
    for(i = 1; i < 4; i++) {
      if((colNum - i) >= 0 && (rowNum - i) >= 0) {
        if(squares[colNum - i][rowNum - i] === player) {
          score += 100;
        } else if(squares[colNum - i][rowNum - i] === null) {
          score += 50;
        } else {
          break;
        }
      }
    }

    // down left
    for(i = 1; i < 4; i++) {
      if((colNum - i) >= 0 && (rowNum + i) < 6) {
        if(squares[colNum - i][rowNum + i] === player) {
          score += 100;
        } else if(squares[colNum - i][rowNum + i] === null) {
          score += 50;
        } else {
          break;
        }
      }
    }

    // down left
    for(i = 1; i < 4; i++) {
      if((colNum + i) < 7 && (rowNum + i) < 6) {
        if(squares[colNum + i][rowNum + i] === player) {
          score += 100;
        } else if(squares[colNum + i][rowNum + i] === null) {
          score += 50;
        } else {
          break;
        }
      }
    }

    // down left
    for(i = 1; i < 4; i++) {
      if((colNum + i) < 7 && (rowNum - i) >= 0) {
        if(squares[colNum + i][rowNum - i] === player) {
          score += 100;
        } else if(squares[colNum + i][rowNum - i] === null) {
          score += 50;
        } else {
          break;
        }
      }
    }

    return score;
  }

  compPlay() {
    var colNum = this.getMiniMax();
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

  handleClick(colNum, playComp = true) {
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
                  winner: currWinner,}, () => {
            this.compPlay();
        });
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
  constructor() {
    super();
    this.state = {
      playerNum: 0
    };
  }

  onClick(num) {
    this.setState = {
      playerNum: num
    }
  }

  render() {
    console.log(this.state.playerNum);
    var boardPage = (
      <div>

          <Board
            playerNums={this.state.playerNum}
           />
      </div>
    );

    var playerNumPage = (
      <div>
        <div className="player-num">How many players?</div>
        <button onClick={() => this.onClick(1)}>
          <div className="square-button">1</div>
        </button>
        <button onClick={() => this.onClick(2)}>
          <div className="square-button">2</div>
        </button>
      </div>
    );
    var currPAge = (this.state.playerNum > 0) ? boardPage : playerNumPage;
    console.log(currPAge);
    return (<div className="game">{boardPage}</div>);
  }
}


function checkWinner(squares, player, rowNum, colNum) {
  var count = 0;
  // column
  for(var i = 1; i < 4; i++) {
    if((rowNum - i) >= 0) {
      if(squares[colNum][rowNum - i] === player) {
        count += 1;
      } else {
        break;
      }
    }
  }
  if(count >= 3) {
    return true;
  }
  count = 0;
  // row to the left
  for(i = 1; i < 4; i++) {
    if((colNum - i) >= 0) {
      if(squares[colNum - i][rowNum] === player) {
        count += 1;
      } else {
        break;
      }
    }
  }

  // row to the right
  for(i = 1; i < 4; i++) {
    if((colNum + i) < 7) {
      if(squares[colNum + i][rowNum] === player) {
        count += 1;
      } else {
        break;
      }
    }
  }

  if(count >= 3) {
    return true;
  }
  count = 0;

  // down left
  for(i = 1; i < 4; i++) {
    if((colNum - i) >= 0 && (rowNum - i) >= 0) {
      if(squares[colNum - i][rowNum - i] === player) {
        count += 1;
      } else {
        break;
      }
    }
  }

  // down left
  for(i = 1; i < 4; i++) {
    if((colNum + i) < 7 && (rowNum + i) < 6) {
      if(squares[colNum + i][rowNum + i] === player) {
        count += 1;
      } else {
        break;
      }
    }
  }

  if(count >= 3) {
    return true;
  }
  count = 0;

  // down left
  for(i = 1; i < 4; i++) {
    if((colNum - i) >= 0 && (rowNum + i) < 6) {
      if(squares[colNum - i][rowNum + i] === player) {
        count += 1;
      } else {
        break;
      }
    }
  }

  // down left
  for(i = 1; i < 4; i++) {
    if((colNum + i) < 7 && (rowNum - i) >= 0) {
      if(squares[colNum + i][rowNum - i] === player) {
        count += 1;
      } else {
        break;
      }
    }
  }
  if(count >= 3) {
    return true;
  }
  count = 0;

  return false;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
