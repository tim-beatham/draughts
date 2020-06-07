import "../stylesheets/CreateOrJoin.css";
import React from "react";

const BOARD_SIZE = 8;

// Represents a single piece.
class Piece {
    constructor(isTeam1, indexX, indexY) {
        this.isTeam1 = isTeam1;
        this.indexX = indexX;
        this.indexY = indexY;
    }
}



class Board extends React.Component {

    constructor() {
        super();
        this.canvasRef = React.createRef();
        // Here we generate the pieces on the board.
        this.board = []
        this.boardSize = BOARD_SIZE;
        this.genBoard();
    }

    genBoard() {
        this.board = [];
        for (var row = 0; row < BOARD_SIZE; row++){
            var rowList = [];
            for (var col = 0; col < BOARD_SIZE; col++){
                if (row < 3 && ((row % 2 === 0) === (col % 2 === 0))){
                    // Insert a black piece.
                    rowList.push(new Piece(true, col, row));
                } else if ((row < this.boardSize && row > this.boardSize - 4) && ((row % 2 === 0) === (col % 2 === 0))){
                    rowList.push(new Piece(false, col, row));
                } else {
                    // Empty piece.
                    rowList.push(null);
                }
            }
            this.board.push(rowList);
        }
    }

    updateCanvas() {
        const ctx = this.canvasRef.current.getContext('2d');

        let canvasWidth = this.canvasRef.current.width;

        let squareSize = canvasWidth / BOARD_SIZE;

        for (var row  = 0; row < BOARD_SIZE; row++) {
            for (var col = 0; col < BOARD_SIZE; col++) {
                if ((row % 2 === 0) === (col % 2 === 0))
                    ctx.fillStyle = '#996633'
                else
                    ctx.fillStyle = '#ffffcc'

                let drawX = col * squareSize;
                let drawY = row * squareSize;

                ctx.fillRect(drawX, drawY, squareSize, squareSize);

                // Drawing a circle
                if (this.board[row][col] !== null){
                    // We need to work out the centre of the square.
                    // Get the top left coordinates.
                    let centreX = drawX + squareSize / 2;
                    let centreY = drawY + squareSize / 2;

                    if (this.board[row][col].isTeam1){
                        var colour = "black";
                    } else {
                        var colour = "white";
                    }

                    ctx.beginPath();
                    ctx.arc(centreX, centreY, squareSize / 2, 0, 2 * Math.PI, false);
                    ctx.fillStyle = colour;
                    ctx.fill();
                }


            }
        }
    }

    componentDidMount() {
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    render() {
        return (
            <canvas id="Board" ref={this.canvasRef} width={700} height={700}/>
        );
    }
}

export default Board;