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

    onMouseMove = (e) => {
        // When the mouse moves we want to draw a highlighter.
        // Get the canvas rectangle.
        const rect = this.canvasRef.current.getBoundingClientRect();
        var relativeX = e.clientX - rect.left;
        var relativeY = e.clientY - rect.top;

        // Now we have the relative X and Y coordinates we can do some drawing.
        this.updateCanvas();

        let squareSize = this.canvasRef.current.width / BOARD_SIZE;

        const ctx = this.canvasRef.current.getContext('2d');

        ctx.fillStyle = "rgba(51, 102, 255, 0.3)";

        var indexX = Math.floor(relativeX / squareSize);
        var indexY = Math.floor(relativeY / squareSize);

        ctx.fillRect(indexX * squareSize, indexY * squareSize, squareSize, squareSize);

        console.log("hello");
    };



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
        this.canvasRef.current.onMouseMove = this.onMouseMove;
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    render() {
        return (
            <canvas id="Board" onMouseMove={this.onMouseMove} onMouseLeave={this.updateCanvas.bind(this)} ref={this.canvasRef} width={700} height={700}/>
        );
    }
}

export default Board;