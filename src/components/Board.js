import "../stylesheets/CreateOrJoin.css";
import React from "react";

const BOARD_SIZE = 8;

// Converts a board array to a String.
function boardToStringArray(board){

    var stringArray = [];

    for (var row = 0; row < board.length; row++){
        let string = "";
        for (var col = 0; col < board.length; col++){
            // Get the current piece
            if (board[row][col] === null){
                string += "-";
            } else if (board[row][col].isTeam1){
                if (board[row][col] instanceof King){
                    string += "B";
                } else {
                    string += "b";
                }
            } else {
                if (board[row][col] instanceof King){
                    string += "W";
                } else {
                    string += "w";
                }
            }
        }
        stringArray.push(string);
    }
    return stringArray;
}

function stringArrayToBoard(stringArrayBoard, squareSize) {
    var board = [];
    for (var row = 0; row < stringArrayBoard.length; row++){
        let rowList = [];
        for (var col = 0; col < stringArrayBoard[row].length; col++){
            switch (stringArrayBoard[row].charAt(col)){
                case "-":
                    rowList.push(null);
                    break;
                case "B":
                    rowList.push(new King(true, col, row, squareSize, board));
                    break;
                case "W":
                    rowList.push(new King(false, col, row, squareSize, board));
                    break;
                case "w":
                    rowList.push(new Piece(false, col, row, squareSize, board));
                    break;
                case "b":
                    rowList.push(new Piece(true, col, row, squareSize, board));
                    break;

            }
        }
        board.push(rowList);
    }
    return board;
}


// Represents a single piece.
class Piece {
    constructor(isTeam1, indexX, indexY, squareSize, board) {
        this.isTeam1 = isTeam1;
        this.indexX = indexX;
        this.indexY = indexY;
        this.board = board;
        this.squareSize = squareSize;

        this.validMoves = [];
        this.validTakes = [];

        this.potentialMoves = [];
        this.potentialTakes = [];

        this.setPotentialMoves()
    }

    drawPiece(ctx) {
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
        this.potentialTakes = [];

        if (this.isTeam1){
            this.potentialMoves.push([-1, 1], [1, 1]);
            this.potentialTakes.push([-2, 2], [2, 2]);
        } else {
            this.potentialMoves.push([-1, -1], [1, -1]);
            this.potentialTakes.push([-2, -2], [2, -2]);
        }
    }

    calcValidMoves = () => {
        this.validMoves = [];
        this.potentialMoves.forEach((move) => {
            let movePosX = this.indexX + move[0];
            let movePosY = this.indexY + move[1];

            if (movePosY >= 0 && movePosY < this.board.length && movePosX >= 0 && movePosX < this.board.length) {
                if (this.board[movePosY][movePosX] === null) {
                    // The move is valid.
                    this.validMoves.push([movePosX, movePosY]);
                }
            }
        });
    }

    calcValidTakes = () => {
        this.validTakes = [];
        this.potentialTakes.forEach((take) => {
            let takePosX = this.indexX + take[0];
            let takePosY = this.indexY + take[1]

            if (takePosY >= 0 && takePosY < this.board.length && takePosX >= 0 && takePosX < this.board.length) {
                if (this.board[takePosY][takePosX] === null &&
                    this.board[(takePosY + this.indexY) / 2][(takePosX + this.indexX) / 2] !== null) {

                    if (this.board[(takePosY + this.indexY) / 2][(takePosX + this.indexX) / 2].isTeam1 !== this.isTeam1) {
                        this.validTakes.push([takePosX, takePosY]);
                    }
                }
            }
        })
    }

    getColour = () => {
        if (this.isTeam1){
            return "black";
        }
        return "white";
    }

    move = (indexX, indexY) => {
        for (var i = 0; i < this.validMoves.length; i++){

            console.log("Moves: ", this.validMoves);
            console.log("Take: ", [indexX, indexY]);

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

    take = (indexX, indexY) => {
        for (var i = 0; i < this.validTakes.length; i++){
            if (indexX === this.validTakes[i][0] && indexY === this.validTakes[i][1]){

                // Get the enemy position.
                let enemyPosX = (indexX + this.indexX) / 2;
                let enemyPosY = (indexY + this.indexY) / 2;

                this.board[enemyPosY][enemyPosX] = null;

                this.board[this.indexY][this.indexX] = null;
                this.board[indexY][indexX] = this;

                // Make the move
                this.indexX = indexX;
                this.indexY = indexY;
                return true;
            }
        }

        // no takes can be made.
        return false;
    }

    canTake = () => {
        return this.validTakes.length > 0;
    }
}

class King extends Piece {
    constructor(isTeam1, indexX, indexY, squareSize, board) {
        super(isTeam1, indexX, indexY, squareSize, board);
        this.setPotentialMoves();
    }

    setPotentialMoves = () => {
        this.potentialMoves = [[-1,1], [-1,-1], [1,1], [1,-1]];
        this.potentialTakes = [[-2,2], [-2,-2], [2,2], [2,-2]];
    }

    drawPiece = (ctx) => {
        super.drawPiece(ctx);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "yellow";
        ctx.stroke();
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
        team1Turn: true,
        chaining: false
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
                    this.board[row][col].calcValidTakes();
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

    promoteToKing = (indexX, indexY) => {
        // Check if the piece can be kinged.
        if ((this.board[indexY][indexX].isTeam1 && indexY === this.board.length - 1) ||
            !this.board[indexY][indexX].isTeam1 && indexY === 0){
            // King the piece.
            this.board[indexY][indexX] = new King(this.board[indexY][indexX].isTeam1, indexX, indexY,
                this.squareSize, this.board);
        }
    }

    onClick = (e) => {
        // When the mouse moves we want to draw a highlighter.
        // Get the canvas rectangle.
        const rect = this.canvasRef.current.getBoundingClientRect();
        var relativeX = e.clientX - rect.left;
        var relativeY = e.clientY - rect.top;


        var indexX = Math.floor(relativeX / this.squareSize);
        var indexY = Math.floor(relativeY / this.squareSize);
        if (!this.state.chaining) {
            if (this.board[indexY][indexX] !== null) {

                if (this.board[indexY][indexX].isTeam1 === this.state.team1Turn
                    && this.board[indexY][indexX].isTeam1 === this.props.team) {
                    // Draw a red square.
                    this.picker.show(indexX, indexY);
                }
            } else if (this.picker.isVisible) {
                if (this.board[this.picker.indexY][this.picker.indexX].move(indexX, indexY)) {
                    this.picker.hide();

                    this.promoteToKing(indexX, indexY);

                    this.props.socket.emit("client-move-made", {
                        board: boardToStringArray(this.board),
                        team: this.state.team1Turn, username: this.props.user
                    });

                } else if (this.board[this.picker.indexY][this.picker.indexX].take(indexX, indexY)) {
                    this.picker.hide();


                    // We need to check if the piece can be chained.
                    this.updateMoves();

                    if (this.board[indexY][indexX].canTake()) {
                        this.picker.show(indexX, indexY);
                        this.setState({chaining: true});
                    } else {
                        this.promoteToKing(indexX, indexY);

                        this.props.socket.emit("client-move-made", {
                            board: boardToStringArray(this.board),
                            team: this.state.team1Turn, username: this.props.user
                        });
                        this.picker.hide();
                        this.setState({chaining: false});

                    }


                }
            }
        } else {
            // When chaining.
            if (this.board[this.picker.indexY][this.picker.indexX].take(indexX, indexY)){
                this.updateMoves();
                // Check for chaining again.
                if (!this.board[indexX][indexY].canTake()){
                    this.promoteToKing(indexX, indexY);
                    this.props.socket.emit("client-move-made", {
                        board: boardToStringArray(this.board),
                        team: this.state.team1Turn, username: this.props.user
                    });
                    this.picker.hide();
                    this.setState({chaining: false});
                } else {
                    this.picker.show(indexX, indexY);
                }


            }
        }
        this.updateCanvas();

    }

    componentDidMount() {
        this.canvasRef.current.onMouseMove = this.onMouseMove;
        this.squareSize = this.canvasRef.current.width / this.boardSize;
        this.genBoard();
        this.updateCanvas();

        this.props.socket.on("server-move-made", (info) => {
            this.board = stringArrayToBoard(info.board, this.squareSize);
            this.updateMoves();
            this.setState({team1Turn: !info.team});
            this.updateCanvas();

            this.props.setTurnMsg.call(this, !info.team);

        })

        console.log(boardToStringArray(this.board));

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