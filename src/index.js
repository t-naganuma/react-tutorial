import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={'square' + (props.judgeWin ? ' bg-color' : '')}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, judgeWin) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                judgeWin={judgeWin}
                key={i}
            />
        )
    }

    render() {
        const rows = [0, 1, 2];
        const cols = [0, 1, 2];
        return (
            <div>
                {rows.map(row => {
                    return (
                        <div className="board-row" key={row}>
                            { cols.map(col => {
                                const cell = row * 3 + col;
                                const judgeWin = this.props.judgeWin.includes(cell);
                                return this.renderSquare(cell, judgeWin);
                            })}
                        </div>
                    )
                })}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: {
                    row: 0,
                    col: 0
                },
            }],
            stepNumber: 0,
            xIsNext: true,
            isCurrent: true,
            isToggle: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winInfo = calculateWinner(squares);
        if (winInfo.winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: {
                    row: i % 3,
                    col: Math.trunc(i / 3)
                },
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleToggleClick() {
        this.setState({
            isToggle: !this.state.isToggle
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winInfo = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + `(${step.location.col}, ${step.location.row})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        className={move === this.state.stepNumber ? 'font-bold' : ''}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            );
        });
        
        let status;
        if (winInfo.winner) {
            status = 'Winner: ' + winInfo.winner;
        } else if(!current.squares.includes(null)) {
            status = "Draw";
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        judgeWin={winInfo.line}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <p><button onClick={() => this.handleToggleClick()}>toggle</button></p>
                    <ol>{ this.state.isToggle ? moves : moves.reverse() }</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                line: [a, b, c]
            };
        }
    }
    return {
        winner: null,
        line: []
    };
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
