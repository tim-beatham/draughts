import "../stylesheets/CreateOrJoin.css";
import React from "react";

const BOARD_SIZE = 8;

// Represents a single piece.
class Piece {
    constructor(isTeam1, indexX, indexY, squareSize, board) {
        this.isTeam1 = isTeam1;
        this.indexX = indexX;
        this.indexY = indexY;
        this.board = board;
        this.squareSize = squareSize;

        this.validMoves = [];

        this.potentialMoves = [];

        this.setPotentialMoves()
    }

    drawPiece = (ctx) => {
        let drawX = this.indexX * this.squareSize;
        let drawY = this.indexY * this.squareSize;

        // We need to work out the centre of the square.
        // Get the top left coordinates.
        let centreX = drawX + this.squareSize / 2;
        let centreY = drawY + this.squareSize / 2;

        ctx.fillStyle = this.getColour();
        ctx.beginPath();
        ctx.arc(centreX, centreY, this.squareSize / 2, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    setPotentialMoves = () => {
        this.potentialMoves = [];
        if (this.isTeam1){
            this.potentialMoves.push([-1, 1], [1, 1]);
        } else {
            this.potentialMoves.push([-1, -1], [1, -1]);
        }
    }

    calcValidMoves = () => {
        this.validMoves = [];
        this.potentialMoves.forEach((move) => {
            if (this.board[this.indexY + move[1]][this.indexX + move[0]] === null){
                // The move is valid.
                this.validMoves.push([this.indexX + move[0], this.indexY + move[1]]);
            }
        });
    }

    getColour = () => {
        if (this.isTeam1){
            return "black";
        }
        return "white";
    }

    move = (indexX, indexY) => {
        for (var i = 0; i < this.validMoves.length; i++){

            if (indexX === this.validMoves[i][0] && indexY === this.validMoves[i][1]){

                this.board[this.indexY][this.indexX] = null;
                this.board[indexY][indexX] = this;

                // Make the move
                this.indexX = indexX;
                this.indexY = indexY;
                return true;
            }
        }
        return false;
    }
}

// Class that represent the user pressing on a draught piece.
class Picker {
    constructor(indexX, indexY, squareSize, isVisible) {
        this.indexX = indexX;
        this.indexY = indexY;
        this.isVisible = isVisible;
        this.squareSize = squareSize;

        this.colour = "rgba(255, 0, 0, 0.3)"
        this.isVisible = false;
    }

    drawSquare = (ctx) => {
        if(this.isVisible) {
            ctx.fillStyle = this.colour;
            ctx.fillRect(this.indexX * this.squareSize, this.indexY * this.squareSize, this.squareSize, this.squareSize);
        }
    }

    show(indexX, indexY){
        this.indexX = indexX;
        this.indexY = indexY;
        this.isVisible = true;
    }

    hide(){
        this.isVisible = false;
    }
}

class Board extends React.Component {

    constructor() {
        super();
        this.canvasRef = React.createRef();
        // Here we generate the pieces on the board.
        this.board = []
        this.boardSize = BOARD_SIZE;

    }

    state = {
        team1Turn: true
    }

    onMouseMove = (e) => {
        // When the mouse moves we want to draw a highlighter.
        // Get the canvas rectangle.
        const rect = this.canvasRef.current.getBoundingClientRect();
        var relativeX = e.clientX - rect.left;
        var relativeY = e.clientY - rect.top;

        // Now we have the relative X and Y coordinates we can do some drawing.
        this.updateCanvas();

        const ctx = this.canvasRef.current.getContext('2d');

        ctx.fillStyle = "rgba(51, 102, 255, 0.3)";

        var indexX = Math.floor(relativeX / this.squareSize);
        var indexY = Math.floor(relativeY / this.squareSize);

        ctx.fillRect(indexX * this.squareSize, indexY * this.squareSize, this.squareSize, this.squareSize);

    };

    updateMoves = () => {
        for (var row = 0; row < this.boardSize; row++){
            for (var col = 0; col < this.boardSize; col++){
                if (this.board[row][col] !== null){
                    this.board[row][col].calcValidMoves();
                }
            }
        }
    }

    genBoard() {
        this.board = [];

        this.picker = new Picker(0, 0, this.squareSize, false);

        for (var row = 0; row < BOARD_SIZE; row++){
            var rowList = [];
            for (var col = 0; col < BOARD_SIZE; col++){
                if (row < 3 && ((row % 2 === 0) === (col % 2 === 0))){
                    // Insert a black piece.
                    rowList.push(new Piece(true, col, row, this.squareSize, this.board));
                } else if ((row < this.boardSize && row > this.boardSize - 4) && ((row % 2 === 0) === (col % 2 === 0))){
                    rowList.push(new Piece(false, col, row, this.squareSize, this.board));
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

        for (var row  = 0; row < BOARD_SIZE; row++) {
            for (var col = 0; col < BOARD_SIZE; col++) {
                if ((row % 2 === 0) === (col % 2 === 0))
                    ctx.fillStyle = '#996633'
                else
                    ctx.fillStyle = '#ffffcc'

                let drawX = col * this.squareSize;
                let drawY = row * this.squareSize;

                ctx.fillRect(drawX, drawY, this.squareSize, this.squareSize);

                // Drawing a circle
                if (this.board[row][col] !== null){
                    this.board[row][col].drawPiece(ctx);
                }
            }
        }

        this.picker.drawSquare(ctx);

        this.updateMoves();
    }

    onClick = (e) => {
        // When the mouse moves we want to draw a highlighter.
        // Get the canvas rectangle.
        const rect = this.canvasRef.current.getBoundingClientRect();
        var relativeX = e.clientX - rect.left;
        var relativeY = e.clientY - rect.top;


        var indexX = Math.floor(relativeX / this.squareSize);
        var indexY = Math.floor(relativeY / this.squareSize);


        const ctx = this.canvasRef.current.getContext('2d');

        if (this.board[indexY][indexX] !== null){

            if (this.board[indexY][indexX].isTeam1 === this.state.team1Turn) {
                // Draw a red square.
                this.picker.show(indexX, indexY);
            }
        } else if (this.picker.isVisible){
            // The user has clicked on a valid square.
            let moved = this.board[this.picker.indexY][this.picker.indexX].move(indexX, indexY);

            if (moved)
                this.picker.hide();

            this.setState({team1Turn: !this.state.team1Turn});

        }
        this.updateCanvas();

    }

    componentDidMount() {
        this.canvasRef.current.onMouseMove = this.onMouseMove;
        this.squareSize = this.canvasRef.current.width / this.boardSize;
        this.genBoard();
        this.updateCanvas();
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    render() {
        return (
            <canvas id="Board" onMouseMove={this.onMouseMove} onMouseLeave={this.updateCanvas.bind(this)}
                    onClick={this.onClick} ref={this.canvasRef} width={700} height={700}/>
        );
    }
}

export default Board;