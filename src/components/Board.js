import "../stylesheets/CreateOrJoin.css";
import React from "react";

const BOARD_SIZE = 8;

class Board extends React.Component {

    constructor() {
        super();
        this.canvasRef = React.createRef();
    }

    updateCanvas() {
        const ctx = this.canvasRef.current.getContext('2d');

        let canvasWidth = this.canvasRef.current.width;

        let squareSize = canvasWidth / BOARD_SIZE;

        for (var row  = 0; row < BOARD_SIZE; row++) {
            for (var col = 0; col < BOARD_SIZE; col++) {
                if ((row % 2 === 0) === (col % 2 === 0))
                    ctx.fillStyle = '#000000'
                else
                    ctx.fillStyle = '#FFFFFF'

                ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
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